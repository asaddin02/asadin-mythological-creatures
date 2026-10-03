/**
 * Fill status of every creature in the work plan (shared by fill-status.mjs and the site build).
 *
 *   lengkap-bergambar  valid, meets its tier target, and has at least one approved image
 *   lengkap-informasi  valid and meets its tier target, but has no approved image yet
 *   valid              passed the automatic verifier in an accepted batch, below its tier target
 *   tidak-valid        everything else: not researched yet, in progress, rejected, failing,
 *                      or added later because the worklist missed it (manual-additions.json)
 *   bukan-makhluk      skipped as not a creature
 *
 * See fill-status.mjs for what "valid", the tier target and an approved image mean.
 */
import { readFile, readdir } from 'node:fs/promises';
import { readProgress, DONE } from './progress.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = async (p, fallback) => JSON.parse(await readFile(new URL(p, ROOT), 'utf8').catch(e => { if (fallback !== undefined) return JSON.stringify(fallback); throw e; }));

export const ORDER = ['lengkap-bergambar', 'lengkap-informasi', 'valid', 'tidak-valid', 'bukan-makhluk'];

/** Latest version of every entry in a batch: the main inbox file, then fix files in order. */
async function entriesOf(batch, inbox) {
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

/**
 * @param {object[]} creatures  data/creatures.json (an AI editorial illustration there counts as an image)
 * @returns {Promise<{ status: Record<string, {status: string, batch: string, manual?: true}>,
 *                     entries: Map<string, object>, counts: Record<string, number>, creaturesTotal: number }>}
 *   entries holds the research entry of every slug that passed the verifier in an accepted batch.
 */
export async function computeFillStatus(creatures) {
  const progress = await readProgress();
  const inbox = await readdir(new URL('data/gemini/inbox/', ROOT));
  const illustrated = new Set(creatures.filter(c => (c.images || []).some(i => i.ai_generated)).map(c => c.slug));
  const manual = new Set((await read('data/gemini/manual-additions.json', { items: [] })).items.map(i => i.slug));

  const status = {};
  const passed = new Map();
  const batches = (await readdir(new URL('data/gemini/batches/', ROOT))).filter(n => /^batch-\d+\.json$/.test(n)).map(n => n.slice(0, -5)).sort();
  for (const batch of batches) {
    const manifest = await read(`data/gemini/batches/${batch}.json`);
    const state = progress[batch]?.status || 'belum';
    const accepted = DONE.has(state);
    const review = accepted ? await read(`data/gemini/reviews/${batch}.review.json`) : null;
    const verdicts = new Map((review?.entries || []).map(e => [e.slug, e]));
    const entries = accepted ? await entriesOf(batch, inbox) : new Map();
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
        if (entries.has(slug)) passed.set(slug, entries.get(slug));
      }
      status[slug] = { status: s, batch, ...(manual.has(slug) ? { manual: true } : {}) };
    }
  }

  const counts = Object.fromEntries(ORDER.map(k => [k, 0]));
  for (const { status: s } of Object.values(status)) counts[s]++;
  return { status, entries: passed, counts, creaturesTotal: Object.keys(status).length - counts['bukan-makhluk'] };
}
