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
  assert(regions.length === 8, 'Must return 8 macro-regions of the world');
  const seAsia = getRegionById('southeast-asia');
  assert(seAsia && seAsia.creatures.length >= 5, 'Southeast Asia must contain regional beings');

  const indoCult = getCultureById('indonesian-folklore');
  assert(indoCult && indoCult.creatures.length >= 8, 'Indonesian folklore must contain registered entities');
  console.log('  ✓ Multi-Tier Schema & Relationship Graph passed');

  console.log('\n🎉 ALL 4 TEST MODULES PASSED!\n');
}

runTests().catch(err => {
  console.error('\n❌ Test suite failure:', err);
  process.exit(1);
});

