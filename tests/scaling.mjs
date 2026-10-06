import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SCALES, ASSESSMENTS, getAssessment, getLevel } from '../js/scaling.js';
import { queryCreatures } from '../js/query-engine.js';
const creatures = JSON.parse(await readFile(new URL('../data/creatures.json', import.meta.url)));
const data = { creatures, regions: [] };
const planned = new Set(Object.keys(JSON.parse(await readFile(new URL('../data/gemini/fill-status.json', import.meta.url))).status));
assert.deepEqual(Object.values(SCALES).map(levels => levels.length), [7, 7, 6]);
for (const [slug, assessment] of Object.entries(ASSESSMENTS)) {
  assert(creatures.some(c => c.slug === slug) || planned.has(slug), `Assessment has an archive entry: ${slug}`);
  for (const axis of Object.keys(SCALES)) {
    if (assessment[axis]) assert(getLevel(axis, assessment[axis]), `Valid ${axis} for ${slug}`);
    assert(assessment.reasons[axis].id && assessment.reasons[axis].en, `Bilingual rationale: ${slug}/${axis}`);
  }
}
const unknown = getAssessment({slug:'unresearched-being', classification:'deity', power_profile:{dimensions:{supernatural:100}}});
assert.equal(unknown.power, null, 'Category and old score must not fabricate a power tier');
assert.equal(unknown.threat, null);
assert.equal(unknown.fear, null);
assert.equal(getAssessment({slug:'banshee'}).threat, null, 'Foretelling death is not causing death');
const worldSerpent = queryCreatures(data, {power:'cosmic', threat:'t6', fear:'f4'});
assert(worldSerpent.creatures.some(c=>c.slug==='jormungandr'), 'Composed tier filters find the world serpent');
assert.equal(queryCreatures(data, {power:'transcendent'}).pagination.total, creatures.filter(c=>getAssessment(c).power==='transcendent').length, 'A tier lists exactly its assessed creatures');
const all = queryCreatures(data, {limit:100}).pagination.total;
const known = creatures.filter(c=>getAssessment(c).power).length;
assert.equal(queryCreatures(data, {power:'unassessed'}).pagination.total, all-known);
const sorted = queryCreatures(data, {sort:'power',limit:100}).creatures;
const rank = c => SCALES.power.findIndex(l=>l.id===getAssessment(c).power);
assert(sorted.every((c,i)=> !i || rank(sorted[i-1])>=rank(c)), 'Sort uses new tiers and puts unknowns last');
assert.equal(queryCreatures(data, {culture:'indonesian-folklore',power:'cosmic'}).pagination.total, creatures.filter(c=>c.culture==='indonesian-folklore'&&getAssessment(c).power==='cosmic').length, 'Filters compose');
console.log('Scaling checks passed: independent axes, bilingual rationale, unknowns, composed filters, empty tiers, ordering.');
