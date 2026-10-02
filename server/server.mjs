#!/usr/bin/env node
/**
 * Mythics HTTP Server
 * High-performance native Node.js HTTP server.
 * Provides static asset serving, compression, client caching,
 * clean client-side routing fallback, and REST API routing.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { initDb } from './db.mjs';
import { handleApiRoute } from './api.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8095);
const HOST = process.env.HOST || '127.0.0.1';
const LOG = process.env.LOG === '1';
// The editorial console writes to data/ and fetches from Wikipedia, so it is off unless enabled explicitly
// (`npm run dev` does) and even then only answers same-origin requests from this machine.
const ADMIN = process.env.MYTHICS_ADMIN === '1';
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

// Only the public application is served; server/, scripts/, data/, tests/ and package files never are.
const PUBLIC_FILES = new Set(['/index.html', '/manifest.webmanifest']);
const PUBLIC_DIRS = ['/css/', '/js/', '/assets/'];
const isPublic = path => PUBLIC_FILES.has(path) || PUBLIC_DIRS.some(dir => path.startsWith(dir));

function adminAllowed(req) {
  if (!ADMIN || !LOOPBACK.has(req.socket.remoteAddress)) return false;
  if (req.method === 'GET') return true;
  const origin = req.headers.origin;
  return !origin || origin === `http://${req.headers.host}`;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://en.wikipedia.org https://id.wikipedia.org https://commons.wikimedia.org;"
};

const COMPRESSIBLE = /^(text\/|application\/(json|manifest\+json|javascript))|image\/svg/;

async function serveFile(req, res, filePath, contentType) {
  try {
    let raw = await readFile(filePath);
    // The page hides the editorial console when this server does not offer it.
    if (!ADMIN && filePath.endsWith('index.html')) {
      raw = Buffer.from(String(raw).replace('</head>', '  <meta name="mythics-admin" content="off">\n</head>'));
    }
    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': contentType,
      // Unversioned application files must revalidate after a UI update.
      'Cache-Control': /\.(html|css|js|svg)$/.test(filePath) ? 'no-cache' : 'public, max-age=3600'
    };

    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.test(contentType) && raw.length > 512) {
      if (acceptEncoding.includes('br')) {
        headers['Content-Encoding'] = 'br';
        headers['Vary'] = 'Accept-Encoding';
        res.writeHead(200, headers);
        return res.end(brotliCompressSync(raw));
      }
      if (acceptEncoding.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        headers['Vary'] = 'Accept-Encoding';
        res.writeHead(200, headers);
        return res.end(gzipSync(raw));
      }
    }

    res.writeHead(200, headers);
    res.end(raw);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal server error loading asset');
  }
}

async function start() {
  await initDb();

  const server = createServer(async (req, res) => {
    const startReq = Date.now();
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (LOG) {
      console.log(`[HTTP] ${req.method} ${url.pathname}${url.search}`);
    }

    // CORS for local development / testing
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end();
    }

    if (url.pathname.startsWith('/api/admin/') && !adminAllowed(req)) {
      res.writeHead(ADMIN ? 403 : 404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: ADMIN ? 'Editorial console accepts local same-origin requests only' : 'Editorial console is disabled (start the server with MYTHICS_ADMIN=1)' }));
    }

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRoute(req, res, url);
    }

    // Static Assets & Routing
    let safePath = normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
    if (safePath === '/' || safePath === '') safePath = '/index.html';

    const localPath = join(ROOT, safePath);
    const ext = extname(localPath).toLowerCase();

    try {
      const stats = await stat(localPath);
      if (stats.isFile() && MIME[ext] && isPublic(safePath.replace(/\\/g, '/'))) {
        return serveFile(req, res, localPath, MIME[ext]);
      }
    } catch {
      // Not a direct static file
    }

    // SPA routing fallback for clean paths (e.g. /creature/pocong, /explore, /compare, /admin, /cultures/*)
    if (!ext || ext === '.html') {
      const indexPath = join(ROOT, 'index.html');
      return serveFile(req, res, indexPath, 'text/html; charset=utf-8');
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(PORT, HOST, () => {
    console.log(`\n======================================================`);
    console.log(`  ✦ MYTHICS ENCYCLOPEDIA SERVER RUNNING ✦`);
    console.log(`  URL: http://${HOST}:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Editorial console: ${ADMIN ? 'enabled (local requests only)' : 'disabled'}`);
    console.log(`======================================================\n`);
  });
}

start().catch(err => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
