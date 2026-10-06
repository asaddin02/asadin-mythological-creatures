/** Isolated contract fixtures remain usable after a checkout moves between PCs. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, hash, revisionPaths, validateRevision, assertBaseline, assetPath } from '../scripts/artwork-presentation-lib.mjs';
assert.equal(revisionPaths().directory, 'data/artwork-generated/presentation-revision-1000');
assert.equal(revisionPaths('nama-besar').ledgerPath, 'data/artwork-presentation-revision-nama-besar.json');
for (const name of ['../escape', '/tmp/escape', '', 'NAME', 'a/b', 'a--b']) assert.throws(() => revisionPaths(name));
const testRevision = `contract-${process.pid}`;
const paths = revisionPaths(testRevision);
const temporary = `tmp/artwork-presentation-test-${process.pid}`;
const legacyNative = `data/artwork-generated/presentation-revision-1000/originals/contract-${process.pid}.png`;
mkdirSync(resolve(root, `${paths.directory}/originals`), { recursive: true });
mkdirSync(resolve(root, temporary), { recursive: true });
mkdirSync(resolve(root, legacyNative, '..'), { recursive: true });
try {
  const oldFile = `${temporary}/old.webp`, oldNative = `${temporary}/old.png`;
  const backup = `${temporary}/backup.webp`, nativeBackup = `${temporary}/backup.png`;
  const native = `${paths.directory}/originals/test.png`, reviewPath = `${temporary}/review.json`;
  for (const [file, bytes] of [[oldFile, 'previous webp'], [backup, 'previous webp'],
    [oldNative, 'previous PNG'], [nativeBackup, 'previous PNG'], [native, 'new native PNG'],
    [legacyNative, 'new native PNG']]) writeFileSync(resolve(root, file), bytes);
  const claim = { id: 'test-c01', source_id: 'test-s1', quote: 'The deity represents the sun.',
    statement: { en: 'The deity represents the sun.' } };
  writeFileSync(resolve(root, reviewPath), JSON.stringify({ entries: [{ slug: 'test', verdict: 'lulus-otomatis',
    claims: [{ ...claim, statement: claim.statement.en }] }] }));
  const item = { slug: 'test', worker: 'codex', review_path: reviewPath,
    old_artwork: { url: `/${oldFile}`, original_file: oldNative, review_path: reviewPath },
    old_webp_sha256: hash(oldFile), old_native_sha256: hash(oldNative),
    old_webp_backup: backup, old_native_backup: nativeBackup,
    research: { claims: [claim], sources: [{ id: 'test-s1', url: 'https://example.com/source' }] } };
  const receipt = { revision: testRevision, slug: 'test', worker: 'codex', tool: 'OpenAI built-in image_gen',
    status: 'awaiting-independent-review', prompt: 'A monumental solar deity.',
    depicted_variant: 'Sun deity in radiant light', rationale: 'Documented solar domain', aura: 'Solar radiance',
    review_path: reviewPath, basis_claim_ids: ['test-c01'],
    visual_requirements: [{ kind: 'effect', description: 'Solar radiance', claim_ids: ['test-c01'] }],
    artistic_choices: ['Monumental low-angle camera framing'], old_url: item.old_artwork.url,
    old_webp_sha256: item.old_webp_sha256, old_original_file: oldNative,
    old_native_sha256: item.old_native_sha256, original_file: native, native_sha256: hash(native),
    visual_review: { reviewer: 'codex', verdict: 'pass', notes: 'Inspected selected image', native_sha256: hash(native) } };
  const awaiting = { revision: testRevision, requireIndependent: false };
  assert.equal(validateRevision(receipt, item, awaiting), receipt.native_sha256);
  const invalid = (change, options = awaiting, source = item) => {
    const copy = structuredClone(receipt); change(copy);
    assert.throws(() => validateRevision(copy, source, options));
  };
  invalid(r => { r.slug = 'other'; });
  invalid(r => { r.worker = 'other'; });
  invalid(r => { r.revision = 'other'; });
  invalid(r => { r.basis_claim_ids = ['invented-claim']; });
  invalid(r => { r.visual_review.native_sha256 = '0'.repeat(64); });
  invalid(r => { delete r.visual_review.native_sha256; });
  invalid(r => { r.old_webp_sha256 = '0'.repeat(64); });
  invalid(r => { r.status = 'generated'; });
  invalid(() => {}, awaiting, { ...item, historical_native_sha256: receipt.native_sha256 });
  invalid(r => { r.visual_requirements[0].claim_ids = ['invented-claim']; });
  invalid(r => { r.visual_requirements = ['Unsupported unstructured effect']; });
  invalid(r => { r.original_file = legacyNative; });
  invalid(r => { r.root_visual_review = { reviewer: 'claude', verdict: 'pass' }; });
  invalid(r => { r.independent_visual_review = { reviewer: 'claude', verdict: 'pass' }; });
  const alteredResearch = structuredClone(item);
  alteredResearch.research.claims[0].statement.en = 'Invented wings';
  invalid(() => {}, awaiting, alteredResearch);
  const reviewed = structuredClone(receipt);
  reviewed.status = 'reviewed';
  reviewed.root_visual_review = { reviewer: 'claude', verdict: 'pass', notes: 'Second inspection', native_sha256: hash(native) };
  assert.equal(validateRevision(reviewed, item, { revision: testRevision }), receipt.native_sha256);
  for (const change of [r => { r.root_visual_review.reviewer = r.visual_review.reviewer; },
    r => { r.root_visual_review.native_sha256 = '0'.repeat(64); }, r => { delete r.root_visual_review; }]) {
    const bad = structuredClone(reviewed); change(bad);
    assert.throws(() => validateRevision(bad, item, { revision: testRevision }));
  }
  const legacyReceipt = { ...reviewed, original_file: legacyNative, visual_requirements: ['Solar domain'] };
  delete legacyReceipt.revision;
  assert.equal(validateRevision(legacyReceipt, item), receipt.native_sha256, 'Default revision 1000 stays compatible');
  writeFileSync(resolve(root, backup), 'corrupted backup');
  assert.throws(() => validateRevision(receipt, item, awaiting));
  const manifest = { artworks: { test: {} } }, ledger = { baseline: [{ slug: 'test' }] };
  assertBaseline(ledger, manifest);
  assert.throws(() => assertBaseline(ledger, { artworks: {} }));
  assert.throws(() => assertBaseline(ledger, { artworks: { other: {} } }));
  assertBaseline(ledger, { artworks: { test: {}, added: {} } }); // artwork added by later batches is allowed
  const relocated = `/obsolete/asadin-mythological-creatures/${oldNative}`;
  assert.equal(assetPath(relocated), resolve(root, oldNative));
  assert.equal(hash(relocated), item.old_native_sha256);
  console.log('PASS: default and named revisions; grounded effects; preserved hashes; relocation; independent-review boundary; stale and forged receipts rejected');
} finally {
  rmSync(resolve(root, paths.directory), { recursive: true, force: true });
  rmSync(resolve(root, temporary), { recursive: true, force: true });
  rmSync(resolve(root, legacyNative), { force: true });
}
