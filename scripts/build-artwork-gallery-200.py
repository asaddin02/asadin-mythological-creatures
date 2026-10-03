#!/usr/bin/env python3
"""Build a local review gallery from the current, inspected 200-image batch."""
import html
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
batch = json.loads((root / 'data/artwork-batch-200.json').read_text())
cards = []
for item in sorted(batch['items'], key=lambda i: i['slug']):
    esc = html.escape
    name = esc(item.get('canonical_name', item['slug']))
    url = '..' + item['url']
    notes = esc(item['visual_review']['notes'])
    variant = esc(item.get('depicted_variant', 'Firefly form'))
    prompt = esc(item.get('prompt') or item.get('exact_prompt', ''))
    cards.append(f'<article data-search="{esc(item["slug"])} {name}"><a href="{url}"><img src="{url}" alt="Ilustrasi AI {name}" width="640" height="640" loading="lazy"></a><div><small>AI · ILUSTRASI EDITORIAL</small><h2>{name}</h2><p>{variant}</p><details><summary>Catatan pemeriksaan dan prompt</summary><p>{notes}</p><p class="prompt">{prompt}</p><a href="../{esc(item["review_path"])}">Rujukan riset</a></details></div></article>')
    
page = '''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mythics · 200 gambar baru</title>
<style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#101715;color:#eee9dd;font:16px/1.55 system-ui,sans-serif}header,main{max-width:1500px;margin:auto;padding:28px}h1{font:clamp(30px,5vw,58px) Georgia,serif;margin:0}header p{max-width:75ch;color:#c8c9bd}input{font:inherit;padding:12px 16px;width:min(100%,500px);border:1px solid #65766a;background:#17241f;color:#fff;border-radius:6px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:24px}article{background:#19241f;border:1px solid #34483c;border-radius:9px;overflow:hidden}article img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain}article div{padding:18px}h2{margin:8px 0;font:27px Georgia,serif}small{color:#d8b67e;font-size:11px;letter-spacing:.1em}article p{font-size:14px;color:#cad1c9}summary{cursor:pointer;color:#e2bf8b}a{color:#dfb47f}.prompt{white-space:pre-wrap}article[hidden]{display:none}</style>
<header><small>MYTHICS · KOLEKSI ILUSTRASI</small><h1>200 gambar baru</h1><p>COMPLETE/200 selesai. BASELINE ilustrasi sebelumnya + COMPLETE ilustrasi baru = TOTAL karakter bergambar. Setiap hasil diperiksa oleh agen terhadap ciri dan varian yang dipilih, dengan suasana mencekam yang tetap menjaga identitas karakter. Ini interpretasi artistik AI, bukan gambar dokumenter atau sertifikasi ahli folklor.</p><label for="search">Cari karakter</label><br><input id="search" type="search" placeholder="Nama atau slug karakter…"><p id="count"></p></header><main>CARDS</main>
<script>const input=document.querySelector('#search'),cards=[...document.querySelectorAll('article')],count=document.querySelector('#count');function filter(){let n=0;for(const card of cards){card.hidden=!card.dataset.search.toLowerCase().includes(input.value.toLowerCase());if(!card.hidden)n++;}count.textContent=n+' ilustrasi ditampilkan';}input.addEventListener('input',filter);filter();</script></html>'''
page = page.replace('COMPLETE', str(len(batch['items']))).replace('BASELINE', str(batch['baseline'])).replace('TOTAL', str(batch['baseline'] + len(batch['items']))).replace('CARDS', '\n'.join(cards))
(root / 'docs/artwork-batch-200.html').write_text(page)
print(f'Gallery updated: {len(cards)} inspected illustrations')
