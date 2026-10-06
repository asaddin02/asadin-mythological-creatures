/** Shared provenance checks for the source-backed mythology presentation revision. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, isAbsolute } from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const directory = 'data/artwork-generated/presentation-revision-1000';
export const ledgerPath = 'data/artwork-presentation-revision-1000.json';
export function revisionPaths(revision = '1000') {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(revision), 'Invalid revision name');
  return { revision, directory: `data/artwork-generated/presentation-revision-${revision}`,
    ledgerPath: `data/artwork-presentation-revision-${revision}.json`,
    auditPath: `data/artwork-presentation-revision-${revision}-audit.json`,
    galleryPath: `docs/artwork-presentation-revision-${revision}.html` };
}
export function revisionArgs(extra = {}) {
  const { values } = parseArgs({ options: { revision: { type: 'string', default: '1000' }, ...extra } });
  return { ...values, ...revisionPaths(values.revision) };
}
// Historical receipts can refer to the same checkout under its former absolute location.
// Never fall back by basename: only an exact repository-relative suffix is eligible.
export function assetPath(path) {
  const file = resolve(root, path);
  if (existsSync(file) || !isAbsolute(path)) return file;
  const marker = '/asadin-mythological-creatures/';
  const index = path.indexOf(marker);
  return index === -1 ? file : resolve(root, path.slice(index + marker.length));
}
export const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export const hash = path => createHash('sha256').update(readFileSync(assetPath(path))).digest('hex');
export function save(path, value) {
  const file = resolve(root, path);
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, file);
}
export function validateRevision(receipt, item, options = {}) {
  const paths = revisionPaths(options.revision || '1000');
  assert.equal(receipt.slug, item.slug, 'Receipt must identify its selected creature');
  assert.equal(receipt.worker, item.worker);
  assert.equal(receipt.tool, 'OpenAI built-in image_gen');
  const independent = options.requireIndependent !== false;
  assert.equal(receipt.status, independent ? 'reviewed' : 'awaiting-independent-review');
  for (const key of ['prompt', 'depicted_variant', 'rationale', 'aura', 'review_path'])
    assert(receipt[key]?.trim(), `Missing ${key}: ${item.slug}`);
  assert(receipt.visual_requirements?.length && receipt.artistic_choices?.length);
  assert(receipt.basis_claim_ids?.length);
  const claimIds = new Set(item.research.claims.map(c => c.id));
  assert(receipt.basis_claim_ids.every(id => claimIds.has(id)), `Unknown source claim: ${item.slug}`);
  assert.equal(receipt.review_path, item.review_path || item.old_artwork.review_path);
  const accepted = read(receipt.review_path).entries.find(e => e.slug === item.slug);
  assert.equal(accepted?.verdict, 'lulus-otomatis', `Passing source review: ${item.slug}`);
  assert(receipt.basis_claim_ids.every(id => accepted.claims.some(c => c.id === id)),
    `Source claims must belong to the passing review: ${item.slug}`);
  for (const id of receipt.basis_claim_ids) {
    const claim = item.research.claims.find(c => c.id === id);
    const checked = accepted.claims.find(c => c.id === id);
    assert.equal(claim.source_id, checked.source_id, `Source identity changed: ${id}`);
    assert.equal(claim.quote, checked.quote, `Source evidence changed: ${id}`);
    assert.equal(typeof claim.statement === 'string' ? claim.statement : claim.statement.en,
      checked.statement, `Source statement changed: ${id}`);
    assert(item.research.sources.some(s => s.id === claim.source_id && s.url), `Missing source: ${id}`);
  }
  assert.equal(receipt.old_url, item.old_artwork.url);
  assert.equal(receipt.old_webp_sha256, item.old_webp_sha256);
  assert.equal(hash(`.${receipt.old_url}`), item.old_webp_sha256, `Earlier WebP changed: ${item.slug}`);
  if (item.old_webp_backup) assert.equal(hash(item.old_webp_backup), item.old_webp_sha256);
  assert.equal(receipt.old_original_file, item.old_artwork.original_file);
  assert.equal(receipt.old_native_sha256, item.old_native_sha256);
  if (item.old_native_sha256) assert.equal(hash(receipt.old_original_file), item.old_native_sha256);
  if (item.old_native_backup) assert.equal(hash(item.old_native_backup), item.old_native_sha256);
  assert(assetPath(receipt.original_file).startsWith(resolve(root, `${paths.directory}/originals`) + '/'));
  const selectedHash = hash(receipt.original_file);
  assert.equal(receipt.native_sha256, selectedHash);
  assert.notEqual(selectedHash, item.old_native_sha256, 'Revision must select a different image');
  if (item.historical_native_sha256)
    assert.notEqual(selectedHash, item.historical_native_sha256, 'Revision cannot reuse the historical native image');
  const first = receipt.visual_review, second = receipt.root_visual_review;
  assert.equal(first?.verdict, 'pass');
  assert(first.notes?.trim() && first.reviewer);
  assert.equal(first.native_sha256, selectedHash, 'First inspection must match selected bytes');
  if (paths.revision !== '1000') {
    assert.equal(receipt.revision, paths.revision);
    for (const requirement of receipt.visual_requirements) {
      assert(requirement.description?.trim(), 'Every requirement needs a description');
      assert(['anatomy', 'effect', 'setting'].includes(requirement.kind), 'Every requirement needs its kind');
      assert(requirement.claim_ids?.length, 'Every anatomical feature and effect needs source claims');
      assert(requirement.claim_ids.every(id => receipt.basis_claim_ids.includes(id)),
        'Requirement claims must be selected and accepted');
    }
  }
  if (!independent) {
    assert(!second && !receipt.independent_visual_review,
      'Generator must leave the independent review to a second reviewer');
    return selectedHash;
  }
  assert.equal(second?.verdict, 'pass');
  assert(first.notes?.trim() && second.notes?.trim());
  assert(first.reviewer && second.reviewer && first.reviewer !== second.reviewer,
    `Two different visual reviewers required: ${item.slug}`);
  assert.equal(second.native_sha256, selectedHash, 'Second inspection must match selected bytes');
  assert.equal(first.native_sha256, selectedHash, 'First inspection must match selected bytes');
  return selectedHash;
}
// A revision may never remove an illustrated creature; artwork added later by other batches is allowed.
export function assertBaseline(ledger, manifest) {
  const missing = ledger.baseline.map(i => i.slug).filter(slug => !manifest.artworks[slug]);
  assert.deepEqual(missing, [], 'Revision preserves every originally illustrated creature');
}
export function existing(path) { return existsSync(assetPath(path)); }
