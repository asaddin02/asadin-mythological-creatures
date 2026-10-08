#!/usr/bin/env node
/**
 * Prepare missing catalogue bases for a selected artwork batch from its current accepted research.
 * Dry-run: node scripts/prepare-reviewed-artwork-records.mjs data/artwork-batch-1000.json
 * Apply:   node scripts/prepare-reviewed-artwork-records.mjs data/artwork-batch-1000.json --apply
 *          --allow-skipped  apply the ready records even when some items are skipped (for example research that
 *                           fell below its tier target after selection); the skipped items are still listed.
 * Existing records are retained verbatim. Unknown taxonomy is skipped, never inferred.
 */
import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { computeFillStatus } from './gemini/fill-lib.mjs';
import { toSiteRecord } from './publish/research-record.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const text = value => typeof value === 'string' && value.trim().length > 0;
const bilingual = value => text(value?.id) && text(value?.en);
const hashResearch = entry => createHash('sha256').update(JSON.stringify(entry)).digest('hex');

/** Map one accepted entry without generating any factual content or power scores. */
export function toReviewedArtworkRecord(entry, ctx) {
  if (entry?.schema !== 'mythics-entry/1' || !text(entry.slug)) throw new Error('Invalid research identity/schema.');
  if (!ctx.cultures.has(entry.culture?.value)) throw new Error(`Unknown culture: ${entry.culture?.value}`);
  if (!ctx.categories.has(entry.classification?.value)) throw new Error(`Unknown classification: ${entry.classification?.value}`);
  if (!text(entry.identity?.canonical_name) || !bilingual(entry.identity?.display_name)
      || !bilingual(entry.short_description) || !entry.long_description?.length
      || !entry.long_description.every(bilingual)) throw new Error('Incomplete bilingual identity/descriptions.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.researched_at || '')) throw new Error('Invalid researched_at date.');
  if (!entry.sources?.length || !entry.claims?.length) throw new Error('Missing sources/claims.');
  const sources = new Set();
  for (const source of entry.sources) {
    if (!text(source.id) || sources.has(source.id) || !text(source.title) || !text(source.url)) throw new Error('Invalid/duplicate source record.');
    sources.add(source.id);
  }
  const claims = new Set();
  for (const claim of entry.claims) {
    if (!text(claim.id) || claims.has(claim.id) || !sources.has(claim.source_id)
        || !text(claim.quote) || !bilingual(claim.statement)) throw new Error('Invalid claim/source wiring.');
    claims.add(claim.id);
  }
  // Preserve claim references throughout the research, including variants, conflicts and caveats.
  function validateReferences(node) {
    if (!node || typeof node !== 'object') return;
    if (Object.hasOwn(node, 'claim_ids') && (!Array.isArray(node.claim_ids)
        || node.claim_ids.some(id => !claims.has(id)))) throw new Error('Dangling claim reference.');
    for (const value of Object.values(node)) validateReferences(value);
  }
  validateReferences(entry);
  const mapped = toSiteRecord(entry, undefined, ctx);
  return {
    ...mapped,
    sources: mapped.sources.map((source, i) => ({ ...structuredClone(entry.sources[i]), ...source })),
    claims_provenance: mapped.claims_provenance.map((claim, i) => ({ id: entry.claims[i].id, ...claim })),
    // The converter strips presentation claim IDs. Retain the exact research for later audit/review.
    accepted_research: structuredClone(entry),
    accepted_research_sha256: hashResearch(entry),
    import_method: 'accepted-research-artwork-base',
  };
}

/**
 * Pure preparation; fill is the result of computeFillStatus(creatures).
 * Selection may be a batch {items:[{slug,research}]} or an array of items/slugs.
 * Only current accepted, tier-complete research is used. Existing records are never rewritten.
 */
export function prepareReviewedArtworkRecords({ selection, creatures, cultures, categories, regions, fill,
  manifest = { artworks: {} }, exclusions = { items: {} } }) {
  const items = Array.isArray(selection) ? selection : selection?.items;
  if (!Array.isArray(items)) throw new Error('Selection must contain an items array.');
  const existing = new Map(creatures.map(creature => [creature.slug, creature]));
  const seen = new Set();
  const additions = [], skipped = [], preserved = [];
  const ctx = {
    cultures: new Set(cultures.map(culture => culture.id)),
    categories: new Set(categories.map(category => category.id)),
    regionName: new Map([...regions.map(region => [region.id, region.name.en]), ['transregional', 'Transregional']]),
    slugs: new Set([...existing.keys(), ...items.map(item => typeof item === 'string' ? item : item.slug)]),
  };
  for (const item of items) {
    const slug = typeof item === 'string' ? item : item.slug;
    if (!text(slug) || seen.has(slug)) throw new Error(`Invalid/duplicate selected slug: ${slug}`);
    seen.add(slug);
    if (existing.has(slug)) { preserved.push(slug); continue; }
    try {
      if (exclusions.items?.[slug]) throw new Error('Permanent artwork exclusion.');
      if (manifest.artworks?.[slug]) throw new Error('Artwork already registered without a catalogue base; needs separate reconciliation.');
      if (!['lengkap-informasi', 'lengkap-bergambar'].includes(fill.status[slug]?.status)) throw new Error('Not current accepted tier-complete research.');
      const entry = fill.entries.get(slug);
      if (!entry) throw new Error('Current accepted research unavailable.');
      if (item?.research && !isDeepStrictEqual(item.research, entry)) throw new Error('Embedded research differs from current accepted research.');
      if (item?.research_source_file && (typeof item.research_source_file !== 'string'
          || !/^data\/gemini\/inbox\/batch-\d+[^/]*\.md$/.test(item.research_source_file))) throw new Error('Invalid research source file.');
      additions.push({
        ...toReviewedArtworkRecord(entry, ctx),
        accepted_review_path: `data/gemini/reviews/${fill.status[slug].batch}.review.json`,
        ...(item?.research_source_file ? { accepted_research_source_file: item.research_source_file } : {}),
      });
    } catch (error) { skipped.push({ slug, reason: error.message }); }
  }
  // Relations can link to existing records and actual valid additions only.
  const available = new Set([...existing.keys(), ...additions.map(record => record.slug)]);
  for (const record of additions) {
    record.related_creature_ids = record.related_creature_ids.filter(slug => available.has(slug));
    record.semantic_relations = record.semantic_relations.map(relation => ({
      ...relation, target_slug: available.has(relation.target_slug) ? relation.target_slug
        : relation.target_slug.startsWith('ref-') ? relation.target_slug : `ref-${relation.target_slug}`,
    }));
  }
  return { creatures: [...creatures, ...additions], additions, preserved, skipped };
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const allowSkipped = args.includes('--allow-skipped');
  const paths = args.filter(arg => arg !== '--apply' && arg !== '--allow-skipped');
  if (paths.length !== 1 || paths[0].startsWith('--')) throw new Error('Usage: prepare-reviewed-artwork-records.mjs <selection.json> [--apply]');
  const read = async path => JSON.parse(await readFile(resolve(ROOT, path), 'utf8'));
  const selection = JSON.parse(await readFile(resolve(process.cwd(), paths[0]), 'utf8'));
  const original = await readFile(resolve(ROOT, 'data/creatures.json'), 'utf8');
  const creatures = JSON.parse(original);
  const [cultures, categories, regions, manifest, exclusions, fill] = await Promise.all([
    read('data/cultures.json'), read('data/categories.json'), read('data/regions.json'),
    read('assets/art/verified-manifest.json'), read('data/artwork-exclusions.json'), computeFillStatus(creatures),
  ]);
  const result = prepareReviewedArtworkRecords({ selection, creatures, cultures, categories, regions, manifest, exclusions, fill });
  if (apply && result.skipped.length && !allowSkipped) throw new Error(`Apply refused (pass --allow-skipped to apply the ready records anyway): ${JSON.stringify(result.skipped)}`);
  if (apply && result.additions.length) {
    const path = resolve(ROOT, 'data/creatures.json');
    if (await readFile(path, 'utf8') !== original) throw new Error('Catalogue changed during preparation; rerun.');
    const temporary = `${path}.reviewed-artwork-${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(result.creatures, null, 2)}\n`, { flag: 'wx' });
    await rename(temporary, path);
  }
  console.log(JSON.stringify({ applied: apply, original_count: creatures.length, prepared_count: result.creatures.length,
    additions: result.additions.map(record => record.slug), preserved: result.preserved, skipped: result.skipped }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
