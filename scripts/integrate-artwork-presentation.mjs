/** Install reviewed replacements serially, preserving earlier assets and generation receipts. */
import assert from 'node:assert/strict';
import { copyFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { root, directory, ledgerPath, read, save, hash, validateRevision, assertBaseline, existing } from './artwork-presentation-lib.mjs';

const ledger = read(ledgerPath);
assertBaseline(ledger, read('assets/art/verified-manifest.json'));
const batches = readdirSync(resolve(root, 'data')).filter(name => /^artwork-batch-\d+\.json$/.test(name));
let added = 0;
for (const item of ledger.items) {
  if (item.status === 'complete') continue;
  const receiptPath = `${directory}/${item.slug}.json`;
  if (!existing(receiptPath)) continue;
  const receipt = read(receiptPath);
  if (receipt.status !== 'reviewed' || receipt.root_visual_review?.verdict !== 'pass') continue;
  const selectedHash = validateRevision(receipt, item);
  const manifestBefore = read('assets/art/verified-manifest.json');
  const active = manifestBefore.artworks[item.slug];
  // Retain original batch directory contracts used by existing audits.
  const oldFolder = resolve(root, item.old_artwork.original_file, '..');
  const generatedRoot = resolve(root, 'data/artwork-generated') + '/';
  const selected = oldFolder.startsWith(generatedRoot)
    ? resolve(oldFolder, `${item.slug}-mythic-presence.png`) : resolve(root, receipt.original_file);
  // Registration may have succeeded immediately before an interrupted metadata write.
  const resuming = (active.presentation_revision?.ledger === ledgerPath
    && active.presentation_revision.native_sha256 === selectedHash)
    || (active.original_file === selected && active.prompt === receipt.prompt
      && active.url.includes('-mythic-presence') && existing(selected) && hash(selected) === selectedHash);
  assert(resuming || active.url === item.old_artwork.url, `Active image changed independently: ${item.slug}`);
  if (existing(selected)) assert.equal(hash(selected), selectedHash, 'Never overwrite a native variant');
  else copyFileSync(resolve(root, receipt.original_file), selected);
  const revision = { ledger: ledgerPath, receipt_path: receiptPath, native_sha256: selectedHash,
    old_url: item.old_artwork.url, old_original_file: item.old_artwork.original_file,
    old_webp_sha256: item.old_webp_sha256, old_native_sha256: item.old_native_sha256,
    rationale: receipt.rationale, basis_claim_ids: receipt.basis_claim_ids };
  const prompts = read('assets/art/verified-prompts.json');
  prompts.prompts[item.slug] = receipt.prompt;
  prompts.specifications[item.slug] = {
    depicted_variant: receipt.depicted_variant, visual_requirements: receipt.visual_requirements,
    aura: receipt.aura, basis_review: receipt.review_path,
    basis_claims: item.research.claims.filter(c => receipt.basis_claim_ids.includes(c.id)),
    accuracy_mode: 'source-supported', artistic_changes: receipt.artistic_choices,
    presentation_revision: revision,
  };
  save('assets/art/verified-prompts.json', prompts);
  const suffix = item.old_artwork.batch === 'regeneration-139' ? 'regeneration-139-mythic-presence' : 'mythic-presence';
  if (!resuming) execFileSync('python3', ['scripts/register-artwork.py', item.slug, selected, '--reviewed',
    '--asset-suffix', suffix, '--skip-historical-batches', '--review-notes', receipt.visual_review.notes],
  { cwd: root, stdio: 'pipe' });
  const manifest = read('assets/art/verified-manifest.json');
  const art = manifest.artworks[item.slug];
  Object.assign(art, { aura: receipt.aura, visual_requirements: receipt.visual_requirements,
    visual_review_notes: receipt.visual_review.notes, root_visual_review: receipt.root_visual_review,
    review_path: receipt.review_path, visual_basis: receipt.review_path,
    presentation_revision: revision, accuracy_mode: 'source-supported' });
  if (item.old_artwork.batch) art.batch = item.old_artwork.batch;
  save('assets/art/verified-manifest.json', manifest);
  const webpHash = hash(`.${art.url}`);
  const updates = { original_file: selected, prompt: receipt.prompt, depicted_variant: receipt.depicted_variant,
    visual_requirements: receipt.visual_requirements, aura: receipt.aura, basis_claim_ids: receipt.basis_claim_ids,
    visual_review: receipt.visual_review, root_visual_review: receipt.root_visual_review,
    native_sha256: selectedHash, presentation_revision: revision,
    url: art.url, width: art.width, height: art.height, sha256: webpHash };
  function updateRecord(record) {
    if (record.presentation_revision?.native_sha256 === selectedHash) return;
    const prior = structuredClone(record);
    (record.presentation_revision_history ||= []).push(prior);
    Object.assign(record, updates);
    if (record.worker === 'root') record.independent_visual_review = receipt.visual_review;
    if (record.accuracy_mode) record.accuracy_mode = 'source-supported';
  }
  for (const name of batches) {
    const path = `data/${name}`, batch = read(path);
    const row = batch.items.find(i => i.slug === item.slug && (i.url === receipt.old_url
      || i.presentation_revision?.native_sha256 === selectedHash));
    if (!row) continue;
    const generationPath = `data/artwork-generated/${name.replace('artwork-', '').replace('.json', '')}/${item.slug}.json`;
    if (existing(generationPath)) {
      const generation = read(generationPath);
      updateRecord(generation);
      generation.generated_file = receipt.generated_file;
      generation.revision_generator = receipt.visual_review.reviewer;
      generation.artistic_changes = receipt.artistic_choices;
      save(generationPath, generation);
    }
    updateRecord(row);
    save(path, batch);
  }
  const regenerationPath = 'data/artwork-regeneration-139.json';
  if (existing(regenerationPath)) {
    const regeneration = read(regenerationPath);
    const row = regeneration.items.find(i => i.slug === item.slug && (i.url === receipt.old_url
      || i.presentation_revision?.native_sha256 === selectedHash));
    if (row) {
      const originalReceipt = read(row.receipt_path);
      updateRecord(originalReceipt);
      originalReceipt.nonhuman_features = receipt.visual_requirements;
      originalReceipt.historical_basis = item.research.claims.filter(c => receipt.basis_claim_ids.includes(c.id));
      save(row.receipt_path, originalReceipt);
      updateRecord(row);
      save(regenerationPath, regeneration);
    }
  }
  const visual = read('data/artwork-visual-review.json');
  visual.reviews[item.slug] = { ...receipt.visual_review, original_file: selected,
    reviewed_at: new Date().toISOString(), root_visual_review: receipt.root_visual_review, presentation_revision: revision };
  save('data/artwork-visual-review.json', visual);
  Object.assign(item, updates, { status: 'complete', receipt_path: receiptPath });
  ledger.complete = ledger.items.filter(i => i.status === 'complete').length;
  ledger.status = ledger.screening_complete && ledger.complete === ledger.target ? 'complete' : 'in-progress';
  save(ledgerPath, ledger);
  added++;
  console.log(`${item.slug}: revised (${ledger.complete}/${ledger.target})`);
}
assertBaseline(ledger, read('assets/art/verified-manifest.json'));
console.log(JSON.stringify({ added, complete: ledger.complete, target: ledger.target, status: ledger.status }));
