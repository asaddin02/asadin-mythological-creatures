#!/usr/bin/env node
/**
 * Assembles dist/ for static hosting (Cloudflare Pages, Netlify, GitHub Pages):
 * the application plus the read-only API as pre-built JSON files under dist/api/, produced by the same
 * query engine the Node server uses (js/query-engine.js). In the browser, js/api-client.js reads these files
 * and runs search, filters, pagination and random encounters itself. The editorial console needs the Node
 * server (npm run dev) and is not part of the static site.
 *
 *   npm run build:site
 *   SITE_URL=https://mythics.example npm run build:site   absolute link-preview and canonical URLs
 */

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../js/query-engine.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const siteURL = (process.env.SITE_URL || '').replace(/\/+$/, '');
if (siteURL && !/^https:\/\/[^/]+$/.test(siteURL))
  throw new Error(`SITE_URL must look like https://example.org, got "${siteURL}"`);

// Same security policy as server/server.mjs.
const HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://en.wikipedia.org https://id.wikipedia.org https://commons.wikimedia.org;",
  'Strict-Transport-Security': 'max-age=31536000',
};

const readData = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(join(root, 'data', file), 'utf8'));
  } catch (err) {
    if (fallback !== undefined && err.code === 'ENOENT') return fallback;
    throw err;
  }
};

// The library exactly as server/db.mjs initDb() prepares it.
const data = {
  creatures: await readData('creatures.json'),
  cultures: await readData('cultures.json'),
  categories: await readData('categories.json'),
  traits: await readData('traits.json'),
  regions: await readData('regions.json', []),
};
for (const cult of data.cultures) {
  cult.creature_count = data.creatures.filter(c => c.culture === cult.id && c.status === 'published').length;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ['manifest.webmanifest']) await cp(join(root, file), join(dist, file));
for (const dir of ['css', 'js', 'assets'])
  await cp(join(root, dir), join(dist, dir), { recursive: true, filter: src => !src.endsWith('.md') });

let files = 0;
async function writeJson(path, value) {
  const full = join(dist, 'api', path);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, JSON.stringify(value));
  files++;
}
const key = value => engine.normalizeText(value);

await writeJson('creature-index.json', engine.getCreatureIndex(data));
await writeJson('library-stats.json', engine.getLibraryStats(data));
await writeJson('cultures.json', data.cultures);
await writeJson('regions.json', engine.getRegions(data));
await writeJson('categories.json', engine.getCategories(data));
await writeJson('traits.json', data.traits);

// Everything search, filters, sorting, cards and random encounters read; details come from per-slug files.
await writeJson(
  'catalog.json',
  data.creatures.map(c => ({
    id: c.id,
    slug: c.slug,
    status: c.status,
    content_tier: c.content_tier,
    canonical_name: c.canonical_name,
    original_name: c.original_name,
    display_name: c.display_name,
    short_description: c.short_description,
    alternate_names: (c.alternate_names || []).map(a => ({ name: a.name })),
    culture: c.culture,
    region: c.region,
    country: c.country,
    classification: c.classification,
    element: c.element,
    habitat: c.habitat,
    behavior: c.behavior,
    traits: c.traits,
    completeness_score: c.completeness_score,
    power_profile: c.power_profile ? { dimensions: c.power_profile.dimensions } : undefined,
    images: (c.images || []).slice(0, 1).map(i => ({ url: i.url, thumbnail_url: i.thumbnail_url, caption: i.caption })),
  }))
);

for (const c of data.creatures) {
  for (const name of new Set([key(c.slug), key(c.id)])) {
    await writeJson(`creatures/${name}.json`, engine.getCreatureBySlug(data, c.slug));
    await writeJson(`graph/${name}.json`, engine.getRelationshipGraph(data, c.slug));
    await writeJson(`claims/${name}.json`, engine.getCreatureBySlug(data, c.slug).claims_provenance || []);
  }
}
for (const cult of data.cultures) {
  for (const name of new Set([key(cult.id), key(cult.slug)].filter(Boolean)))
    await writeJson(`cultures/${name}.json`, engine.getCultureById(data, cult.id));
}
for (const reg of data.regions) {
  for (const name of new Set([key(reg.id), key(reg.slug)].filter(Boolean)))
    await writeJson(`regions/${name}.json`, engine.getRegionById(data, reg.id));
}

// index.html tells js/api-client.js to read the static API and hides the editorial console.
let html = await readFile(join(root, 'index.html'), 'utf8');
const marker = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
const ogURL = '<meta property="og:url" content="https://mythics.org/">';
if (!html.includes(marker) || !html.includes(ogURL))
  throw new Error('index.html head changed; update scripts/build-site.mjs');
html = html.replace(
  marker,
  `${marker}\n  <meta name="mythics-data" content="static">\n  <meta name="mythics-admin" content="off">`
);
html = siteURL
  ? html
      .replace(ogURL, `<meta property="og:url" content="${siteURL}/">\n  <link rel="canonical" href="${siteURL}/">`)
      .replaceAll('content="/assets/logo.png"', `content="${siteURL}/assets/logo.png"`)
  : html.replace(`  ${ogURL}\n`, '');
await writeFile(join(dist, 'index.html'), html);
// Unknown paths answer 404 (so a missing /api/… file is an error, not the page) but still open the app.
await writeFile(join(dist, '404.html'), html);

await writeFile(
  join(dist, '_headers'),
  `/*\n${Object.entries(HEADERS)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join('\n')}\n/api/*\n  Cache-Control: public, max-age=300\n`
);
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n# The JSON API is for the app, not for search engines.\nDisallow: /api/\n');

async function size(dir) {
  let count = 0;
  let bytes = 0;
  let largest = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await size(full);
      count += sub.count;
      bytes += sub.bytes;
      largest = Math.max(largest, sub.largest);
    } else {
      const { size: b } = await stat(full);
      count++;
      bytes += b;
      largest = Math.max(largest, b);
    }
  }
  return { count, bytes, largest };
}
const total = await size(dist);
// Cloudflare Pages accepts at most 20,000 files per deployment and 25 MiB per file.
if (total.count > 20000) throw new Error(`dist/ has ${total.count} files; Cloudflare Pages allows 20,000.`);
if (total.largest > 25 * 1024 * 1024) throw new Error('A file in dist/ exceeds the 25 MiB Cloudflare Pages limit.');
console.log(
  `dist/: ${total.count} files (${files} API files), ${(total.bytes / 1048576).toFixed(1)} MB, largest ${(total.largest / 1048576).toFixed(1)} MB${siteURL ? `, link previews for ${siteURL}` : ''}.`
);
