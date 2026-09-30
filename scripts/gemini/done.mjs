#!/usr/bin/env node
/**
 * Records a finished batch from the verifier's last report and prints the commit message.
 * Entries that still fail, and entries missing from the answer, go to perlu_manusia.
 *
 * Usage: node scripts/gemini/done.mjs batch-048 --agent codex [--catatan "..."]
 */
import { readFile, readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { readProgress, writeProgress, remaining } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const { values: args, positionals } = parseArgs({ allowPositionals: true, options: { agent: { type: 'string' }, catatan: { type: 'string', default: '' } } });
const batch = positionals[0];
const agent = (args.agent || '').trim().toLowerCase();
if (!/^batch-\d{3,4}$/.test(batch || '') || !agent) {
  console.error('Pemakaian: npm run gemini:done -- batch-048 --agent codex [--catatan "..."]');
  process.exit(1);
}
const review = JSON.parse(await readFile(new URL(`data/gemini/reviews/${batch}.review.json`, ROOT), 'utf8').catch(() => 'null'));
if (!review) {
  console.error(`Belum ada laporan pemeriksa untuk ${batch}. Jalankan dulu: npm run gemini:verify -- ${batch}`);
  process.exit(1);
}
const files = (await readdir(new URL('data/gemini/inbox/', ROOT))).filter(n => n.startsWith(`${batch}.`) || n.startsWith(`${batch}-`));
const failing = review.entries.filter(e => e.verdict === 'perlu-perbaikan').map(e => e.slug);
const needsHuman = [...failing, ...(review.missing || [])];
const previous = (await readProgress())[batch] || {};
const record = {
  status: needsHuman.length ? 'sebagian' : 'lulus',
  putaran: files.length,
  entri: review.entries.length,
  lulus: review.entries.filter(e => e.verdict === 'lulus-otomatis').length,
  skip: review.entries.filter(e => e.verdict === 'skip').length,
  perlu_manusia: needsHuman,
  oleh: agent,
  mulai: previous.mulai || null,
  selesai: new Date().toISOString(),
  catatan: args.catatan
};
await writeProgress(batch, record);
const left = (await remaining()).length;
console.log(`${batch}: ${record.status}, ${record.lulus} lulus, ${record.skip} skip, ${needsHuman.length} perlu manusia${needsHuman.length ? ` (${needsHuman.join(', ')})` : ''}.`);
console.log(`Pesan commit: data(gemini): ${batch} researched by ${agent} (sisa ${left} batch)`);
