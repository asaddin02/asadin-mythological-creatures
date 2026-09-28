/**
 * Mythics Normalized Database Layer
 * In-memory indexed cache with file persistence, normalized search,
 * fuzzy matching, multi-faceted filtering, and transactional updates.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { calculatePowerProfile } from './power-engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CREATURES_FILE = join(ROOT, 'data', 'creatures.json');
const CULTURES_FILE = join(ROOT, 'data', 'cultures.json');
const CATEGORIES_FILE = join(ROOT, 'data', 'categories.json');
const TRAITS_FILE = join(ROOT, 'data', 'traits.json');
const REGIONS_FILE = join(ROOT, 'data', 'regions.json');
const REVIEWS_FILE = join(ROOT, 'data', 'reviews.json');
const JOBS_FILE = join(ROOT, 'data', 'ingestion-jobs.json');

// In-memory state
let creatures = [];
let cultures = [];
let categories = [];
let traits = [];
let regions = [];
let reviews = [];
let jobs = [];

/**
 * Normalize string for search: lowercase, remove diacritics/accents
 */
export function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Initialize DB from disk
 */
export async function initDb() {
  try {
    creatures = JSON.parse(await readFile(CREATURES_FILE, 'utf8'));
    cultures = JSON.parse(await readFile(CULTURES_FILE, 'utf8'));
    categories = JSON.parse(await readFile(CATEGORIES_FILE, 'utf8'));
    traits = JSON.parse(await readFile(TRAITS_FILE, 'utf8'));
    try {
      regions = JSON.parse(await readFile(REGIONS_FILE, 'utf8'));
    } catch {
      regions = [];
    }
    
    try {
      reviews = JSON.parse(await readFile(REVIEWS_FILE, 'utf8'));
    } catch {
      reviews = [];
    }

    try {
      jobs = JSON.parse(await readFile(JOBS_FILE, 'utf8'));
    } catch {
      jobs = [];
    }

    // Refresh culture counts
    for (const cult of cultures) {
      cult.creature_count = creatures.filter(c => c.culture === cult.id && c.status === 'published').length;
    }

    console.log(`[DB] Loaded ${creatures.length} creatures, ${cultures.length} cultures, ${reviews.length} pending reviews`);
  } catch (err) {
    console.error('[DB] Initialization error:', err);
    throw err;
  }
}

/**
 * Persist creatures to disk
 */
async function saveCreaturesToDisk() {
  await writeFile(CREATURES_FILE, JSON.stringify(creatures, null, 2), 'utf8');
  // Refresh culture counts
  for (const cult of cultures) {
    cult.creature_count = creatures.filter(c => c.culture === cult.id && c.status === 'published').length;
  }
  await writeFile(CULTURES_FILE, JSON.stringify(cultures, null, 2), 'utf8');
}

/**
 * Persist reviews to disk
 */
