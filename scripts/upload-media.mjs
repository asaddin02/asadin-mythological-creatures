#!/usr/bin/env node
/**
 * Uploads dist-media/ (written by `MEDIA_BASE=/media npm run build:site`) to the Cloudflare R2 bucket
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
const bucket = process.argv[2] || 'mythics-media';
const TYPES = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', avif: 'image/avif', json: 'application/json' };
const wrangler = args => run('npx', ['--yes', 'wrangler@4', ...args], { cwd: root, maxBuffer: 64 * 1024 * 1024 });

const files = (await readdir(dir, { recursive: true, withFileTypes: true })).filter(f => f.isFile()).map(f => join(f.parentPath ?? f.path, f.name).slice(dir.length + 1));
if (!files.length) throw new Error('dist-media/ is empty: run MEDIA_BASE=/media npm run build:site first.');

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
for (const key of files.sort()) {
  const file = join(dir, key);
  const hash = createHash('sha256').update(await readFile(file)).digest('hex');
  manifest[key] = hash;
  if (previous[key] === hash) continue;
  const type = TYPES[key.split('.').pop().toLowerCase()] || 'application/octet-stream';
  await wrangler(['r2', 'object', 'put', `${bucket}/${key}`, '--remote', '--file', file, '--content-type', type, '--cache-control', 'public, max-age=86400']);
  sent++;
  console.log(`uploaded ${key}`);
}
await writeFile(join(tmp, 'manifest.json'), JSON.stringify(manifest, null, 1));
if (sent) await wrangler(['r2', 'object', 'put', `${bucket}/_manifest.json`, '--remote', '--file', join(tmp, 'manifest.json'), '--content-type', 'application/json']);
console.log(`R2 ${bucket}: ${sent} uploaded, ${files.length - sent} unchanged, ${files.length} files in this build.`);
