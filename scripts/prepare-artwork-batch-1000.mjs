#!/usr/bin/env node
/** Reproducible selection for 203 additional illustrations after the 797-image baseline. */
import { readFile, writeFile } from 'node:fs/promises';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const ROOT = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));
const output = new URL('data/artwork-batch-1000.json', ROOT);
try {
  await readFile(output);
  throw new Error('Batch 1000 already exists; preserve generation progress instead of replacing it.');
} catch (error) { if (error.code !== 'ENOENT') throw error; }

const catalogue = await read('data/creatures.json');
const creatures = [...catalogue];
const manifest = await read('assets/art/verified-manifest.json');
const exclusions = await read('data/artwork-exclusions.json');
const { status, entries, counts } = await computeFillStatus(catalogue);
const knownCultures = new Set((await read('data/cultures.json')).map(c => c.id));
const knownCategories = new Set((await read('data/categories.json')).map(c => c.id));
for (const [slug, research] of entries) {
  if (catalogue.some(c => c.slug === slug)) continue;
  if (!knownCultures.has(research.culture?.value) || !knownCategories.has(research.classification?.value)) continue;
  creatures.push({ slug, canonical_name: research.identity.canonical_name, images: [], reviewed_research_only: true });
}
// Some accepted reviews point to research parts (-p/-q/-r/-u) that fill-lib's
// main/fix-file reader does not include. Recover only the exact file referenced
// by the current passing review, never an arbitrary older inbox candidate.
const recovered = [];
for (const creature of creatures) {
  if (status[creature.slug]?.status !== 'lengkap-informasi' || entries.has(creature.slug)) continue;
  const batch = status[creature.slug].batch;
  const review = await read(`data/gemini/reviews/${batch}.review.json`);
  const record = review.entries.find(item => item.slug === creature.slug);
  if (record?.verdict !== 'lulus-otomatis' || record.issues.some(issue => issue.where === 'tier') || !record.file) continue;
  if (!record.file.startsWith(`${batch}-`) || record.file.includes('/') || record.file.includes('..')) continue;
  const markdown = await readFile(new URL(`data/gemini/inbox/${record.file}`, ROOT), 'utf8');
  for (const match of markdown.matchAll(/```json\s*\n([\s\S]*?)\n```/g)) {
    const entry = JSON.parse(match[1]);
    if (entry.slug !== creature.slug) continue;
    const reviewedIds = new Set(record.claims.map(claim => claim.id));
    if (!entry.claims.every(claim => reviewedIds.has(claim.id))) throw new Error(`Recovered claim mismatch: ${creature.slug}`);
    entries.set(creature.slug, entry);
    recovered.push({ slug: creature.slug, file: `data/gemini/inbox/${record.file}` });
  }
}
const OMIT = {
  annar: 'The father of Earth and the dwarf namesake cannot safely be identified as one physical individual.',
  asag: 'The accepted research describes powers and genealogy, but no physical form.',
  'azure-jay': 'A real bird with a folklore role, rather than a separate mythical being.',
  bies: 'No fixed image; the only specific predator anatomy belongs to a modern video game.',
  'billy-blind': 'No physical description in the accepted research.',
  birog: 'Druidess/familiar identity without a documented physical description.',
  'chernobog-and-belobog': 'Contested paired identities with no traditional physical description.',
  daeva: 'General religious category with no physical description in this research.',
  'danava-hinduism': 'General lineage/class without a physical description in this research.',
  'deva-hinduism': 'General religious category without a specific documented visual variant.',
  fravashi: 'The research describes invisible protective functions, not a bodily form.',
  guhyaka: 'Hidden wealth guardians without documented physical attributes.',
  hanbi: 'Genealogy and authority only; no physical form.',
  'knight-of-the-swan': 'Ordinary human legendary hero.',
  lempo: 'Flying spirit and powers without a documented physical appearance.',
  'maruda-slavic-demon': 'Female harassing demon without documented appearance.',
  namtar: 'Fearsome is the only visual description; no identifying physical attributes.',
  nisroch: 'Name meaning great eagle does not establish an eagle body or iconography.',
  pereplut: 'Identity and function are uncertain; no physical description.',
  poroniec: 'Origin in an infant soul does not establish a bodily appearance; do not copy the video-game variant.',
  'sea-mither': 'Explicitly invisible; no documented visual form.',
  seonaidh: 'Water spirit with no documented appearance.',
  'skuld-princess': 'Princess/elf ancestry is described, but no identifying physical depiction.',
  'superstitions-of-russians': 'Collection of customs, not a creature.',
  sylph: 'Explicitly invisible air beings; no supported physical depiction in this research.',
  tiamat: 'Research explicitly cautions that a dragon form is unestablished.',
  'tooth-fairy': 'Appearance is explicitly inconsistent; no named visual variant in this research.',
  yokai: 'Broad category without a specific visual exemplar documented in this research.',
};
const NEEDS_REVIEW = {
  caoineag: 'The core being is invisible. A green-shawl caointeach is separately documented; verify that variant before depiction.',
  haltija: 'A guardian can manifest, but the accepted claims do not specify an appearance.',
  ifrit: 'The accepted Quran/commentary claims establish strength and identity, but no physical depiction.',
  ootakemaru: 'The accepted claims establish kijin identity and powers, but no physical attributes.',
  'piru-spirit': 'The accepted claims establish a fiend identity without physical appearance.',
  stuhac: 'The claims explicitly state that appearance is undescribed; leg ties alone are insufficient.',
  topielec: 'Drowned soul identity alone does not establish body, costume, skin colour, or facial anatomy.',
  vourdalak: 'Vampire identity is documented, but no specific physical appearance is established.',
};
const statement = claim => typeof claim.statement === 'string' ? claim.statement : claim.statement?.en || '';
const appearance = /\b(?:appears? as|appearances?|form of|pictured|portrayed|depicted|described as|body|heads?|hair|eyes?|skin|beards?|wings?|horns?|claws?|feet|foot|tail|serpent|dragon|giant|dwarf|elk|wolf|horse|fish|frog|owl|insect|coat|cloak|shawl|robe|cap|hats?|tunics?|dress|trousers|goat|spider|cobra|eagle|bird|light|fireball|dog|cat|beast)\b/i;
const nonhuman = /\b(?:dragon|serpent|giant|dwarf|elk|wolf|horse|fish|frog|owl|insect|goat|spider|cobra|eagle|bird|fireball|claws?|horns?|wings?|tails?|one-eyed|three-eyed|skelet(?:al|on)|hairy|webbed|hooves|snout|many-headed|ten heads?|ten-headed|backward)\b/i;
const available = creatures.filter(creature => ['lengkap-informasi', 'lengkap-bergambar'].includes(status[creature.slug]?.status)
  && !(creature.images || []).some(image => image.ai_generated) && !manifest.artworks[creature.slug] && !exclusions.items[creature.slug]);