async function saveReviewsToDisk() {
  await writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

/**
 * Persist jobs to disk
 */
async function saveJobsToDisk() {
  await writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf8');
}

/**
 * Query creatures with filtering, search, and pagination
 */
export function queryCreatures(options = {}) {
  const {
    culture,
    classification,
    region,
    element,
    habitat,
    behavior,
    trait,
    status = 'published',
    q,
    sort = 'default',
    page = 1,
    limit = 12,
    includeAllStatus = false
  } = options;

  let results = creatures;

  // Filter status
  if (!includeAllStatus) {
    results = results.filter(c => c.status === status);
  }

  // Filter culture
  if (culture && culture !== 'all') {
    const cultNorm = normalizeText(culture);
    results = results.filter(c => c.culture === culture || normalizeText(c.culture) === cultNorm);
  }

  // Filter classification
  if (classification && classification !== 'all') {
    const classNorm = normalizeText(classification);
    results = results.filter(c => c.classification === classification || normalizeText(c.classification) === classNorm);
  }

  // Filter region
  if (region && region !== 'all') {
    const regNorm = normalizeText(region);
    results = results.filter(c => normalizeText(c.region) === regNorm);
  }

  // Filter element
  if (element && element !== 'all') {
    const elNorm = normalizeText(element);
    results = results.filter(c => normalizeText(c.element) === elNorm);
  }

  // Filter habitat
  if (habitat && habitat !== 'all') {
    const habNorm = normalizeText(habitat);
    results = results.filter(c => normalizeText(c.habitat) === habNorm);
  }

  // Filter behavior
  if (behavior && behavior !== 'all') {
    const behNorm = normalizeText(behavior);
    results = results.filter(c => normalizeText(c.behavior) === behNorm);
  }

  // Filter trait
  if (trait && trait !== 'all') {
    const traitNorm = normalizeText(trait);
    results = results.filter(c => (c.traits || []).some(t => normalizeText(t) === traitNorm));
  }

  // Full-text & normalized fuzzy search
  if (q && q.trim()) {
    const term = normalizeText(q);
    results = results.filter(c => {
      const canonical = normalizeText(c.canonical_name);
      const original = normalizeText(c.original_name);
      const nameId = normalizeText(c.display_name?.id);
      const nameEn = normalizeText(c.display_name?.en);
      const descId = normalizeText(c.short_description?.id);
      const descEn = normalizeText(c.short_description?.en);
      const cult = normalizeText(c.culture);
      const reg = normalizeText(c.region);
      const cType = normalizeText(c.classification);

      // Check alternate names
      const altNames = (c.alternate_names || []).map(a => normalizeText(a.name)).join(' ');
      // Check traits
      const traitsStr = (c.traits || []).map(t => normalizeText(t)).join(' ');

      return (
        canonical.includes(term) ||
        original.includes(term) ||
        nameId.includes(term) ||
        nameEn.includes(term) ||
        altNames.includes(term) ||
        descId.includes(term) ||
        descEn.includes(term) ||
        cult.includes(term) ||
        reg.includes(term) ||
        cType.includes(term) ||
        traitsStr.includes(term)
      );
    });
  }

  // Sorting
  if (sort === 'name-asc') {
    results.sort((a, b) => a.canonical_name.localeCompare(b.canonical_name));
  } else if (sort === 'name-desc') {
    results.sort((a, b) => b.canonical_name.localeCompare(a.canonical_name));
  } else if (sort === 'completeness') {
    results.sort((a, b) => (b.completeness_score || 0) - (a.completeness_score || 0));
  } else if (sort === 'power') {
    results.sort((a, b) => {
      const pA = a.power_profile?.dimensions?.supernatural || 0;
      const pB = b.power_profile?.dimensions?.supernatural || 0;
      return pB - pA;
    });
  }

  const total = results.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const totalPages = Math.ceil(total / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginated = results.slice(offset, offset + limitNum);

  return {
    creatures: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  };
}

/**
 * Get creature by slug with resolved related creatures
 */
export function getCreatureBySlug(slug) {
  const normSlug = normalizeText(slug);
  const creature = creatures.find(c => normalizeText(c.slug) === normSlug || normalizeText(c.id) === normSlug);
  if (!creature) return null;

  // Resolve related beings
  let related = [];
  if (creature.related_creature_ids && creature.related_creature_ids.length > 0) {
    related = creatures
      .filter(c => creature.related_creature_ids.includes(c.id) || creature.related_creature_ids.includes(c.slug))
      .map(c => ({
        id: c.id,
        slug: c.slug,
        canonical_name: c.canonical_name,
        display_name: c.display_name,
        classification: c.classification,
        culture: c.culture,
        images: c.images?.slice(0, 1) || []
      }));
  }

  // If few related, supplement with same culture
  if (related.length < 3) {
    const supplement = creatures
      .filter(c => c.culture === creature.culture && c.id !== creature.id && !related.some(r => r.id === c.id))
      .slice(0, 3 - related.length)
      .map(c => ({
        id: c.id,
        slug: c.slug,
        canonical_name: c.canonical_name,
        display_name: c.display_name,
        classification: c.classification,
        culture: c.culture,
        images: c.images?.slice(0, 1) || []
      }));
    related = [...related, ...supplement];
  }

  return {
    ...creature,
    resolved_related: related
  };
}

/**
 * Random encounter
 */
export function getRandomCreature(filters = {}) {
  const { culture, classification, obscure } = filters;
  let candidates = creatures.filter(c => c.status === 'published');

  if (culture && culture !== 'all') {
    candidates = candidates.filter(c => c.culture === culture);
  }
  if (classification && classification !== 'all') {
    candidates = candidates.filter(c => c.classification === classification);
  }
  if (obscure) {
    candidates = candidates.filter(c => (c.alternate_names?.length || 0) <= 2);
  }

  if (candidates.length === 0) candidates = creatures.filter(c => c.status === 'published');
  if (candidates.length === 0) return null;

  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

/**
 * Compare two creatures
 */
export function compareCreatures(slugA, slugB) {
  const creatureA = getCreatureBySlug(slugA);
  const creatureB = getCreatureBySlug(slugB);

  if (!creatureA || !creatureB) return null;

  const dimsA = creatureA.power_profile?.dimensions || {};
  const dimsB = creatureB.power_profile?.dimensions || {};

  const dimensions = ['physical', 'supernatural', 'durability', 'mobility', 'intelligence', 'influence'];
  const comparisonMatrix = dimensions.map(dim => ({
    dimension: dim,
    valA: dimsA[dim] || 0,
    valB: dimsB[dim] || 0,
    difference: (dimsA[dim] || 0) - (dimsB[dim] || 0)
  }));

  return {
    creatureA,
    creatureB,
    comparisonMatrix,
    disclaimer: {
      id: "Perbandingan profil kekuatan ini diturunkan untuk keperluan visualisasi/hiburan berdasarkan dokumentasi atribut tradisi, dan bukan perbandingan mutlak atas tradisi kebudayaan yang bersangkutan.",
      en: "This power profile comparison is derived for visualization/entertainment purposes based on documented folkloric attributes, not an absolute comparative ranking of respective cultural traditions."
    }
  };
}

/**
 * Get all cultures
 */
export function getCultures() {
  return cultures;
}

/**
 * Get single culture detail with associated creatures
 */
export function getCultureById(id) {
  const normId = normalizeText(id);
  const culture = cultures.find(c => normalizeText(c.id) === normId || normalizeText(c.slug) === normId);
  if (!culture) return null;
  const cultCreatures = creatures.filter(c => c.culture === culture.id && c.status === 'published');
  return {
    ...culture,
    creatures: cultCreatures
  };
}

/**
 * Get all global macro-regions
 */
export function getRegions() {
  return regions.map(reg => ({
    ...reg,
    creature_count: creatures.filter(c => {
      const cult = cultures.find(cult => cult.id === c.culture);
      return (reg.cultures || []).includes(c.culture) || cult?.region_id === reg.id || normalizeText(c.region) === normalizeText(reg.name?.en);
    }).length
  }));
}

/**
 * Get single region detail
 */
export function getRegionById(id) {
  const normId = normalizeText(id);
  const region = regions.find(r => normalizeText(r.id) === normId || normalizeText(r.slug) === normId);
  if (!region) return null;
  const regionCreatures = creatures.filter(c => {
    const cult = cultures.find(cult => cult.id === c.culture);
    return (region.cultures || []).includes(c.culture) || cult?.region_id === region.id || normalizeText(c.region) === normalizeText(region.name?.en);
  });
  return {
    ...region,
    creatures: regionCreatures
  };
}

/**
 * Get Relationship Graph for interactive visual exploration
 */
export function getRelationshipGraph(slug) {
  const creature = getCreatureBySlug(slug);
  if (!creature) return null;

  const nodes = [
    {
      id: creature.slug,
      label: creature.canonical_name,
      type: 'primary',
      culture: creature.culture,
      classification: creature.classification
    }
  ];

  const edges = [];
  const relations = creature.semantic_relations || [];

  for (const rel of relations) {
    const targetCreature = creatures.find(c => c.slug === rel.target_slug);
    nodes.push({
      id: rel.target_slug,
      label: rel.target_name || (targetCreature ? targetCreature.canonical_name : rel.target_slug),
      type: 'related',
      relation_type: rel.relation_type,
      culture: targetCreature?.culture || creature.culture,
      classification: targetCreature?.classification || 'Creature'
    });

    edges.push({
      source: creature.slug,
      target: rel.target_slug,
      relation_type: rel.relation_type,
      note: rel.note
    });
  }

  return {
    centralCreature: creature.canonical_name,
    nodes,
    edges
  };
}

/**
 * Get all categories
 */
export function getCategories() {
  return categories.map(cat => ({
    ...cat,
    count: creatures.filter(c => c.classification === cat.id && c.status === 'published').length
  }));
}

/**
 * Get all traits
 */
export function getTraits() {
  return traits;
}

/**
 * Get admin stats
 */
export function getAdminStats() {
  const total = creatures.length;
  const published = creatures.filter(c => c.status === 'published').length;
  const drafts = creatures.filter(c => c.status === 'draft').length;
  const reviewRequired = creatures.filter(c => c.status === 'review_required').length + reviews.length;
  const missingImages = creatures.filter(c => !c.images || c.images.length === 0).length;
  const lowConfidence = creatures.filter(c => c.confidence_score === 'Low').length;
  const missingIndonesian = creatures.filter(c => !c.short_description?.id || c.short_description.id.length < 10).length;
  const missingEnglish = creatures.filter(c => !c.short_description?.en || c.short_description.en.length < 10).length;

  return {
    total,
    published,
    drafts,
    reviewRequired,
    missingImages,
    lowConfidence,
    missingIndonesian,
    missingEnglish,
    totalReviews: reviews.length,
    totalJobs: jobs.length
  };
}

/**
 * Get pending reviews
 */
export function getPendingReviews() {
  return reviews;
}

/**
 * Approve review item into live database
 */
export async function approveReviewItem(slug, updates = {}) {
  const idx = reviews.findIndex(r => r.slug === slug);
  let draft = null;

  if (idx >= 0) {
    draft = reviews[idx];
    reviews.splice(idx, 1);
  } else {
    // Check if creature already exists in drafts
    draft = creatures.find(c => c.slug === slug);
  }

  if (!draft) return { success: false, error: 'Draft not found' };

  // Apply edits
  const finalized = {
    ...draft,
    ...updates,
    status: 'published',
    updated_at: new Date().toISOString()
  };

  // Re-calculate power profile deterministically
  finalized.power_profile = calculatePowerProfile(finalized);

  const existingIdx = creatures.findIndex(c => c.slug === finalized.slug);
  if (existingIdx >= 0) {
    creatures[existingIdx] = finalized;
  } else {
    creatures.push(finalized);
  }

  await saveCreaturesToDisk();
  await saveReviewsToDisk();

  return { success: true, creature: finalized };
}

/**
 * Reject review item
 */
export async function rejectReviewItem(slug) {
  const idx = reviews.findIndex(r => r.slug === slug);
  if (idx >= 0) {
    reviews.splice(idx, 1);
    await saveReviewsToDisk();
    return { success: true };
  }
  return { success: false, error: 'Draft not found' };
}

/**
 * Save / Update creature directly
 */
export async function saveCreature(creatureData) {
  if (!creatureData.slug) return { success: false, error: 'Slug is required' };

  // Calculate power profile if missing
  if (!creatureData.power_profile) {
    creatureData.power_profile = calculatePowerProfile(creatureData);
  }

  const idx = creatures.findIndex(c => c.slug === creatureData.slug);
  if (idx >= 0) {
    creatures[idx] = { ...creatures[idx], ...creatureData, updated_at: new Date().toISOString() };
  } else {
    creatures.push({
      ...creatureData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  await saveCreaturesToDisk();
  return { success: true, creature: creatureData };
}

/**
 * Add job to queue
 */
export async function addJob(job) {
  jobs.unshift(job);
  if (jobs.length > 50) jobs = jobs.slice(0, 50);
  await saveJobsToDisk();
}

/**
 * Get jobs
 */
export function getJobs() {
  return jobs;
}
