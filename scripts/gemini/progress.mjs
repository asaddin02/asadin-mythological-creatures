/**
 * Research progress, one file per batch (data/gemini/progress/<batch>.json), so agents on
 * different machines never edit the same file. data/gemini/progress.json holds batches
 * finished before 2026-09-30 and is read but no longer written.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);
const DIR = new URL('data/gemini/progress/', ROOT);
export const DONE = new Set(['lulus', 'sebagian']);

/** @returns {Promise<Record<string, object>>} batch id → progress record */
export async function readProgress() {
  const legacy = JSON.parse(await readFile(new URL('data/gemini/progress.json', ROOT), 'utf8').catch(() => '{}'));
  const out = { ...legacy };
  for (const name of await readdir(DIR).catch(() => [])) {
    if (!/^batch-\d+\.json$/.test(name)) continue;
    out[name.slice(0, -5)] = JSON.parse(await readFile(new URL(name, DIR), 'utf8'));
  }
  return out;
}

export async function writeProgress(batchId, record) {
  await mkdir(DIR, { recursive: true });
  await writeFile(new URL(`${batchId}.json`, DIR), JSON.stringify(record, null, 2) + '\n');
}

export async function listBatches() {
  return (await readdir(new URL('data/gemini/batches/', ROOT))).filter(n => /^batch-\d+\.json$/.test(n)).map(n => n.slice(0, -5)).sort();
}

export async function remaining() {
  const progress = await readProgress();
  return (await listBatches()).filter(b => !DONE.has(progress[b]?.status));
}
