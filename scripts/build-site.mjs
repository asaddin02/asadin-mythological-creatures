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
 *   MYTHICS_PUBLISH=complete npm run build:site   public library only: creatures whose verified research
 *                                                 meets its tier target and has an approved image, shown
 *                                                 with that research (scripts/publish/research-record.mjs)
 *   MEDIA_BASE=/media npm run build:site          creature artwork is served from object storage under this
 *                                                 path: image URLs are rewritten, the files are left out of
 *                                                 dist/ and copied to dist-media/ for upload (Cloudflare R2,
 *                                                 read back by functions/media/[[path]].js)
 */

import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as engine from '../js/query-engine.js';
import { publishedCreatures } from './publish/research-record.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const distMedia = join(root, 'dist-media');
const publishMode = process.env.MYTHICS_PUBLISH || 'all';
if (!['all', 'complete'].includes(publishMode)) throw new Error(`MYTHICS_PUBLISH must be "all" or "complete", got "${publishMode}"`);
const mediaBase = (process.env.MEDIA_BASE || '').replace(/\/+$/, '');
if (mediaBase && !/^\/[a-z0-9-]+$/.test(mediaBase)) throw new Error(`MEDIA_BASE must look like /media, got "${mediaBase}"`);
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
if (publishMode === 'complete') {
  const all = data.creatures.length;
  data.creatures = await publishedCreatures(data);
  console.log(`Public library: ${data.creatures.length} of ${all} creatures (verified research, tier target met, approved image).`);
}

// Art that the interface itself names (e.g. the home page feature) stays with the site.
const uiText = (await Promise.all(['index.html', ...(await readdir(join(root, 'js'), { recursive: true })).filter(f => f.endsWith('.js') && f !== 'editorial-art.js').map(f => join('js', f)), ...(await readdir(join(root, 'css'))).map(f => join('css', f))].map(f => readFile(join(root, f), 'utf8')))).join('\n');
const keepArt = name => !mediaBase || name.endsWith('.json') || name.endsWith('.md') || uiText.includes(`/assets/art/${name}`);

// Creature artwork: every local image a published creature uses, and the URL it is served from.
const { EDITORIAL_ART } = await import('../js/editorial-art.js');
const published = new Set(data.creatures.map(c => c.slug));
const artFiles = new Set();
const mediaURL = url => {
  if (!mediaBase || !url?.startsWith('/assets/art/') || keepArt(url.slice('/assets/art/'.length))) return url;
  artFiles.add(url.slice('/assets/art/'.length));
  return `${mediaBase}/art/${url.slice('/assets/art/'.length)}`;
};
for (const c of data.creatures)
  c.images = (c.images || []).map(i => ({ ...i, url: mediaURL(i.url), thumbnail_url: mediaURL(i.thumbnail_url), preview_url: mediaURL(i.preview_url), source_url: mediaURL(i.source_url) }));
const editorialArt = Object.fromEntries(
  Object.entries(EDITORIAL_ART).filter(([slug]) => publishMode === 'all' || published.has(slug)).map(([slug, url]) => [slug, mediaURL(url)])
);

for (const cult of data.cultures) {
  cult.creature_count = data.creatures.filter(c => c.culture === cult.id && c.status === 'published').length;
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ['manifest.webmanifest']) await cp(join(root, file), join(dist, file));
for (const dir of ['css', 'js', 'assets'])
  await cp(join(root, dir), join(dist, dir), {
    recursive: true,
    filter: src => !src.endsWith('.md') && !(dirname(src) === join(root, 'assets', 'art') && !keepArt(src.slice(dirname(src).length + 1))),
  });
await writeFile(
  join(dist, 'js', 'editorial-art.js'),
  `// Creature-specific editorial assets; generated by scripts/build-site.mjs.\nexport const EDITORIAL_ART = Object.freeze(${JSON.stringify(editorialArt, null, 2)});\n`
);
await rm(distMedia, { recursive: true, force: true });
if (mediaBase) {
  await mkdir(join(distMedia, 'art'), { recursive: true });
  for (const name of [...artFiles].sort()) await cp(join(root, 'assets', 'art', name), join(distMedia, 'art', name));
  console.log(`dist-media/: ${artFiles.size} artwork files for ${mediaBase}/art/ (upload to object storage).`);
}

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
// Google Search Console ownership: GOOGLE_SITE_VERIFICATION is the content of its meta tag (or the whole tag).
const verificationInput = (process.env.GOOGLE_SITE_VERIFICATION || '').trim();
const verification = verificationInput.match(/content="([^"]*)"/)?.[1] ?? verificationInput;
if (verificationInput && !/^[\w-]{20,100}$/.test(verification))
  throw new Error('GOOGLE_SITE_VERIFICATION must be the content of the google-site-verification meta tag');
if (verification) html = html.replace('</head>', `  <meta name="google-site-verification" content="${verification}">\n</head>`);
await writeFile(join(dist, 'index.html'), html);
// Unknown paths answer 404 (so a missing /api/… file is an error, not the page) but still open the app.
await writeFile(join(dist, '404.html'), html);

await writeFile(
  join(dist, '_headers'),
  `/*\n${Object.entries(HEADERS)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join('\n')}\n/api/*\n  Cache-Control: public, max-age=300\n/css/*\n  Cache-Control: no-cache\n/js/*\n  Cache-Control: no-cache\n/assets/ornaments/*\n  Cache-Control: no-cache\n${mediaBase ? `${mediaBase}/*\n  Cache-Control: public, max-age=86400\n` : ''}`
);
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n# The JSON API is for the app, not for search engines.\nDisallow: /api/\n${siteURL ? `\nSitemap: ${siteURL}/sitemap.xml\n` : ''}`
);
if (siteURL)
  await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteURL}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`
  );

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
