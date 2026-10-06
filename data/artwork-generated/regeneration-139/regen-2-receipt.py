import json, sys, datetime, pathlib
base=pathlib.Path(__file__).parent
root=base.parents[2]
slug, notes=sys.argv[1:3]
job=next(j for j in json.load(open(base/'regen-2-current-jobs.json')) if j['slug']==slug)
item=next(j for j in json.load(open(root/'data/artwork-regeneration-139.json'))['items'] if j['slug']==slug)
claims=[c for c in item['research']['claims'] if c['id'] in job['basis_claim_ids']]
receipt={**job, 'worker':'regen-2', 'review_path':item['review_path'], 'original_file':str(base/'originals'/f'{slug}.png'), 'visual_requirements':[job['depicted_variant'], 'Coherent source-supported anatomy and identifying features', 'No invented animal/monster additions or text'], 'historical_basis':' '.join(c['statement']['en'] for c in claims), 'source_references':item['research']['sources'], 'accuracy_mode':'source-supported', 'invented_anatomy':[], 'artistic_changes':['Exact facial likeness, clothing folds, compositional details and painterly lighting are illustrative; no anatomical deformation asserted beyond selected documented account.'], 'visual_review':{'verdict':'pass','notes':notes}, 'tool':'OpenAI built-in image_gen', 'status':'reviewed', 'reviewed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
target=base/f'{slug}.json'
if target.exists():raise SystemExit('Active receipt exists; preserve superseded receipt first')
if not pathlib.Path(receipt['original_file']).exists():raise SystemExit('Missing original PNG')
target.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(slug+' reviewed '+str(target))
