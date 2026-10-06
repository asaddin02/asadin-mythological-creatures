/** Build a searchable before/after gallery from the revision decisions. */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, read, revisionArgs } from './artwork-presentation-lib.mjs';
const { ledgerPath, galleryPath } = revisionArgs();
const ledger = read(ledgerPath);
const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const image = url => `..${escape(url)}`;
const choices = item => {
  const value = read(item.receipt_path).artistic_choices;
  return (Array.isArray(value) ? value : [value]).map(r => `<li>${escape(r)}</li>`).join('');
};
const evidence = item => item.research.claims.filter(c => item.basis_claim_ids.includes(c.id)).map(claim => {
  const source = item.research.sources.find(s => s.id === claim.source_id);
  const statement = typeof claim.statement === 'string' ? claim.statement : claim.statement.id || claim.statement.en;
  const citation = source && /^https?:\/\//.test(source.url)
    ? ` <a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} (${escape(source.language)})</a>` : '';
  return `<li>${escape(statement)}${citation}</li>`;
}).join('');
const cards = ledger.items.map(item => `<article data-status="${escape(item.status)}" data-search="${escape(`${item.canonical_name} ${item.slug}`.toLowerCase())}">
<h2>${escape(item.canonical_name)}</h2><div class="pair"><figure><img loading="lazy" src="${image(item.old_artwork.url)}" alt="${escape(item.canonical_name)} sebelum revisi"><figcaption>Sebelum</figcaption></figure><figure>${item.status === 'complete' ? `<img loading="lazy" src="${image(item.url)}" alt="${escape(item.canonical_name)} setelah revisi">` : '<div class="pending">Menunggu revisi yang lolos pemeriksaan</div>'}<figcaption>Setelah</figcaption></figure></div>
<p>${escape(item.rationale)}</p>${item.status === 'complete' ? `<p>${escape(item.depicted_variant)}</p><details><summary>Dasar sumber dan prompt</summary><p>${escape(item.basis_claim_ids.join(', '))}</p><ul>${evidence(item)}</ul><p>Pilihan artistik:</p><ul>${choices(item)}</ul><p>${escape(item.visual_review.notes)}</p><pre>${escape(item.prompt)}</pre></details>` : ''}</article>`).join('\n');
writeFileSync(resolve(root, galleryPath), `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mythics — Revisi penggambaran mitologis</title>
<style>body{margin:0;background:#141a18;color:#eef3ec;font:16px/1.6 system-ui}main{max-width:1200px;margin:auto;padding:30px 20px}h1{line-height:1.2}h2{font-size:22px}article{border:1px solid #405247;border-radius:12px;padding:20px;margin:24px 0}article[hidden]{display:none}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img,.pending{width:100%;aspect-ratio:1;object-fit:contain;background:#0c100e;display:block}.pending{display:grid;place-items:center;text-align:center}figcaption{color:#b8cdbc;margin-top:6px}nav{display:flex;gap:12px;flex-wrap:wrap;position:sticky;top:0;background:#141a18;padding:12px 0;z-index:1}input,select{max-width:100%;box-sizing:border-box;font:inherit;color:inherit;background:#24312b;padding:8px;border:1px solid #6d8473;border-radius:6px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.6 system-ui}a{color:#b4dfbb}summary{cursor:pointer}@media(max-width:640px){main{padding:20px 10px}article{padding:10px}.pair{gap:8px}}</style>
<main><h1>Penggambaran mitologis yang mengikuti sumber</h1><p>${ledger.complete}/${ledger.target} revisi selesai. Jumlah ilustrasi aktif tetap ${ledger.baseline.length}.</p><p>Varian, peristiwa, skala, dan peran yang tercatat dalam riset memperjelas identitas makhluk. Pakaian serta komposisi artistik dibedakan dari ciri yang didukung sumber.</p><p><a href="../${ledgerPath}">Catatan keputusan, sumber, dan prompt</a></p><nav><label>Cari <input id="search" type="search" placeholder="Nama makhluk"></label><label>Status <select id="filter"><option value="all">Semua</option><option value="complete">Selesai</option><option value="pending">Menunggu</option></select></label><span id="count" aria-live="polite"></span></nav>${cards}</main>
<script>const q=document.querySelector('#search'),f=document.querySelector('#filter'),cards=[...document.querySelectorAll('article')];function update(){let n=0;for(const c of cards){c.hidden=!(c.dataset.search.includes(q.value.trim().toLowerCase())&&(f.value==='all'||c.dataset.status===f.value));if(!c.hidden)n++}document.querySelector('#count').textContent=n+' makhluk'}q.addEventListener('input',update);f.addEventListener('change',update);update()</script></html>\n`);
console.log(JSON.stringify({ gallery: galleryPath, complete: ledger.complete, target: ledger.target }));
