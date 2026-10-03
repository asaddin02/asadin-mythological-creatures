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
 * in the legacy data do not count. Entries skipped as "not a creature" are listed apart.
 *
 * Writes data/gemini/fill-status.json (summary + status per slug).
 *   node scripts/gemini/fill-status.mjs
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { readProgress, DONE } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = async (p, fallback) => JSON.parse(await readFile(new URL(p, ROOT), 'utf8').catch(e => { if (fallback !== undefined) return JSON.stringify(fallback); throw e; }));
const progress = await readProgress();
const inbox = await readdir(new URL('data/gemini/inbox/', ROOT));
const creatures = await read('data/creatures.json');
const illustrated = new Set(creatures.filter(c => (c.images || []).some(i => i.ai_generated)).map(c => c.slug));
const manual = new Set((await read('data/gemini/manual-additions.json', { items: [] })).items.map(i => i.slug));

/** Latest version of every entry in a batch: the main inbox file, then fix files in order. */
async function entriesOf(batch) {
  const files = inbox.filter(n => n === `${batch}.md` || n.startsWith(`${batch}-fix-`))
    .sort((a, b) => (a === `${batch}.md` ? -1 : b === `${batch}.md` ? 1 : a.localeCompare(b, undefined, { numeric: true })));
  const out = new Map();
  for (const name of files) {
    const md = await readFile(new URL(`data/gemini/inbox/${name}`, ROOT), 'utf8');
    for (const m of md.matchAll(/```json\s*\n([\s\S]*?)\n```/g)) {
      try { const j = JSON.parse(m[1]); if (j.slug) out.set(j.slug, j); } catch { /* reported by verify */ }
    }
  }
  return out;
}

const status = {};
const batches = (await readdir(new URL('data/gemini/batches/', ROOT))).filter(n => /^batch-\d+\.json$/.test(n)).map(n => n.slice(0, -5)).sort();
for (const batch of batches) {
  const manifest = await read(`data/gemini/batches/${batch}.json`);
  const state = progress[batch]?.status || 'belum';
  const accepted = DONE.has(state);
  const review = accepted ? await read(`data/gemini/reviews/${batch}.review.json`) : null;
  const verdicts = new Map((review?.entries || []).map(e => [e.slug, e]));
  const entries = accepted ? await entriesOf(batch) : new Map();
  for (const { slug } of manifest.entries) {
    const rev = verdicts.get(slug);
    let s;
    if (!accepted) s = 'tidak-valid';
    else if (rev?.verdict === 'skip') s = 'bukan-makhluk';
    else if (rev?.verdict !== 'lulus-otomatis') s = 'tidak-valid';
    else {
      const complete = !rev.issues.some(i => i.where === 'tier');
      const image = (entries.get(slug)?.images || []).length > 0 || illustrated.has(slug);
      s = !complete ? 'valid' : image ? 'lengkap-bergambar' : 'lengkap-informasi';
    }
    status[slug] = { status: s, batch, ...(manual.has(slug) ? { manual: true } : {}) };
  }
}

const order = ['lengkap-bergambar', 'lengkap-informasi', 'valid', 'tidak-valid', 'bukan-makhluk'];
const counts = Object.fromEntries(order.map(k => [k, 0]));
for (const { status: s } of Object.values(status)) counts[s]++;
const creaturesTotal = Object.keys(status).length - counts['bukan-makhluk'];
await writeFile(new URL('data/gemini/fill-status.json', ROOT), JSON.stringify({ computed_at: new Date().toISOString(), creatures_total: creaturesTotal, counts, status }, null, 2) + '\n');

const pct = n => `${((100 * n) / creaturesTotal).toFixed(1)}%`;
console.log(`Makhluk dalam rencana: ${creaturesTotal} (tidak termasuk ${counts['bukan-makhluk']} entri bukan makhluk).`);
for (const k of order.slice(0, 4)) console.log(`  ${k.padEnd(18)} ${String(counts[k]).padStart(5)}  ${pct(counts[k])}`);
console.log(`  tambahan manual (ikut tidak-valid): ${[...manual].join(', ') || '-'}`);
