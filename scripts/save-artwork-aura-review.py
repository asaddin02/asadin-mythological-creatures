#!/usr/bin/env python3
"""Save a completed visual inspection and copy native tool output without editing pixels."""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'data/artwork-generated/aura-revision-797'
record = json.loads(sys.argv[1])
slug = record['slug']
item = next(i for i in json.loads((ROOT / 'data/artwork-batch-797.json').read_text())['items'] if i['slug'] == slug)
receipt = json.loads((ROOT / 'data/artwork-generated/batch-797' / f'{slug}.json').read_text())
record.setdefault('old_original_file', item['original_file'])
record.setdefault('source_basis_claim_ids', receipt['basis_claim_ids'])
record.setdefault('status', 'reviewed')
assert record['decision'] in ('keep', 'revise')
assert record['visual_review']['verdict'] == 'pass'
assert record['visual_requirements'] and record['rationale'] and record['aura']
if record['decision'] == 'revise':
    source = Path(record['native_tool_file'])
    destination = BASE / 'originals' / f'{slug}.png'
    assert source.is_file()
    assert not destination.exists(), 'Use a versioned artifact for another attempt.'
    shutil.copy2(source, destination)
    record['original_file'] = str(destination.resolve())
    record['tool'] = 'OpenAI built-in image_gen'
path = BASE / 'reviews' / f'{slug}.json'
assert not path.exists(), 'Existing review must be explicitly corrected, not silently overwritten.'
path.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'slug': slug, 'decision': record['decision'], 'review': str(path)}))
