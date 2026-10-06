#!/usr/bin/env node
/** Register individually generated, visually audited receipts, serially and resumably. */
import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const batchNumber = process.argv[2] || '267';
if (!/^\d+$/.test(batchNumber)) throw new Error('Use a numeric batch identifier.');
const batchPath = resolve(root, `data/artwork-batch-${batchNumber}.json`);
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const save = (path, value) => {
  const full = resolve(root, path);
  writeFileSync(`${full}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(`${full}.tmp`, full);
};
const batch = read(batchPath);
const exclusions = existsSync(resolve(root, 'data/artwork-exclusions.json')) ? read('data/artwork-exclusions.json').items : {};
const creatures = read('data/creatures.json');
const { status } = await computeFillStatus(creatures);
if (batch.items.length !== batch.target || new Set(batch.items.map(i => i.slug)).size !== batch.target)
  throw new Error('Batch must contain the exact target number of unique characters.');

const hashes = new Map();
for (const [slug, art] of Object.entries(read('assets/art/verified-manifest.json').artworks)) {
  hashes.set(createHash('sha256').update(readFileSync(resolve(root, `.${art.url}`))).digest('hex'), slug);
}
let added = 0;
for (const item of batch.items) {
  if (exclusions[item.slug]) continue;
  if (item.status === 'complete') continue;
  const receiptPath = `data/artwork-generated/batch-${batchNumber}/${item.slug}.json`;
  if (!existsSync(resolve(root, receiptPath))) continue;
  const receipt = read(receiptPath);
  // tidak-digambar: the generator declined because the research documents no depictable form.
  if (['awaiting-visual-review', 'awaiting-independent-review', 'needs-correction', 'tidak-digambar'].includes(receipt.status)) continue;
  if (batch.require_root_visual_review && receipt.root_visual_review?.verdict !== 'pass') continue;
  if (receipt.slug !== item.slug || receipt.worker !== item.worker || receipt.status !== 'reviewed')
    throw new Error(`Receipt identity/status mismatch: ${item.slug}`);
  if (receipt.tool !== batch.tool || receipt.visual_review?.verdict !== 'pass' || !receipt.visual_review.notes)
    throw new Error(`An inspected passing image is required: ${item.slug}`);
  if (!receipt.prompt || !receipt.depicted_variant || !receipt.aura || !receipt.visual_requirements?.length || !receipt.basis_claim_ids?.length)
    throw new Error(`Missing character-specific visual specification: ${item.slug}`);
  if (!['lengkap-informasi', 'lengkap-bergambar'].includes(status[item.slug]?.status))
    throw new Error(`Research must meet its completeness target: ${item.slug}`);
  if (receipt.review_path !== item.review_path) throw new Error(`Wrong source review: ${item.slug}`);
  const review = read(item.review_path).entries.find(e => e.slug === item.slug);
  if (review?.verdict !== 'lulus-otomatis' || review.issues.some(i => i.where === 'tier'))
    throw new Error(`Research review is failing or incomplete: ${item.slug}`);
  const claimIds = new Set(item.research.claims.map(c => c.id));
  if (!receipt.basis_claim_ids.every(id => claimIds.has(id)))
    throw new Error(`Visual basis cites absent claims: ${item.slug}`);
  const source = resolve(receipt.original_file);
  if (!existsSync(source)) throw new Error(`Missing generated original: ${item.slug}`);
  if (batch.presence_policy) {
    const nativeHash = createHash('sha256').update(readFileSync(source)).digest('hex');
    const first = receipt.visual_review;
    const second = receipt.root_visual_review;
    if (!first.reviewer || !second?.reviewer || first.reviewer === second.reviewer)
      throw new Error(`Two distinct visual reviewers required: ${item.slug}`);
    if (receipt.native_sha256 !== nativeHash || second.native_sha256 !== nativeHash)
      throw new Error(`Visual reviews must match the selected native image hash: ${item.slug}`);
  }
  const prompts = read('assets/art/verified-prompts.json');
  prompts.prompts[item.slug] = receipt.prompt;
  (prompts.specifications ||= {})[item.slug] = {
    depicted_variant: receipt.depicted_variant,
    visual_requirements: receipt.visual_requirements,
    aura: receipt.aura,
    basis_review: item.review_path,
    basis_claims: item.research.claims.filter(c => receipt.basis_claim_ids.includes(c.id)),
    ...(receipt.additional_sources ? { additional_sources: receipt.additional_sources } : {}),
  };
  // The original registrar performs image decoding, dimensions, and non-overwrite checks.
  save('assets/art/verified-prompts.json', prompts);
  const manifestBefore = read('assets/art/verified-manifest.json');
  if (!manifestBefore.artworks[item.slug]) {
    execFileSync('python3', ['scripts/register-artwork.py', item.slug, source, '--reviewed', '--skip-historical-batches', '--tool', batch.tool, '--review-notes', receipt.visual_review.notes], { cwd: root, stdio: 'pipe' });
  } else if (manifestBefore.artworks[item.slug].original_file !== source || manifestBefore.artworks[item.slug].prompt !== receipt.prompt) {
    throw new Error(`An existing artwork conflicts with this receipt: ${item.slug}`);
  }
  const manifest = read('assets/art/verified-manifest.json');
  const art = manifest.artworks[item.slug];
  const sha256 = createHash('sha256').update(readFileSync(resolve(root, `.${art.url}`))).digest('hex');
  if (hashes.has(sha256) && hashes.get(sha256) !== item.slug)
    throw new Error(`Different characters cannot share identical artwork: ${item.slug}`);
  hashes.set(sha256, item.slug);
  Object.assign(art, { visual_review_notes: receipt.visual_review.notes, aura: receipt.aura, visual_requirements: receipt.visual_requirements, batch: batchNumber });
  if (receipt.root_visual_review) art.root_visual_review = receipt.root_visual_review;
  save('assets/art/verified-manifest.json', manifest);
  const visual = read('data/artwork-visual-review.json');
  visual.reviews[item.slug] = { ...receipt.visual_review, original_file: source, reviewed_at: receipt.reviewed_at || new Date().toISOString(), visual_requirements: receipt.visual_requirements, aura: receipt.aura, ...(receipt.root_visual_review ? { root_visual_review: receipt.root_visual_review } : {}) };
  save('data/artwork-visual-review.json', visual);
  Object.assign(item, { status: 'complete', url: art.url, original_file: source, prompt: receipt.prompt, depicted_variant: receipt.depicted_variant, visual_requirements: receipt.visual_requirements, basis_claim_ids: receipt.basis_claim_ids, aura: receipt.aura, visual_review: receipt.visual_review, width: art.width, height: art.height, sha256 });
  batch.complete = batch.items.filter(i => i.status === 'complete').length;
  batch.status = batch.complete === batch.target ? 'complete' : 'in-progress';
  // Preserve pending replacements selected while a long image registration was running.
  const latest = read(batchPath);
  for (let n = 0; n < batch.items.length; n++) {
    if (latest.items[n].slug !== batch.items[n].slug) {
      if (latest.items[n].status === 'complete' || batch.items[n].status === 'complete')
        throw new Error('Cannot replace a completed character during registration.');
      batch.items[n] = latest.items[n];
    }
  }
  if (latest.replacements) batch.replacements = latest.replacements;
  save(batchPath, batch);
  added++;
  console.log(`${item.slug}: registered and audited (${batch.complete}/${batch.target}).`);
}
console.log(JSON.stringify({ batch: batchNumber, added, complete: batch.complete, target: batch.target }));
if (added || process.argv.includes('--refresh-gallery') || !existsSync(resolve(root, `docs/artwork-batch-${batchNumber}.html`))) {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const cards = batch.items.map(item => `<article><h2>${escape(item.canonical_name)}</h2>${item.status === 'complete'
    ? `<img loading="lazy" src="..${escape(item.url)}" alt="${escape(item.canonical_name)}"><p>${escape(item.depicted_variant)}</p><p><b>Aura:</b> ${escape(item.aura)}</p><details><summary>Audit ciri dan sumber</summary><ul>${(Array.isArray(item.visual_requirements) ? item.visual_requirements : [item.visual_requirements]).map(v => `<li>${escape(v)}</li>`).join('')}</ul><p>${escape(item.visual_review.notes)}</p><a href="../${escape(item.review_path)}">Review sumber</a><pre>${escape(item.prompt)}</pre></details>`
    : '<div class="pending">Menunggu gambar yang lolos audit</div>'}</article>`).join('');
  writeFileSync(resolve(root, `docs/artwork-batch-${batchNumber}.html`), `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mythics — ${batch.target} ilustrasi tambahan</title><style>body{margin:0;padding:24px;background:#101916;color:#edf3ed;font:16px/1.6 system-ui}h1{margin-top:0}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px}article{background:#1b2822;padding:16px;border-radius:12px}h2{font-size:22px}img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:8px}.pending{aspect-ratio:1;display:grid;place-items:center;background:#26352c;color:#bdc9bc}a{color:#e6b875}pre{white-space:pre-wrap;font:13px/1.6 system-ui}details{border-top:1px solid #435349;padding-top:12px}</style><h1>${batch.target} ilustrasi tambahan Mythics</h1><p>${batch.complete}/${batch.target} lolos audit dan terpasang. Semua karakter dipilih dari entri dengan informasi lengkap. Ilustrasi adalah interpretasi artistik AI berdasarkan sumber riset.</p><main>${cards}</main></html>\n`);
}
