#!/usr/bin/env node
/**
 * Ingestion CLI Tool
 * Usage:
 *   node scripts/ingest-cli.mjs "Cerberus"
 *   node scripts/ingest-cli.mjs "Kraken" --publish
 */

import { researchEntity } from '../server/ingestion.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const entityName = args.find(a => !a.startsWith('--'));
const autoPublish = args.includes('--publish');

if (!entityName) {
  console.log('Usage: node scripts/ingest-cli.mjs "<Entity Name>" [--publish]');
  process.exit(1);
}

async function run() {
  console.log(`\n=== MYTHICS INGESTION PIPELINE ===`);
  console.log(`Target: "${entityName}" (Auto-publish: ${autoPublish})\n`);

  const result = await researchEntity(entityName, { autoPublish });

  for (const step of result.log) {
    console.log(step);
  }

  if (!result.success) {
    console.error(`\n❌ Ingestion aborted: ${result.error}`);
    process.exit(1);
  }

  const draft = result.draft;
  console.log(`\n✓ Draft successfully compiled:`);
  console.log(`  Canonical Name : ${draft.canonical_name}`);
  console.log(`  Classification : ${draft.classification}`);
  console.log(`  Culture Sphere : ${draft.culture} (${draft.region})`);
  console.log(`  Images Found   : ${draft.images.length}`);
  console.log(`  Sources Cited  : ${draft.sources.length}`);
  console.log(`  Completeness   : ${draft.completeness_score}%`);
  console.log(`  Confidence     : ${draft.confidence_score}`);
  console.log(`  Status         : ${draft.status}`);

  if (autoPublish) {
    // Save directly to creatures.json
    const creaturesPath = join(ROOT, 'data', 'creatures.json');
    const creatures = JSON.parse(await readFile(creaturesPath, 'utf8'));
    const existingIndex = creatures.findIndex(c => c.slug === draft.slug);
    if (existingIndex >= 0) {
      creatures[existingIndex] = draft;
      console.log(`  Updated existing creature "${draft.slug}"`);
    } else {
      creatures.push(draft);
      console.log(`  Added new creature "${draft.slug}" to encyclopedia`);
    }
    await writeFile(creaturesPath, JSON.stringify(creatures, null, 2), 'utf8');

    // Update cultures count
    const culturesPath = join(ROOT, 'data', 'cultures.json');
    const cultures = JSON.parse(await readFile(culturesPath, 'utf8'));
    for (const cult of cultures) {
      cult.creature_count = creatures.filter(c => c.culture === cult.id).length;
    }
    await writeFile(culturesPath, JSON.stringify(cultures, null, 2), 'utf8');
  } else {
    // Save to reviews queue
    const reviewsPath = join(ROOT, 'data', 'reviews.json');
    const reviews = JSON.parse(await readFile(reviewsPath, 'utf8'));
    const existingIndex = reviews.findIndex(r => r.slug === draft.slug);
    if (existingIndex >= 0) {
      reviews[existingIndex] = draft;
    } else {
      reviews.push(draft);
    }
    await writeFile(reviewsPath, JSON.stringify(reviews, null, 2), 'utf8');
    console.log(`\n✓ Stored in editorial review queue: data/reviews.json`);
  }
}

run().catch(err => {
  console.error('CLI Ingestion Error:', err);
  process.exit(1);
});
