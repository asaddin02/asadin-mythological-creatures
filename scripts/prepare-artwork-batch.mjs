#!/usr/bin/env node
/**
 * Worklist for the next editorial illustration batch: every "lengkap-informasi" creature (complete, valid
 * research without an approved image), with its accepted research embedded unchanged.
 *
 *   node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex [--limit 100] [--slugs a,b,c] [--policy nama-besar]
 *     --slugs        only these creatures (they must still be lengkap-informasi)
 *     --policy nama-besar  the dramatic style for big names (data/artwork-nama-besar.json → policy)
 *
 * Writes data/artwork-batch-<N>.json, where N = active illustrations + selected items (like 797 and 1000).
 * Creatures that an earlier batch left out (no documented bodily form) stay in the list with that reason
 * as `catatan_sebelumnya`; the generator decides again and may decline with status "tidak-digambar".
 * The receipts, the second visual review and registration follow scripts/integrate-artwork-batch.mjs.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const ROOT = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));
const { values: args } = parseArgs({ options: { tool: { type: 'string' }, worker: { type: 'string' }, limit: { type: 'string' }, slugs: { type: 'string' }, policy: { type: 'string' } } });
const only = args.slugs ? new Set(args.slugs.split(',').map(s => s.trim()).filter(Boolean)) : null;
if (!args.tool?.trim() || !/^[a-z0-9-]+$/.test(args.worker || '')) {
  console.error('Pemakaian: node scripts/prepare-artwork-batch.mjs --tool "<nama alat>" --worker <nama> [--limit N]');
  process.exit(1);
}

const catalogue = await read('data/creatures.json');
const inCatalogue = new Set(catalogue.map(c => c.slug));
const manifest = await read('assets/art/verified-manifest.json');
const exclusions = (await read('data/artwork-exclusions.json')).items;
const { status, entries, counts } = await computeFillStatus(catalogue);

// Reasons earlier batches gave for leaving a creature out, newest batch last so it wins.
const earlier = {};
const ledgers = (await readdir(new URL('data/', ROOT))).filter(n => /^artwork-batch-\d+\.json$/.test(n)).sort((a, b) => parseInt(a.slice(14)) - parseInt(b.slice(14)));
for (const name of ledgers) for (const o of (await read(`data/${name}`)).selection_audit?.omitted || []) earlier[o.slug] = o.reason;

const statement = claim => (typeof claim.statement === 'string' ? claim.statement : claim.statement?.en || '');
const appearance = /\b(?:appears? as|appearances?|form of|pictured|portrayed|depicted|described as|body|heads?|hair|eyes?|skin|beards?|wings?|horns?|claws?|feet|foot|tail|serpent|dragon|giant|dwarf|elk|wolf|horse|fish|frog|owl|insect|coat|cloak|shawl|robe|cap|hats?|tunics?|dress|trousers|goat|spider|cobra|eagle|bird|light|fireball|dog|cat|beast)\b/i;

const eligible = Object.entries(status)
  .filter(([slug, v]) => v.status === 'lengkap-informasi' && !manifest.artworks[slug] && !exclusions[slug] && (!only || only.has(slug)))
  .map(([slug]) => slug);
const missing = eligible.filter(slug => !entries.has(slug));
let selected = eligible.filter(slug => entries.has(slug)).map(slug => {
  const research = entries.get(slug);
  return { slug, research, visual: research.claims.filter(c => appearance.test(statement(c))).map(c => c.id) };
});
// Documented appearance first, then the rest; earlier omissions last.
selected.sort((a, b) => Number(Boolean(earlier[a.slug])) - Number(Boolean(earlier[b.slug])) || b.visual.length - a.visual.length || a.slug.localeCompare(b.slug, 'en'));
if (args.limit) selected = selected.slice(0, Number(args.limit));
if (!selected.length) throw new Error('Tidak ada entri lengkap-informasi yang bisa digambar.');

const baseline = Object.keys(manifest.artworks).length;
const number = baseline + selected.length;
const output = new URL(`data/artwork-batch-${number}.json`, ROOT);
if (await readFile(output).then(() => true, () => false)) throw new Error(`data/artwork-batch-${number}.json sudah ada; jangan menimpa progres yang sedang berjalan.`);

const items = selected.map(({ slug, research, visual }, i) => ({
  index: i + 1,
  slug,
  canonical_name: research.identity.canonical_name,
  worker: args.worker,
  status: 'pending',
  requires_catalogue_record: !inCatalogue.has(slug),
  review_path: `data/gemini/reviews/${status[slug].batch}.review.json`,
  research,
  selection_visual_claim_ids: visual,
  ...(earlier[slug] ? { catatan_sebelumnya: earlier[slug] } : {}),
}));
const batch = {
  target: items.length,
  tool: args.tool.trim(),
  scope: `${items.length} illustrations for every complete and valid research entry that has no approved image yet.`,
  selected_at: new Date().toISOString(),
  baseline_counts: counts,
  status: 'in-progress',
  complete: 0,
  presence_policy: true,
  require_root_visual_review: true,
  items,
  replacements: [],
  baseline_artwork_count: baseline,
  selection_criteria: [
    'computeFillStatus must be lengkap-informasi: complete, valid research without an approved image.',
    'No active editorial artwork and no permanent artwork exclusion.',
    'The accepted research entry is embedded unchanged; the image may only depict what its claims document.',
    'Creatures an earlier batch left out keep that reason as catatan_sebelumnya; the generator may decline them with status tidak-digambar.',
  ],
  user_policy: args.policy === 'nama-besar' ? (await read('data/artwork-nama-besar.json')).policy : {
    instruction_date: '2026-10-06',
    only_complete_information: true,
    fidelity: 'Do not invent. Every bodily feature, attribute and the scene must follow the documented claims of this research entry.',
    presence: 'The being must not read as an ordinary human or an ordinary animal. Use its documented distinguishing traits, plus pose, expression, gaze, scale, setting from its stories and natural lighting, so the feel of the tradition comes through. Add no undocumented anatomy.',
    aura: 'Character presence through pose, expression, framing, scale, atmosphere and natural lighting. No generic glowing envelope, neon outline, energy ribbons or luminous coloured mist. Magical effects only when documented, and restrained. Frightening beings get an appropriate horror atmosphere; benevolent beings stay appropriate to their tradition.',
    style: 'Same house style as the existing 1,000 illustrations: square premium painterly naturalistic illustration, no text, labels, logo, border or watermark.',
  },
  selection_audit: {
    eligible: eligible.length,
    selected: items.length,
    missing_current_research: missing,
    needs_catalogue_record: items.filter(i => i.requires_catalogue_record).length,
    without_visual_claims: items.filter(i => !i.selection_visual_claim_ids.length).map(i => i.slug),
    earlier_omissions: items.filter(i => i.catatan_sebelumnya).map(i => i.slug),
    omitted: [],
  },
};
await writeFile(output, `${JSON.stringify(batch, null, 2)}\n`);
console.log(JSON.stringify({ output: `data/artwork-batch-${number}.json`, baseline, target: items.length, tool: batch.tool, worker: args.worker, missing: missing.length, needs_catalogue_record: batch.selection_audit.needs_catalogue_record, without_visual_claims: batch.selection_audit.without_visual_claims.length, earlier_omissions: batch.selection_audit.earlier_omissions.length }, null, 2));
