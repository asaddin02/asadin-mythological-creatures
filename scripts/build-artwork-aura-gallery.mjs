#!/usr/bin/env node
/** Local before/after gallery using preserved and active native image files. */
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const docs = resolve(root, 'docs');
const ledger = JSON.parse(readFileSync(resolve(root, 'data/artwork-aura-revision-797.json'), 'utf8'));
const batch = JSON.parse(readFileSync(resolve(root, 'data/artwork-batch-797.json'), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const imagePath = path => escape(relative(docs, resolve(root, path)).split(sep).map(encodeURIComponent).join('/'));
const cards = ledger.items.map(row => {
  const item = batch.items.find(i => i.slug === row.slug);
  const name = item?.canonical_name || row.slug;
  return `<article data-decision="${escape(row.decision)}" data-search="${escape(`${name} ${row.slug}`.toLowerCase())}">
    <h2>${escape(name)} <small>${row.decision === 'revise' ? 'Direvisi' : 'Dipertahankan'}</small></h2>
    <div class="pair"><figure><img loading="lazy" src="${imagePath(row.old_original_file)}" alt="${escape(name)} sebelum pemeriksaan"><figcaption>Sebelum</figcaption></figure><figure><img loading="lazy" src="${imagePath(row.original_file)}" alt="${escape(name)} setelah pemeriksaan"><figcaption>${row.decision === 'revise' ? 'Setelah revisi' : 'Sesuai aturan; tetap digunakan'}</figcaption></figure></div>
    <p>${escape(row.rationale)}</p><p><strong>Kesan tokoh:</strong> ${escape(row.aura)}</p>
    <details><summary>Efek yang diizinkan, prompt, dan dasar sumber</summary><p>${escape(row.allowed_magic)}</p><p>${escape(row.source_basis_claim_ids.join(', '))}</p><pre>${escape(row.prompt)}</pre></details>
  </article>`;
}).join('\n');
const html = `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mythics — Revisi aura 200 gambar</title>
<style>body{margin:0;background:#141a18;color:#eee;font:16px/1.6 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px 20px}h1{line-height:1.2}h2{font-size:21px}small{font-size:13px;color:#b5ccb9;margin-left:12px}nav{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0;position:sticky;top:0;background:#141a18;padding:12px 0;z-index:1}input,select{font:inherit;padding:8px 12px;background:#24312b;color:#eee;border:1px solid #657c6b;border-radius:6px}article{border:1px solid #34463b;border-radius:12px;padding:20px;margin:24px 0}article[hidden]{display:none}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;display:block;aspect-ratio:1;object-fit:contain;background:#0c100e}figcaption{color:#b5ccb9;margin-top:6px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.6 system-ui}summary{cursor:pointer}a{color:#b5dfbb}@media(max-width:640px){main{padding:20px 10px}article{padding:10px}.pair{gap:8px}figcaption{font-size:13px}}</style>
<main><h1>Revisi aura: kesan dari wujud dan suasana</h1><p>${ledger.reviewed}/${ledger.target} gambar diperiksa oleh dua agent. ${ledger.revised} direvisi; ${ledger.kept} dipertahankan.</p><p>Aura muncul melalui pose, ekspresi, skala, komposisi, dan pencahayaan. Efek magis dipakai hanya bila sesuai ciri atau kemampuan yang didukung sumber.</p><p><a href="artwork-batch-797.html">Galeri 200 gambar aktif</a> · <a href="../data/artwork-aura-revision-797.json">Catatan keputusan dan prompt</a></p>
<nav><label>Cari <input id="search" type="search" placeholder="Nama makhluk"></label><label>Tampilkan <select id="filter"><option value="all">Semua</option><option value="revise">Direvisi</option><option value="keep">Dipertahankan</option></select></label><span id="count" aria-live="polite"></span></nav>${cards}</main>
<script>const search=document.querySelector('#search'),filter=document.querySelector('#filter'),cards=[...document.querySelectorAll('article')];function update(){const q=search.value.trim().toLowerCase();let n=0;for(const c of cards){c.hidden=!(c.dataset.search.includes(q)&&(filter.value==='all'||c.dataset.decision===filter.value));if(!c.hidden)n++}document.querySelector('#count').textContent=n+' gambar'}search.addEventListener('input',update);filter.addEventListener('change',update);update();</script></html>`;
const path = resolve(docs, 'artwork-aura-revision-797.html');
writeFileSync(path, html);
console.log(JSON.stringify({ gallery: path, reviewed: ledger.reviewed, revised: ledger.revised, kept: ledger.kept }));
