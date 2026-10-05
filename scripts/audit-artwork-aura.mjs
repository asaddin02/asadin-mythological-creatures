#!/usr/bin/env node
/** Verify the complete source-backed presence revision and retained previous assets. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const batch = read('data/artwork-batch-797.json');
const ledger = read('data/artwork-aura-revision-797.json');
const manifest = read('assets/art/verified-manifest.json');
const prompts = read('assets/art/verified-prompts.json');
assert.equal(ledger.target, 200);
assert.equal(ledger.reviewed, ledger.items.length);
assert.equal(new Set(ledger.items.map(i => i.slug)).size, ledger.items.length);
assert.equal(ledger.revised + ledger.kept, ledger.reviewed);
assert.equal(Object.keys(manifest.artworks).length, 797, 'Revision must preserve the active image count');
if (process.argv.includes('--require-complete')) {
  assert.equal(ledger.reviewed, 200);
  assert.equal(ledger.status, 'complete');
  assert.equal(batch.aura_revision.status, 'complete');
}
for (const row of ledger.items) {
  const item = batch.items.find(i => i.slug === row.slug);
  assert(item);
  const review = read(row.review_path);
  const receipt = read(`data/artwork-generated/batch-797/${row.slug}.json`);
  const art = manifest.artworks[row.slug];
  assert.equal(review.decision, row.decision);
  assert.equal(review.status, 'reviewed');
  assert.equal(review.visual_review.verdict, 'pass');
  assert.equal(row.root_review.verdict, 'pass');
  assert(row.root_review.reviewer && row.root_review.reviewer !== review.reviewer);
  assert.equal(row.root_review.sha256, hash(row.root_review.inspection_file));
  assert.equal(row.root_review.sha256, hash(art.original_file));
  assert.equal(receipt.original_file, art.original_file);
  assert.equal(item.original_file, art.original_file);
  assert.equal(row.sha256, hash(`.${art.url}`));
  assert.equal(item.sha256, row.sha256);
  assert.equal(art.url, row.url);
  assert.equal(receipt.prompt, row.prompt);
  assert.equal(prompts.prompts[row.slug], row.prompt);
  assert.equal(art.prompt, row.prompt);
  assert.equal(art.aura, review.aura);
  assert.deepEqual(art.visual_requirements, review.visual_requirements);
  assert.equal(prompts.specifications[row.slug].aura_policy, ledger.policy);
  assert.equal(receipt.root_visual_review.verdict, 'pass');
  assert.equal(receipt.aura_revision.reviewer, review.reviewer);
  assert.equal(art.aura_revision.decision, row.decision);
  const claims = new Set(item.research.claims.map(c => c.id));
  assert(row.source_basis_claim_ids.length && row.source_basis_claim_ids.every(id => claims.has(id)));
  assert(existsSync(row.old_original_file), `Earlier native artifact preserved: ${row.slug}`);
  assert(existsSync(resolve(root, `.${row.old_url}`)), `Earlier WebP preserved: ${row.slug}`);
  if (row.decision === 'revise') {
    assert.equal(review.tool, 'OpenAI built-in image_gen');
    assert.notEqual(art.url, row.old_url);
    assert.notEqual(hash(art.original_file), hash(row.old_original_file));
    assert(receipt.attempt_history.some(i => i.original_file === row.old_original_file));
  } else {
    assert.equal(art.url, row.old_url);
    assert.equal(art.original_file, row.old_original_file);
  }
}
const report = { status: ledger.status === 'complete' ? 'pass' : 'in-progress', target: ledger.target, reviewed: ledger.reviewed, revised: ledger.revised, kept: ledger.kept, checked_at: new Date().toISOString(), policy: ledger.policy, active_artwork_count: Object.keys(manifest.artworks).length, source_claims_checked: true, selected_file_hashes_checked: true, second_agent_reviews_checked: true, earlier_artifacts_preserved: true };
writeFileSync(resolve(root, 'data/artwork-aura-revision-797-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
