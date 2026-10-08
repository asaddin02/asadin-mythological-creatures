import json,pathlib
D=pathlib.Path(__file__).parent
def make(s,name,anatomy,effect,setting,claims,ma,mb,light='one fierce sunset through cloud',choices=None,scale=None):
 req=[dict(kind=k,description=d,claim_ids=[s+'-'+c for c in ids]) for k,d,ids in [('anatomy',anatomy,claims[0]),('effect',effect,claims[1]),('setting',setting,claims[2])]]
 basis=list(dict.fromkeys(c for q in req for c in q['claim_ids']))
 variants={}
 for v,m in [('A',ma),('B',mb)]:
  prompt=f'''ONE original square premium painterly cinematic Mythics illustration of {name}.
ANATOMY: {anatomy} [{', '.join(req[0]['claim_ids'])}]
MOMENT: {m}
POWER: {effect} [{', '.join(req[1]['claim_ids'])}]
SCALE & CAMERA: extreme low camera; {scale or 'tight framing and strong foreshortening; subject fills most of square, no invented giant size'}.
LIGHT & WEATHER: {light}; high contrast rim light and deep shadows.
SURFACE: tangible skin or fur, weathered opaque cloth and stone; dark walnut and antique gold palette with one accent.
SETTING: {setting} [{', '.join(req[2]['claim_ids'])}]
MOOD: overwhelming imposing majesty and determined expression, active awe inspiring presence, never ordinary or decorative; respectful living religious deity if applicable.
HARD CONSTRAINTS: no text anywhere including clothes and stones, NO pseudo glyphs, painted forehead symbols, lettering, signature, logo, border, frame or watermark; no extra heads, limbs or fingers; no film/game/anime/comic design; fully opaque clothing covering the whole torso whenever clothed, no nudity, no explicit gore, no generic glow aura, neon outline, energy ribbons or runes. Entire head and attributes remain in frame. Cloth ornaments only plain weaving or geometric patterns, no writing.'''
  variants[v]=dict(prompt=prompt,depicted_variant=m,composition=m)
 spec=dict(slug=s,basis_claim_ids=basis,visual_requirements=req,aura='Kesan kuasa dari aksi fisik/atribut: '+effect+' ('+', '.join(req[1]['claim_ids'])+'), bukan aura generik.',artistic_choices=['Framing, foreshortening, warna dan pakaian buram adalah pilihan editorial; tidak menambah anatomi atau kekuatan.']+(choices or []),variants=variants)
 (D/f'{s}-spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
