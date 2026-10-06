/** Verify the real before/after gallery, its assets, search, status filter and mobile layout. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { root, ledgerPath, read } from '../scripts/artwork-presentation-lib.mjs';
const ledger = read(ledgerPath), port = '8107', base = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', port, '--bind', '127.0.0.1'],
  { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Gallery server startup timed out')), 10000);
    const ready = async () => {
      try { if ((await fetch(base)).ok) { clearTimeout(timer); resolve(); return; } } catch {}
      setTimeout(ready, 100);
    };
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Gallery server exited: ${code}`)));
    ready();
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${base}/docs/artwork-presentation-revision-1000.html`);
  assert.equal(await page.locator('article').count(), ledger.target);
  assert.equal(await page.locator('article img').count(), ledger.target + ledger.complete);
  // Request every referenced asset, including images below the fold and hidden cards.
  const sources = await page.locator('article img').evaluateAll(imgs => imgs.map(i => i.src));
  for (const url of new Set(sources)) {
    const response = await page.request.get(url);
    assert.equal(response.status(), 200, `Gallery asset: ${url}`);
    assert(response.headers()['content-type']?.includes('image/webp'));
    await response.dispose();
  }
  const countVisible = () => page.locator('article:not([hidden])').count();
  await page.locator('#filter').selectOption('complete');
  assert.equal(await countVisible(), ledger.complete);
  await page.locator('#filter').selectOption('pending');
  assert.equal(await countVisible(), ledger.target - ledger.complete);
  await page.locator('#filter').selectOption('all');
  await page.locator('#search').fill('heqet');
  assert.equal(await countVisible(), 1);
  assert.equal(await page.locator('article:not([hidden]) img').count(), 2);
  await page.locator('article:not([hidden]) summary').click();
  assert((await page.locator('article:not([hidden]) details').innerText()).includes('heqet-c06'));
  await page.locator('#search').fill('no-such-mythological-creature');
  assert.equal(await countVisible(), 0);
  assert.equal(await page.locator('#count').innerText(), '0 makhluk');
  await page.locator('#search').fill('heqet');
  mkdirSync(`${root}/tmp/presentation-revision-1000/browser`, { recursive: true });
  for (const [name, width, height] of [['desktop', 1440, 960], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll('article:not([hidden]) img')) {
        img.loading = 'eager';
        await img.decode();
      }
    });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} overflow`);
    await page.screenshot({ path: `${root}/tmp/presentation-revision-1000/browser/${name}.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'pass', cards: ledger.target, complete: ledger.complete,
    referenced_images: sources.length, search: true, filters: true, desktop_mobile: true }));
} finally {
  await browser?.close();
  server.kill();
}
