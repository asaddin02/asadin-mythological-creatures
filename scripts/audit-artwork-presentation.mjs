/** Verify reviewed replacements, source evidence, preservation, and unchanged catalogue membership. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { root, read, save, hash, validateRevision, assertBaseline, revisionArgs, existing, assetPath } from './artwork-presentation-lib.mjs';
const options = revisionArgs({ 'require-complete': { type: 'boolean', default: false },
  'require-generated': { type: 'boolean', default: false } });
const { revision, directory, ledgerPath, auditPath } = options;

const ledger = read(ledgerPath), manifest = read('assets/art/verified-manifest.json');
assertBaseline(ledger, manifest);
assert.equal(ledger.target, ledger.items.length);
assert.equal(new Set(ledger.items.map(i => i.slug)).size, ledger.items.length);
assert.equal(ledger.complete, ledger.items.filter(i => i.status === 'complete').length);
assert.equal(ledger.screening.length, ledger.baseline.length, 'Every original artwork has a screening decision');
assert.equal(new Set(ledger.screening.map(i => i.slug)).size, ledger.baseline.length);
assert.deepEqual(ledger.screening.map(i => i.slug).sort(), ledger.baseline.map(i => i.slug).sort(),
  'Screening must cover exactly the original artworks');
assert.deepEqual(ledger.items.map(i => i.slug).sort(),
  ledger.screening.filter(i => i.decision === 'revise').map(i => i.slug).sort(),
  'Every final revision decision must have a tracked replacement');
if (options['require-complete']) {
  assert(ledger.screening_complete, 'All screening must be finalized');
  assert(ledger.screening.every(i => ['keep', 'revise'].includes(i.decision)), 'No unresolved screening');
  assert.equal(ledger.complete, ledger.target);
  assert.equal(ledger.status, 'complete');
}
const creatures = read('data/creatures.json'), bySlug = new Map(creatures.map(c => [c.slug, c]));
// Later research adds catalogue entries; a revision must only never remove one.
const catalogue = new Set(creatures.map(c => c.slug));
assert.deepEqual(ledger.catalogue_slugs.filter(slug => !catalogue.has(slug)), [], 'No catalogue entries removed');
const prompts = read('assets/art/verified-prompts.json');
const { EDITORIAL_ART } = await import(new URL('../js/editorial-art.js', import.meta.url));
const selected = new Map(ledger.items.filter(i => i.status === 'complete').map(i => [i.slug, i]));
const hashes = new Set(), images = [];
let awaitingIndependentReview = 0, reviewedPendingReceipts = 0, generatedNativeImagesDecoded = 0, needsCorrection = 0;
for (const item of ledger.items.filter(i => i.status !== 'complete')) {
  const receiptPath = item.receipt_path || `${directory}/${item.slug}.json`;
  if (!existing(receiptPath)) {
    assert(!options['require-generated'], `Missing generated receipt: ${item.slug}`);
    continue;
  }
  const receipt = read(receiptPath);
  assert(['awaiting-independent-review', 'reviewed', 'needs-correction'].includes(receipt.status), 'Unexpected receipt status');
  // Rejected by the second reviewer: the earlier artwork stays active until a corrected image passes.
  if (receipt.status === 'needs-correction') {
    assert.equal(receipt.root_visual_review?.verdict, 'reject', `Correction needs a recorded rejection: ${item.slug}`);
    assert(receipt.root_visual_review.notes?.trim() && receipt.root_visual_review.reviewer !== receipt.visual_review?.reviewer,
      `Rejection needs notes from a second reviewer: ${item.slug}`);
    needsCorrection++;
    continue;
  }
  validateRevision(receipt, item, { revision, requireIndependent: receipt.status === 'reviewed' });
  if (receipt.status === 'awaiting-independent-review') awaitingIndependentReview++;
  else reviewedPendingReceipts++;
  const dimensions = JSON.parse(execFileSync('python3', ['-c',
    "import json,sys;from PIL import Image;im=Image.open(sys.argv[1]);im.load();print(json.dumps(im.size))",
    assetPath(receipt.original_file)], { encoding: 'utf8' }));
  assert.equal(dimensions[0], dimensions[1], `Square native artwork required: ${item.slug}`);
  assert(dimensions[0] >= 512, `Native image too small: ${item.slug}`);
  generatedNativeImagesDecoded++;
}
let preservedNative = 0, previouslyMissingNative = 0;
for (const baseline of ledger.baseline) {
  const art = manifest.artworks[baseline.slug], creature = bySlug.get(baseline.slug);
  assert(creature && art.creature_id === creature.id);
  const { images: ignored, ...nonimage } = creature;
  assert.equal(createHash('sha256').update(JSON.stringify(nonimage)).digest('hex'), baseline.creature_sha256,
    `Revision may only change catalogue images: ${baseline.slug}`);
  assert.equal(hash(`.${baseline.url}`), baseline.sha256, `Preserve earlier WebP: ${baseline.slug}`);
  if (baseline.native_sha256) {
    assert.equal(hash(baseline.original_file), baseline.native_sha256, `Preserve earlier PNG: ${baseline.slug}`);
    preservedNative++;
  } else previouslyMissingNative++;
  const currentHash = hash(`.${art.url}`);
  assert(!hashes.has(currentHash), `Distinct creatures cannot share artwork: ${baseline.slug}`);
  hashes.add(currentHash);
  assert.equal(EDITORIAL_ART[baseline.slug], art.url);
  assert(creature.images.some(i => i.url === art.url && i.ai_generated && i.is_primary));
  const item = selected.get(baseline.slug);
  if (!item) {
    assert.equal(art.url, baseline.url, `Unselected artwork must not change: ${baseline.slug}`);
    assert.equal(art.original_file, baseline.original_file);
    continue;
  }
  const receipt = read(item.receipt_path);
  const nativeHash = validateRevision(receipt, item, { revision });
  assert.equal(hash(art.original_file), nativeHash);
  assert.equal(art.original_file, item.original_file);
  assert.equal(art.url, item.url);
  assert.equal(currentHash, item.sha256);
  assert.equal(art.prompt, receipt.prompt);
  assert.equal(prompts.prompts[item.slug], receipt.prompt);
  assert.equal(art.presentation_revision.native_sha256, nativeHash);
  assert.deepEqual(art.root_visual_review, receipt.root_visual_review);
  assert.deepEqual(item.visual_review, receipt.visual_review);
  assert.deepEqual(item.root_visual_review, receipt.root_visual_review);
  assert.notEqual(art.url, baseline.url);
  images.push({ slug: item.slug, original: assetPath(art.original_file), file: resolve(root, `.${art.url}`),
    width: art.width, height: art.height });
}
const decoded = JSON.parse(execFileSync('python3', ['-c', `import json,sys\nfrom PIL import Image\nitems=json.load(sys.stdin)\nfor i in items:\n for key in ('file','original'):\n  with Image.open(i[key]) as im:\n   im.load()\n   assert im.size==(i['width'],i['height']),i['slug']\n   assert min(im.size)>=512,i['slug']\nprint(json.dumps({'images':len(items),'files':2*len(items)}))`],
{ input: JSON.stringify(images), encoding: 'utf8' }));
const report = { status: ledger.status === 'complete' ? 'pass' : 'in-progress',
  active_artwork_count: ledger.baseline.length, screened: ledger.screening.length,
  revision, target: ledger.target, complete: ledger.complete, awaiting_independent_review: awaitingIndependentReview, needs_correction: needsCorrection,
  decoded, generated_native_images_decoded: generatedNativeImagesDecoded,
  preserved_earlier_native_images: preservedNative,
  earlier_missing_native_images: previouslyMissingNative, preserved_earlier_webp_images: ledger.baseline.length,
  unchanged_catalogue_facts: true,
  first_review_hashes_checked: true, first_review_receipts_checked: generatedNativeImagesDecoded + ledger.complete,
  independent_reviews_checked: reviewedPendingReceipts + ledger.complete,
  distinct_reviewers_and_hashes_checked: reviewedPendingReceipts + ledger.complete > 0,
  source_claims_checked: true,
  checked_at: new Date().toISOString() };
save(auditPath, report);
console.log(JSON.stringify(report));
