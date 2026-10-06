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
let browser, page;
const diagnostics = [];
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
  page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  const errors = [];
  page.on("pageerror", (error) => { errors.push(error.message); diagnostics.push(error.message); });
  page.on('response', response => { if (response.status() >= 400) diagnostics.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => diagnostics.push(`${request.failure()?.errorText} ${request.url()}`));
  page.on('console', message => { if(message.type()==='error')diagnostics.push(message.text()); });
  const waitForBoot = async () => {
    await page.locator('#header-root nav, #app-boot-error:not([hidden])').first().waitFor();
    if (await page.locator('#app-boot-error:not([hidden])').count()) {
      // This host changes network interfaces during the audit. Exercise the same
      // recovery button a visitor receives instead of leaving a blank application.
      console.log('Recovering an interrupted application download through Try again.');
      await page.locator('#app-boot-error button').click();
      await page.locator('#header-root nav').waitFor();
    }
  };
  const go = async (route) => {
    await page.goto(`${base}/#/${route}`);
    await waitForBoot();
  };
  const reload = async () => { await page.reload(); await waitForBoot(); };
  await go("");
  await page.locator(".featured-grid .creature-card").first().waitFor();
  assert.equal(await page.locator(".featured-grid .creature-card").count(), 4);
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => ['Cinzel', 'Manrope', 'Cormorant Garamond'].every(font => document.fonts.check(`500 16px "${font}"`)) && document.fonts.check('italic 500 16px "Cormorant Garamond"')), 'All local typefaces must load');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => /fonts\.(googleapis|gstatic)\.com/.test(r.name))), false, 'Typography must not require an external font service');
  if (STATIC) assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.endsWith('/api/catalog.json'))), false, 'Homepage should not download the complete catalog');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => /\/(assets\/logo\.png|components\/(creature-detail|admin-dashboard)\.js)$/.test(r.name))), false, 'Homepage avoids the hidden 1 MB logo and unopened detail/admin modules');
  // Real carousel controls: time advances without waiting twelve seconds per case.
  await page.clock.install();
  await page.locator('[data-hero="garuda"]').click();
  assert.equal(await page.locator('#hero-play').getAttribute('aria-pressed'), 'false');
  await page.locator('#hero-play').click();
  // Leave the hovered controls before autoplay.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.mouse.move(5, 5);
  await page.waitForFunction(() => document.querySelector('.gateway').classList.contains('is-playing'));
  await page.clock.fastForward(11000);
  assert.equal(await page.locator('.gateway').getAttribute('data-legend'), 'garuda', 'Each legend remains visible for twelve seconds');
  await page.clock.fastForward(1100);
  await page.waitForFunction(() => document.querySelector('.gateway').dataset.legend === 'kitsune');
  assert.equal(await page.locator('.royal-scene-link').getAttribute('href'), '#/creature/kitsune');
  // Hovering a scene pauses it while the visitor reads or chooses a link.
  await page.locator('.royal-hero-copy h1').hover();
  await page.clock.fastForward(13000);
  assert.equal(await page.locator('.gateway').getAttribute('data-legend'), 'kitsune');
  await page.locator('#hero-play').click();
  await page.mouse.move(5, 5);
  await page.clock.fastForward(13000);
  assert.equal(await page.locator('.gateway').getAttribute('data-legend'), 'kitsune', 'Pause must stop automatic changes');
  await page.locator('#hero-next').click();
  await page.waitForFunction(() => document.querySelector('.gateway').dataset.legend === 'jormungandr');
  await page.locator('#hero-prev').click();
  await page.waitForFunction(() => document.querySelector('.gateway').dataset.legend === 'kitsune');
  // Failed slides retain the current artwork and provide a recoverable message.
  const barongArt = '**/assets/art/barong-editorial.webp';
  await page.route(barongArt, route => route.abort());
  await page.locator('[data-hero="barong"]').click();
  await page.waitForFunction(() => document.querySelector('#hero-slide-status').textContent.includes('belum dapat'));
  assert.equal(await page.locator('.gateway').getAttribute('data-legend'), 'kitsune');
  assert.equal(await page.locator('#hero-play').getAttribute('aria-pressed'), 'false');
  await page.unroute(barongArt);
  for (const [slug,power] of [['kitsune','superhuman'],['jormungandr','cosmic'],['barong','divine'],['garuda','divine']]) {
    await page.locator(`[data-hero="${slug}"]`).click();
    await page.waitForFunction(slug => document.querySelector('.gateway')?.dataset.legend === slug, slug);
    assert((await page.locator('.gateway').getAttribute('class')).includes(`power-${power}`));
    assert.equal(await page.locator('.gateway-art').getAttribute('href'), `#/creature/${slug}`);
    assert.equal(await page.locator(`[data-hero="${slug}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.hero), slug);
    await page.locator('.royal-slide.is-active .hero-art').evaluate(img => img.decode());
  }
  await page.locator('#hero-play').click();
  await page.locator('.featured-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('.gateway').classList.contains('is-playing'));
  await page.clock.fastForward(13000);
  assert.equal(await page.locator('.gateway').getAttribute('data-legend'), 'garuda', 'Offscreen slideshow must pause');
  assert.equal(await page.locator('.royal-slide.is-active .hero-art').evaluate(img => getComputedStyle(img).transform), 'none', 'Artwork must stay fully framed without zoom drift');
  await page.locator('.featured-grid img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  assert.equal(await page.locator('[data-preview-src], [data-download-src], .card-aura, #aura-toggle-btn').count(), 0, 'Home cards navigate; artwork tools belong on detail pages');
  await page.evaluate(() => { window.departedHero = document.querySelector('.gateway'); });
  await page.locator('.featured-grid [data-slug="kitsune"] .card-media').click();
  await page.locator('.detail-preview').waitFor();
  assert.equal(new URL(page.url()).hash, '#/creature/kitsune');
  await page.clock.fastForward(13000);
  assert.equal(await page.evaluate(() => window.departedHero.dataset.legend), 'garuda', 'Leaving home must cancel the old slideshow');
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
  await page.locator('#tab-power').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'tab-power');
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
  await reload();
  await page.locator('.compare-matrix-table').waitFor();
  assert.equal(await page.locator('#compare-select-b').inputValue(), 'jormungandr');
  await page.locator('#compare-swap').click();
  await page.waitForFunction(()=>location.hash.includes('a=jormungandr') && location.hash.includes('b=kitsune'));
  assert.equal(await page.locator('#compare-select-a').inputValue(), 'jormungandr');
  await reload();
  await page.locator('.compare-matrix-table').waitFor();
  assert.equal(await page.locator('#compare-select-b').inputValue(), 'kitsune');
  await page.locator('#compare-select-a').selectOption('kitsune');
  await page.waitForFunction(()=>location.hash.includes('a=kitsune') && location.hash.includes('b=kitsune'));
  await reload();
  await page.locator('.compare-matrix-table').waitFor();
  assert.equal(await page.locator('#compare-select-a').inputValue(), 'kitsune');
  assert.equal(await page.locator('#compare-select-b').inputValue(), 'kitsune', 'Reload must not silently change a selected creature');
  assert.match(await page.locator('.compare-status').innerText(), /makhluk yang sama/);
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
  await reload();
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
  assert.equal(await page.locator('.achievement-icon svg').count(),5);
  await reload();
  await page.locator('#journal-favorites-slot [data-slug="garuda"]').waitFor();
  await go("learn");
  await page.locator('input[name="answer"][value="0"]').check();
  await page.locator("#lesson-quiz button").click();
  assert.match(await page.locator("#quiz-feedback").innerText(), /Belum tepat/);
  await page.locator('input[name="answer"][value="1"]').check();
  await page.locator("#lesson-quiz button").click();
  assert.match(await page.locator("#quiz-feedback").innerText(), /Tepat/);
  await page.locator("#complete-lesson").click();
  await reload();
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
  await reload();
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
  assert.deepEqual(await page.locator('.tier-preview .frame-level').allTextContents(), ['I','II','III','IV','V','VI','VII'], 'All seven tiers have a distinct, color-independent marker');
  assert(await page.locator('.tier-preview .frame-art').evaluateAll(frames => frames.every(frame => getComputedStyle(frame).borderTopWidth === '1px')), 'Every tier uses a fine one-pixel frame');
  assert.equal(await page.locator('.frame-art img').count(), 0, 'Frames need no raster overlays');
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/assets/frames/'))), false, 'The guide does not download ornamental frame images');
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
  await reload();
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
  await page.locator('#tab-power').click();
  await page.locator('.assessment-panel').waitFor();
  assert.equal(await page.locator('.assessment-grid article').count(), 3);
  await page.locator('.dossier-header .badge-power').click();
  await page.locator('.scale-level').first().waitFor();
  await go('');
  await page.locator('.gateway').waitFor();
  await page.evaluate(() => localStorage.setItem('mythics_aura', 'true'));
  await reload();
  await page.locator('.gateway').waitFor();
  assert.equal(await page.locator('.card-aura, #aura-toggle-btn, .is-tilting').count(), 0, 'Aura and pointer tilt stay removed even with a legacy preference');
  assert.equal(await page.evaluate(() => localStorage.getItem('mythics_aura')), null);


  // Dossier tabs preserve all topics and keep the portrait in place on desktop.
  await page.setViewportSize({width:1440,height:960});
  await go('creature/garuda');
  await page.locator('.dossier-workspace').waitFor();
  assert.equal(await page.locator('.dossier-tabs [role="tab"]').count(),6);
  assert.equal(await page.locator('.dossier-panel:not([hidden])').count(),1);
  const portraitTop=await page.locator('.detail-art-stage').evaluate(el=>el.getBoundingClientRect().top);
  const pageTop=await page.evaluate(()=>scrollY);
  for (const tab of ['lore','power','culture','relations','sources','overview']) {
    await page.locator(`#tab-${tab}`).click();
    assert.equal(await page.locator(`#panel-${tab}`).isVisible(),true);
    assert.equal(await page.locator('.dossier-panel:not([hidden])').count(),1);
    assert.equal(await page.evaluate(()=>scrollY),pageTop,'Tabs must not scroll the document');
    assert.equal(await page.locator('.detail-art-stage').evaluate(el=>el.getBoundingClientRect().top),portraitTop);
  }
  await page.locator('#tab-overview').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#tab-lore').getAttribute('aria-selected'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'tab-lore');
  await page.locator('#panel-lore .dossier-fold').first().locator('summary').click();
  assert(await page.locator('#panel-lore .dossier-fold').first().evaluate(el=>el.open));
  await page.locator('#tab-power').click();
  await reload();
  await page.locator('#panel-power:not([hidden])').waitFor();
  await page.locator('.axis-assessment summary').first().click();
  assert(await page.locator('.axis-assessment').first().evaluate(el=>el.open));
  assert(await page.locator('.axis-assessment .assessment-reason').first().isVisible());
  await page.locator('.assessment-source-link').click();
  assert.equal(await page.locator('#tab-sources').getAttribute('aria-selected'),'true');
  assert(await page.locator('#detail-sources').isVisible());
  await page.locator('#tab-sources').focus();
  await page.keyboard.press('Home');
  assert.equal(await page.locator('#tab-overview').getAttribute('aria-selected'),'true');
  await page.keyboard.press('End');
  assert.equal(await page.locator('#tab-sources').getAttribute('aria-selected'),'true');
  await page.locator('#lang-toggle-btn').click();
  await page.locator('#panel-sources:not([hidden])').waitFor();
  assert.equal(await page.locator('#tab-sources').innerText(),'Sources');
  await page.locator('#lang-toggle-btn').click();
  // On phones a topic chosen after scrolling begins below the sticky tab bar.
  await page.setViewportSize({width:390,height:844});
  await go('creature/garuda');
  await page.locator('#tab-lore').click();
  await page.evaluate(()=>window.scrollTo(0,600));
  await page.locator('#tab-sources').click();
  const sourceStart=await page.locator('#panel-sources').evaluate(el=>el.getBoundingClientRect().top);
  assert(sourceStart >= 100 && sourceStart < 170, 'Selecting a topic should show its beginning under the sticky tabs');
  await page.locator('#tab-overview').click();
  await page.evaluate(()=>window.scrollTo(0,0));
  assert(await page.locator('.dossier-tabs').evaluate(el=>el.getBoundingClientRect().bottom < innerHeight), 'All profile topics are reachable in the first mobile viewport');
  await page.setViewportSize({width:1440,height:960});
  // Directory tools filter real data, preserve the query, and recover from an empty match.
  await go('cultures');
  await page.locator('.culture-card').first().waitFor();
  assert(await page.locator('#culture-search').evaluate(el=>el.getBoundingClientRect().width>250),'Culture search must have usable desktop width');
  const allCultures=await page.locator('.culture-card').count();
  await page.locator('#culture-search').fill('indones');
  assert((await page.locator('.culture-card').count())>0);
  assert((await page.locator('.culture-card').count())<allCultures);
  await reload();
  await page.locator('.culture-card').first().waitFor();
  assert.equal(await page.locator('#culture-search').inputValue(),'indones');
  await page.locator('#culture-search').fill('no-such-culture-xyz');
  await page.locator('#culture-reset').click();
  assert.equal(await page.locator('.culture-card').count(),allCultures);
  await go('regions');
  await page.locator('.region-index').first().waitFor();
  assert.equal(await page.locator('.region-index').first().evaluate(el=>el.open),false);
  await page.locator('.region-index summary').first().click();
  assert(await page.locator('.region-index').first().evaluate(el=>el.open));
  await page.locator('.region-index a').first().click();
  await page.locator('.culture-cover').waitFor();
  assert.equal(await page.locator('.nav-link[data-route="cultures"]').getAttribute('aria-current'),'page');
  // Hidden advanced filters remain usable and open automatically from a shared link.
  await go('explore');
  await page.locator('#explore-creature-grid .creature-card').first().waitFor();
  assert.equal(await page.locator('.filter-disclosure').evaluate(el=>el.open),false);
  await page.locator('.filter-disclosure summary').click();
  await page.locator('#filter-culture').selectOption('indonesian-folklore');
  await page.waitForFunction(()=>location.hash.includes('culture=indonesian-folklore')&&document.querySelector('#explore-creature-grid').getAttribute('aria-busy')==='false');
  await reload();
  await page.locator('#explore-creature-grid .creature-card').first().waitFor();
  assert(await page.locator('.filter-disclosure').evaluate(el=>el.open));

  // Main views remain within the viewport on narrow phones and desktop.
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
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
  // A debounced search from a detached view cannot hijack later navigation.
  await go('explore');
  await page.locator('#explore-creature-grid .creature-card').first().waitFor();
  await page.locator('#explore-search-input').fill('pending search');
  await page.evaluate(()=>{location.hash='#/scales';});
  await page.locator('.scale-level').first().waitFor();
  await page.waitForTimeout(400);
  assert.equal(new URL(page.url()).hash, '#/scales');
  // Filters recover after a failed request without discarding the search.
  const archivePath = STATIC ? '**/api/catalog.json' : '**/api/creatures?**';
  await page.route(archivePath, route=>route.abort());
  await page.goto(`${base}/#/explore?q=garuda`);
  await reload();
  await page.locator('#explore-retry').waitFor();
  await page.unroute(archivePath);
  await page.locator('#explore-retry').click();
  await page.locator('#explore-creature-grid [data-slug="garuda"]').waitFor();
  assert.equal(await page.locator('#explore-search-input').inputValue(), 'garuda');
  // In-page reading navigation moves focus, so it works with a keyboard too.
  await go('creature/garuda');
  await page.locator('#tab-power').click();
  assert.equal(await page.evaluate(()=>document.activeElement.id), 'tab-power');
  assert.equal(await page.locator('#detail-scaling.motion-pending').count(), 0);
  // Removing a favorite is persisted as well as adding it.
  const favorite = page.locator('#btn-toggle-favorite');
  if(await favorite.getAttribute('aria-pressed')==='false')await favorite.click();
  await favorite.click();
  await reload();
  await page.locator('#btn-toggle-favorite').waitFor();
  assert.equal(await page.locator('#btn-toggle-favorite').getAttribute('aria-pressed'), 'false');
  await go('journal');
  await page.locator('#journal-favorites-slot').waitFor();
  assert.equal(await page.locator('#journal-favorites-slot [data-slug="garuda"]').count(), 0);
  // Reduced-motion mode removes reveals without hiding any functionality.
  await page.emulateMedia({reducedMotion:'reduce'});
  await go('');
  await page.locator('.featured-grid .creature-card').first().waitFor();
  assert.equal(await page.locator('.motion-pending').count(), 0);
  assert(await page.locator('.royal-slide.is-active .hero-art').evaluate(el=>getComputedStyle(el).animationName==='none'));
  assert.equal(await page.locator('#hero-play').getAttribute('aria-pressed'), 'false', 'Reduced motion starts with a still illustration');
  await page.locator('#hero-next').click();
  await page.waitForFunction(() => document.querySelector('.gateway').dataset.legend === 'kitsune');
  await page.locator('#hero-random-trigger').click();
  await page.locator('#random-inspect-btn').waitFor({state:'visible'});
  await page.locator('#random-again-btn').click();
  await page.locator('#random-inspect-btn').waitFor({state:'visible'});
  await page.locator('#random-inspect-btn').click();
  await page.locator('#btn-toggle-favorite').waitFor();
  assert.match(new URL(page.url()).hash, /^#\/creature\//);
  assert.equal(await page.evaluate(()=>document.body.style.overflow), '');
  // A late module import must boot even when DOMContentLoaded has already fired.
  const latePage = await browser.newPage();
  await latePage.route(`${base}/`, async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/<script\b[^>]*src="\/js\/app\.js"[^>]*><\/script>/, '');
    await route.fulfill({response,body});
  });
  await latePage.goto(`${base}/#/compare?a=kitsune&b=garuda`);
  assert.equal(await latePage.evaluate(()=>document.readyState), 'complete');
  await latePage.evaluate(()=>import('/js/app.js'));
  await latePage.locator('.compare-matrix-table').waitFor();
  assert.equal(await latePage.locator('#compare-select-a').inputValue(), 'kitsune');
  await latePage.close();
  // Interrupted module downloads offer a working recovery action.
  const bootPage = await browser.newPage();
  await bootPage.route('**/js/app.js', route=>route.abort());
  await bootPage.goto(`${base}/#/compare?a=garuda&b=kitsune`);
  await bootPage.locator('#app-boot-error button').waitFor();
  assert(await bootPage.locator('#app-boot-loading').isHidden());
  await bootPage.unroute('**/js/app.js');
  await bootPage.locator('#app-boot-error button').click();
  await bootPage.locator('.compare-matrix-table').waitFor();
  await bootPage.close();
  assert.deepEqual(errors, []);
  console.log(
    `Browser checks passed${STATIC ? " on the static site" : ""}: royal slideshow autoplay/pause/hover/arrows/failure/retry/route cleanup, search, pagination, regions, journal, learning, persistence, languages, permanent dark theme, modal, artwork zoom/pan/pinch/download, comparison search/swap/same-pair persistence/recovery, navigation, scaling filters and guides, six dossier tabs/keyboard/persistence/source navigation, culture directory search, collapsible archive/atlas sections, paused offscreen images, seven fine frames, reduced motion, pending-search navigation, archive retry, favorite removal, random repeat/detail, no aura, and 66 responsive route checks.`,
  );
} catch (error) {
  console.error('Browser audit failure:', page?.url(), diagnostics.slice(-12));
  if (page && !page.isClosed()) {
    console.error('Visible page:', (await page.locator('#app').innerText()).slice(-2500));
    await page.screenshot({path:`/tmp/mythics-audit-${STATIC ? 'static' : 'server'}-failure.png`,fullPage:true}).catch(()=>{});
  }
  throw error;
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
