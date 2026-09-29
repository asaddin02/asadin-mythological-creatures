/**
 * The static site (npm run build:site) answers like the Node server: every pre-built API file matches the
 * server's response, and queries over the lightweight catalog return the same creatures and pagination.
 */

import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import * as engine from '../js/query-engine.js';
import {
  initDb,
  getLibrary,
  getCreatureBySlug,
  getCreatureIndex,
  getLibraryStats,
  getCultures,
  getCultureById,
  getRegions,
  getRegionById,
  getRelationshipGraph,
  getCategories,
  queryCreatures,
} from '../server/db.mjs';

const dist = new URL('../dist/', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, dist), 'utf8'));

console.log('📦 Static site');
await initDb();
const library = getLibrary();

assert.deepEqual(await json('api/creature-index.json'), getCreatureIndex());
assert.deepEqual(await json('api/library-stats.json'), getLibraryStats());
assert.deepEqual(await json('api/cultures.json'), getCultures());
assert.deepEqual(await json('api/regions.json'), getRegions());
assert.deepEqual(await json('api/categories.json'), getCategories());

for (const slug of ['garuda', 'pocong', 'kitsune', library.creatures.at(-1).slug]) {
  assert.deepEqual(await json(`api/creatures/${slug}.json`), JSON.parse(JSON.stringify(getCreatureBySlug(slug))));
  assert.deepEqual(await json(`api/graph/${slug}.json`), JSON.parse(JSON.stringify(getRelationshipGraph(slug))));
  assert.deepEqual(await json(`api/claims/${slug}.json`), getCreatureBySlug(slug).claims_provenance || []);
}
for (const culture of library.cultures.slice(0, 5))
  assert.deepEqual(await json(`api/cultures/${engine.normalizeText(culture.id)}.json`), JSON.parse(JSON.stringify(getCultureById(culture.id))));
for (const region of library.regions)
  assert.deepEqual(await json(`api/regions/${engine.normalizeText(region.id)}.json`), JSON.parse(JSON.stringify(getRegionById(region.id))));

// The browser runs the query engine over catalog.json + regions.json; results must match the full library.
const catalog = { creatures: await json('api/catalog.json'), regions: await json('api/regions.json') };
const cases = [
  {},
  { limit: '100' },
  { q: 'pocong' },
  { q: 'jormungandr' },
  { q: 'naga', page: '2' },
  { culture: 'indonesian-folklore' },
  { region: 'southeast-asia' },
  { region: 'Asia Tenggara' },
  { tier: 'core', page: '999999' },
  { tier: 'rich', sort: 'name-desc' },
  { sort: 'power', limit: '24' },
  { sort: 'completeness', classification: 'dragon' },
  { trait: 'flight' },
];
for (const params of cases) {
  const server = queryCreatures(params);
  const local = engine.queryCreatures(catalog, params);
  assert.deepEqual(local.pagination, server.pagination, `pagination for ${JSON.stringify(params)}`);
  assert.deepEqual(local.creatures.map(c => c.slug), server.creatures.map(c => c.slug), `results for ${JSON.stringify(params)}`);
}
// Card, random-encounter and journal fields survive the catalog trim.
const card = catalog.creatures.find(c => c.slug === 'garuda');
for (const field of ['slug', 'canonical_name', 'display_name', 'short_description', 'culture', 'classification', 'content_tier', 'images'])
  assert.ok(card[field] !== undefined, `catalog keeps ${field}`);

const html = await readFile(new URL('index.html', dist), 'utf8');
assert.match(html, /<meta name="mythics-data" content="static">/);
assert.match(html, /<meta name="mythics-admin" content="off">/);
assert.doesNotMatch(html, /mythics\.org/, 'no link previews for a domain this project does not own');
assert.equal(await readFile(new URL('404.html', dist), 'utf8'), html);
assert.match(await readFile(new URL('_headers', dist), 'utf8'), /Content-Security-Policy/);
for (const path of ['api/admin', 'server', 'scripts', 'data', 'package.json'])
  await assert.rejects(stat(new URL(path, dist)), `dist/ must not contain ${path}`);
console.log(`  ✓ ${cases.length} query cases and every API file match the server`);
