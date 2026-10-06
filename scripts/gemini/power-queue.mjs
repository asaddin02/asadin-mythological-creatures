#!/usr/bin/env node
/**
 * Work queue for Power / Threat / Fear assessments: every creature on the public site (lengkap-bergambar)
 * that has no assessment yet, neither in data/power/ nor among the hand-written entries in js/scaling.js.
 *
 * Big names first: batches are ordered by the most Wikipedia language editions (sitelinks in
 * data/gemini/worklist.json) among their creatures, and creatures within a batch the same way.
 *
 *   node scripts/gemini/power-queue.mjs [--top 10] [--semua]
 *     --semua  also list creatures that are complete but not illustrated yet (lengkap-informasi)
 *
 * Writes data/gemini/power-queue.json (not committed).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { computeFillStatus } from './fill-lib.mjs';
import { ASSESSMENTS } from '../../js/scaling.js';

const ROOT = new URL('../../', import.meta.url);
const { values: args } = parseArgs({ options: { top: { type: 'string', default: '10' }, semua: { type: 'boolean', default: false } } });
const read = async path => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));

const { status } = await computeFillStatus(await read('data/creatures.json'));
const worklist = await read('data/gemini/worklist.json');
const sitelinks = new Map(worklist.items.map(i => [i.slug, i.sitelinks || 0]));
const recorded = new Set();
for (const name of (await readdir(new URL('data/power/', ROOT)).catch(() => [])).filter(n => /^batch-\d+\.json$/.test(n))) {
  for (const slug of Object.keys(await read(`data/power/${name}`))) recorded.add(slug);
}

const wanted = new Set(['lengkap-bergambar', ...(args.semua ? ['lengkap-informasi'] : [])]);
const byBatch = new Map();
for (const [slug, v] of Object.entries(status)) {
  if (!wanted.has(v.status) || recorded.has(slug) || ASSESSMENTS[slug]) continue;
  if (!byBatch.has(v.batch)) byBatch.set(v.batch, []);
  byBatch.get(v.batch).push({ slug, status: v.status, sitelinks: sitelinks.get(slug) || 0 });
}
const batches = [...byBatch].map(([batch, items]) => {
  items.sort((a, b) => b.sitelinks - a.sitelinks || a.slug.localeCompare(b.slug));
  return { batch, jumlah: items.length, sitelinks_tertinggi: items[0].sitelinks, entri: items };
}).sort((a, b) => b.sitelinks_tertinggi - a.sitelinks_tertinggi || a.batch.localeCompare(b.batch));

const total = batches.reduce((n, b) => n + b.jumlah, 0);
await writeFile(new URL('data/gemini/power-queue.json', ROOT), JSON.stringify({ computed_at: new Date().toISOString(), entri: total, batch: batches }, null, 2) + '\n');
console.log(`Antrean penilaian kekuatan: ${total} makhluk di ${batches.length} batch. Ditulis ke data/gemini/power-queue.json.`);
for (const b of batches.slice(0, Number(args.top))) console.log(`  ${b.batch}  ${String(b.jumlah).padStart(3)} makhluk; terbesar: ${b.entri.slice(0, 3).map(e => `${e.slug} (${e.sitelinks})`).join(', ')}`);
