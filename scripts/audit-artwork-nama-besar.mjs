#!/usr/bin/env node
/** Validate the generator handoff; never approve or integrate an illustration. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { root, read, save, validateRevision, revisionPaths } from './artwork-presentation-lib.mjs';
const {values:args}=parseArgs({options:{'require-generated':{type:'boolean',default:false}}});
const ready=read('data/artwork-nama-besar.json');
const readyBySlug=new Map(ready.siap.map(i=>[i.slug,i]));
const waiting=new Set(ready.menunggu.map(i=>i.slug));
const paths=revisionPaths('nama-besar');
const revision=read(paths.ledgerPath);
const batches=[1055,1047].map(n=>({number:n,...read(`data/artwork-batch-${n}.json`)}));
const tasks=[...revision.items.map(i=>({...i,kind:'replacement',receipt_path:i.receipt_path})),
 ...batches.flatMap(b=>b.items.map(i=>({...i,kind:'new',batch:b.number,
  receipt_path:`data/artwork-generated/batch-${b.number}/${i.slug}.json`})) )];
assert.equal(tasks.length,ready.siap.length,'Every ready creature has exactly one selected task');
assert.equal(new Set(tasks.map(i=>i.slug)).size,tasks.length,'No overlapping agent assignments');
assert.deepEqual(tasks.map(i=>i.slug).sort(),[...readyBySlug.keys()].sort());
for(const b of batches) assert.equal(b.user_policy.name,'nama-besar');
assert.equal(revision.user_policy.name,'nama-besar');
const output=[],missing=[],nativeHashes=new Set(),secondReview={reviewed:0,'needs-correction':0};
for(const item of tasks){
 assert(!waiting.has(item.slug),'Never draw a waiting research entry');
 assert.equal(readyBySlug.get(item.slug).status,item.kind==='new'?'lengkap-informasi':'lengkap-bergambar');
 if(!existsSync(resolve(root,item.receipt_path))){missing.push(item.slug);continue;}
 const receipt=read(item.receipt_path);
 assert.equal(receipt.slug,item.slug);
 assert.equal(receipt.tool,'OpenAI built-in image_gen');
 assert.equal(receipt.worker,'codex');
 assert(['awaiting-independent-review','reviewed','needs-correction'].includes(receipt.status),`${item.slug}: unexpected status`);
 if(receipt.status==='awaiting-independent-review') assert(!receipt.root_visual_review && !receipt.independent_visual_review,'Claude must provide the second review');
 else {
  // The second review by Claude: a pass makes the receipt "reviewed", a rejection "needs-correction".
  assert.equal(receipt.root_visual_review?.reviewer,'claude');
  assert.equal(receipt.root_visual_review?.verdict,receipt.status==='reviewed'?'pass':'reject');
  assert(receipt.root_visual_review.notes?.trim());
 }
 for(const field of ['prompt','depicted_variant','aura','review_path']) assert(receipt[field]?.trim(),`${item.slug}: missing ${field}`);
 assert(receipt.visual_requirements?.length && receipt.artistic_choices?.length);
 assert.equal(receipt.visual_review?.reviewer,'codex');
 assert.equal(receipt.visual_review?.verdict,'pass');
 assert(receipt.visual_review.notes?.trim());
 const folder=item.kind==='new'?`data/artwork-generated/batch-${item.batch}/originals`:paths.directory+'/originals';
 const original=resolve(root,receipt.original_file);
 assert(original.startsWith(resolve(root,folder)+'/'),'Selected PNG must be in its workspace originals folder');
 const nativeHash=createHash('sha256').update(readFileSync(original)).digest('hex');
 assert.equal(receipt.native_sha256,nativeHash);
 assert.equal(receipt.visual_review.native_sha256,nativeHash,'Review must inspect the selected bytes');
 assert(!nativeHashes.has(nativeHash),'Every creature needs distinct selected artwork');nativeHashes.add(nativeHash);
 const accepted=read(item.review_path).entries.find(e=>e.slug===item.slug);
 assert.equal(receipt.review_path,item.review_path);
 assert.equal(accepted?.verdict,'lulus-otomatis');
 assert(receipt.basis_claim_ids?.length);
 for(const id of receipt.basis_claim_ids){
  const claim=item.research.claims.find(c=>c.id===id), checked=accepted.claims.find(c=>c.id===id);
  assert(claim && checked,`${item.slug}: unknown/unaccepted claim ${id}`);
  assert.equal(claim.source_id,checked.source_id);
  assert.equal(claim.quote,checked.quote);
  assert.equal(typeof claim.statement==='string'?claim.statement:claim.statement.en,checked.statement);
  assert(item.research.sources.some(s=>s.id===claim.source_id && s.url));
 }
 for(const requirement of receipt.visual_requirements){
  const ids=typeof requirement==='string'
   ? [...requirement.matchAll(/(?:[a-z][a-z0-9-]*-)?c\d+/g)].map(m=>/^c\d+$/.test(m[0])?`${item.slug}-${m[0]}`:m[0])
   : requirement.claim_ids;
  assert(Array.isArray(ids),`${item.slug}: visual requirement lacks claim wiring`);
  for(const id of ids)assert(receipt.basis_claim_ids.includes(id),`${item.slug}: visual requirement cites unselected claim ${id}`);
 }
 if(receipt.status in secondReview)secondReview[receipt.status]++;
 if(item.kind==='replacement'&&receipt.status!=='needs-correction')validateRevision(receipt,item,{revision:'nama-besar',requireIndependent:receipt.status==='reviewed'});
 output.push({slug:item.slug,name:item.canonical_name,kind:item.kind,batch:item.batch,
  receipt:item.receipt_path,original_file:relative(root,original),native_sha256:nativeHash,
  old_url:item.old_artwork?.url,old_webp_sha256:item.old_webp_sha256,
  historical_native_sha256:item.historical_native_sha256,
  aura:receipt.aura,basis_claim_ids:receipt.basis_claim_ids,visual_requirements:receipt.visual_requirements,
  inspected_at:receipt.generated_at||receipt.reviewed_at||receipt.visual_review.reviewed_at||null});
}
if(args['require-generated'])assert.equal(missing.length,0,`Missing generated receipts: ${missing.join(', ')}`);
const rejected=[];
for(const directory of [paths.directory,...batches.map(b=>`data/artwork-generated/batch-${b.number}`)]){
 const folder=resolve(root,directory,'rejected');
 if(!existsSync(folder))continue;
 for(const file of readdirSync(folder,{recursive:true}).filter(f=>f.endsWith('.png'))){
  const original=resolve(folder,file);
  rejected.push({original_file:relative(root,original),native_sha256:createHash('sha256').update(readFileSync(original)).digest('hex')});
 }
}
const decoded=JSON.parse(execFileSync('python3',['-c',
 `import json,sys\nfrom PIL import Image\nitems=json.load(sys.stdin)\nfor i in items:\n with Image.open(i['file']) as im:\n  im.load()\n  assert im.format=='PNG',i['slug']\n  assert im.width==im.height and im.width>=512,i['slug']\nprint(json.dumps({'native_pngs':len(items),'square':True,'minimum_edge':512}))`],
 {input:JSON.stringify([...output,...rejected].map(i=>({slug:i.slug||i.original_file,file:resolve(root,i.original_file)}))),encoding:'utf8'}));
output.sort((a,b)=>(a.inspected_at||'').localeCompare(b.inspected_at||'')||a.slug.localeCompare(b.slug));
const report={status:missing.length?'in-progress':secondReview.reviewed+secondReview['needs-correction']===tasks.length?'second-review-complete':'awaiting-independent-review',target:tasks.length,
 generated:output.length,new_images:output.filter(i=>i.kind==='new').length,
 replacement_images:output.filter(i=>i.kind==='replacement').length,waiting_research_not_drawn:waiting.size,
 source_claim_wiring_checked:true,selected_native_hashes_checked:true,
 second_reviews_performed:secondReview.reviewed+secondReview['needs-correction'],second_review_passed:secondReview.reviewed,second_review_rejected:secondReview['needs-correction'],integration_performed:false,
 decoded:{...decoded,selected_native_pngs:output.length,rejected_native_pngs:rejected.length},missing,
 rejected_attempts_preserved:rejected.length,rejected_attempts:rejected,
 scope:'Source claim wiring, selected bytes and image decoding are technical checks; Claude must independently assess depicted anatomy, semantic source support and visual quality.',
 checked_at:new Date().toISOString(),receipts:output};
save('data/artwork-nama-besar-generation-audit.json',report);
console.log(JSON.stringify({...report,receipts:undefined,rejected_attempts:undefined}));
