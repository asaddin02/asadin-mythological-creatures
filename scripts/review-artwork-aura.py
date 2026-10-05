#!/usr/bin/env python3
"""Create inspection previews only; leave all artwork originals untouched."""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'data/artwork-generated/aura-revision-797'
OUT = ROOT / 'tmp/artwork-aura-review-797'
OUT.mkdir(parents=True, exist_ok=True)
(BASE / 'root-reviews').mkdir(exist_ok=True)
batch = json.loads((ROOT / 'data/artwork-batch-797.json').read_text())
parser = argparse.ArgumentParser()
parser.add_argument('--reviewer', default='root')
parser.add_argument('--root-generated-only', action='store_true')
args = parser.parse_args()
items = []
for item in batch['items']:
    path = BASE / 'reviews' / f"{item['slug']}.json"
    root_review = BASE / 'root-reviews' / f"{item['slug']}.json"
    if not path.exists() or root_review.exists():
        continue
    review = json.loads(path.read_text())
    if review.get('reviewer') == args.reviewer:
        continue
    if args.root_generated_only and review.get('reviewer') != 'root':
        continue
    if review.get('status') != 'reviewed' or review.get('visual_review', {}).get('verdict') != 'pass':
        continue
    original = review.get('original_file') if review['decision'] == 'revise' else review['old_original_file']
    if not original or not Path(original).is_file():
        continue
    items.append({**review, 'inspection_file': original,
                  'source_requirements': item.get('visual_requirements', []),
                  'depicted_variant': item.get('depicted_variant'),
                  'source_claims': [c for c in item['research']['claims'] if c['id'] in review.get('source_basis_claim_ids', [])]})
    if len(items) == 6:
        break
if not items:
    print(json.dumps({'pending_review': 0}))
    raise SystemExit()
size = 600
canvas = Image.new('RGB', (size * 3, (size + 42) * ((len(items) + 2) // 3)), '#161b19')
draw = ImageDraw.Draw(canvas)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
for i, item in enumerate(items):
    x, y = i % 3 * size, i // 3 * (size + 42)
    with Image.open(item['inspection_file']) as original:
        preview = original.convert('RGB')
        preview.thumbnail((size, size))
        canvas.paste(preview, (x + (size - preview.width) // 2, y + 42))
    draw.text((x + 8, y + 8), f"{item['slug']} [{item['decision']}]", font=font, fill='white')
sheet = OUT / 'contact-sheet.jpg'
canvas.save(sheet, quality=95)
(OUT / 'current-review.json').write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'sheet': str(sheet), 'items': [{'slug': i['slug'], 'decision': i['decision'], 'file': i['inspection_file'], 'rationale': i['rationale'], 'allowed_magic': i.get('allowed_magic'), 'source_claims': i['source_claims']} for i in items]}, ensure_ascii=False))
