/**
 * Fill status of every creature in the work plan (shared by fill-status.mjs and the site build).
 *
 *   lengkap-bergambar    complete, valid, and has at least one approved image
 *   lengkap-informasi    complete and valid, without an approved image yet
 *   lengkap-tidak-valid  has a research entry that meets its tier target, but it is not valid: its batch
 *                        has not been accepted, or the verifier did not pass it
 *   tidak-lengkap        has a research entry below its tier target (`valid` says whether it passed)
 *   belum-ada-entri      no research entry yet, including manual additions (manual-additions.json)
 *   bukan-makhluk        skipped as not a creature
 *
 * Complete: meets the tier target (tier.mjs). Valid: passed the automatic verifier in an accepted batch;
 * it does not mean a person has reviewed it.
 *
 * Only complete and valid entries may have images. Any other entry with an image (an editorial
 * illustration in data/creatures.json or a Commons image in its research) gets `gambar_ditahan`; the
 * image is not counted, and only lengkap-bergambar entries reach the public site.
 * Permanent exclusions in data/artwork-exclusions.json override both image sources without discarding research.
 */
import { readFile, readdir } from 'node:fs/promises';
import { readProgress, DONE } from './progress.mjs';
import { tierShortfall } from './tier.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = async (p, fallback) => JSON.parse(await readFile(new URL(p, ROOT), 'utf8').catch(e => { if (fallback !== undefined) return JSON.stringify(fallback); throw e; }));

export const ORDER = ['lengkap-bergambar', 'lengkap-informasi', 'lengkap-tidak-valid', 'tidak-lengkap', 'belum-ada-entri', 'bukan-makhluk'];

/** Load each accepted entry from the exact inbox fragment named by its review. */
async function entriesOf(batch, inbox, review) {
  const reviewedFiles = new Set((review?.entries || []).map(e => e.file).filter(Boolean));
  const files = inbox.filter(n => n === `${batch}.md` || n.startsWith(`${batch}-fix-`) || reviewedFiles.has(n))
    .sort((a, b) => (a === `${batch}.md` ? -1 : b === `${batch}.md` ? 1 : a.localeCompare(b, undefined, { numeric: true })));
  const out = new Map();
  const byFile = new Map();
  for (const name of files) {
    const md = await readFile(new URL(`data/gemini/inbox/${name}`, ROOT), 'utf8');
    const entries = new Map();
    for (const m of md.matchAll(/```json\s*\n([\s\S]*?)\n```/g)) {
      try { const j = JSON.parse(m[1]); if (j.slug) { out.set(j.slug, j); entries.set(j.slug, j); } } catch { /* reported by verify */ }
    }
    byFile.set(name, entries);
  }
  for (const verdict of review?.entries || []) {
    if (!verdict.file) continue;
    const entry = byFile.get(verdict.file)?.get(verdict.slug);
    // An absent reviewed record cannot be replaced by an unreviewed newer fragment.
    if (entry) out.set(verdict.slug, entry);
    else out.delete(verdict.slug);
  }
  return out;
}

/**
 * @param {object[]} creatures  data/creatures.json (an AI editorial illustration there counts as an image)
 * @returns {Promise<{ status: Record<string, {status: string, batch: string, valid?: boolean, kurang?: string[],
 *                                         gambar_ditahan?: true, manual?: true}>,
 *                     entries: Map<string, object>, counts: Record<string, number>, creaturesTotal: number }>}
 *   entries holds the research entry of every slug that passed the verifier in an accepted batch.
 */
export async function computeFillStatus(creatures) {
  const progress = await readProgress();
  const inbox = await readdir(new URL('data/gemini/inbox/', ROOT));
  const illustrated = new Set(creatures.filter(c => (c.images || []).some(i => i.ai_generated)).map(c => c.slug));
  const excludedArtwork = new Set(Object.keys((await read('data/artwork-exclusions.json', { items: {} })).items));
  const manual = new Set((await read('data/gemini/manual-additions.json', { items: [] })).items.map(i => i.slug));

  const status = {};
  const passed = new Map();
  const batches = (await readdir(new URL('data/gemini/batches/', ROOT))).filter(n => /^batch-\d+\.json$/.test(n)).map(n => n.slice(0, -5)).sort();
  for (const batch of batches) {
    const manifest = await read(`data/gemini/batches/${batch}.json`);
    const accepted = DONE.has(progress[batch]?.status || 'belum');
    const review = await read(`data/gemini/reviews/${batch}.review.json`, null);
    const verdicts = new Map((review?.entries || []).map(e => [e.slug, e]));
    const entries = await entriesOf(batch, inbox, review);
    for (const { slug } of manifest.entries) {
      const rev = verdicts.get(slug);
      const entry = entries.get(slug);
      const valid = accepted && rev?.verdict === 'lulus-otomatis' && !!entry;
      const image = !excludedArtwork.has(slug) && ((entry?.images || []).length > 0 || illustrated.has(slug));
      const record = { batch };
      if (accepted && rev?.verdict === 'skip') record.status = 'bukan-makhluk';
      else if (!entry) record.status = 'belum-ada-entri';
      else {
        const short = tierShortfall(entry);
        record.status = short.length ? 'tidak-lengkap' : !valid ? 'lengkap-tidak-valid' : image ? 'lengkap-bergambar' : 'lengkap-informasi';
        record.valid = valid;
        if (short.length) record.kurang = short;
        if (valid) passed.set(slug, entry);
      }
      if (image && record.status !== 'lengkap-bergambar') record.gambar_ditahan = true;
      if (manual.has(slug)) record.manual = true;
      status[slug] = record;
    }
  }

  const counts = Object.fromEntries(ORDER.map(k => [k, 0]));
  for (const { status: s } of Object.values(status)) counts[s]++;
  return { status, entries: passed, counts, creaturesTotal: Object.keys(status).length - counts['bukan-makhluk'] };
}
