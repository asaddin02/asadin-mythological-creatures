#!/usr/bin/env node
/**
 * Fill status of every creature in the work plan, in four levels:
 *
 *   lengkap-bergambar  valid, meets its tier target, and has at least one approved image
 *   lengkap-informasi  valid and meets its tier target, but has no approved image yet
 *   valid              passed the automatic verifier in an accepted batch, below its tier target
 *   tidak-valid        everything else: not researched yet, in progress, rejected, failing,
 *                      or added later because the worklist missed it (manual-additions.json)
 *
 * "Valid" means every quote was found on its page and every text cites a claim; it says
 * nothing about completeness. The tier target is the verifier's TIER_MIN (core: 6 claims,
 * 2 sources; rich: 15 claims, 3 sources, 2 publishers besides Wikipedia). An approved image
 * is a Commons image in the research entry or a reviewed editorial illustration in
 * data/creatures.json (artwork audit, flagged `ai_generated`); older unproven Commons images
 * in the legacy data do not count. Permanent exclusions in data/artwork-exclusions.json
 * override either image source without discarding research. Entries skipped as "not a creature" are listed apart.
 *
 * Writes data/gemini/fill-status.json (summary + status per slug).
 *   node scripts/gemini/fill-status.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { computeFillStatus, ORDER } from './fill-lib.mjs';

const ROOT = new URL('../../', import.meta.url);
const creatures = JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8'));
const { status, counts, creaturesTotal } = await computeFillStatus(creatures);
const manual = Object.entries(status).filter(([, v]) => v.manual).map(([slug]) => slug);
await writeFile(new URL('data/gemini/fill-status.json', ROOT), JSON.stringify({ computed_at: new Date().toISOString(), creatures_total: creaturesTotal, counts, status }, null, 2) + '\n');

const pct = n => `${((100 * n) / creaturesTotal).toFixed(1)}%`;
console.log(`Makhluk dalam rencana: ${creaturesTotal} (tidak termasuk ${counts['bukan-makhluk']} entri bukan makhluk).`);
for (const k of ORDER.slice(0, 4)) console.log(`  ${k.padEnd(18)} ${String(counts[k]).padStart(5)}  ${pct(counts[k])}`);
console.log(`  tambahan manual (ikut tidak-valid): ${manual.join(', ') || '-'}`);
