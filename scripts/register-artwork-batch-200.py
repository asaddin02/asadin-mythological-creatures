#!/usr/bin/env python3
"""Attach only individually inspected passing outputs from the 200-image worklist."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FOLDER = ROOT / 'data/artwork-generated/batch-200'

def read(path):
    return json.loads((ROOT / path).read_text())

def write(path, data):
    (ROOT / path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

records = [read('data/artwork-generated/batch-200/adze-folklore.json')]
for lane in ('a', 'b', 'c', 'root'):
    path = FOLDER / f'lane-{lane}.json'
    if not path.exists():
        continue
    data = json.loads(path.read_text())
    entries = data.get('items', data.get('images', data.get('entries', [])))
    records.extend(e for e in entries if e.get('visual_review', {}).get('verdict') == 'pass')

assert len(records) <= 200, 'More than requested target'
assert len({e['slug'] for e in records}) == len(records), 'Duplicate creature'
creatures = read('data/creatures.json')
by_slug = {c['slug']: c for c in creatures}
manifest = read('assets/art/verified-manifest.json')
prompts = read('assets/art/verified-prompts.json')
reviews = read('data/artwork-visual-review.json')
worklist = read('data/artwork-worklist.json')
checks = []
for record in records:
    slug = record['slug']
    creature = by_slug[slug]
    prompt = record.get('prompt') or record.get('exact_prompt')
    assert prompt and record['visual_review']['notes'], slug
    assert any(e['slug'] == slug and e['verdict'] == 'lulus-otomatis' for e in read(record['review_path'])['entries']), slug
    url = record.get('url') or f'/assets/art/{slug}-verified.webp'
    asset = ROOT / url.lstrip('/')
    assert asset.is_file() and Path(record['original_file']).is_file(), slug
    with Image.open(asset) as image:
        image.load()
        width, height = image.size
        assert min(width, height) >= 512, slug
    prior = manifest['artworks'].get(slug)
    assert not prior or prior['original_file'] == record['original_file'], f'Would replace old art: {slug}'
    others = [i for i in creature.get('images', []) if i.get('id') != f'editorial-{slug}']
    assert not others, f'Expected previously unillustrated entry: {slug}'
    name = creature['display_name']
    creature['images'] = [{
        'id': f'editorial-{slug}', 'creature_slug': slug,
        'url': url, 'thumbnail_url': url, 'preview_url': url,
        'caption': {'id': f"{name['id']} — interpretasi artistik AI berdasarkan ciri dalam sumber folklor.",
                    'en': f"{name['en']} — AI artistic interpretation based on features in folklore sources."},
        'source_name': 'OpenAI built-in image_gen', 'source_url': url,
        'author': 'Mythics · OpenAI image generation',
        'license': 'AI-generated editorial illustration; see assets/art/README.md',
        'image_type': 'AI-generated editorial illustration', 'ai_generated': True,
        'is_primary': True, 'width': width, 'height': height,
    }]
    specification = {
        'depicted_variant': record.get('depicted_variant', 'Firefly form only'),
        'basis_review': record['review_path'], 'basis_claims': record.get('basis_claims', []),
    }
    prompts['prompts'][slug] = prompt
    if specification['basis_claims'] or slug not in prompts.get('specifications', {}):
        prompts.setdefault('specifications', {})[slug] = specification
    manifest['artworks'][slug] = {
        'url': url, 'creature_id': creature['id'], 'canonical_name': creature['canonical_name'],
        'prompt': prompt, 'review_path': record['review_path'], 'review_verdict': 'lulus-otomatis',
        'visual_review': 'Individually inspected by agent for described identity and selected folklore variant',
        'visual_review_notes': record['visual_review']['notes'], 'original_file': record['original_file'],
        'width': width, 'height': height, 'depicted_variant': specification['depicted_variant'],
        'visual_basis': record['review_path'],
    }
    reviews['reviews'][slug] = {**record['visual_review'], 'original_file': record['original_file']}
    for item in worklist['items']:
        if item['slug'] == slug:
            item.update(status='complete', url=url, prompt=prompt)
    record.update(prompt=prompt, status='complete', url=url, width=width, height=height)
    checks.append({'slug': slug, 'sha256': hashlib.sha256(asset.read_bytes()).hexdigest(), 'dimensions': [width, height]})

assert len({c['sha256'] for c in checks}) == len(checks), 'Duplicate image bytes'
mapping = {slug: f'/assets/art/{slug}-editorial.webp' for slug in read('assets/art/prompts.json')['prompts']}
mapping.update({slug: art['url'] for slug, art in manifest['artworks'].items()})
for path, data in [('data/creatures.json', creatures), ('assets/art/verified-manifest.json', manifest),
                   ('assets/art/verified-prompts.json', prompts), ('data/artwork-visual-review.json', reviews),
                   ('data/artwork-worklist.json', worklist)]:
    write(path, data)
(ROOT / 'js/editorial-art.js').write_text('// Creature-specific editorial assets; updated by artwork registration scripts.\n'
    + 'export const EDITORIAL_ART = Object.freeze(' + json.dumps(mapping, indent=2) + ');\n')
write('data/artwork-batch-200.json', {
    'target': 200, 'baseline': 118, 'tool': 'OpenAI built-in image_gen',
    'status': 'complete' if len(records) == 200 else 'in-progress',
    'complete': len(records), 'items': records, 'asset_checks': checks,
    'review_scope': 'Agent visual inspection against selected source-backed variant; not expert folklore certification.',
})
print(f'Attached {len(records)}/200 new images; total illustrated creatures: {sum(bool(c["images"]) for c in creatures)}')
