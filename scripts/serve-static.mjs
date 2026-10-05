#!/usr/bin/env node
/**
 * Serves dist/ the way Cloudflare Pages does, for previews and the static-site browser test:
 * files as they are, directories as index.html, anything missing as 404.html with status 404.
 *   npm run build:site && npm run preview:static   (PORT, default 8096)
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const MEDIA = fileURLToPath(new URL('../dist-media', import.meta.url));
const PORT = Number(process.env.PORT || 8096);
const HOST = process.env.HOST || '127.0.0.1';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function file(path, root = DIST) {
  try {
    const full = normalize(join(root, path));
    if (full !== root && !full.startsWith(root + sep)) return null;
    const info = await stat(full);
    return info.isDirectory() ? file(join(path, 'index.html'), root) : { full, body: await readFile(full) };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  } catch {
    res.writeHead(400);
    return res.end();
  }
  // The public build uses the same /media route backed by R2 in production.
  const found = path.startsWith('/media/') ? await file(path.slice('/media/'.length), MEDIA) : await file(path);
  const hit = found || (await file('404.html'));
  if (!hit) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(found ? 200 : 404, { 'Content-Type': MIME[extname(hit.full)] || 'application/octet-stream' });
  res.end(req.method === 'HEAD' ? undefined : hit.body);
}).listen(PORT, HOST, () => console.log(`STATIC SITE SERVER RUNNING at http://${HOST}:${PORT}`));
