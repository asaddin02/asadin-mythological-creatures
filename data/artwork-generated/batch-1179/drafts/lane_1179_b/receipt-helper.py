import json, pathlib, sys, shutil, hashlib, datetime
from PIL import Image
ROOT=pathlib.Path('/home/asadin/Projects/asadin-mythological-creatures')
D=ROOT/'data/artwork-generated/batch-1179/drafts/lane_1179_b'
ledger=json.loads((ROOT/'data/artwork-batch-1179.json').read_text())
slug,variant,raw,notes=sys.argv[1:5]
verdict=sys.argv[5] if len(sys.argv)>5 else 'pass'
spec=json.loads((D/f'{slug}-spec.json').read_text())
item=next(i for i in ledger['items'] if i['slug']==slug)
v=spec['variants'][variant]
dest=ROOT/f'data/artwork-generated/batch-1179/variants/{slug}/{variant}.png'
dest.parent.mkdir(parents=True,exist_ok=True)
assert not dest.exists()
shutil.copyfile(raw,dest)
h=hashlib.sha256(dest.read_bytes()).hexdigest()
w,ht=Image.open(dest).size
assert w>=1024 and ht>=1024 and w==ht
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
r=dict(slug=slug,worker='codex',worker_agent='lane_1179_b',subagent_model='gpt-6.1-sol',subagent_reasoning_effort='high',tool='OpenAI built-in image_gen',image_model='tidak dilaporkan alat',status='awaiting-independent-review',review_path=item['review_path'],batch=1179,rationale=ledger['user_policy']['intent'],generated_file=raw,generated_at=now,original_file=str(dest.relative_to(ROOT)),native_sha256=h,width=w,height=ht,prompt=v['prompt'],depicted_variant=v['depicted_variant'],basis_claim_ids=spec['basis_claim_ids'],visual_requirements=spec['visual_requirements'],aura=spec['aura'],artistic_choices=spec['artistic_choices']+[v['composition']],generation_failures=spec.get('generation_failures',[]),rejected_attempts=spec.get('rejected_attempts',[]),visual_review=dict(reviewer='codex',verdict=verdict,notes=notes,limitations=[] if verdict=='pass' else [notes],native_sha256=h,reviewed_at=now),candidate_variant=variant)
dest.with_suffix('.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(str(dest.relative_to(ROOT)),h,w,ht)
