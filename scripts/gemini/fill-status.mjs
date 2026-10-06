#!/usr/bin/env node
/**
 * Fill status of every creature in the work plan, in five categories:
 *
 *   lengkap-bergambar    complete, valid, with an approved image (only these reach the public site)
 *   lengkap-informasi    complete and valid, no image yet
 *   lengkap-tidak-valid  research meets its tier target but is not valid (batch not accepted, or not passed)
 *   tidak-lengkap        research below its tier target, valid or not
 *   belum-ada-entri      no research entry yet
 *
 * Complete: the tier target in tier.mjs (core: 6 claims, 2 sources; rich: 15 claims, 3 sources,
 * 2 publishers besides Wikipedia). Valid: every quote was found on its page and every text cites a
 * claim, in a batch that was accepted; a person has not necessarily reviewed it.
 *
 * Only complete and valid entries may have images. An image on any other entry is held
 * (`gambar_ditahan`) and listed here. An approved image is a Commons image in the research entry or a
 * reviewed editorial illustration in data/creatures.json (flagged `ai_generated`); older unproven
 * Commons images in the legacy data do not count. Permanent exclusions in data/artwork-exclusions.json
 * override either image source. Entries skipped as "not a creature" are counted apart.
 *
 * Writes data/gemini/fill-status.json (summary, held images, and status per slug).
 *   node scripts/gemini/fill-status.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { computeFillStatus, ORDER } from './fill-lib.mjs';

const ROOT = new URL('../../', import.meta.url);
const creatures = JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8'));
const { status, counts, creaturesTotal } = await computeFillStatus(creatures);
const slugsWhere = test => Object.entries(status).filter(([, v]) => test(v)).map(([slug]) => slug);
const manual = slugsWhere(v => v.manual);
const held = slugsWhere(v => v.gambar_ditahan);
const heldBy = Object.fromEntries(ORDER.map(k => [k, held.filter(slug => status[slug].status === k).length]).filter(([, n]) => n));
const incompleteValid = slugsWhere(v => v.status === 'tidak-lengkap' && v.valid).length;
await writeFile(
  new URL('data/gemini/fill-status.json', ROOT),
  JSON.stringify({ computed_at: new Date().toISOString(), creatures_total: creaturesTotal, counts, gambar_ditahan: held, status }, null, 2) + '\n'
);

const pct = n => `${((100 * n) / creaturesTotal).toFixed(1)}%`;
console.log(`Makhluk dalam rencana: ${creaturesTotal} (tidak termasuk ${counts['bukan-makhluk']} entri bukan makhluk).`);
for (const k of ORDER.slice(0, 5)) console.log(`  ${k.padEnd(20)} ${String(counts[k]).padStart(5)}  ${pct(counts[k])}`);
console.log(`  (tidak-lengkap: ${incompleteValid} valid, ${counts['tidak-lengkap'] - incompleteValid} tidak valid)`);
console.log(`Gambar ditahan karena entrinya belum lengkap dan valid: ${held.length}${held.length ? ` (${Object.entries(heldBy).map(([k, n]) => `${k} ${n}`).join(', ')})` : ''}`);
console.log(`Tambahan manual: ${manual.map(slug => `${slug} (${status[slug].status})`).join(', ') || '-'}`);
