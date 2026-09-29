/**
 * Mythics Normalized Database Layer
 * In-memory indexed cache with file persistence and transactional updates.
 * Read queries (search, filters, relations) live in js/query-engine.js so the static site
 * builder and the browser on static hosting answer exactly like this server.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { calculatePowerProfile } from './power-engine.mjs';
import * as engine from '../js/query-engine.js';

export { normalizeText } from '../js/query-engine.js';

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

/** The current library, in the shape js/query-engine.js expects. */
export function getLibrary() {
  return { creatures, cultures, categories, traits, regions };
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
  return engine.queryCreatures(getLibrary(), options);
}

/**
 * Get creature by slug with resolved related creatures
 */
export function getCreatureBySlug(slug) {
  return engine.getCreatureBySlug(getLibrary(), slug);
}

/**
 * Random encounter
 */
export function getRandomCreature(filters = {}) {
  return engine.getRandomCreature(getLibrary(), filters);
}

/**
 * Compare two creatures
 */
export function compareCreatures(slugA, slugB) {
  return engine.compareCreatures(getLibrary(), slugA, slugB);
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
  return engine.getCultureById(getLibrary(), id);
}

/**
 * Get all global macro-regions
 */
export function getRegions() {
  return engine.getRegions(getLibrary());
}

/**
 * Get single region detail
 */
export function getRegionById(id) {
  return engine.getRegionById(getLibrary(), id);
}

/**
 * Get Relationship Graph for interactive visual exploration
 */
export function getRelationshipGraph(slug) {
  return engine.getRelationshipGraph(getLibrary(), slug);
}

/**
 * Get all categories
 */
export function getCategories() {
  return engine.getCategories(getLibrary());
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

/** Lightweight complete index for selectors; no 100-record truncation. */
export function getCreatureIndex() {
  return engine.getCreatureIndex(getLibrary());
}
export function getLibraryStats() {
  return engine.getLibraryStats(getLibrary());
}
