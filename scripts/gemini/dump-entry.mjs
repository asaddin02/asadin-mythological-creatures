#!/usr/bin/env node
/**
 * Prints the current accepted research entry of one or more creatures as full JSON (schema mythics-entry/1),
 * exactly as the site uses it: the starting point for an enrichment fix file, which must hold the whole entry.
 *
 *   node scripts/gemini/dump-entry.mjs <slug> [<slug> ...]          JSON per slug to stdout
 *   node scripts/gemini/dump-entry.mjs --ke <folder> <slug> [...]   writes <folder>/<slug>.json
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { computeFillStatus } from './fill-lib.mjs';

const ROOT = new URL('../../', import.meta.url);
const args = process.argv.slice(2);
let out = null;
const i = args.indexOf('--ke');
if (i >= 0) { out = args[i + 1]; args.splice(i, 2); }
if (!args.length) { console.error('Pemakaian: node scripts/gemini/dump-entry.mjs [--ke <folder>] <slug> [<slug> ...]'); process.exit(1); }

const creatures = JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8'));
const { entries, status } = await computeFillStatus(creatures);
if (out) await mkdir(out, { recursive: true });
let missing = 0;
for (const slug of args) {
  const entry = entries.get(slug);
  if (!entry) { console.error(`${slug}: tidak ada entri riset yang diterima`); missing++; continue; }
  const text = `${JSON.stringify(entry, null, 2)}\n`;
  if (out) {
    await writeFile(`${out}/${slug}.json`, text);
    console.error(`${slug}: ${status[slug].batch}, tier ${entry.tier}, ${entry.claims.length} klaim, ${entry.sources.length} sumber → ${out}/${slug}.json`);
  } else console.log(text);
}
process.exit(missing ? 1 : 0);
