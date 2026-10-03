/**
 * The public build (MYTHICS_PUBLISH=complete MEDIA_BASE=/media npm run build:site) publishes only creatures
 * whose verified research meets its tier target and has an approved image, shows that research, and moves
 * their artwork out of dist/ into dist-media/ for R2.
 */
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { promisify } from 'node:util';
import { computeFillStatus } from '../scripts/gemini/fill-lib.mjs';

const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));

await promisify(execFile)('node', ['scripts/build-site.mjs'], {
  cwd: root,
  env: { ...process.env, MYTHICS_PUBLISH: 'complete', MEDIA_BASE: '/media' },
});

const creatures = await read('data/creatures.json');
const { status, entries } = await computeFillStatus(creatures);
const expected = Object.entries(status).filter(([, v]) => v.status === 'lengkap-bergambar').map(([slug]) => slug).sort();
const catalog = await read('dist/api/catalog.json');
assert.deepEqual(catalog.map(c => c.slug).sort(), expected, 'Only complete, illustrated creatures are published');
assert(expected.length > 0, 'The public library is not empty');

const media = new Set((await readdir(new URL('dist-media/art/', root))).map(f => `/media/art/${f}`));
const { EDITORIAL_ART } = await import(new URL(`dist/js/editorial-art.js?${Date.now()}`, root));
assert.deepEqual(Object.keys(EDITORIAL_ART).filter(s => !expected.includes(s)), [], 'Artwork map lists only published creatures');

for (const slug of expected) {
  const c = await read(`dist/api/creatures/${slug}.json`);
  const entry = entries.get(slug);
  assert.equal(c.short_description.en, entry.short_description.en, `${slug} shows its research text`);
  assert.equal(c.claims_provenance.length, entry.claims.length, `${slug} lists every claim`);
  assert(c.claims_provenance.every(cl => cl.quote && cl.source_citation), `${slug} claims carry their quotes`);
  assert(c.sources.every(s => /^https?:\/\//.test(s.url)), `${slug} sources link out`);
  assert(c.images.length > 0, `${slug} has an image`);
  for (const img of c.images) {
    const local = img.url.startsWith('/assets/art/') && (await access(new URL(`dist${img.url}`, root)).then(() => true, () => false));
    const ok = img.url.startsWith('https://commons.wikimedia.org/') || media.has(img.url) || local;
    assert(ok, `${slug} image is on R2, Commons or the site: ${img.url}`);
  }
  if (EDITORIAL_ART[slug]?.startsWith('/media/')) assert(media.has(EDITORIAL_ART[slug]), `${slug} artwork is uploaded`);
}

// Creature artwork left dist/ (only art the interface names directly stays).
const leftover = (await readdir(new URL('dist/assets/art/', root))).filter(f => /\.(webp|png|jpe?g)$/.test(f));
for (const f of leftover) assert(!media.has(`/media/art/${f}`), `${f} is not shipped twice`);
await access(new URL('functions/media/[[path]].js', root));

console.log(`Public build: ${expected.length} creatures, ${media.size} artwork files for R2, ${leftover.length} interface images kept in dist/.`);
