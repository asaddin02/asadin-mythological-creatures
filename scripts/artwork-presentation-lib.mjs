/** Shared provenance checks for the source-backed mythology presentation revision. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const directory = 'data/artwork-generated/presentation-revision-1000';
export const ledgerPath = 'data/artwork-presentation-revision-1000.json';
export const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export const hash = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
export function save(path, value) {
  const file = resolve(root, path);
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, file);
}
export function validateRevision(receipt, item) {
  assert.equal(receipt.slug, item.slug, 'Receipt must identify its selected creature');
  assert.equal(receipt.worker, item.worker);
  assert.equal(receipt.tool, 'OpenAI built-in image_gen');
  assert.equal(receipt.status, 'reviewed');
  for (const key of ['prompt', 'depicted_variant', 'rationale', 'aura', 'review_path'])
    assert(receipt[key]?.trim(), `Missing ${key}: ${item.slug}`);
  assert(receipt.visual_requirements?.length && receipt.artistic_choices?.length);
  assert(receipt.basis_claim_ids?.length);
  const claimIds = new Set(item.research.claims.map(c => c.id));
  assert(receipt.basis_claim_ids.every(id => claimIds.has(id)), `Unknown source claim: ${item.slug}`);
  assert.equal(receipt.review_path, item.old_artwork.review_path);
  const accepted = read(receipt.review_path).entries.find(e => e.slug === item.slug);
  assert.equal(accepted?.verdict, 'lulus-otomatis', `Passing source review: ${item.slug}`);
  assert(receipt.basis_claim_ids.every(id => accepted.claims.some(c => c.id === id)),
    `Source claims must belong to the passing review: ${item.slug}`);
  for (const id of receipt.basis_claim_ids) {
    const claim = item.research.claims.find(c => c.id === id);
    const checked = accepted.claims.find(c => c.id === id);
    assert.equal(claim.source_id, checked.source_id, `Source identity changed: ${id}`);
    assert.equal(claim.quote, checked.quote, `Source evidence changed: ${id}`);
    assert.equal(claim.statement.en, checked.statement, `Source statement changed: ${id}`);
    assert(item.research.sources.some(s => s.id === claim.source_id && s.url), `Missing source: ${id}`);
  }
  assert.equal(receipt.old_url, item.old_artwork.url);
  assert.equal(receipt.old_webp_sha256, item.old_webp_sha256);
  assert.equal(hash(`.${receipt.old_url}`), item.old_webp_sha256, `Earlier WebP changed: ${item.slug}`);
  assert.equal(receipt.old_original_file, item.old_artwork.original_file);
  assert.equal(receipt.old_native_sha256, item.old_native_sha256);
  if (item.old_native_sha256) assert.equal(hash(receipt.old_original_file), item.old_native_sha256);
  assert(resolve(root, receipt.original_file).startsWith(resolve(root, `${directory}/originals`) + '/'));
  const selectedHash = hash(receipt.original_file);
  assert.equal(receipt.native_sha256, selectedHash);
  assert.notEqual(selectedHash, item.old_native_sha256, 'Revision must select a different image');
  const first = receipt.visual_review, second = receipt.root_visual_review;
  assert.equal(first?.verdict, 'pass');
  assert.equal(second?.verdict, 'pass');
  assert(first.notes?.trim() && second.notes?.trim());
  assert(first.reviewer && second.reviewer && first.reviewer !== second.reviewer,
    `Two different visual reviewers required: ${item.slug}`);
  assert.equal(second.native_sha256, selectedHash, 'Second inspection must match selected bytes');
  assert.equal(first.native_sha256, selectedHash, 'First inspection must match selected bytes');
  return selectedHash;
}
export function assertBaseline(ledger, manifest) {
  assert.equal(Object.keys(manifest.artworks).length, ledger.baseline.length, 'Revision preserves image count');
  assert.deepEqual(Object.keys(manifest.artworks).sort(), ledger.baseline.map(i => i.slug).sort(),
    'Revision preserves exactly the original illustrated creatures');
}
export function existing(path) { return existsSync(resolve(root, path)); }
