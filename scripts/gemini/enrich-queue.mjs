#!/usr/bin/env node
/**
 * Work queue for enriching "tidak-lengkap" entries (valid research below its tier target) in accepted batches.
 *
 * Left out:
 *   - batches that still hold "belum-ada-entri" or "lengkap-tidak-valid" entries, or are not accepted:
 *     those are new research, worked on elsewhere;
 *   - entries already recorded as "mentok" in data/gemini/enrich/<batch>.json (no more sources found).
 *
 * Order (since 6 October 2026, owner's request): big names first. Batches are ordered by the most Wikipedia
 * language editions (sitelinks in data/gemini/worklist.json) among their entries, then by held images (an entry
 * that reaches its target gets its image back). Within a batch: most sitelinks first.
 *
 * Writes data/gemini/enrich-queue.json and prints a summary.
 *   node scripts/gemini/enrich-queue.mjs [--top 10]
 *
 * Log per batch (written by the enriching agent, one file per batch so agents never edit the same file):
 *   data/gemini/enrich/<batch>.json  { "<slug>": { "hasil": "lengkap"|"mentok", "catatan": "...", "oleh": "...", "tanggal": "YYYY-MM-DD" } }
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { computeFillStatus } from './fill-lib.mjs';
import { readProgress, DONE } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const { values: args } = parseArgs({ options: { top: { type: 'string', default: '10' } } });
const read = async (path, fallback) => JSON.parse(await readFile(new URL(path, ROOT), 'utf8').catch(e => { if (fallback !== undefined) return JSON.stringify(fallback); throw e; }));

const creatures = await read('data/creatures.json');
const sitelinks = new Map((await read('data/gemini/worklist.json')).items.map(i => [i.slug, i.sitelinks || 0]));
const { status } = await computeFillStatus(creatures);
const progress = await readProgress();
const logs = {};
for (const name of await readdir(new URL('data/gemini/enrich/', ROOT)).catch(() => [])) {
  if (/^batch-\d+\.json$/.test(name)) logs[name.slice(0, -5)] = await read(`data/gemini/enrich/${name}`);
}

const byBatch = new Map();
for (const [slug, v] of Object.entries(status)) {
  if (!byBatch.has(v.batch)) byBatch.set(v.batch, []);
  byBatch.get(v.batch).push({ slug, ...v });
}
const batches = [];
const excluded = [];
for (const [batch, items] of byBatch) {
  const todo = items.filter(i => i.status === 'tidak-lengkap');
  if (!todo.length) continue;
  const newResearch = items.filter(i => ['belum-ada-entri', 'lengkap-tidak-valid'].includes(i.status)).length;
  if (!DONE.has(progress[batch]?.status) || newResearch) {
    excluded.push({ batch, tidak_lengkap: todo.length, alasan: newResearch ? `${newResearch} entri riset baru masih terbuka` : `batch belum diterima (${progress[batch]?.status || 'belum'})` });
    continue;
  }
  const review = await read(`data/gemini/reviews/${batch}.review.json`);
  const reviewed = new Map(review.entries.map(e => [e.slug, e]));
  const log = logs[batch] || {};
  const planned = new Map((await read(`data/gemini/batches/${batch}.json`)).entries.map(e => [e.slug, e]));
  const entries = todo
    .filter(i => log[i.slug]?.hasil !== 'mentok')
    .map(i => ({ slug: i.slug, nama: planned.get(i.slug)?.canonical_name, tier: planned.get(i.slug)?.tier, sitelinks: sitelinks.get(i.slug) || 0, berkas: reviewed.get(i.slug)?.file, kurang: i.kurang, ...(i.gambar_ditahan ? { gambar_ditahan: true } : {}) }))
    .sort((a, b) => b.sitelinks - a.sitelinks || Number(!!b.gambar_ditahan) - Number(!!a.gambar_ditahan) || a.slug.localeCompare(b.slug));
  if (!entries.length) continue;
  batches.push({ batch, jumlah: entries.length, sitelinks_tertinggi: entries[0].sitelinks, gambar_ditahan: entries.filter(e => e.gambar_ditahan).length, mentok: todo.length - entries.length, entri: entries });
}
batches.sort((a, b) => b.sitelinks_tertinggi - a.sitelinks_tertinggi || b.gambar_ditahan - a.gambar_ditahan || b.jumlah - a.jumlah || a.batch.localeCompare(b.batch));

const total = batches.reduce((n, b) => n + b.jumlah, 0);
const held = batches.reduce((n, b) => n + b.gambar_ditahan, 0);
await writeFile(new URL('data/gemini/enrich-queue.json', ROOT), JSON.stringify({ computed_at: new Date().toISOString(), entri: total, gambar_ditahan: held, batch: batches, dikecualikan: excluded }, null, 2) + '\n');
console.log(`Antrean pengayaan: ${total} entri di ${batches.length} batch (${held} dengan gambar ditahan). Ditulis ke data/gemini/enrich-queue.json.`);
for (const b of batches.slice(0, Number(args.top))) console.log(`  ${b.batch}  ${String(b.jumlah).padStart(3)} entri${b.gambar_ditahan ? `, ${b.gambar_ditahan} gambar ditahan` : ''}; terbesar: ${b.entri.slice(0, 3).map(e => `${e.slug} (${e.sitelinks})`).join(', ')}`);
if (excluded.length) console.log(`Dikecualikan (riset baru, dikerjakan di tempat lain): ${excluded.map(e => e.batch).join(', ')}`);
