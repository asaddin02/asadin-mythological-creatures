#!/usr/bin/env node
/**
 * Claims the next batch for an agent and prints its id. An agent that already holds a
 * batch in status "dikerjakan" gets that batch back, so an interrupted session resumes it.
 * Two agents working at once should go in opposite directions (--arah maju / mundur);
 * they only meet at the end of the plan.
 *
 * Usage: node scripts/gemini/next.mjs --agent codex [--arah maju|mundur]
 */
import { readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { readProgress, writeProgress, listBatches, remaining } from './progress.mjs';

const { values: args } = parseArgs({ options: { agent: { type: 'string' }, arah: { type: 'string', default: 'maju' } } });
const agent = (args.agent || '').trim().toLowerCase();
if (!agent) {
  console.error('Wajib: --agent <nama>, misalnya --agent codex atau --agent gemini');
  process.exit(1);
}
if (!['maju', 'mundur'].includes(args.arah)) {
  console.error('--arah harus maju atau mundur');
  process.exit(1);
}

const progress = await readProgress();
const inbox = await readdir(new URL('../../data/gemini/inbox/', import.meta.url)).catch(() => []);
const mine = Object.entries(progress).find(([, p]) => p.status === 'dikerjakan' && p.oleh === agent);
let batch = mine?.[0];
if (!batch) {
  const free = (await listBatches()).filter(b => !progress[b] && !inbox.some(n => n.startsWith(`${b}.`) || n.startsWith(`${b}-`)));
  batch = args.arah === 'maju' ? free[0] : free.at(-1);
  if (!batch) {
    const busy = Object.entries(progress).filter(([, p]) => p.status === 'dikerjakan').map(([b, p]) => `${b} (${p.oleh}, sejak ${p.mulai})`);
    console.log(`SEMUA BATCH SUDAH DIAMBIL.${busy.length ? ` Masih dikerjakan agen lain: ${busy.join(', ')}.` : ''}`);
    process.exit(0);
  }
  await writeProgress(batch, { status: 'dikerjakan', oleh: agent, mulai: new Date().toISOString() });
}
console.log(batch);
console.error(`${mine ? 'Lanjutkan' : 'Diambil'}: ${batch} oleh ${agent}. Sisa ${(await remaining()).length} batch belum selesai (termasuk yang ini).`);
