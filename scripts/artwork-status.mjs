#!/usr/bin/env node
/**
 * Status ilustrasi Mythics, dibangun dari berkas nyata (ledger, receipt, fill status), bukan dari ingatan sesi.
 * Dipakai di awal setiap sesi Codex (ilustrator) dan Claude (peninjau) supaya konteks tidak hilang.
 *
 *   node scripts/artwork-status.mjs            ringkasan, antrean, batch terbuka, receipt bermasalah, jurnal, saran
 *   node scripts/artwork-status.mjs --semua    cetak semua slug antrean, bukan hanya awalnya
 *   node scripts/artwork-status.mjs --json     keluaran mesin (untuk Claude atau skrip lain)
 *
 * Tidak menulis apa pun. Nama besar dihitung dari data/artwork-nama-besar.json (siap + menunggu) ditambah
 * sitelinks worklist, tanpa menjalankan ulang scripts/nama-besar.mjs, karena audit nama besar bergantung
 * pada daftar `siap` yang lama.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const { values: args } = parseArgs({ options: { json: { type: 'boolean', default: false }, semua: { type: 'boolean', default: false } } });
const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const now = `${new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)} WIB`;

const creatures = await read('data/creatures.json');
const { status, entries, counts } = await computeFillStatus(creatures);
const manifest = (await read('assets/art/verified-manifest.json')).artworks;
const exclusions = existsSync(resolve(root, 'data/artwork-exclusions.json')) ? (await read('data/artwork-exclusions.json')).items : {};
const namaBesar = await read('data/artwork-nama-besar.json');
const named = new Set([...namaBesar.siap, ...namaBesar.menunggu].map(i => i.slug));
const worklist = (await read('data/gemini/worklist.json')).items;
const sitelinks = new Map(worklist.map(i => [i.slug, i.sitelinks || 0]));
const names = new Map(worklist.map(i => [i.slug, i.canonical_name]));
const minSitelinks = namaBesar.min_sitelinks || 40;
const isBig = slug => named.has(slug) || (sitelinks.get(slug) || 0) >= minSitelinks;
const nameOf = slug => entries.get(slug)?.identity?.canonical_name || names.get(slug) || slug;

// Antrean gambar baru: entri lengkap dan valid tanpa ilustrasi editorial dan tanpa pengecualian permanen.
const ready = Object.entries(status)
  .filter(([slug, v]) => v.status === 'lengkap-informasi' && !manifest[slug] && !exclusions[slug])
  .map(([slug]) => slug);
const big = ready.filter(isBig).sort((a, b) => (sitelinks.get(b) || 0) - (sitelinks.get(a) || 0) || a.localeCompare(b, 'en'));
const others = ready.filter(slug => !isBig(slug)).sort((a, b) => a.localeCompare(b, 'en'));
const held = Object.entries(status).filter(([, v]) => v.gambar_ditahan).map(([slug]) => slug);

// Receipt yang menunggu tinjauan Claude harus lengkap dan terikat ke berkas PNG-nya; kalau tidak, Codex memperbaikinya dulu.
function checkReceipt(receipt, item, originalsDir, tool, strictRequirements) {
  const problems = [];
  if (receipt.slug !== item.slug) problems.push(`slug receipt ${receipt.slug} bukan ${item.slug}`);
  if (tool && receipt.tool !== tool) problems.push(`tool "${receipt.tool}" bukan "${tool}"`);
  for (const key of ['prompt', 'depicted_variant', 'aura', 'review_path']) if (!String(receipt[key] || '').trim()) problems.push(`${key} kosong`);
  if (!receipt.visual_requirements?.length) problems.push('visual_requirements kosong');
  if (!receipt.artistic_choices?.length) problems.push('artistic_choices kosong');
  if (!receipt.basis_claim_ids?.length) problems.push('basis_claim_ids kosong');
  const expectedReview = item.review_path || item.old_artwork?.review_path;
  if (expectedReview && receipt.review_path !== expectedReview) problems.push(`review_path bukan ${expectedReview}`);
  const claimIds = new Set((item.research?.claims || []).map(c => c.id));
  if (claimIds.size) for (const id of receipt.basis_claim_ids || []) if (!claimIds.has(id)) problems.push(`klaim ${id} tidak ada di riset`);
  for (const requirement of receipt.visual_requirements || []) {
    if (typeof requirement === 'string') continue;
    if (strictRequirements && !['anatomy', 'effect', 'setting'].includes(requirement.kind)) problems.push(`visual_requirements.kind "${requirement.kind}" tidak dikenal`);
    if (!String(requirement.description || '').trim()) problems.push('visual_requirements tanpa description');
    if (!requirement.claim_ids?.length) problems.push(`visual_requirements "${requirement.description || '?'}" tanpa claim_ids`);
    for (const id of requirement.claim_ids || []) if (!receipt.basis_claim_ids?.includes(id)) problems.push(`visual_requirements memakai ${id} yang tidak ada di basis_claim_ids`);
  }
  const review = receipt.visual_review || {};
  if (review.verdict !== 'pass') problems.push('visual_review.verdict bukan pass');
  if (!review.reviewer) problems.push('visual_review.reviewer kosong');
  if (!String(review.notes || '').trim()) problems.push('visual_review.notes kosong');
  if (receipt.root_visual_review || receipt.independent_visual_review) problems.push('root_visual_review lama masih ada; hapus setelah gambar diganti');
  if (receipt.correction_notes) problems.push('correction_notes lama masih ada; pindahkan ke rejected_attempts');
  const original = receipt.original_file ? resolve(root, receipt.original_file) : null;
  if (!original) problems.push('original_file kosong');
  else if (!original.startsWith(resolve(root, originalsDir) + '/')) problems.push(`original_file di luar ${originalsDir}/`);
  else if (!existsSync(original)) problems.push(`PNG tidak ada: ${receipt.original_file}`);
  else {
    const hash = sha256(original);
    if (receipt.native_sha256 !== hash) problems.push('native_sha256 tidak sama dengan PNG');
    if (review.native_sha256 !== hash) problems.push('visual_review.native_sha256 tidak sama dengan PNG');
  }
  return problems;
}

const open = [];
const dataFiles = await readdir(resolve(root, 'data'));
// Item ledger yang sudah tertutup: terpasang, dikecualikan (manusia biasa pada batch lama), atau ditolak digambar.
const closed = item => item.status === 'complete' || /^excluded/.test(item.status || '') || item.status === 'tidak-digambar' || Boolean(exclusions[item.slug]);
const ledgers = dataFiles
  .map(n => n.match(/^artwork-batch-(\d+)\.json$/) ? { file: n, kind: 'batch', id: RegExp.$1, dir: `data/artwork-generated/batch-${RegExp.$1}` }
    : n.match(/^artwork-presentation-revision-([a-z0-9]+(?:-[a-z0-9]+)*)\.json$/) && !n.endsWith('-audit.json') ? { file: n, kind: 'revisi', id: RegExp.$1, dir: `data/artwork-generated/presentation-revision-${RegExp.$1}` }
    : null)
  .filter(Boolean)
  .sort((a, b) => a.file.localeCompare(b.file, 'en', { numeric: true }));
for (const ledger of ledgers) {
  const data = await read(`data/${ledger.file}`);
  const items = data.items || [];
  const summary = { ledger: ledger.file, kind: ledger.kind, id: ledger.id, policy: data.user_policy?.name || 'rumah', tool: data.tool, target: items.length, complete: 0, pending: [], awaiting: [], corrections: [], reviewed: [], declined: [], invalid: [] };
  for (const item of items) {
    if (closed(item)) { summary.complete++; continue; }
    const receiptPath = `${ledger.dir}/${item.slug}.json`;
    if (!existsSync(resolve(root, receiptPath))) { summary.pending.push(item.slug); continue; }
    const receipt = JSON.parse(readFileSync(resolve(root, receiptPath), 'utf8'));
    switch (receipt.status) {
      case 'awaiting-independent-review': {
        // Sudah lolos tinjauan Claude tetapi belum terintegrasi (misalnya menunggu catatan katalog): urusan Claude.
        if (receipt.root_visual_review?.verdict === 'pass') { summary.reviewed.push(item.slug); break; }
        summary.awaiting.push(item.slug);
        const problems = checkReceipt(receipt, item, `${ledger.dir}/originals`, data.tool, Boolean(data.user_policy?.name));
        if (problems.length) summary.invalid.push({ slug: item.slug, receipt: receiptPath, problems });
        break;
      }
      case 'needs-correction':
        summary.corrections.push({ slug: item.slug, receipt: receiptPath, notes: receipt.correction_notes || receipt.root_visual_review?.notes || '' });
        break;
      case 'reviewed': summary.reviewed.push(item.slug); break;
      case 'tidak-digambar': summary.declined.push(item.slug); break;
      default: summary.pending.push(item.slug);
    }
  }
  if (summary.complete < summary.target) open.push(summary);
}

let journal = null;
const journalPath = resolve(root, 'docs/codex/JURNAL-GAMBAR.md');
if (existsSync(journalPath)) {
  const sections = readFileSync(journalPath, 'utf8').split(/\n(?=## )/).filter(s => s.startsWith('## '));
  if (sections.length) journal = { entries: sections.length, last: sections.at(-1).trim() };
}

const corrections = open.flatMap(o => o.corrections.map(c => ({ ...c, ledger: o.ledger })));
const awaiting = open.flatMap(o => o.awaiting.map(slug => ({ slug, ledger: o.ledger })));
const invalid = open.flatMap(o => o.invalid.map(i => ({ ...i, ledger: o.ledger })));
const unfinished = open.filter(o => o.pending.length);
const prepare = extra => `node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --policy sangar ${extra}`;
const suggestions = [];
if (invalid.length) suggestions.push(`Perbaiki ${invalid.length} receipt yang tidak valid (daftar di atas) sebelum membuat gambar baru.`);
for (const o of unfinished) suggestions.push(`Lanjutkan ${o.ledger}: ${o.pending.length} makhluk belum punya receipt (${o.pending.slice(0, 8).join(', ')}${o.pending.length > 8 ? ', …' : ''}).`);
if (corrections.length) suggestions.push(`Buat ulang ${corrections.length} gambar berstatus needs-correction; alasan penolakan Claude ada di receipt (correction_notes).`);
if (big.length) suggestions.push(`Siapkan batch nama besar: ${prepare(`--slugs ${big.slice(0, 50).join(',')}`)}`);
else if (others.length) suggestions.push(`Siapkan batch berikutnya: ${prepare('--limit 50')}`);
if (awaiting.length) suggestions.push(`${awaiting.length} receipt menunggu tinjauan Claude; itu bukan tugas Codex.`);
if (!suggestions.length) suggestions.push('Tidak ada antrean gambar. Semua entri lengkap sudah berilustrasi.');

const report = { computed_at: now, counts, active_artwork: Object.keys(manifest).length, excluded: Object.keys(exclusions).length, ready: { total: ready.length, big: big.map(slug => ({ slug, name: nameOf(slug), sitelinks: sitelinks.get(slug) || 0 })), others }, held, open, corrections, awaiting, invalid, journal, suggestions };
if (args.json) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }

const list = (slugs, max) => (args.semua || slugs.length <= max ? slugs : [...slugs.slice(0, max), `… (${slugs.length - max} lagi, pakai --semua)`]).join(', ');
console.log(`Status ilustrasi Mythics — ${now}`);
console.log(`Ilustrasi aktif terpasang: ${report.active_artwork}. Lengkap-bergambar ${counts['lengkap-bergambar']}, lengkap-informasi ${counts['lengkap-informasi']}, tidak-lengkap ${counts['tidak-lengkap']}, belum-ada-entri ${counts['belum-ada-entri']}.`);
console.log(`Dikecualikan permanen: ${report.excluded}. Gambar ditahan (entri belum lengkap): ${held.length}${held.length ? ` (${held.join(', ')})` : ''}.`);
console.log('');
console.log('Antrean Codex, urut prioritas:');
console.log(`  1. Perbaikan (needs-correction): ${corrections.length}`);
for (const o of open.filter(o => o.corrections.length)) {
  console.log(`     ${o.ledger} (${o.corrections.length}, gaya ${o.policy}):`);
  for (const c of o.corrections) console.log(`       - ${c.slug}: ${c.notes || '(tanpa catatan)'}`);
}
console.log(`  2. Nama besar baru (lengkap, belum berilustrasi): ${big.length}`);
if (big.length) console.log(`     ${list(big.map(slug => `${slug} (${sitelinks.get(slug) || 0})`), 30)}`);
console.log(`  3. Entri lengkap lainnya: ${others.length}`);
if (others.length) console.log(`     ${list(others, 20)}`);
console.log('');
console.log(`Batch terbuka (belum semua terpasang): ${open.length}`);
for (const o of open) {
  const parts = [`${o.complete}/${o.target} terpasang`];
  if (o.pending.length) parts.push(`${o.pending.length} belum ada receipt`);
  if (o.awaiting.length) parts.push(`${o.awaiting.length} menunggu tinjauan Claude`);
  if (o.corrections.length) parts.push(`${o.corrections.length} needs-correction`);
  if (o.reviewed.length) parts.push(`${o.reviewed.length} lolos, tinggal integrasi`);
  if (o.declined.length) parts.push(`${o.declined.length} tidak-digambar`);
  if (o.invalid.length) parts.push(`${o.invalid.length} receipt tidak valid`);
  console.log(`  ${o.ledger} [gaya ${o.policy}]: ${parts.join('; ')}`);
  if (o.pending.length) console.log(`     belum ada receipt: ${list(o.pending, 15)}`);
}
if (invalid.length) {
  console.log('');
  console.log('Receipt menunggu tinjauan yang TIDAK valid (perbaiki dulu):');
  for (const i of invalid) console.log(`  ${i.receipt}: ${i.problems.join('; ')}`);
}
console.log('');
if (journal) {
  console.log(`Jurnal (${journal.entries} entri). Entri terakhir:`);
  for (const line of journal.last.split('\n').slice(0, 14)) console.log(`  ${line}`);
  if (journal.last.split('\n').length > 14) console.log('  … (lihat docs/codex/JURNAL-GAMBAR.md)');
} else console.log('Jurnal docs/codex/JURNAL-GAMBAR.md belum ada entri.');
console.log('');
console.log('Saran langkah berikutnya:');
suggestions.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
