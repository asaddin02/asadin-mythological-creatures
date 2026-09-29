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
  await page.locator("#hero-search-input").fill("kitsune");
  await page.locator("#hero-search-input").press("Enter");
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
  await page.locator("#theme-toggle-btn").click();
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.locator("#lang-toggle-btn").click();
  await page.locator("#theme-toggle-btn").click();
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
    ]) {
      await go(route);
      await page.locator("h1").waitFor();
      if (route === "explore")
        await page
          .locator("#explore-creature-grid .creature-card")
          .first()
          .waitFor();
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
        ?.textContent.includes("Not assessed"),
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
    `Browser checks passed${STATIC ? " on the static site" : ""}: search, pagination, regions, journal, learning, persistence, languages, themes, modal, navigation, and 32 responsive route checks.`,
  );
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
