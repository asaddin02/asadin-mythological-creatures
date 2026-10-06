/** Snapshot the original catalogue once and merge the three agents' screening decisions. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, directory, ledgerPath, read, save, existing, hash, assertBaseline } from './artwork-presentation-lib.mjs';
if (existing(ledgerPath) && !existing('tmp/presentation-revision-1000/inventory.json')) {
  const ledger = read(ledgerPath);
  assertBaseline(ledger, read('assets/art/verified-manifest.json'));
  console.log(JSON.stringify({ screened: ledger.screening.length, finalized: ledger.screening_complete,
    target: ledger.target, complete: ledger.complete, retained_existing_ledger: true }));
  process.exit(0);
}
const inventory = read('tmp/presentation-revision-1000/inventory.json');
const manifest = read('assets/art/verified-manifest.json');
const creatures = read('data/creatures.json');
const bySlug = new Map(creatures.map(c => [c.slug, c]));
let ledger;
if (existing(ledgerPath)) ledger = read(ledgerPath);
else {
  assert.equal(inventory.items.length, 1000);
  ledger = { title: 'Source-supported mythology presentation revisions',
    tool: 'OpenAI built-in image_gen', status: 'in-progress', started_at: new Date().toISOString(),
    screening_complete: false, target: 0, complete: 0,
    catalogue_slugs: creatures.map(c => c.slug).sort(),
    baseline: inventory.items.map(i => {
      const { images, ...facts } = bySlug.get(i.slug);
      assert.equal(manifest.artworks[i.slug].url, i.old_artwork.url, 'Snapshot before any replacement');
      assert.equal(hash(`.${i.old_artwork.url}`), i.old_webp_sha256);
      return { slug: i.slug, url: i.old_artwork.url, sha256: i.old_webp_sha256,
        original_file: i.old_artwork.original_file, native_sha256: i.old_native_sha256,
        creature_sha256: createHash('sha256').update(JSON.stringify(facts)).digest('hex') };
    }), screening: [], items: [] };
}
assertBaseline(ledger, manifest);
const decisions = new Map();
for (let worker = 0; worker < 3; worker++) {
  const temporary = `tmp/presentation-revision-1000/triage-${worker}.json`;
  const file = `${directory}/screening/triage-${worker}.json`;
  if (existing(temporary)) {
    mkdirSync(resolve(root, `${directory}/screening`), { recursive: true });
    save(file, read(temporary));
  }
  if (!existing(file)) continue;
  for (const item of read(file).items) {
    assert(!decisions.has(item.slug), 'Agents cannot screen the same creature');
    assert(['keep', 'revise', 'needs-source-review'].includes(item.decision));
    decisions.set(item.slug, { ...item, worker: `revision-${worker}` });
  }
}
const prior = new Map(ledger.items.map(i => [i.slug, i]));
ledger.screening = inventory.items.map(i => decisions.get(i.slug)
  || { slug: i.slug, worker: i.worker, decision: 'pending', rationale: 'Awaiting agent screening' });
ledger.items = inventory.items.filter(i => decisions.get(i.slug)?.decision === 'revise').map(i => {
  if (prior.has(i.slug)) return prior.get(i.slug);
  return { ...i, status: 'pending', rationale: decisions.get(i.slug).rationale };
});
for (const i of prior.values()) assert(ledger.items.some(n => n.slug === i.slug), 'Cannot silently discard a selected revision');
ledger.target = ledger.items.length;
ledger.complete = ledger.items.filter(i => i.status === 'complete').length;
ledger.screening_complete = ledger.screening.every(i => ['keep', 'revise'].includes(i.decision));
ledger.status = ledger.screening_complete && ledger.complete === ledger.target ? 'complete' : 'in-progress';
save(ledgerPath, ledger);
console.log(JSON.stringify({ screened: decisions.size, finalized: ledger.screening_complete,
  target: ledger.target, complete: ledger.complete }));
