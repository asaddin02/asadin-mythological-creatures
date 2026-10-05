#!/usr/bin/env python3
"""Build the review gallery directly from the saved replacement cohort and receipts."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
batch = json.loads((ROOT / 'data/artwork-regeneration-139.json').read_text())
escape = lambda value: html.escape(str(value), quote=True)
cards = []
for item in batch['items']:
    name = escape(item['canonical_name'])
    reason = escape(item['previous_exclusion']['reason'])
    if item['status'] != 'complete':
        cards.append(f'<article><h2>{name}</h2><p>Menunggu pengganti yang lolos pemeriksaan.</p><details><summary>Alasan penolakan lama</summary><p>{reason}</p></details></article>')
        continue
    receipt = json.loads((ROOT / item['receipt_path']).read_text())
    features = ''.join(f'<li>{escape(f)}</li>' for f in receipt['nonhuman_features'])
    differences = ''.join(f'<li>{escape(f)}</li>' for f in receipt.get('artistic_changes', []))
    mode = 'Interpretasi monster artistik; anatomi kreasi, bukan bentuk harfiah dalam sumber.' if receipt['accuracy_mode'] == 'authorized-artistic' else 'Varian makhluk yang didukung sumber.'
    cards.append(f'''<article><h2>{name}</h2><img loading="lazy" src="..{escape(item['url'])}" alt="{name}">
<p>{escape(receipt['depicted_variant'])}</p><p>{mode}</p><p><b>Aura:</b> {escape(receipt['aura'])}</p>
<ul>{features}</ul><details><summary>Dasar sumber dan audit</summary><p>{escape(receipt['historical_basis'])}</p>
<p>{escape(receipt['visual_review']['notes'])}</p><p>{escape(receipt['root_visual_review']['notes'])}</p>
<p>Alasan penolakan lama: {reason}</p><p>Pilihan artistik:</p><ul>{differences}</ul>
<a href="../{escape(item['receipt_path'])}">Receipt lengkap dan sumber</a><pre>{escape(receipt['prompt'])}</pre></details></article>''')
page = f'''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mythics — Regenerasi 139 ilustrasi</title><style>body{{margin:0;padding:24px;background:#171713;color:#f4ead6;font:16px/1.6 system-ui}}main{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px}}article{{background:#29261f;padding:16px;border-radius:12px}}img{{width:100%;aspect-ratio:1;object-fit:contain}}h2{{font-size:22px}}pre{{white-space:pre-wrap;overflow-wrap:anywhere}}a{{color:#d9b572}}</style>
<h1>Regenerasi 139 ilustrasi</h1><p>{batch['complete']}/{batch['target']} pengganti terpasang setelah dua pemeriksaan visual.</p><main>{''.join(cards)}</main></html>'''
(ROOT / 'docs/artwork-regeneration-139.html').write_text(page)
print(f"Gallery: {batch['complete']}/{batch['target']} approved replacements")
