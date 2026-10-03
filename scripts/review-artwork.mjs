#!/usr/bin/env node
// Make a browser screenshot for visual inspection without altering source images.
// Usage: node scripts/review-artwork.mjs slug1 slug2 slug3 slug4
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const batch = JSON.parse(await readFile(resolve(root, 'data/artwork-batch-100.json'), 'utf8'));
const slugs = process.argv.slice(2);
if (!slugs.length || slugs.length > 4) throw new Error('Select one to four creature slugs.');
const entries = [];
for (const slug of slugs) {
  const item = batch.items.find(i => i.slug === slug);
  if (!item) throw new Error(`Not part of this batch: ${slug}`);
  let generated;
  try {
    generated = JSON.parse(await readFile(resolve(root, `data/artwork-generated/${slug}-corrected.json`), 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    generated = JSON.parse(await readFile(resolve(root, `data/artwork-generated/${slug}.json`), 'utf8'));
  }
  if (!generated.original_file) throw new Error(`No generated file: ${slug}`);
  const png = await readFile(generated.original_file);
  entries.push({ ...item, original_file: generated.original_file, data: png.toString('base64') });
}
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const browser = await chromium.launch({ headless: true });
const output = `/home/asadin/.codex/generated_images/mythics-review-${slugs.join('_')}.png`;
try {
  const page = await browser.newPage({ viewport: { width: 2000, height: entries.length > 2 ? 2080 : 1040 }, deviceScaleFactor: 1 });
  await page.setContent(`<style>body{margin:0;background:#111;color:#fff;font:24px sans-serif}main{display:grid;grid-template-columns:repeat(2,1000px)}figure{margin:0;height:1040px}h2{height:40px;line-height:40px;font-size:24px;margin:0;padding:0 20px}img{display:block;width:1000px;height:1000px;object-fit:contain}</style><main>${entries.map(e => `<figure><h2>${escape(e.slug)}</h2><img src="data:image/png;base64,${e.data}"></figure>`).join('')}</main>`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await mkdir('/home/asadin/.codex/generated_images', { recursive: true });
  await page.screenshot({ path: output });
} finally {
  await browser.close();
}
console.log(JSON.stringify({ screenshot: output, entries: entries.map(({slug, original_file, visual_requirements}) => ({slug, original_file, visual_requirements})) }));
