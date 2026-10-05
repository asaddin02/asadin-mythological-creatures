#!/usr/bin/env node
/** Register approved replacements without discarding the prior exclusion audit. Run serially. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = p => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const save = (p, value) => {
  const file = resolve(root, p);
  writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2) + '\n');
  renameSync(`${file}.tmp`, file);
};
const batchPath = 'data/artwork-regeneration-139.json';
const directory = 'data/artwork-generated/regeneration-139';
const batch = read(batchPath);
assert(batch.authorization.supersedes_previous_no_regeneration === true);
assert.equal(batch.items.length, 139);
assert.equal(new Set(batch.items.map(i => i.slug)).size, 139);
const exclusionPath = 'data/artwork-exclusions.json';
const exclusions = read(exclusionPath);
const hashes = new Map(Object.entries(read('assets/art/verified-manifest.json').artworks)
  .map(([slug, art]) => [createHash('sha256').update(readFileSync(resolve(root, `.${art.url}`))).digest('hex'), slug]));
let added = 0;
for (const item of batch.items) {
  if (item.status === 'complete') continue;
  const receiptPath = `${directory}/${item.slug}.json`;
  if (!existsSync(resolve(root, receiptPath))) continue;
  const receipt = read(receiptPath);
  if (receipt.status !== 'reviewed' || receipt.root_visual_review?.verdict !== 'pass') continue;
  assert.equal(receipt.slug, item.slug);
  assert.equal(receipt.worker, item.worker);
  assert.equal(receipt.tool, 'OpenAI built-in image_gen');
  assert.equal(receipt.review_path, item.review_path);
  assert.equal(receipt.visual_review?.verdict, 'pass');
  assert(receipt.visual_review.notes?.trim() && receipt.root_visual_review.notes?.trim());
  assert(receipt.prompt?.trim() && receipt.depicted_variant?.trim() && receipt.aura?.trim());
  assert(receipt.nonhuman_features?.length && receipt.visual_requirements?.length);
  assert(receipt.historical_basis?.length, `Documented character identity required: ${item.slug}`);
  assert(['source-supported', 'authorized-artistic'].includes(receipt.accuracy_mode));
  if (receipt.accuracy_mode === 'authorized-artistic') {
    assert(batch.artistic_interpretation_authorized === true, 'Explicit user authorization required for invented anatomy');
    assert(receipt.artistic_changes?.length, 'Invented features must be disclosed');
  } else {
    assert(!receipt.invented_anatomy?.length, 'Source-supported illustrations cannot silently invent anatomy');
  }
  const review = read(item.review_path).entries.find(e => e.slug === item.slug);
  assert.equal(review?.verdict, 'lulus-otomatis', `Current source verification required: ${item.slug}`);
  const claims = new Set((item.research?.claims || []).map(c => c.id));
  assert(receipt.basis_claim_ids?.length && receipt.basis_claim_ids.every(id => claims.has(id)));
  const source = resolve(receipt.original_file);
  assert(source.startsWith(resolve(root, directory) + '/'), 'Replacement originals must be retained in this workspace batch');
  assert(existsSync(source));
  assert(exclusions.items[item.slug] || exclusions.resolved?.[item.slug], 'Regeneration must belong to the original exclusion set');
  const promptsPath = 'assets/art/verified-prompts.json';
  const prompts = read(promptsPath);
  prompts.prompts[item.slug] = receipt.prompt;
  (prompts.specifications ||= {})[item.slug] = {
    depicted_variant: receipt.depicted_variant, visual_requirements: receipt.visual_requirements,
    aura: receipt.aura, basis_review: item.review_path,
    basis_claims: item.research.claims.filter(c => receipt.basis_claim_ids.includes(c.id)),
    accuracy_mode: receipt.accuracy_mode, nonhuman_features: receipt.nonhuman_features,
    historical_basis: receipt.historical_basis, artistic_changes: receipt.artistic_changes || [],
    invented_anatomy: receipt.invented_anatomy || [],
    ...(receipt.additional_sources ? { additional_sources: receipt.additional_sources } : {}),
  };
  save(promptsPath, prompts);
  // Revoke only this character's previous prohibition after both visual audits pass.
  const prior = exclusions.items[item.slug];
  if (prior) {
    (exclusions.resolved ||= {})[item.slug] = {
      ...prior, status: 'regeneration-approved', regenerate: true,
      superseded_by: batchPath, authorized_at: batch.authorization.date,
      replacement_receipt: receiptPath, resolved_at: new Date().toISOString(),
    };
    delete exclusions.items[item.slug];
    save(exclusionPath, exclusions);
  }
  try {
    const manifestBefore = read('assets/art/verified-manifest.json');
    if (!manifestBefore.artworks[item.slug]) {
      execFileSync('python3', ['scripts/register-artwork.py', item.slug, source, '--reviewed',
        '--asset-suffix', 'regeneration-139', '--skip-historical-batches', '--review-notes', receipt.visual_review.notes],
      { cwd: root, stdio: 'pipe' });
    } else {
      assert.equal(manifestBefore.artworks[item.slug].original_file, source, 'Existing replacement must match this receipt');
      assert.equal(manifestBefore.artworks[item.slug].prompt, receipt.prompt);
    }
  } catch (error) {
    if (prior) { exclusions.items[item.slug] = prior; delete exclusions.resolved[item.slug]; save(exclusionPath, exclusions); }
    throw error;
  }
  const manifest = read('assets/art/verified-manifest.json');
  const art = manifest.artworks[item.slug];
  const hash = createHash('sha256').update(readFileSync(resolve(root, `.${art.url}`))).digest('hex');
  assert(!hashes.has(hash) || hashes.get(hash) === item.slug, 'Different characters cannot reuse the same artwork');
  hashes.set(hash, item.slug);
  Object.assign(art, { batch: 'regeneration-139', root_visual_review: receipt.root_visual_review,
    nonhuman_features: receipt.nonhuman_features, accuracy_mode: receipt.accuracy_mode });
  save('assets/art/verified-manifest.json', manifest);
  const visual = read('data/artwork-visual-review.json');
  visual.reviews[item.slug] = { ...receipt.visual_review, original_file: source,
    reviewed_at: receipt.reviewed_at, root_visual_review: receipt.root_visual_review,
    accuracy_mode: receipt.accuracy_mode, nonhuman_features: receipt.nonhuman_features };
  save('data/artwork-visual-review.json', visual);
  Object.assign(item, { status: 'complete', url: art.url, original_file: source,
    width: art.width, height: art.height, sha256: hash, receipt_path: receiptPath });
  // Preserve user policy changes that arrive while a registration is running.
  const latest = read(batchPath);
  for (const key of ['artistic_interpretation_authorized', 'interpretation_policy', 'policy_answer'])
    if (key in latest) batch[key] = latest[key];
  batch.complete = batch.items.filter(i => i.status === 'complete').length;
  batch.status = batch.complete === batch.target ? 'complete' : 'in-progress';
  save(batchPath, batch);
  added++;
  console.log(`${item.slug}: replacement registered (${batch.complete}/${batch.target}).`);
}
console.log(JSON.stringify({ added, complete: batch.complete, target: batch.target }));
if (added || !existsSync(resolve(root, 'docs/artwork-regeneration-139.html')))
  execFileSync('python3', ['scripts/build-artwork-regeneration-gallery.py'], { cwd: root, stdio: 'inherit' });
