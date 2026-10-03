#!/usr/bin/env node
/**
 * Adds the beings listed in data/gemini/manual-additions.json that the worklist missed
 * (their Wikidata class is outside the roots build-worklist.mjs queries) as `new` items
 * in one extra batch, and records them in data/gemini/worklist.json. Beings already in
 * the worklist are skipped, so the script can be re-run after adding more names.
 *
 *   node scripts/gemini/add-manual.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { writeBatch } from './make-batch.mjs';
import { listBatches } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, ROOT), 'utf8'));
const worklist = await read('data/gemini/worklist.json');
const { items } = await read('data/gemini/manual-additions.json');
const known = new Set(worklist.items.flatMap(i => [i.slug, i.qid].filter(Boolean)));
const fresh = items.filter(i => !known.has(i.slug) && !known.has(i.qid));
if (!fresh.length) {
  console.log('Tidak ada makhluk baru; semua sudah ada di worklist.');
  process.exit(0);
}
const last = (await listBatches()).at(-1);
const id = `batch-${String(Number(last.slice(6)) + 1).padStart(3, '0')}`;
const added = fresh.map(i => ({ ...i, task: 'new', batch_id: id, manual: true }));
const creatures = await read('data/creatures.json');
await writeBatch({ id, title: 'Tambahan manual (makhluk yang terlewat worklist)', items: added, creaturesBySlug: new Map(creatures.map(c => [c.slug, c])) });
worklist.items.push(...added);
worklist.counts.total += added.length;
worklist.counts.new += added.length;
for (const i of added) worklist.counts[i.tier] = (worklist.counts[i.tier] || 0) + 1;
worklist.counts.batches = Number(id.slice(6));
await writeFile(new URL('data/gemini/worklist.json', ROOT), JSON.stringify(worklist, null, 2) + '\n');
console.log(`${id}: ${added.map(i => i.slug).join(', ')}`);
