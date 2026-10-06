#!/usr/bin/env python3
"""Build a labeled inspection contact sheet; originals remain unchanged."""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
folder = ROOT / 'data/artwork-generated/batch-1000'
batch = json.loads((ROOT / 'data/artwork-batch-1000.json').read_text())
receipts = []
for item in batch['items']:
    path = folder / (item['slug'] + '.json')
    if not path.exists():
        continue
    receipt = json.loads(path.read_text())
    if receipt.get('status') != 'reviewed' or receipt.get('visual_review', {}).get('verdict') != 'pass':
        continue
    if receipt.get('root_visual_review', {}).get('verdict') == 'pass':
        continue
    # The creator cannot provide the independent inspection of their own image.
    if receipt.get('visual_review', {}).get('reviewer') == 'root':
        continue
    if not Path(receipt.get('original_file', '')).is_file():
        print(json.dumps({'awaiting_original_copy': item['slug']}))
        continue
    receipts.append(receipt)
    if len(receipts) == 6:
        break
if not receipts:
    print(json.dumps({'pending_review': 0}))
    raise SystemExit()
size = 600
canvas = Image.new('RGB', (size * 3, (size + 38) * ((len(receipts) + 2) // 3)), '#141a19')
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
for i, receipt in enumerate(receipts):
    x, y = (i % 3) * size, (i // 3) * (size + 38)
    with Image.open(receipt['original_file']) as original:
        preview = original.convert('RGB')
        preview.thumbnail((size, size))
        canvas.paste(preview, (x + (size - preview.width) // 2, y + 38))
    draw.text((x + 10, y + 7), receipt['slug'], font=font, fill='white')
destination = ROOT / 'tmp/artwork-review-1000/contact-sheet.jpg'
destination.parent.mkdir(parents=True, exist_ok=True)
canvas.save(destination, quality=94)
report = {'sheet': str(destination), 'items': [{k: r.get(k) for k in ('slug', 'depicted_variant', 'visual_requirements', 'basis_claim_ids', 'aura', 'visual_review', 'original_file', 'native_sha256')} for r in receipts]}
(destination.parent / 'current-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'sheet': report['sheet'], 'items': [{'slug': r['slug'], 'requirements': r.get('visual_requirements'), 'original': r['original_file']} for r in receipts]}, ensure_ascii=False))