const missing = available.filter(creature => !entries.has(creature.slug)).map(creature => creature.slug);
const candidates = available.filter(creature => entries.has(creature.slug) && !OMIT[creature.slug] && !NEEDS_REVIEW[creature.slug]).map(creature => {
  const research = entries.get(creature.slug);
  const visualClaims = research.claims.filter(claim => appearance.test(statement(claim)));
  const nonhumanClaims = visualClaims.filter(claim => nonhuman.test(statement(claim)));
  return { creature, research, visualClaims, nonhumanClaims };
});
candidates.sort((a, b) => Number(Boolean(NEEDS_REVIEW[a.creature.slug])) - Number(Boolean(NEEDS_REVIEW[b.creature.slug]))
  || Number(b.nonhumanClaims.length > 0) - Number(a.nonhumanClaims.length > 0)
  || b.visualClaims.length - a.visualClaims.length
  || a.creature.slug.localeCompare(b.creature.slug, 'en'));
const selected = candidates.filter(candidate => candidate.visualClaims.length > 0).slice(0, 203);
if (selected.length !== 203) throw new Error(`Only ${selected.length} eligible candidates; cannot manufacture a 203-item worklist.`);
const items = selected.map(({ creature, research, visualClaims }, index) => ({
  index: index + 1, slug: creature.slug, canonical_name: creature.canonical_name,
  worker: `worker-${index % 3}`,
  status: 'pending', requires_catalogue_record: Boolean(creature.reviewed_research_only),
  review_path: `data/gemini/reviews/${status[creature.slug].batch}.review.json`, research,
  ...(recovered.find(record => record.slug === creature.slug) ? { research_source_file: recovered.find(record => record.slug === creature.slug).file } : {}),
  selection_visual_claim_ids: visualClaims.map(claim => claim.id),
  ...(NEEDS_REVIEW[creature.slug] ? { source_review_required: NEEDS_REVIEW[creature.slug] } : {}),
}));
const sources = items.flatMap(item => item.research.sources);
const batch = {
  target: 203, tool: 'OpenAI built-in image_gen',
  scope: '203 additional distinct source-based illustrations after the 797 active editorial artworks; only complete-information records are eligible.',
  selected_at: new Date().toISOString(), baseline_counts: counts, status: 'in-progress', complete: 0, presence_policy: true, require_root_visual_review: true, items, replacements: [],
  baseline_artwork_count: Object.keys(manifest.artworks).length,
  selection_criteria: [
    'Current computeFillStatus must be lengkap-informasi or lengkap-bergambar (documentary image only), including a passing accepted review and no tier-completeness issue.',
    'No existing AI-generated image, active editorial manifest entry, or active artwork exclusion. Documentary images, if present, do not count as an existing editorial illustration.',
    'The current accepted research entry must be available and embedded unchanged in the worklist.',
    'Prioritize documented nonhuman anatomy, then documented humanlike supernatural forms. Identity, abilities and etymology alone cannot establish anatomy.',
    'Entries with undescribed bodily forms are omitted; every worker must select and document one coherent visual variant before image generation.',
  ],
  user_policy: {
    instruction_date: '2026-10-05', only_complete_information: true, parallel_workers: 3,
    visual_identity: 'Follow the selected source-supported form. For humanlike supernatural forms use uncanny presence through pose, expression, framing and natural lighting; do not add unsupported horns, wings, fangs, animal limbs or species.',
    aura: 'Character presence through pose, expression, framing, scale, atmosphere and natural lighting. No generic glowing envelope, neon outline, energy ribbons or luminous coloured mist. Magical effects only if supported by the selected documented appearance or ability, and restrained. Frightening beings get appropriate horror atmosphere; benevolent beings remain appropriate to their tradition.',
    scale: 'For beings explicitly described as huge, emphasize their documented gigantic scale with small environmental reference features; do not inflate species or beings whose size is not supported.',
    human_form: 'A genuinely human-looking source-supported form is allowed and must be rendered beautifully with a clearly supernatural atmosphere.',
  },
  selection_audit: {
    available_without_editorial_image: available.length, available_without_any_image: available.filter(creature => !(creature.images || []).length).length,
    available_research_entries: available.length - missing.length, recovered_current_review_parts: recovered,
    selected: items.length, ready_for_variant_review: items.filter(item => item.status === 'pending').length,
    needs_additional_source_review: items.filter(item => item.status === 'needs-source-review').map(item => ({ slug: item.slug, reason: item.source_review_required })),
    missing_current_research: missing,
    omitted: Object.entries({ ...OMIT, ...NEEDS_REVIEW }).filter(([slug]) => available.some(creature => creature.slug === slug)).map(([slug, reason]) => ({ slug, reason })),
    source_count: sources.length,
    unique_source_urls: new Set(sources.map(source => source.url)).size,
    source_types: Object.fromEntries([...new Set(sources.map(source => source.type))].sort().map(type => [type, sources.filter(source => source.type === type).length])),
    worker_counts: Object.fromEntries(['root', 'worker-0', 'worker-1', 'worker-2'].map(worker => [worker, items.filter(item => item.worker === worker).length])),
    keyword_ranking_note: 'Visual keyword ranking assists selection only. Workers must read claim text, context and sources, select one coherent variant and inspect the resulting image; keywords are not an anatomy verifier.',
  },
};
await writeFile(output, `${JSON.stringify(batch, null, 2)}\n`);
console.log(JSON.stringify({ output: 'data/artwork-batch-1000.json', baseline: batch.baseline_artwork_count, target: batch.target, ...batch.selection_audit }, null, 2));
