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
    const raw = await readFile(filePath);
    const headers = {
      ...SECURITY_HEADERS,
      'Content-Type': contentType,
      'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=3600'
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
      if (stats.isFile() && MIME[ext]) {
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
    console.log(`======================================================\n`);
  });
}

start().catch(err => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
