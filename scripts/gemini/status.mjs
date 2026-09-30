#!/usr/bin/env node
/**
 * Overview of the Gemini work plan: which batches have submissions, what the last
 * verifier run said, and what the agents recorded in data/gemini/progress(.json|/).
 * Usage: node scripts/gemini/status.mjs [--verify]   (--verify re-runs the verifier on submitted batches)
 */
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { readProgress, remaining } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = async (p, fallback) => JSON.parse(await readFile(new URL(p, ROOT), 'utf8').catch(() => JSON.stringify(fallback)));
const worklist = await read('data/gemini/worklist.json', { counts: {} });
const progress = await readProgress();
const inbox = await readdir(new URL('data/gemini/inbox/', ROOT)).catch(() => []);
const batches = (await readdir(new URL('data/gemini/batches/', ROOT))).filter(n => /^batch-\d+\.json$/.test(n)).map(n => n.slice(0, -5)).sort();

const submitted = batches.filter(b => inbox.some(n => n.startsWith(b)));
if (process.argv.includes('--verify')) {
  for (const b of submitted) execFileSync('node', ['scripts/gemini/verify.mjs', b], { cwd: ROOT, stdio: 'ignore' });
}
const tally = { 'lulus-otomatis': 0, 'perlu-perbaikan': 0, skip: 0 };
const failing = [];
for (const b of submitted) {
  const review = await read(`data/gemini/reviews/${b}.review.json`, null);
  if (!review) continue;
  for (const e of review.entries) {
    tally[e.verdict] = (tally[e.verdict] || 0) + 1;
    if (e.verdict === 'perlu-perbaikan') failing.push(`${b}/${e.slug}`);
  }
}
console.log(`Rencana: ${worklist.counts.total ?? '?'} makhluk dalam ${batches.length} batch.`);
console.log(`Batch dengan jawaban: ${submitted.length}; batch tercatat di progres: ${Object.keys(progress).length}; sisa ${(await remaining()).length} batch.`);
const busy = Object.entries(progress).filter(([, p]) => p.status === 'dikerjakan');
if (busy.length) console.log(`Sedang dikerjakan: ${busy.map(([b, p]) => `${b} (${p.oleh || '?'})`).join(', ')}`);
console.log(`Entri: ${tally['lulus-otomatis']} lulus otomatis, ${tally.skip} skip, ${tally['perlu-perbaikan']} perlu perbaikan.`);
if (failing.length) console.log(`Perlu perbaikan (${failing.length}): ${failing.slice(0, 30).join(', ')}${failing.length > 30 ? ', …' : ''}`);
