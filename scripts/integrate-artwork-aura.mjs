#!/usr/bin/env node
/** Integrate independently reviewed aura edits serially without overwriting older files. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, renameSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = 'data/artwork-generated/aura-revision-797';
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const save = (path, value) => {
  const full = resolve(root, path);
  writeFileSync(`${full}.tmp`, JSON.stringify(value, null, 2) + '\n');
  renameSync(`${full}.tmp`, full);
};
const hash = path => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
const batch = read('data/artwork-batch-797.json');
const ledger = read('data/artwork-aura-revision-797.json');
let added = 0;
for (const item of batch.items) {
  if (ledger.items.some(i => i.slug === item.slug)) continue;
  const reviewPath = `${base}/reviews/${item.slug}.json`;
  const rootPath = `${base}/root-reviews/${item.slug}.json`;
  if (!existsSync(resolve(root, reviewPath)) || !existsSync(resolve(root, rootPath))) continue;
  const review = read(reviewPath);
  const second = read(rootPath);
  if (review.status !== 'reviewed' || review.visual_review?.verdict !== 'pass' || second.verdict !== 'pass') continue;
  assert.equal(review.slug, item.slug);
  assert(['keep', 'revise'].includes(review.decision));
  assert(review.rationale?.trim() && review.aura?.trim() && review.visual_requirements?.length);
  assert(review.visual_review.notes?.trim() && second.notes?.trim());
  assert(second.reviewer && review.reviewer !== second.reviewer, `Distinct second visual reviewer: ${item.slug}`);
  assert(review.source_basis_claim_ids?.length);
  const claims = new Set(item.research.claims.map(c => c.id));
  assert(review.source_basis_claim_ids.every(id => claims.has(id)), `Unknown source claim: ${item.slug}`);
  const inspected = review.decision === 'revise' ? review.original_file : review.old_original_file;
  assert.equal(resolve(root, second.inspection_file), resolve(root, inspected));
  assert.equal(second.sha256, hash(inspected), `Output changed after second review: ${item.slug}`);
  const receiptPath = `data/artwork-generated/batch-797/${item.slug}.json`;
  const receipt = read(receiptPath);
  const manifestBefore = read('assets/art/verified-manifest.json').artworks[item.slug];
  assert.equal(resolve(root, receipt.original_file), resolve(root, review.old_original_file));
  assert.equal(manifestBefore.original_file, receipt.original_file);
  const historical = { ...receipt, registered_url: manifestBefore.url, sha256: hash(`.${manifestBefore.url}`), superseded_reason: 'User clarified aura as character presence rather than generic magical effects.' };
  const rootReview = { verdict: 'pass', reviewer: second.reviewer, reviewed_at: second.reviewed_at, notes: second.notes };
  const revision = { decision: review.decision, reviewer: review.reviewer, rationale: review.rationale, allowed_magic: review.allowed_magic, source_basis_claim_ids: review.source_basis_claim_ids, review_path: reviewPath, root_review_path: rootPath };
  if (review.decision === 'revise') {
    assert.equal(review.tool, 'OpenAI built-in image_gen');
    assert(review.prompt?.trim());
    assert(resolve(root, inspected).startsWith(resolve(root, `${base}/originals`) + '/'));
    const destination = resolve(root, `data/artwork-generated/batch-797/originals/${item.slug}-presence-v2.png`);
    if (existsSync(destination)) assert.equal(hash(destination), hash(inspected), `Refuse original overwrite: ${item.slug}`);
    else copyFileSync(resolve(root, inspected), destination);
    receipt.attempt_history = [...(receipt.attempt_history || []), historical];
    receipt.original_file = destination;
    receipt.prompt = review.prompt;
    receipt.native_tool_file = review.native_tool_file;
    receipt.revision_generator = review.reviewer;
    receipt.artistic_changes = ['Character presence conveyed by pose, composition, scene atmosphere and natural lighting; effects only where the source supports them.'];
  } else {
    receipt.aura_policy_history = [...(receipt.aura_policy_history || []), { aura: receipt.aura, visual_requirements: receipt.visual_requirements, visual_review: receipt.visual_review, root_visual_review: receipt.root_visual_review }];
  }
  receipt.aura = review.aura;
  receipt.visual_requirements = review.visual_requirements;
  receipt.visual_review = { ...review.visual_review, reviewer: review.reviewer };
  receipt.root_visual_review = rootReview;
  if (item.worker === 'root') receipt.independent_visual_review = { ...review.visual_review, reviewer: review.reviewer, reviewed_at: second.reviewed_at };
  receipt.aura_revision = revision;
  receipt.reviewed_at = second.reviewed_at;
  save(receiptPath, receipt);
  const prompts = read('assets/art/verified-prompts.json');
  prompts.prompts[item.slug] = receipt.prompt;
  Object.assign(prompts.specifications[item.slug], { aura: receipt.aura, visual_requirements: receipt.visual_requirements, aura_policy: batch.user_policy.aura, aura_revision: revision, ...(review.decision === 'revise' ? { artistic_changes: receipt.artistic_changes } : {}) });
  save('assets/art/verified-prompts.json', prompts);
  if (review.decision === 'revise') {
    execFileSync('python3', ['scripts/register-artwork.py', item.slug, receipt.original_file, '--reviewed', '--asset-suffix', 'presence', '--skip-historical-batches', '--review-notes', receipt.visual_review.notes], { cwd: root, stdio: 'pipe' });
  }
  const manifest = read('assets/art/verified-manifest.json');
  const art = manifest.artworks[item.slug];
  Object.assign(art, { aura: receipt.aura, visual_requirements: receipt.visual_requirements, visual_review_notes: receipt.visual_review.notes, root_visual_review: rootReview, aura_revision: revision, batch: '797' });
  save('assets/art/verified-manifest.json', manifest);
  const visual = read('data/artwork-visual-review.json');
  visual.reviews[item.slug] = { ...receipt.visual_review, original_file: receipt.original_file, reviewed_at: receipt.reviewed_at, visual_requirements: receipt.visual_requirements, aura: receipt.aura, root_visual_review: rootReview, aura_revision: revision };
  save('data/artwork-visual-review.json', visual);
  Object.assign(item, { original_file: receipt.original_file, prompt: receipt.prompt, aura: receipt.aura, visual_requirements: receipt.visual_requirements, visual_review: receipt.visual_review, root_visual_review: rootReview, aura_revision: revision, url: art.url, width: art.width, height: art.height, sha256: hash(`.${art.url}`) });
  if (item.worker === 'root') item.independent_visual_review = receipt.independent_visual_review;
  ledger.items.push({ slug: item.slug, decision: review.decision, rationale: review.rationale, allowed_magic: review.allowed_magic, source_basis_claim_ids: review.source_basis_claim_ids, prompt: receipt.prompt, aura: receipt.aura, old_original_file: historical.original_file, old_url: historical.registered_url, original_file: receipt.original_file, url: art.url, sha256: item.sha256, review_path: reviewPath, root_review: second });
  ledger.reviewed = ledger.items.length;
  ledger.revised = ledger.items.filter(i => i.decision === 'revise').length;
  ledger.kept = ledger.items.filter(i => i.decision === 'keep').length;
  ledger.status = ledger.reviewed === ledger.target ? 'complete' : 'in-progress';
  Object.assign(batch.aura_revision, { status: ledger.status, reviewed: ledger.reviewed, revised: ledger.revised, kept: ledger.kept });
  save('data/artwork-aura-revision-797.json', ledger);
  save('data/artwork-batch-797.json', batch);
  added++;
  console.log(`${item.slug}: ${review.decision} (${ledger.reviewed}/200 reviewed, ${ledger.revised} revised).`);
}
if (added) execFileSync('node', ['scripts/integrate-artwork-batch.mjs', '797', '--refresh-gallery'], { cwd: root, stdio: 'pipe' });
console.log(JSON.stringify({ added, reviewed: ledger.reviewed, revised: ledger.revised, kept: ledger.kept, status: ledger.status }));
