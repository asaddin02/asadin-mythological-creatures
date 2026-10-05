#!/usr/bin/env node
/**
 * Uploads dist-media/ and every active reviewed illustration to the Cloudflare R2 bucket
 * that functions/media/[[path]].js reads. Only new or changed files are sent: the bucket keeps
 * _manifest.json (file → SHA-256) from the previous upload. Files are never deleted, so a deployment
 * that is rolled back still finds its images.
 *
 *   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… node scripts/upload-media.mjs [bucket]
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const dir = join(root, 'dist-media');
const bucket = process.argv.slice(2).find(arg => !arg.startsWith('--')) || 'mythics-media';
const TYPES = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', avif: 'image/avif', json: 'application/json' };
const wrangler = args => run('npx', ['--yes', 'wrangler@4', ...args], { cwd: root, maxBuffer: 64 * 1024 * 1024 });

const sources = new Map((await readdir(dir, { recursive: true, withFileTypes: true })).filter(f => f.isFile()).map(f => {
  const file = join(f.parentPath ?? f.path, f.name);
  return [file.slice(dir.length + 1), file];
}));
if (!sources.size) throw new Error('dist-media/ is empty: run MEDIA_BASE=/media npm run build:site first.');
const artwork = JSON.parse(await readFile(join(root, 'assets/art/verified-manifest.json'), 'utf8')).artworks;
for (const art of Object.values(artwork)) {
  if (!/^\/assets\/art\/[a-z0-9][a-z0-9._-]*\.(webp|png|jpe?g|avif)$/i.test(art.url)) throw new Error(`Invalid registered artwork URL: ${art.url}`);
  sources.set(`art/${art.url.split('/').pop()}`, join(root, art.url.slice(1)));
}
const files = [...sources.keys()].sort();
const selected = await Promise.all(files.map(async key => ({ key, file: sources.get(key), hash: createHash('sha256').update(await readFile(sources.get(key))).digest('hex') })));
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ bucket, files: files.length, active_reviewed: Object.keys(artwork).length, keys: files }));
  process.exit(0);
}

const tmp = await mkdtemp(join(tmpdir(), 'mythics-media-'));
let previous = {};
try {
  await wrangler(['r2', 'object', 'get', `${bucket}/_manifest.json`, '--remote', '--file', join(tmp, 'manifest.json')]);
  previous = JSON.parse(await readFile(join(tmp, 'manifest.json'), 'utf8'));
} catch {
  console.log('No previous upload manifest; uploading every file.');
}

const manifest = { ...previous };
let sent = 0;
let next = 0;
let failure;
const upload = async () => {
  while (!failure && next < selected.length) {
    const { key, file, hash } = selected[next++];
    if (previous[key] === hash) continue;
    try {
      const type = TYPES[key.split('.').pop().toLowerCase()] || 'application/octet-stream';
      await wrangler(['r2', 'object', 'put', `${bucket}/${key}`, '--remote', '--file', file, '--content-type', type, '--cache-control', 'public, max-age=86400']);
      manifest[key] = hash;
      sent++;
      console.log(`uploaded ${key}`);
    } catch (error) { failure = error; }
  }
};
// Bound simultaneous uploads so a large illustration batch fits the deploy window.
await Promise.all(Array.from({ length: 4 }, upload));
await writeFile(join(tmp, 'manifest.json'), JSON.stringify(manifest, null, 1));
if (sent) await wrangler(['r2', 'object', 'put', `${bucket}/_manifest.json`, '--remote', '--file', join(tmp, 'manifest.json'), '--content-type', 'application/json']);
if (failure) {
  // Successful objects stay checkpointed; the next deploy retries only unfinished files.
  throw failure;
}
console.log(`R2 ${bucket}: ${sent} uploaded, ${files.length - sent} unchanged, ${files.length} active media files (${Object.keys(artwork).length} reviewed illustrations).`);
