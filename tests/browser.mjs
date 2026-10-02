import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright";

// UI_TEST_TARGET=static runs the same checks against dist/ (npm run build:site) as Cloudflare Pages serves it.
const STATIC = process.env.UI_TEST_TARGET === "static";
const port = process.env.UI_TEST_PORT || (STATIC ? "8099" : "8098");
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [STATIC ? "scripts/serve-static.mjs" : "server/server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, PORT: port, HOST: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await Promise.race([
    new Promise((resolve, reject) => {
      server.stdout.on("data", (chunk) => {
        if (String(chunk).includes("SERVER RUNNING")) resolve();
      });
      server.once("exit", (code) =>
        reject(new Error(`Test server exited: ${code}`)),
      );
      server.once("error", reject);
    }),
    new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Test server startup timed out")),
        10000,
      );
      timer.unref();
    }),
  ]);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const go = async (route) => {
    await page.goto(`${base}/#/${route}`);
  };
  await go("");
  await page.locator(".featured-grid .creature-card").first().waitFor();
  assert.equal(await page.locator(".featured-grid .creature-card").count(), 4);
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => ['Cinzel', 'Manrope'].every(font => document.fonts.check(`500 16px "${font}"`)) && document.fonts.check('italic 500 16px "Cormorant Garamond"')), 'All local typefaces must load');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => /fonts\.(googleapis|gstatic)\.com/.test(r.name))), false, 'Typography must not require an external font service');
  if (STATIC) assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.endsWith('/api/catalog.json'))), false, 'Homepage should not download the complete catalog');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => /\/(assets\/logo\.png|components\/(creature-detail|admin-dashboard)\.js)$/.test(r.name))), false, 'Homepage avoids the hidden 1 MB logo and unopened detail/admin modules');
  for (const [slug,power] of [['kitsune','superhuman'],['jormungandr','cosmic'],['barong','divine'],['garuda','divine']]) {
    await page.locator(`[data-hero="${slug}"]`).click();
    assert.equal(await page.locator('.archive-hero').getAttribute('data-legend'), slug);
    assert((await page.locator('.archive-hero').getAttribute('class')).includes(`power-${power}`));
    assert.equal(await page.locator('.hero-art-label').getAttribute('href'), `#/creature/${slug}`);
    assert.equal(await page.locator(`[data-hero="${slug}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.hero), slug);
    await page.locator('.hero-art').evaluate(img => img.decode());
  }
  await page.locator('.featured-grid').scrollIntoViewIfNeeded();
  await page.locator('.featured-grid img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  assert.equal(await page.locator('[data-preview-src], [data-download-src], .card-aura, #aura-toggle-btn').count(), 0, 'Home cards navigate; artwork tools belong on detail pages');
  await page.locator('.featured-grid [data-slug="kitsune"] .card-media').click();
  await page.locator('.detail-preview').waitFor();
  assert.equal(new URL(page.url()).hash, '#/creature/kitsune');
  assert.equal(await page.locator('.art-viewer[open]').count(), 0);

  // Detail artwork supports preview, zoom, pan and actual downloads.
  const artworkButton = page.locator('.detail-preview');
  await artworkButton.click();
  await page.locator('.viewer-image.is-loaded').waitFor();
  assert.equal(await page.locator('.art-viewer[open]').count(), 1);
  assert.equal(new URL(page.url()).hash, '#/creature/kitsune');
  await page.locator('[data-zoom="in"]').click();
  assert.equal(await page.locator('.viewer-zoom output').innerText(), '150%');
  const stageBox = await page.locator('.viewer-stage').boundingBox();
  await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(stageBox.x + stageBox.width / 2 + 55, stageBox.y + stageBox.height / 2 + 30);
  await page.mouse.up();
  assert.match(await page.locator('.viewer-image').getAttribute('style'), /translate\(55px,\s*30px\)/);
  await page.locator('[data-zoom="reset"]').click();
  assert.equal(await page.locator('.viewer-zoom output').innerText(), '100%');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.viewer-download').click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'mythics-kitsune.webp');
  const { stat } = await import('node:fs/promises');
  assert((await stat(await download.path())).size > 10000, 'Downloads contain the actual illustration');
  // A blocked remote download must give a usable original-image fallback.
  const imagePath = '**/assets/art/kitsune-editorial.webp';
  await page.route(imagePath, route => route.request().resourceType() === 'fetch' ? route.abort() : route.continue());
  await page.locator('.viewer-download').click();
  await page.locator('.download-source:not([hidden])').waitFor();
  assert.match(await page.locator('.download-source').getAttribute('href'), /kitsune-editorial\.webp$/);
  await page.unroute(imagePath);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.art-viewer[open]').count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.previewSlug), 'kitsune');
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');

  // On a phone the viewer fits the viewport, and two pointer contacts drive pinch zoom.
  await page.setViewportSize({width:390,height:844});
  await artworkButton.click();
  await page.locator('.viewer-image.is-loaded').waitFor();
  await page.locator('.viewer-stage').evaluate(stage => {
    // Synthetic pointers do not own browser pointer capture; isolate the gesture math.
    stage.setPointerCapture = () => {};
    const pointer = (type, id, x) => stage.dispatchEvent(new PointerEvent(type,{pointerId:id,pointerType:'touch',clientX:x,clientY:200,bubbles:true}));
    pointer('pointerdown',1,100); pointer('pointerdown',2,200); pointer('pointermove',2,260);
    pointer('pointerup',1,100); pointer('pointerup',2,260);
  });
  assert.equal(await page.locator('.viewer-zoom output').innerText(), '160%');
  assert(await page.locator('.viewer-download').isVisible());
  assert(await page.locator('.art-viewer').evaluate(el=>el.scrollWidth<=innerWidth && el.getBoundingClientRect().bottom<=innerHeight+1));
  await page.keyboard.press('Escape');
  await page.setViewportSize({width:1440,height:960});

  // The direct detail download and separate artwork button are both usable.
  const directDownloadEvent = page.waitForEvent('download');
  await page.locator('.detail-download').click();
  const directDownload = await directDownloadEvent;
  assert.equal(directDownload.suggestedFilename(), 'mythics-kitsune.webp');
  assert((await stat(await directDownload.path())).size > 10000);
  await page.route(imagePath, route => route.request().resourceType() === 'fetch' ? route.abort() : route.continue());
  await page.locator('.detail-download').click();
  await page.locator('.detail-download-status a').waitFor();
  assert.match(await page.locator('.detail-download-status a').getAttribute('href'), /kitsune-editorial\.webp$/);
  await page.unroute(imagePath);
  await page.locator('.detail-open-art').click();
  await page.locator('.viewer-image.is-loaded').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'detail-open-art');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.detail-toc [data-scroll="detail-scaling"]').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'detail-scaling');
  await page.emulateMedia({reducedMotion:'no-preference'});

  // Failed artwork keeps zoom/download controls disabled, including keyboard zoom.
  await page.route(imagePath, route => route.abort());
  await page.locator('.detail-open-art').click();
  await page.waitForFunction(() => document.querySelector('.viewer-status')?.textContent.includes('tidak dapat'));
  await page.keyboard.press('+');
  assert.equal(await page.locator('.viewer-zoom output').innerText(), '100%');
  assert(await page.locator('[data-zoom="in"]').isDisabled());
  assert(await page.locator('.viewer-download').isDisabled());
  await page.keyboard.press('Escape');
  await page.unroute(imagePath);

  await go('compare?a=kitsune&b=garuda');
  await page.locator('.compare-matrix-table').waitFor();
  assert.equal(await page.locator('#compare-select-a').inputValue(), 'kitsune');
  assert.equal(await page.locator('.compare-matrix-table [data-axis]').count(), 3);
  await page.locator('#compare-search-b').fill('jorm');
  assert.equal(await page.locator('#compare-select-b option').count(), 1);
  await page.locator('#btn-run-compare').click();
  await page.waitForFunction(()=>location.hash.includes('b=jormungandr'));
  assert.match(await page.locator('[data-axis="power"]').innerText(), /Cosmic/);
  await page.reload();
  await page.locator('.compare-matrix-table').waitFor();
  assert.equal(await page.locator('#compare-select-b').inputValue(), 'jormungandr');
  await page.locator('#compare-search-a').fill('no-such-being-123');
  assert(await page.locator('#btn-run-compare').isDisabled());
  await page.locator('#compare-search-a').fill('garuda');
  await page.locator('#btn-run-compare').click();
  await page.waitForFunction(()=>location.hash.includes('a=garuda'));
  assert.equal(await page.locator('.compare-header-row [data-preview-src]').count(), 0);
  await page.locator('.compare-header-row [data-slug="garuda"] .card-media').click();
  await page.locator('.detail-preview').waitFor();
  assert.equal(new URL(page.url()).hash, '#/creature/garuda');
  // Recovery after a failed comparison fetch, on both hosting modes.
  const comparisonPath = STATIC ? '**/api/creatures/medusa.json' : '**/api/compare?a=medusa&b=fenrir';
  await page.route(comparisonPath, route=>route.abort());
  await go('compare?a=medusa&b=fenrir');
  await page.locator('.comparison-error').waitFor();
  await page.unroute(comparisonPath);
  await page.locator('#btn-run-compare').click();
  await page.locator('.compare-matrix-table').waitFor();
  assert.match(await page.locator('.compare-matrix-table').innerText(), /Medusa/);
  await go('');
  await page.locator('.featured-grid .creature-card').first().waitFor();

  await page.locator("#hero-search-input").fill("kitsune");
  await page.locator("#hero-search-input").press("Enter");
  await page.locator('#explore-creature-grid [data-slug="kitsune"]').waitFor();
  assert.equal(await page.locator('#explore-creature-grid [data-preview-src]').count(), 0);
  await page.locator('#explore-creature-grid [data-slug="kitsune"] .card-media').click();
  await page.locator('.detail-preview').waitFor();
  assert.equal(new URL(page.url()).hash, '#/creature/kitsune');
  await go('explore?q=kitsune');
  await page.locator('#explore-creature-grid [data-slug="kitsune"]').waitFor();
  assert(
    (await page.locator("#explore-creature-grid .creature-card").count()) >= 1,
  );
  await page.locator("#explore-search-input").fill("not-a-real-creature-987");
  await page.locator("#empty-clear-btn").waitFor();
  assert.equal(
    await page.locator("#explore-pagination-slot button").count(),
    0,
  );
  await page.locator("#empty-clear-btn").click();
  await page.locator('#explore-pagination-slot [data-page="2"]').waitFor();
  await page.locator('#explore-pagination-slot [data-page="2"]').click();
  await page.waitForFunction(
    () =>
      location.hash.includes("page=2") &&
      document
        .querySelector("#explore-creature-grid")
        ?.getAttribute("aria-busy") === "false",
  );
  await page.reload();
  await page
    .locator('#explore-pagination-slot [aria-current="page"][data-page="2"]')
    .waitFor();
  await go("explore?region=southeast-asia");
  await page.locator("#explore-creature-grid .creature-card").first().waitFor();
  assert(
    (await page.locator("#explore-creature-grid .creature-card").count()) >= 8,
  );
  await go("creature/garuda");
  await page.locator("#btn-toggle-favorite").waitFor();
  await page.locator("#btn-toggle-favorite").click();
  assert.equal(
    await page.locator("#btn-toggle-favorite").getAttribute("aria-pressed"),
    "true",
  );
  await go("journal");
  await page.locator('#journal-favorites-slot [data-slug="garuda"]').waitFor();
  await page.reload();
  await page.locator('#journal-favorites-slot [data-slug="garuda"]').waitFor();
  await go("learn");
  await page.locator('input[name="answer"][value="0"]').check();
  await page.locator("#lesson-quiz button").click();
  assert.match(await page.locator("#quiz-feedback").innerText(), /Belum tepat/);
  await page.locator('input[name="answer"][value="1"]').check();
  await page.locator("#lesson-quiz button").click();
  assert.match(await page.locator("#quiz-feedback").innerText(), /Tepat/);
  await page.locator("#complete-lesson").click();
  await page.reload();
  await page.locator("#complete-lesson").waitFor();
  assert(await page.locator("#complete-lesson").isDisabled());
  await page.locator("#lang-toggle-btn").click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.match(
    await page.locator(".lesson-article h2").innerText(),
    /Myth, legend/,
  );
  // Legacy light preferences and OS settings cannot change the permanent dark identity.
  await page.evaluate(() => localStorage.setItem('mythics_theme', 'light'));
  await page.emulateMedia({colorScheme:'light'});
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('#theme-toggle-btn').count(), 0);
  await page.locator("#lang-toggle-btn").click();
  await go("");
  await page.locator("#hero-random-trigger").click();
  await page.locator("#random-inspect-btn").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator("#random-encounter-modal")
      .evaluate((el) => el.classList.contains("open")),
    false,
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "hero-random-trigger",
  );

  // The three independent scales remain readable and usable on every supported host.
  assert.equal(await page.locator('.featured-grid .scale-badge').count(), 12);
  await go('scales');
  assert.equal(await page.locator('.scale-level').count(), 7);
  assert.equal(await page.locator('.tier-preview').count(), 7);
  assert.equal(new Set(await page.locator('.tier-preview .frame-fittings').evaluateAll(els => els.map(el => el.dataset.frameTier))).size, 7, 'Guide shows all seven distinct frame designs');
  await page.locator('.tier-preview img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  assert(await page.locator('.tier-preview img').evaluateAll(images => images.every(img => img.naturalWidth === 640 && img.naturalHeight === 960)), 'All seven generated WebP frames load');
  await page.locator('.scale-axis-nav a[href="#/scales?axis=threat"]').click();
  await page.locator('.scale-axis-nav a[aria-current="page"][href$="threat"]').waitFor();
  assert.equal(await page.locator('.scale-level').count(), 7);
  await page.locator('.scale-axis-nav a[href="#/scales?axis=fear"]').click();
  await page.locator('.scale-axis-nav a[aria-current="page"][href$="fear"]').waitFor();
  assert.equal(await page.locator('.scale-level').count(), 6);
  await page.locator('#lang-toggle-btn').click();
  assert.match(await page.locator('.scale-levels').innerText(), /Its very existence or reality is a threat/);
  await page.locator('#lang-toggle-btn').click();
  await go('explore?power=cosmic&threat=t6&fear=f4');
  await page.locator('#explore-creature-grid [data-slug="jormungandr"]').waitFor();
  assert.equal(await page.locator('#explore-creature-grid .creature-card').count(), 1);
  await page.reload();
  await page.locator('#explore-creature-grid [data-slug="jormungandr"]').waitFor();
  assert.equal(await page.locator('#filter-power').inputValue(), 'cosmic');
  assert.equal(await page.locator('#filter-threat').inputValue(), 't6');
  assert.equal(await page.locator('#filter-fear').inputValue(), 'f4');
  await page.locator('#btn-clear-filters').click();
  await page.waitForFunction(() => document.querySelector('#explore-creature-grid')?.getAttribute('aria-busy') === 'false');
  for (const axis of ['power','threat','fear']) assert.equal(await page.locator(`#filter-${axis}`).inputValue(), 'all');
  await page.locator('#filter-power').selectOption('transcendent');
  await page.locator('#empty-clear-btn').waitFor();
  await go('creature/garuda');
  await page.locator('.assessment-panel').waitFor();
  assert.equal(await page.locator('.assessment-grid article').count(), 3);
  await page.locator('.detail-header-content .badge-power').click();
  await page.locator('.scale-level').first().waitFor();
  await go('');
  await page.locator('.archive-hero').waitFor();
  await page.evaluate(() => localStorage.setItem('mythics_aura', 'true'));
  await page.reload();
  await page.locator('.archive-hero').waitFor();
  assert.equal(await page.locator('.card-aura, #aura-toggle-btn, .is-tilting').count(), 0, 'Aura and pointer tilt stay removed even with a legacy preference');
  assert.equal(await page.evaluate(() => localStorage.getItem('mythics_aura')), null);

  // Main views remain within the viewport on narrow phones and desktop.
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "",
      "explore",
      "creature/garuda",
      "learn?module=reading",
      "compare",
      "journal",
      "cultures",
      "regions",
      "scales?axis=power",
      "scales?axis=threat",
      "scales?axis=fear",
    ]) {
      await go(route);
      await page.locator("h1").waitFor();
      if (route === "explore")
        await page
          .locator("#explore-creature-grid .creature-card")
          .first()
          .waitFor();
      if (route === "creature/garuda") {
        await page.locator('.detail-art-stage img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
        assert(await page.locator('.detail-art-stage').evaluate(el => {
          const rect = el.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth;
        }), `Detail frame remains inside the viewport at ${width}px`);
        assert.equal(await page.locator('.card-aura').count(), 0);
      }
      if (route === "compare")
        await page.locator(".compare-matrix-table").waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `Horizontal page overflow: ${route}, ${width}px`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#mobile-menu-toggle").click();
  assert.equal(
    await page.locator("#mobile-menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.locator('#main-nav-links a[data-route="learn"]').click();
  assert.equal(
    await page.locator("#mobile-menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  const index = await (
    await page.request.get(`${base}/api/creature-index${STATIC ? ".json" : ""}`)
  ).json();
  if (index.length > 100) {
    const last = index.at(-1);
    await go("creature/" + last.slug);
    await page.locator("#btn-toggle-favorite").waitFor();
    await page.locator("#btn-toggle-favorite").click();
    await go("journal");
    await page.locator(`[data-slug="${last.slug}"]`).waitFor();
    await go("compare");
    await page
      .locator("#compare-select-a option")
      .first()
      .waitFor({ state: "attached" });
    assert.equal(
      await page.locator("#compare-select-a option").count(),
      index.length,
    );
    await page.locator("#compare-select-b").selectOption(last.slug);
    await page.locator("#btn-run-compare").click();
    await page.waitForFunction(() =>
      document
        .querySelector(".compare-matrix-table")
        ?.textContent.match(/Not assessed|Belum dinilai/),
    );
    await go("explore?tier=core");
    await page
      .locator("#explore-creature-grid .creature-card")
      .first()
      .waitFor();
    assert(
      (await page.locator("#explore-pagination-slot button").count()) <= 5,
      "Pagination must remain compact for thousands of entries",
    );
    await page.locator("#explore-pagination-slot button").last().click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#explore-creature-grid")
          ?.getAttribute("aria-busy") === "false",
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  // Visitors never see the editorial console: it needs the local server started with MYTHICS_ADMIN=1.
  assert.equal(await page.locator('a[href="#/admin"]').count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    `Browser checks passed${STATIC ? " on the static site" : ""}: search, pagination, regions, journal, learning, persistence, languages, permanent dark theme, modal, artwork zoom/pan/pinch/download, comparison search/persistence/recovery, navigation, scaling filters and guides, detail reading navigation, seven generated frames, no aura, and 44 responsive route checks.`,
  );
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
