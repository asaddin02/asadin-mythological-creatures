/** Smoke-test the public-only build with its R2 media routes, or the deployed site. */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// Face regions in the approved source artwork, normalized to its dimensions.
const heroFaces = {
  garuda: [.46, .03, .68, .27], kitsune: [.53, .08, .74, .29],
  jormungandr: [.55, .09, .81, .42], barong: [.35, .20, .67, .60],
};
const root = new URL('../', import.meta.url);
const remote = process.env.PUBLIC_SITE_URL;
const port = process.env.UI_TEST_PORT || '8103';
const base = remote?.replace(/\/$/, '') || `http://127.0.0.1:${port}`;
const origin = new URL(base).origin;
const catalog = JSON.parse(await readFile(new URL('dist/api/catalog.json', root), 'utf8'));
const server = remote ? null : spawn(process.execPath, ['scripts/serve-static.mjs'], {
  cwd: root, env: { ...process.env, PORT: port, HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;
try {
  if (server) await Promise.race([
    new Promise((resolve, reject) => {
      server.stdout.on('data', chunk => { if (String(chunk).includes('SERVER RUNNING')) resolve(); });
      server.once('error', reject);
      server.once('exit', code => reject(new Error(`Public preview exited: ${code}`)));
    }),
    new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Public preview startup timed out')), 10000); timer.unref(); }),
  ]);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(15000);
  const screenshots = process.env.PUBLIC_SCREENSHOTS_DIR;
  if (screenshots) await mkdir(screenshots, { recursive: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (new URL(response.url()).origin === origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === origin && request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.failure()?.errorText} ${request.url()}`);
  });
  const go = async route => {
    await page.goto(`${base}/#/${route}`);
    await page.locator('#header-root nav').waitFor();
  };
  const decoded = async selector => {
    const image = page.locator(selector);
    await image.waitFor();
    await image.evaluate(img => img.decode());
    assert(await image.evaluate(img => img.naturalWidth > 0 && !img.currentSrc.includes('creature-fallback')), `${selector} loads its actual artwork`);
  };
  const noOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Public page fits the viewport');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    await go('');
    await page.locator('.featured-grid .creature-card').first().waitFor();
    assert.equal(await page.locator('.featured-grid .creature-card').count(), 4);
    assert.equal(await page.locator('a[href="#/admin"]').count(), 0, 'Public navigation excludes the editorial console');
    for (const slug of ['garuda', 'kitsune', 'jormungandr', 'barong']) {
      await page.locator(`[data-hero="${slug}"]`).click();
      await page.waitForFunction(slug => document.querySelector('.gateway')?.dataset.legend === slug, slug);
      await decoded('.royal-slide.is-active .hero-art');
      assert(await page.locator('.royal-slide.is-active .hero-art').evaluate((img, face) => {
        const css = getComputedStyle(img), box = img.getBoundingClientRect();
        const stage = img.closest('.gateway').getBoundingClientRect();
        const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
        const x = box.left + (box.width - img.naturalWidth * scale) * parseFloat(css.objectPosition) / 100;
        const rect = {
          left: x + face[0] * img.naturalWidth * scale,
          top: box.top + face[1] * img.naturalHeight * scale,
          right: x + face[2] * img.naturalWidth * scale,
          bottom: box.top + face[3] * img.naturalHeight * scale,
        };
        const unobstructed = ['.royal-feature', '.royal-hero-copy'].every(selector => {
          const other = document.querySelector(selector).getBoundingClientRect();
          return rect.right <= other.left || rect.left >= other.right || rect.bottom <= other.top || rect.top >= other.bottom;
        });
        return css.filter === 'none' && css.objectFit === 'cover' && css.objectPosition.endsWith('0%') &&
          box.top > stage.top && rect.left >= box.left - 1 && rect.right <= box.right + 1 &&
          rect.top >= box.top && rect.bottom <= box.bottom && unobstructed;
      }, heroFaces[slug]), `${slug}: sharp banner artwork keeps the face visible and clear of the copy and legend card`);
    }
    if (screenshots) await page.locator('.gateway').screenshot({ path: `${screenshots}/home-${width}.png` });
    await page.locator('.featured-grid').scrollIntoViewIfNeeded();
    await page.locator('.featured-grid img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    assert(await page.locator('.featured-grid img').evaluateAll(images => images.every(img => getComputedStyle(img).objectFit === 'contain')), 'Featured cards show complete illustrations');
    await noOverflow();
    for (const slug of ['valva', 'tzitzimitl', 'shubin-ghost']) {
      assert(catalog.some(c => c.slug === slug), `${slug} is in the public catalog`);
      await go(`creature/${slug}`);
      await page.locator('.detail-canonical-name').waitFor();
      await decoded('.detail-primary-img');
      assert.match(await page.locator('.detail-primary-img').getAttribute('src'), /-presence\.webp$/, `${slug} uses the accepted revision`);
      assert.equal(await page.locator('.detail-primary-img').evaluate(img => getComputedStyle(img).objectFit), 'contain', 'Detail preserves the full illustration');
      if (screenshots && slug === 'tzitzimitl') await page.screenshot({ path: `${screenshots}/detail-${width}.png` });
      await noOverflow();
      await page.locator('.detail-open-art').click();
      await decoded('.viewer-image.is-loaded');
      await page.keyboard.press('Escape');
    }
  }
  await page.setViewportSize({ width: 1440, height: 960 });
  await go('explore?q=valva');
  await page.locator('#explore-creature-grid [data-slug="valva"]').waitFor();
  await go('compare?a=kitsune&b=garuda');
  await page.locator('.compare-matrix-table').waitFor();
  await go('cultures');
  await page.locator('#cultures-grid-slot .culture-card').first().waitFor();
  await go('regions');
  await page.locator('#regions-grid-slot .region-card').first().waitFor();
  await go('learn');
  await page.locator('.learn-layout').waitFor();
  await go('dukung');
  await page.locator('.edu-support').waitFor();
  assert.deepEqual(errors, [], 'Public routes have no runtime errors or failed local resources');
  console.log(`Public browser: desktop/mobile hero, cards, accepted revisions, viewer, search, comparison and directories passed (${catalog.length} creatures).`);
} finally {
  await browser?.close();
  server?.kill();
}
