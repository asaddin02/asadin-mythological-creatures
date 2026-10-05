#!/usr/bin/env node
/** Verify the replacement cohort, review trail, unchanged rejected files, and deployed assets. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const batch = read('data/artwork-regeneration-139.json');
assert.equal(batch.target, 139);
assert.equal(batch.items.length, 139);
assert.equal(new Set(batch.items.map(i => i.slug)).size, 139);
const complete = batch.items.filter(i => i.status === 'complete');
assert.equal(batch.complete, complete.length);
if (process.argv.includes('--require-complete')) assert.equal(complete.length, 139);
const manifest = read('assets/art/verified-manifest.json');
const prompts = read('assets/art/verified-prompts.json');
const creatures = new Map(read('data/creatures.json').map(c => [c.slug, c]));
const exclusions = read('data/artwork-exclusions.json');
const { EDITORIAL_ART } = await import(new URL('../js/editorial-art.js', import.meta.url));
const hashes = new Map();
for (const [slug, art] of Object.entries(manifest.artworks)) {
  const hash = createHash('sha256').update(readFileSync(resolve(root, `.${art.url}`))).digest('hex');
  assert(!hashes.has(hash), `Duplicate artworks: ${slug} and ${hashes.get(hash)}`);
  hashes.set(hash, slug);
}
const images = [];
let interpreted = 0;
let previouslyDeleted = 0;
for (const item of batch.items) {
  // Removed originals and old deployed files remain removed, even after a new replacement exists.
  for (const path of item.previous_exclusion.deleted_files || []) {
    assert(!existsSync(path), `Previously rejected file reappeared: ${path}`);
    previouslyDeleted++;
  }
  if (item.status !== 'complete') {
    assert(exclusions.items[item.slug], `Pending character remains excluded: ${item.slug}`);
    assert(!manifest.artworks[item.slug] && !EDITORIAL_ART[item.slug]);
    assert.equal((creatures.get(item.slug)?.images || []).length, 0);
    continue;
  }
  assert(!exclusions.items[item.slug] && exclusions.resolved[item.slug]);
  const receipt = read(item.receipt_path);
  assert.equal(receipt.slug, item.slug);
  assert.equal(receipt.worker, item.worker);
  assert.equal(receipt.review_path, item.review_path);
  assert.equal(receipt.visual_review.verdict, 'pass');
  assert.equal(receipt.root_visual_review.verdict, 'pass');
  assert(receipt.nonhuman_features.length && receipt.historical_basis.length);
  const art = manifest.artworks[item.slug];
  assert.equal(art.url, item.url);
  assert.equal(art.original_file, item.original_file);
  assert.equal(art.prompt, receipt.prompt);
  assert.equal(prompts.prompts[item.slug], receipt.prompt);
  assert.equal(EDITORIAL_ART[item.slug], item.url);
  assert(item.url.includes('-regeneration-139'), 'New replacements have distinct filenames');
  const creature = creatures.get(item.slug);
  assert.equal(art.creature_id, creature.id);
  const image = creature.images.find(i => i.url === item.url);
  assert(image?.is_primary && image.ai_generated && image.creature_slug === item.slug);
  if (receipt.accuracy_mode === 'authorized-artistic') {
    interpreted++;
    assert(batch.artistic_interpretation_authorized === true);
    assert(image.artistic_interpretation && image.artistic_changes.length);
    assert(image.caption.en.includes('invented anatomy'));
  } else {
    assert.equal(receipt.accuracy_mode, 'source-supported');
    assert(!receipt.invented_anatomy?.length);
  }
  const review = read(item.review_path).entries.find(e => e.slug === item.slug);
  assert.equal(review?.verdict, 'lulus-otomatis');
  const file = resolve(root, `.${item.url}`);
  assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), item.sha256);
  images.push({ slug: item.slug, file, original: item.original_file, width: item.width, height: item.height });
}
const decoded = JSON.parse(execFileSync('python3', ['-c', `import json,sys\nfrom PIL import Image\nitems=json.load(sys.stdin)\nfor i in items:\n for key in ('file','original'):\n  with Image.open(i[key]) as im:\n   im.load()\n   assert im.size==(i['width'],i['height']),i['slug']\n   assert min(im.size)>=512,i['slug']\nprint(json.dumps({'images':len(items),'files':2*len(items)}))`],
{ input: JSON.stringify(images), encoding: 'utf8' }));
let rejectedDeleted = 0;
const directory = resolve(root, 'data/artwork-generated/regeneration-139');
const acceptedOriginals = new Set(complete.map(item => resolve(item.original_file)));
for (const name of readdirSync(directory).filter(n => /reject.*\.json$/.test(n))) {
  const ledger = read(resolve(directory, name));
  const items = Array.isArray(ledger) ? ledger : ledger.items || ledger.rejections || ledger.rejected || [ledger];
  for (const rejection of items) {
    const paths = [...new Set([rejection.original_file, rejection.generated_file, rejection.path, rejection.file].filter(Boolean))];
    assert(paths.length, `Rejected replacement has no file reference: ${name}`);
    for (const path of paths) {
      const file = resolve(root, path);
      if (!existsSync(file)) continue;
      // An approved edit may replace the bytes at the same canonical original path.
      // Its rejected hash must remain absent, and the rejected generated file stays deleted.
      assert(acceptedOriginals.has(file) && rejection.sha256,
        `Rejected replacement remains deleted: ${path}`);
      const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
      assert.notEqual(hash, rejection.sha256, `Rejected replacement bytes reappeared: ${path}`);
    }
    rejectedDeleted++;
  }
}
const report = { target:139,complete:complete.length,status:complete.length===139?'pass':'in-progress',
  checked_at:new Date().toISOString(),source_supported:complete.length-interpreted,authorized_artistic:interpreted,
  pending_exclusions:139-complete.length,previously_deleted_files:previouslyDeleted,
  rejected_variants_deleted:rejectedDeleted,decoded,images };
writeFileSync(resolve(root,'data/artwork-regeneration-139-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,images:undefined}));
