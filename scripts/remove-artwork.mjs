#!/usr/bin/env node
/** Apply recorded visual exclusions without removing any creature research. Run serially. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p, fallback) => existsSync(resolve(root, p)) ? JSON.parse(readFileSync(resolve(root, p), 'utf8')) : fallback;
const save = (p, value) => {
  const path = resolve(root, p);
  writeFileSync(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n');
  renameSync(`${path}.tmp`, path);
};
const paths = process.argv.slice(2);
assert(paths.length, 'Provide a recorded visual audit JSON.');
const decisions = paths.flatMap(p => (read(p).items || []).map(i => ({ ...i, audit_path: p })))
  .filter(i => /^(delete-and-exclude-character|remove-without-regeneration|exclude-without-regeneration|exclude-character)$/.test(i.recommendation));
const exclusions = read('data/artwork-exclusions.json', { criterion: 'Ordinary human portraits are excluded without regeneration, per owner instruction on 4 October 2026.', items: {} });
const creatures = read('data/creatures.json');
const manifest = read('assets/art/verified-manifest.json');
const prompts = read('assets/art/verified-prompts.json');
const visual = read('data/artwork-visual-review.json');
const legacy = read('assets/art/prompts.json');
const batches = ['data/artwork-batch-100.json', 'data/artwork-batch-200.json', 'data/artwork-batch-267.json', 'data/artwork-worklist.json']
  .filter(p => existsSync(resolve(root, p))).map(p => [p, read(p)]);
const removedPaths = new Set();
for (const decision of decisions) {
  const slug = decision.slug;
  assert(/^[a-z0-9-]+$/.test(slug), 'Invalid creature slug');
  assert(decision.regenerate === false, `Exclusion must prohibit regeneration: ${slug}`);
  const c = creatures.find(c => c.slug === slug);
  assert(c, `Unknown creature: ${slug}`);
  const art = manifest.artworks[slug];
  const receiptPath = `data/artwork-generated/batch-267/${slug}.json`;
  const receipt = read(receiptPath, null);
  const files = new Set([art?.original_file, receipt?.original_file, decision.original_file, decision.reviewed_image]);
  for (const i of c.images || []) if (/^\/assets\/(art|archive)\//.test(i.url || '')) files.add(resolve(root, `.${i.url}`));
  if (art?.url?.startsWith('/assets/art/')) files.add(resolve(root, `.${art.url}`));
  for (const p of [`assets/art/${slug}-verified.webp`, `assets/art/${slug}-editorial.webp`, `data/artwork-generated/batch-267/reviewed-images/${slug}.png`])
    if (existsSync(resolve(root, p))) files.add(resolve(root, p));
  const deleted = [];
  for (const file of files) {
    if (!file) continue;
    const full = resolve(root, file);
    assert([resolve(root, 'assets/art') + sep, resolve(root, 'assets/archive') + sep, resolve(root, 'data/artwork-generated') + sep,
      resolve(process.env.CODEX_HOME || resolve(homedir(), '.codex'), 'generated_images') + sep].some(base => full.startsWith(base)), `Unsafe image path: ${full}`);
    if (existsSync(full)) { unlinkSync(full); removedPaths.add(full); deleted.push(full); }
  }
  const detachedImages = c.images || [];
  c.images = [];
  const previous = exclusions.items[slug];
  exclusions.items[slug] = { ...previous, slug, reason: decision.visual_evidence || decision.evidence || decision.reason,
    audit_path: decision.audit_path, regenerate: false, status: 'excluded-human',
    excluded_at: previous?.excluded_at || new Date().toISOString(),
    deleted_files: [...new Set([...(previous?.deleted_files || []), ...deleted])],
    detached_images: [...new Map([...(previous?.detached_images || []), ...detachedImages].map(i => [i.url, i])).values()],
    ...(art ? { removed_artwork: art } : {}) };
  delete manifest.artworks[slug];
  delete prompts.prompts[slug];
  if (prompts.specifications) delete prompts.specifications[slug];
  if (visual.reviews) delete visual.reviews[slug];
  if (legacy.prompts) delete legacy.prompts[slug];
  if (receipt) save(receiptPath, { ...receipt, status: 'excluded-human', regenerate: false,
    visual_review: { verdict: 'fail', notes: exclusions.items[slug].reason }, exclusion_audit: decision.audit_path });
  for (const [, batch] of batches) for (const item of batch.items || []) if (item.slug === slug)
    Object.assign(item, { status: 'excluded-human', regenerate: false, exclusion_reason: exclusions.items[slug].reason });
}
save('data/creatures.json', creatures);
save('assets/art/verified-manifest.json', manifest);
save('assets/art/verified-prompts.json', prompts);
save('assets/art/prompts.json', legacy);
save('data/artwork-visual-review.json', visual);
save('data/artwork-exclusions.json', exclusions);
for (const [path, batch] of batches) {
  if ('complete' in batch) batch.complete = batch.items.filter(i => i.status === 'complete').length;
  if ('target' in batch) batch.status = batch.complete === batch.target ? 'complete' : 'in-progress';
  save(path, batch);
}
const mapping = Object.fromEntries(Object.keys(legacy.prompts).filter(slug => !exclusions.items[slug])
  .map(slug => [slug, `/assets/art/${slug}-editorial.webp`]));
for (const [slug, art] of Object.entries(manifest.artworks)) if (!exclusions.items[slug]) mapping[slug] = art.url;
writeFileSync(resolve(root, 'js/editorial-art.js'), '// Creature-specific editorial assets; ordinary human artwork excluded.\nexport const EDITORIAL_ART = Object.freeze(' + JSON.stringify(mapping, null, 2) + ');\n');
console.log(JSON.stringify({ excluded: decisions.length, deleted_files: removedPaths.size, total_exclusions: Object.keys(exclusions.items).length }));
