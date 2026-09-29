/**
 * Production-server policy: only public files are served, and the editorial console is off unless
 * MYTHICS_ADMIN=1, in which case it still refuses cross-origin writes.
 */

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const BASE_PORT = Number(process.env.POLICY_TEST_PORT || 28195);

async function start(port, env = {}) {
  const child = spawn(process.execPath, ['server/server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', MYTHICS_ADMIN: '', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await Promise.race([
    new Promise((resolve, reject) => {
      child.stdout.on('data', chunk => String(chunk).includes('SERVER RUNNING') && resolve());
      child.once('exit', code => reject(new Error(`Server exited: ${code}`)));
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Server startup timed out')), 15000).unref()),
  ]);
  return child;
}

async function stop(child) {
  if (child.exitCode === null) {
    child.kill('SIGTERM');
    await once(child, 'exit');
  }
}

const status = async (url, init) => (await fetch(url, init)).status;

console.log('🔒 Server policy');
let server = await start(BASE_PORT);
try {
  const base = `http://127.0.0.1:${BASE_PORT}`;
  for (const path of ['/', '/index.html', '/css/main.css', '/js/app.js', '/manifest.webmanifest', '/assets/logo.png'])
    assert.equal(await status(base + path), 200, `public file ${path}`);
  for (const path of ['/package.json', '/server/api.mjs', '/scripts/ingest-cli.mjs', '/data/creatures.json', '/data/import/report.json', '/tests/test-all.mjs'])
    assert.equal(await status(base + path), 404, `private file ${path}`);
  assert.equal(await status(`${base}/api/creatures/garuda`), 200);
  assert.equal(await status(`${base}/api/admin/stats`), 404, 'admin is off by default');
  assert.equal(
    await status(`${base}/api/admin/creatures`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"slug":"x"}' }),
    404,
    'no writes when the console is off'
  );
  assert.match(await (await fetch(base)).text(), /<meta name="mythics-admin" content="off">/);
  console.log('  ✓ public files only; editorial console off by default');
} finally {
  await stop(server);
}

server = await start(BASE_PORT + 1, { MYTHICS_ADMIN: '1' });
try {
  const base = `http://127.0.0.1:${BASE_PORT + 1}`;
  assert.equal(await status(`${base}/api/admin/stats`), 200, 'local console reads');
  assert.equal(
    await status(`${base}/api/admin/reviews/does-not-exist/reject`, { method: 'POST', headers: { Origin: 'https://evil.example' } }),
    403,
    'cross-origin writes are refused'
  );
  assert.equal(
    await status(`${base}/api/admin/reviews/does-not-exist/reject`, { method: 'POST', headers: { Origin: base } }),
    404,
    'same-origin writes reach the console'
  );
  assert.doesNotMatch(await (await fetch(base)).text(), /mythics-admin/);
  console.log('  ✓ enabled console accepts same-origin local requests only');
} finally {
  await stop(server);
}
