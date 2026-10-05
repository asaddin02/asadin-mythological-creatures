#!/usr/bin/env python3
"""Register a visually reviewed editorial image against its verified creature slug.

Usage: python3 scripts/register-artwork.py SLUG IMAGE --reviewed [--existing]
New outputs are encoded as WebP; existing artwork is registered without alteration.
"""
import argparse
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def read(path, default=None):
    return json.loads(path.read_text()) if path.exists() else default


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('slug')
parser.add_argument('image', type=Path)
parser.add_argument('--reviewed', action='store_true', required=True)
parser.add_argument('--existing', action='store_true')
parser.add_argument('--review-notes', default='')
parser.add_argument('--asset-suffix', default='verified')
parser.add_argument('--skip-historical-batches', action='store_true')
args = parser.parse_args()
if not re.fullmatch(r'[a-z0-9-]+', args.asset_suffix):
    raise SystemExit('Asset suffix must contain only lowercase letters, numbers and hyphens.')
exclusions = read(ROOT / 'data/artwork-exclusions.json', {'items': {}})
if args.slug in exclusions['items']:
    raise SystemExit('This character was excluded by the owner; do not regenerate or register artwork.')
creatures_path = ROOT / 'data/creatures.json'
creatures = read(creatures_path)
matches = [c for c in creatures if c['slug'] == args.slug]
if len(matches) != 1:
    raise SystemExit('Slug must identify exactly one published creature.')
creature = matches[0]
reviews = []
for path in sorted((ROOT / 'data/gemini/reviews').glob('*.review.json')):
    reviews.extend((path, e) for e in read(path).get('entries', []) if e['slug'] == args.slug)
if not reviews or reviews[-1][1]['verdict'] != 'lulus-otomatis':
    raise SystemExit('Creature must have a passing source verification review.')
review_path, review = reviews[-1]
prompts_path = ROOT / 'assets/art/verified-prompts.json'
prompt_set = read(ROOT / 'assets/art/prompts.json') if args.existing else read(prompts_path)
prompt = prompt_set['prompts'].get(args.slug)
specification = prompt_set.get('specifications', {}).get(args.slug, {})
if not prompt:
    raise SystemExit('An exact creature-specific generation prompt is required.')
source = args.image.resolve(strict=True)
destination = source if args.existing else ROOT / 'assets/art' / f'{args.slug}-{args.asset_suffix}.webp'
if not args.existing:
    version = 2
    while destination.exists():
        destination = ROOT / 'assets/art' / f'{args.slug}-{args.asset_suffix}-v{version}.webp'
        version += 1
if args.existing and source.parent != (ROOT / 'assets/art').resolve():
    raise SystemExit('Existing artwork must already be in assets/art.')
with Image.open(source) as im:
    im.load()
    width, height = im.size
    if min(width, height) < 512:
        raise SystemExit('Image is too small for an encyclopedia illustration.')
    if not args.existing:
        if destination.exists():
            raise SystemExit('Destination already exists; refusing to overwrite artwork.')
        im.convert('RGB').save(destination, 'WEBP', quality=86, method=6)
url = '/' + destination.relative_to(ROOT).as_posix()
image_id = f'editorial-{args.slug}'
others = [i for i in creature.get('images', []) if i.get('id') != image_id]
for image in others:
    image['is_primary'] = False
creature['images'] = [{
    'id': image_id,
    'creature_slug': args.slug,
    'url': url,
    'thumbnail_url': url,
    'preview_url': url,
    'caption': {
        'id': f"{creature['display_name']['id']} — interpretasi artistik AI berdasarkan ciri dalam sumber folklor.",
        'en': f"{creature['display_name']['en']} — AI artistic interpretation based on features in folklore sources.",
    },
    'source_name': 'OpenAI built-in image_gen',
    'source_url': url,
    'author': 'Mythics · OpenAI image generation',
    'license': 'AI-generated editorial illustration; see assets/art/README.md',
    'image_type': 'AI-generated editorial illustration',
    'ai_generated': True,
    'is_primary': True,
    'width': width,
    'height': height,
}] + others
if specification.get('accuracy_mode') == 'authorized-artistic':
    creature['images'][0]['caption'] = {
        'id': f"{creature['display_name']['id']} — interpretasi monster artistik AI; anatomi kreasi, bukan deskripsi harfiah sumber folklor.",
        'en': f"{creature['display_name']['en']} — AI artistic monster interpretation; invented anatomy, not a literal folklore-source depiction.",
    }
    creature['images'][0]['artistic_interpretation'] = True
    creature['images'][0]['artistic_changes'] = specification.get('artistic_changes', [])
manifest_path = ROOT / 'assets/art/verified-manifest.json'
manifest = read(manifest_path, {'tool': 'OpenAI built-in image_gen', 'artworks': {}})
manifest['artworks'][args.slug] = {
    'url': url,
    'creature_id': creature['id'],
    'canonical_name': creature['canonical_name'],
    'prompt': prompt,
    'review_path': review_path.relative_to(ROOT).as_posix(),
    'review_verdict': review['verdict'],
    'visual_review': 'Reviewed for creature identity and the described folklore variant',
    'original_file': str(source),
    'width': width,
    'height': height,
}
if args.review_notes:
    manifest['artworks'][args.slug]['visual_review_notes'] = args.review_notes
if specification:
    manifest['artworks'][args.slug]['depicted_variant'] = specification['depicted_variant']
    manifest['artworks'][args.slug]['visual_basis'] = specification['basis_review']
    for key in ('accuracy_mode', 'nonhuman_features', 'historical_basis', 'artistic_changes', 'additional_sources'):
        if key in specification:
            manifest['artworks'][args.slug][key] = specification[key]
# Keep the browser lookup available for the six existing homepage illustrations.
mapping = {slug: f'/assets/art/{slug}-editorial.webp' for slug in read(ROOT / 'assets/art/prompts.json')['prompts'] if slug not in exclusions['items']}
mapping.update({slug: art['url'] for slug, art in manifest['artworks'].items()})
write(creatures_path, creatures)
write(manifest_path, manifest)
(ROOT / 'js/editorial-art.js').write_text('// Creature-specific editorial assets; updated by scripts/register-artwork.py.\n'
    + 'export const EDITORIAL_ART = Object.freeze(' + json.dumps(mapping, indent=2) + ');\n')
worklist_path = ROOT / 'data/artwork-worklist.json'
worklist = read(worklist_path)
for item in worklist['items']:
    if item['slug'] == args.slug:
        item.update(status='complete', url=url, prompt=prompt)
write(worklist_path, worklist)
batch_path = ROOT / 'data/artwork-batch-100.json'
if batch_path.exists() and not args.skip_historical_batches:
    batch = read(batch_path)
    for item in batch['items']:
        if item['slug'] == args.slug:
            item.update(status='complete', url=url, original_file=str(source), prompt=prompt)
    write(batch_path, batch)
print(f'{args.slug}: registered {url} ({width}×{height}), documentary records retained.')
