#!/usr/bin/env node
/**
 * Prints the current accepted research of one or more creatures: identity, descriptions, abilities and every
 * claim with its id, so an assessor can cite claim ids.
 *   node scripts/gemini/show-entry.mjs <slug> [<slug> ...]
 */
import { readFile } from 'node:fs/promises';
import { computeFillStatus } from './fill-lib.mjs';

const ROOT = new URL('../../', import.meta.url);
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Pemakaian: node scripts/gemini/show-entry.mjs <slug> [<slug> ...]');
  process.exit(1);
}
const { status, entries } = await computeFillStatus(JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8')));
const en = v => (typeof v === 'string' ? v : v?.en || '');
for (const slug of slugs) {
  const e = entries.get(slug);
  console.log(`\n=== ${slug} (${status[slug]?.status || 'tidak ada di rencana'}, ${status[slug]?.batch || '-'})`);
  if (!e) { console.log('Tidak ada riset yang valid.'); continue; }
  console.log(`${e.identity.canonical_name} | tier ${e.tier} | ${e.classification?.value || '-'} | jenis ${e.jenis?.value || '-'} | ${e.culture?.value || '-'}`);
  console.log(`Ringkas: ${en(e.short_description)}`);
  for (const a of e.abilities || []) console.log(`Kemampuan: ${a.ability_id} — ${en(a.description)} [${(a.claim_ids || []).join(', ')}]`);
  for (const c of e.claims) console.log(`${c.id} (${c.context || '-'}): ${en(c.statement)}`);
}
