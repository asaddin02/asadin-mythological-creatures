#!/usr/bin/env node
/** Audit batch records, decoded files, registration, research completeness, and rejected-file deletion. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const batchNumber = process.argv[2] || '267';
assert(/^\d+$/.test(batchNumber), 'Use a numeric batch identifier');
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const batch = read(`data/artwork-batch-${batchNumber}.json`);
assert.equal(batch.items.length, batch.target);
assert.equal(new Set(batch.items.map(i => i.slug)).size, batch.target);
const completed = batch.items.filter(i => i.status === 'complete');
assert.equal(completed.length, batch.complete);
if (process.argv.includes('--require-complete')) assert.equal(completed.length, batch.target, 'All requested images must be complete');
const records = read('data/creatures.json');
const bySlug = new Map(records.map(c => [c.slug, c]));
const { status, counts } = await computeFillStatus(records);
const manifest = read('assets/art/verified-manifest.json');
const prompts = read('assets/art/verified-prompts.json');
const { EDITORIAL_ART } = await import(new URL(`../js/editorial-art.js?${Date.now()}`, import.meta.url));
const exclusions = existsSync(resolve(root, 'data/artwork-exclusions.json')) ? read('data/artwork-exclusions.json').items : {};
for (const [slug, exclusion] of Object.entries(exclusions)) {
  assert.equal(exclusion.regenerate, false, `Excluded character must never be regenerated: ${slug}`);
  assert(!manifest.artworks[slug] && !EDITORIAL_ART[slug] && !prompts.prompts[slug], `Excluded artwork absent from active manifests: ${slug}`);
  assert.equal((bySlug.get(slug)?.images || []).length, 0, `Excluded character has no attached image: ${slug}`);
  for (const path of exclusion.deleted_files || []) assert(!existsSync(path), `Excluded image remains deleted: ${path}`);
  assert(!completed.some(i => i.slug === slug), `Excluded character cannot count toward batch completion: ${slug}`);
}
const hashes = new Set();
const images = [];
let rootReviewed = 0;
let selfGeneratedIndependentReviews = 0;
for (const item of completed) {
  const c = bySlug.get(item.slug);
  assert(c, `Existing character: ${item.slug}`);
  assert.equal(status[item.slug].status, 'lengkap-bergambar', `Complete researched illustrated character: ${item.slug}`);
  const receipt = read(`data/artwork-generated/batch-${batchNumber}/${item.slug}.json`);
  assert.equal(receipt.visual_review.verdict, 'pass', `Individual visual audit: ${item.slug}`);
  if (batch.require_root_visual_review) {
    assert.equal(receipt.root_visual_review?.verdict, 'pass', `Independent root visual audit: ${item.slug}`);
    assert(receipt.root_visual_review.notes?.trim(), `Independent visual review notes: ${item.slug}`);
    rootReviewed++;
    if (item.worker === 'root') {
      assert.equal(receipt.independent_visual_review?.verdict, 'pass', `Second agent review for root-generated artwork: ${item.slug}`);
      assert(receipt.independent_visual_review.notes?.trim(), `Second agent review notes: ${item.slug}`);
      selfGeneratedIndependentReviews++;
    }
  }
  assert(receipt.visual_review.notes && receipt.aura && receipt.visual_requirements.length, `Anatomy and aura audit: ${item.slug}`);
  const art = manifest.artworks[item.slug];
  if (batch.require_root_visual_review) {
    assert.equal(art.root_visual_review?.verdict, 'pass', `Registered independent review: ${item.slug}`);
    assert(resolve(art.original_file).startsWith(resolve(root, `data/artwork-generated/batch-${batchNumber}/originals`) + '/'), `Workspace original retained: ${item.slug}`);
  }
  assert.equal(art.url, item.url);
  assert.equal(art.creature_id, c.id);
  assert.equal(art.canonical_name, c.canonical_name);
  assert.equal(art.prompt, receipt.prompt);
  assert.equal(prompts.prompts[item.slug], receipt.prompt);
  assert.equal(EDITORIAL_ART[item.slug], art.url);
  const image = c.images.find(i => i.url === art.url);
  assert(image?.ai_generated && image.is_primary && image.creature_slug === item.slug, `Correct primary AI image mapping: ${item.slug}`);
  assert(existsSync(art.original_file), `Preserved selected original: ${item.slug}`);
  if (batch.presence_policy) {
    const nativeHash = createHash('sha256').update(readFileSync(art.original_file)).digest('hex');
    assert(receipt.visual_review.reviewer && receipt.root_visual_review?.reviewer, `Named reviewers: ${item.slug}`);
    assert.notEqual(receipt.visual_review.reviewer, receipt.root_visual_review.reviewer, `Distinct reviewers: ${item.slug}`);
    assert.equal(receipt.native_sha256, nativeHash, `First inspected native hash: ${item.slug}`);
    assert.equal(receipt.root_visual_review.native_sha256, nativeHash, `Second inspected native hash: ${item.slug}`);
  }
  const file = resolve(root, `.${art.url}`);
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
  assert(!hashes.has(hash), `Unique artwork: ${item.slug}`);
  hashes.add(hash);
  assert.equal(hash, item.sha256);
  images.push({ slug: item.slug, file, original: art.original_file, width: art.width, height: art.height, sha256: hash });
}
// Decode both originals and deployed WebP files; compare dimensions recorded in the manifest.
const decoded = JSON.parse(execFileSync('python3', ['-c', `import json,sys\nfrom PIL import Image\nitems=json.load(sys.stdin)\nfor i in items:\n for key in ('file','original'):\n  with Image.open(i[key]) as im:\n   im.load()\n   assert im.size == (i['width'],i['height']), i['slug']\n   assert min(im.size) >= 512, i['slug']\nprint(json.dumps({'decoded':len(items),'files':len(items)*2}))`], { input: JSON.stringify(images), encoding: 'utf8' }));
if (batch.baseline_artwork_count !== undefined) {
  assert.equal(Object.keys(manifest.artworks).length, batch.baseline_artwork_count + completed.length, 'Each completed item adds exactly one new illustration');
}
const receiptDir = resolve(root, `data/artwork-generated/batch-${batchNumber}`);
let deletedRejected = 0;
for (const name of readdirSync(receiptDir, { recursive: true }).filter(n => /reject.*\.json$/.test(n))) {
  const reject = read(resolve(receiptDir, name));
  const items = Array.isArray(reject) ? reject : reject.items || reject.rejections || reject.rejected || reject.rejected_variants || [reject];
  for (const rejection of items) {
    const path = rejection.original_file || rejection.path;
    if (path) { assert(!existsSync(path), `Rejected variant must be deleted: ${path}`); deletedRejected++; }
  }
}
const reviewScope = batch.presence_policy
  ? 'Each selected source-supported variant is inspected by two distinct named agents against the same native SHA256. Character presence uses expression, pose, framing, scale, atmosphere and natural lighting; magical effects require source support and restraint. Research completeness, provenance, registration, exclusions and asset integrity are checked.'
  : batch.aura_revision
  ? 'Each selected image is visually inspected by two distinct agents. Character presence comes from pose, expression, framing, scene atmosphere and natural lighting; magical effects require source support. Documented anatomy and scale, complete research, registration, exclusions and asset integrity are checked. Aura revision completeness and provenance are separately checked by audit-artwork-aura.mjs.'
  : batch.require_root_visual_review
    ? 'Each source-supported variant is visually inspected by its generator and a second agent. Source-supported human forms are allowed; visible supernatural aura, documented anatomy and scale, complete research, registration, exclusions and asset integrity are checked.'
    : 'Each image inspected by its generating agent against source-backed anatomy and aura; registration, permanent exclusions and asset integrity audited by this script.';
const report = { target: batch.target, complete: completed.length, status: completed.length === batch.target ? 'pass' : 'in-progress', checked_at: new Date().toISOString(), distinct_images: hashes.size, deleted_rejected_variants: deletedRejected, excluded_characters: Object.keys(exclusions).length, excluded_artwork_files_deleted: Object.values(exclusions).reduce((n, i) => n + (i.deleted_files?.length || 0), 0), decoded, counts, root_visual_reviews: rootReviewed, self_generated_second_agent_reviews: selfGeneratedIndependentReviews, review_scope: reviewScope, images };
writeFileSync(resolve(root, `data/artwork-batch-${batchNumber}-audit.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ target: report.target, complete: report.complete, status: report.status, distinct: hashes.size, deletedRejected, decoded }));
