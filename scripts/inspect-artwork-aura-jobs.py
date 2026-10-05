#!/usr/bin/env python3
"""Preview up to six assigned originals alongside accepted source statements."""
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
jobs_path = Path(sys.argv[1])
offset = int(sys.argv[2]) if len(sys.argv) > 2 else 0
items = json.loads(jobs_path.read_text())['items'][offset:offset + 6]
size = 600
canvas = Image.new('RGB', (1800, 642 * ((len(items) + 2) // 3)), '#171c19')
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
for n, item in enumerate(items):
    x, y = n % 3 * size, n // 3 * 642
    with Image.open(item['original_file']) as original:
        preview = original.convert('RGB')
        preview.thumbnail((size, size))
        canvas.paste(preview, (x + (size - preview.width) // 2, y + 42))
    draw.text((x + 8, y + 8), item['slug'], fill='white', font=font)
    receipt = json.loads((ROOT / 'data/artwork-generated/batch-797' / f"{item['slug']}.json").read_text())
    print(json.dumps({'slug': item['slug'], 'original': item['original_file'],
                      'variant': item['depicted_variant'], 'requirements': item['visual_requirements'],
                      'claims': [{'id': c['id'], 'en': c['statement'].get('en'), 'quote': c.get('quote')} for c in item['research']['claims'] if c['id'] in receipt['basis_claim_ids']]}, ensure_ascii=False))
out = ROOT / 'tmp/artwork-aura-review-797' / f'{jobs_path.stem}-{offset}.jpg'
out.parent.mkdir(parents=True, exist_ok=True)
canvas.save(out, quality=95)
print(json.dumps({'sheet': str(out)}))
