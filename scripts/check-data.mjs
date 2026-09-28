#!/usr/bin/env node
/**
 * Mythics Data Quality Control & Validation Script
 * Verifies schema integrity, bilingual completeness, source provenance,
 * image attribution, and taxonomy reference sanity.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function runCheck() {
  console.log('=== MYTHICS DATA QUALITY AUDIT ===\n');

  const creatures = JSON.parse(await readFile(join(ROOT, 'data', 'creatures.json'), 'utf8'));
  const cultures = JSON.parse(await readFile(join(ROOT, 'data', 'cultures.json'), 'utf8'));
  const categories = JSON.parse(await readFile(join(ROOT, 'data', 'categories.json'), 'utf8'));

  const cultureIds = new Set(cultures.map(c => c.id));
  const categoryIds = new Set(categories.map(c => c.id));
  const seenSlugs = new Set();

  let errors = 0;
  let warnings = 0;

  console.log(`Auditing ${creatures.length} creatures across ${cultures.length} cultures...`);

  for (const c of creatures) {
    const label = `[${c.canonical_name || c.id}]`;

    // 1. Slugs & IDs
    if (!c.id || !c.slug) {
      console.error(`❌ ${label} Missing id or slug`);
      errors++;
    }
    if (seenSlugs.has(c.slug)) {
      console.error(`❌ ${label} Duplicate slug: ${c.slug}`);
      errors++;
    }
    seenSlugs.add(c.slug);

    // 2. Bilingual Text
    if (!c.display_name?.id || !c.display_name?.en) {
      console.error(`❌ ${label} Missing bilingual display_name (ID or EN)`);
      errors++;
    }
    if (!c.short_description?.id || !c.short_description?.en) {
      console.error(`❌ ${label} Missing bilingual short_description`);
      errors++;
    }
    if (!c.long_description?.id || !c.long_description?.en) {
      console.error(`❌ ${label} Missing bilingual long_description`);
      errors++;
    }

    // 3. Taxonomy sanity
    if (!cultureIds.has(c.culture)) {
      console.error(`❌ ${label} Invalid culture reference: "${c.culture}"`);
      errors++;
    }
    if (!categoryIds.has(c.classification)) {
      console.error(`❌ ${label} Invalid classification reference: "${c.classification}"`);
      errors++;
    }

    // 4. Sources provenance
    if (!c.sources || c.sources.length === 0) {
      console.warn(`⚠️ ${label} Has zero sources cited`);
      warnings++;
    } else {
      for (const s of c.sources) {
        if (!s.title || !s.url) {
          console.error(`❌ ${label} Source missing title or url`);
          errors++;
        }
      }
    }

    // 5. Images attribution
    if (!c.images || c.images.length === 0) {
      console.warn(`⚠️ ${label} Has no images (fallback mode required)`);
      warnings++;
    } else {
      for (const img of c.images) {
        if (!img.url || !img.license) {
          console.error(`❌ ${label} Image record missing url or license`);
          errors++;
        }
        if (!img.image_type) {
          console.warn(`⚠️ ${label} Image record missing image_type classification`);
          warnings++;
        }
      }
    }

    // 6. Power Profile & Disclaimers
    if (!c.power_profile || !c.power_profile.dimensions) {
      console.error(`❌ ${label} Missing power_profile dimensions`);
      errors++;
    } else if (!c.power_profile.disclaimer?.id || !c.power_profile.disclaimer?.en) {
      console.error(`❌ ${label} Missing power_profile editorial disclaimer`);
      errors++;
    }
  }

  console.log(`\nAudit complete:`);
  console.log(`  - Total Checked : ${creatures.length} creatures`);
  console.log(`  - Total Errors  : ${errors}`);
  console.log(`  - Total Warnings: ${warnings}`);

  if (errors > 0) {
    console.error(`\n❌ Quality check FAILED with ${errors} critical errors.`);
    process.exit(1);
  } else {
    console.log(`\n✓ All quality checks PASSED successfully!`);
  }
}

runCheck().catch(err => {
  console.error('Audit exception:', err);
  process.exit(1);
});
