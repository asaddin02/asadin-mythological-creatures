#!/usr/bin/env python3
"""Persist visual decisions and register only individually inspected batch images.

Reads JSON from stdin: {slug: {verdict: 'pass'|'reject', notes: '...'}}.
Uses the most recent corrected generation record when present.
"""
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / 'data/artwork-visual-review.json'
ledger = json.loads(PATH.read_text()) if PATH.exists() else {'tool': 'OpenAI built-in image_gen', 'reviews': {}}
batch_path = ROOT / 'data/artwork-batch-100.json'
decisions = json.load(sys.stdin)
for slug, decision in decisions.items():
    if decision['verdict'] not in ('pass', 'reject') or not decision['notes'].strip():
        raise SystemExit('An explicit verdict and creature-specific review notes are required.')
    generated = ROOT / 'data/artwork-generated' / f'{slug}-corrected.json'
    if not generated.exists():
        generated = ROOT / 'data/artwork-generated' / f'{slug}.json'
    record = json.loads(generated.read_text())
    source = Path(record['original_file'])
    source.resolve(strict=True)
    review = {**decision, 'original_file': str(source), 'reviewed_at': datetime.now(ZoneInfo('Asia/Jakarta')).isoformat()}
    previous = ledger['reviews'].get(slug)
    if previous:
        review['previous_attempts'] = previous.get('previous_attempts', []) + [{k: v for k, v in previous.items() if k != 'previous_attempts'}]
    ledger['reviews'][slug] = review
    if decision['verdict'] == 'pass':
        destination = ROOT / 'assets/art' / f'{slug}-verified.webp'
        if destination.exists():
            manifest_path = ROOT / 'assets/art/verified-manifest.json'
            manifest = json.loads(manifest_path.read_text())
            art = manifest['artworks'][slug]
            if art['original_file'] != str(source):
                raise SystemExit(f'{slug}: existing asset belongs to a different generation; review replacement explicitly.')
            art['visual_review_notes'] = decision['notes']
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
            print(f'{slug}: existing final illustration rechecked.')
        else:
            subprocess.run([sys.executable, str(ROOT / 'scripts/register-artwork.py'), slug, str(source), '--reviewed', '--review-notes', decision['notes']], check=True)
        record['status'] = 'complete'
    else:
        record['status'] = 'rejected-needs-correction'
        batch = json.loads(batch_path.read_text())
        item = next(x for x in batch['items'] if x['slug'] == slug)
        item['status'] = 'needs-correction'
        item['rejection_reason'] = decision['notes']
        batch_path.write_text(json.dumps(batch, ensure_ascii=False, indent=2) + '\n')
    record['visual_review_notes'] = decision['notes']
    generated.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
    PATH.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + '\n')
