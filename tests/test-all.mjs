/**
 * Mythics Automated Test Suite
 * Tests power profiling, database querying, search indexing,
 * API routes, and ingestion heuristics.
 */

import assert from 'node:assert/strict';
import { calculatePowerProfile } from '../server/power-engine.mjs';
import { initDb, queryCreatures, getCreatureBySlug, getRandomCreature, compareCreatures, getCultures } from '../server/db.mjs';
import { extractTraitsAndAbilities, calculateCompleteness, calculateConfidence } from '../server/ingestion.mjs';

async function runTests() {
  console.log('🧪 RUNNING MYTHICS TEST SUITE...\n');

  // 1. Power Profile Engine
  console.log('1. Testing Power Profile Calculation...');
  const sampleCreature = {
    canonical_name: 'Test Dragon',
    classification: 'dragon',
    traits: ['flight', 'supernatural-strength', 'colossal size'],
    documented_abilities: [
      { name: 'Fire Breath', description: 'Breathes searing flames that incinerate mountains.' }
    ],
    short_description: { en: 'A colossal flying serpent of immense strength.' }
  };

  const power = calculatePowerProfile(sampleCreature);
  assert(power.dimensions.physical > 40, 'Dragon should possess high physical power');
  assert(power.dimensions.mobility > 40, 'Flying creature should have elevated mobility');
  assert(power.disclaimer.id && power.disclaimer.en, 'Power profile must have bilingual editorial disclaimers');
  assert(power.calculated_basis.length > 0, 'Must provide deterministic explanation triggers');
  console.log('  ✓ Power Profile Engine passed');

  // 2. Database & Search Engine
  console.log('2. Testing Database Initializer & Search Index...');
  await initDb();

  // Test full-text search
  const pocongResult = queryCreatures({ q: 'pocong' });
  assert(pocongResult.creatures.length > 0, 'Search for "pocong" must return matches');
  assert.equal(pocongResult.creatures[0].id, 'pocong');

  // Test diacritic-insensitive search (Jormungandr matching Jörmungandr)
  const jormunResult = queryCreatures({ q: 'jormungandr' });
  assert(jormunResult.creatures.length > 0, 'Normalized search for "jormungandr" must match "Jörmungandr"');

  // Test culture filter
  const indoResult = queryCreatures({ culture: 'indonesian-folklore' });
  assert(indoResult.creatures.length >= 5, 'Indonesian folklore must contain rich entries');
  for (const c of indoResult.creatures) {
    assert.equal(c.culture, 'indonesian-folklore');
  }

  // Test slug retrieval & related beings resolution
  const garuda = getCreatureBySlug('garuda');
  assert(garuda, 'Must retrieve Garuda by slug');
  assert(garuda.resolved_related && garuda.resolved_related.length > 0, 'Must resolve related creatures');

  // Test random encounter
  const randomC = getRandomCreature();
  assert(randomC, 'Random encounter should return a creature');

  // Test comparison mode
  const comp = compareCreatures('garuda', 'minotaur');
  assert(comp, 'Comparison must succeed for Garuda vs Minotaur');
  assert.equal(comp.comparisonMatrix.length, 6, 'Comparison matrix must have 6 dimensions');
  const regionalById = queryCreatures({ region: 'southeast-asia' });
  const regionalByIndonesianName = queryCreatures({ region: 'Asia Tenggara' });
  assert(regionalById.pagination.total >= 8, 'Atlas region ID should include all Indonesian records');
  assert.deepEqual(regionalById.creatures.map(c => c.slug), regionalByIndonesianName.creatures.map(c => c.slug), 'Localized region names and IDs must resolve consistently');
  assert(queryCreatures({ region: 'europe' }).creatures.some(c => c.slug === 'fenrir'), 'Macro-region should include its constituent cultures');
  console.log('  ✓ Database & Query Engine passed');

  // 3. Ingestion & Quality Heuristics
  console.log('3. Testing Ingestion Heuristics & Extraction...');
  const textCorpus = 'A nocturnal spirit of the graveyard, possessing immense supernatural strength and curses.';
  const extracted = extractTraitsAndAbilities(textCorpus);
  assert(extracted.traits.includes('nocturnal'), 'Should detect nocturnal trait');
  assert(extracted.traits.includes('curses'), 'Should detect curses trait');
  assert(extracted.traits.includes('supernatural-strength'), 'Should detect supernatural strength');

  const completeness = calculateCompleteness(garuda);
  assert(completeness >= 90, 'Rich creature should score high completeness');

  const confidence = calculateConfidence(garuda);
  assert.equal(confidence, 'High', 'Creature with verified multiple sources must have High confidence');
  console.log('  ✓ Ingestion Heuristics passed');

  // 4. Schema Enrichment, Multi-Tier & Semantic Relationship Graph
  console.log('4. Testing Schema Enrichment & Relationship Graph...');
  const pocong = getCreatureBySlug('pocong');
  assert.equal(pocong.content_tier, 'archive', 'Pocong should be classified in archive tier');
  assert(pocong.etymology && pocong.etymology.original_form, 'Must contain etymological data');
  assert(pocong.ability_matrix && pocong.ability_matrix.length >= 8, 'Must construct comprehensive ability matrix');
  assert(pocong.historical_timeline && pocong.historical_timeline.length > 0, 'Must have historical timeline');
  assert(pocong.pop_culture_contrast && pocong.pop_culture_contrast.major_differences.length > 0, 'Must document pop culture contrast');
  assert(pocong.claims_provenance && pocong.claims_provenance.length > 0, 'Must have claim-level provenance');

  const { getRelationshipGraph, getRegions, getRegionById, getCultureById } = await import('../server/db.mjs');
  const graph = getRelationshipGraph('pocong');
  assert(graph && graph.nodes.length >= 2, 'Pocong must have semantic graph nodes');
  assert(graph.edges.length >= 1, 'Pocong must have semantic graph edges');

  const regions = getRegions();
  assert(regions.length >= 8, 'Must return 8 macro-regions of the world');
  const seAsia = getRegionById('southeast-asia');
  assert(seAsia && seAsia.creatures.length >= 5, 'Southeast Asia must contain regional beings');

  const indoCult = getCultureById('indonesian-folklore');
  assert(indoCult && indoCult.creatures.length >= 8, 'Indonesian folklore must contain registered entities');
  console.log('  ✓ Multi-Tier Schema & Relationship Graph passed');

  const { lessons } = await import('../js/learning-content.js');
  const { readFile } = await import('node:fs/promises');
  const records = JSON.parse(await readFile(new URL('../data/creatures.json', import.meta.url), 'utf8'));
  for (const lesson of lessons) {
    for (const slug of lesson.creatures) assert(getCreatureBySlug(slug), `Learning link must resolve: ${slug}`);
    assert(lesson.quiz.options[lesson.quiz.answer], 'Quiz answer must reference an option');
    assert(lesson.sections.every(s => s.text.id && s.text.en), 'Lesson sections must support both languages');
  }
  for (const record of records) {
    assert(record.learning_notes?.context.id && record.learning_notes?.context.en, 'Each creature needs a bilingual reading guide');
    for (const img of record.images) {
      if (img.url.startsWith('/assets/')) await readFile(new URL('..' + img.url, import.meta.url));
    }
  }
  const imported = records.filter(c => c.import_method === 'wikipedia-category-library');
  if (imported.length) {
    const { getCreatureIndex, getLibraryStats } = await import('../server/db.mjs');
    assert(imported.length >= 1000, 'Expanded library must contain at least 1000 source introductions');
    assert.equal(new Set(imported.map(c => c.source_identity)).size, imported.length, 'Source identities must be unique');
    assert.equal(getCreatureIndex().length, records.length, 'Selector index must include the full library');
    assert.equal(getLibraryStats().total, records.length);
    const example = imported.find(c => c.translation_status === 'english-source-only');
    assert(example && !example.long_description.id, 'Missing translations must not be fabricated');
    assert(compareCreatures('garuda', example.slug).comparisonMatrix.every(row => row.valB === null && row.difference === null), 'Missing scores are not zero and cannot be compared');
    const lastPage = queryCreatures({ page: 999999, limit: 12 });
    assert.equal(lastPage.pagination.page, lastPage.pagination.totalPages, 'Out-of-range pagination must clamp');
    assert(lastPage.creatures.length > 0, 'Last page must remain readable');
    assert(queryCreatures({ tier: 'core' }).pagination.total >= 1000);
    assert.equal(queryCreatures({ tier: 'rich' }).pagination.total, 18);
  }
  console.log('  ✓ Learning content, expanded library, linked creatures, and local assets passed');
  console.log('\n🎉 ALL 5 TEST MODULES PASSED!\n');
}

runTests().catch(err => {
  console.error('\n❌ Test suite failure:', err);
  process.exit(1);
});

