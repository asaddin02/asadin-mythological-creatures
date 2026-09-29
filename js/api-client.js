/**
 * Mythics Client-side API Service
 * Handles data fetching, in-memory caching, error management,
 * and seamless fallback handling.
 *
 * Two back ends answer the same calls:
 * - the Node server (server/api.mjs), which runs the queries;
 * - static hosting (scripts/build-site.mjs marks index.html with <meta name="mythics-data" content="static">),
 *   where every read is a pre-built JSON file under /api/ and search, filters, pagination and random
 *   encounters run in the browser with the same query engine over /api/catalog.json.
 */

import * as engine from './query-engine.js';

const CACHE = new Map();

const meta = name => document.querySelector(`meta[name="${name}"]`)?.content;
const STATIC = meta('mythics-data') === 'static';
/** The editorial console needs the local server started with MYTHICS_ADMIN=1. */
export const adminEnabled = !STATIC && meta('mythics-admin') !== 'off';

/** Static file for a server endpoint: /api/creatures/Garuda → /api/creatures/garuda.json */
const staticPath = (dir, key) => `/api/${dir}/${encodeURIComponent(engine.normalizeText(key))}.json`;

let catalog;
function loadCatalog() {
  catalog ||= Promise.all([getJson('/api/catalog.json', Infinity), getJson('/api/regions.json', Infinity)]).then(
    ([creatures, regions]) => ({ creatures, regions, cultures: [], categories: [], traits: [] })
  );
  catalog.catch(() => (catalog = undefined));
  return catalog;
}

/** The query string exactly as the server would parse it. */
function toParams(params, skip) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!skip(v)) query.set(k, v);
  }
  return query;
}

function staticOnly() {
  throw new Error('The editorial console is available only on the local Mythics server (npm run dev).');
}

async function getJson(endpoint, cacheTtlMs = 60000) {
  const cached = CACHE.get(endpoint);
  if (cached && Date.now() - cached.time < cacheTtlMs) {
    return cached.data;
  }

  const res = await fetch(endpoint);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status} accessing ${endpoint}`);
  }
  const data = await res.json();
  CACHE.set(endpoint, { data, time: Date.now() });
  return data;
}

export const api = {
  getCreatureIndex: () => getJson(STATIC ? '/api/creature-index.json' : '/api/creature-index'),
  getLibraryStats: () => getJson(STATIC ? '/api/library-stats.json' : '/api/library-stats'),
  // Query creatures
  async getCreatures(params = {}) {
    const query = toParams(params, v => v === undefined || v === null || v === '' || v === 'all');
    if (STATIC) return engine.queryCreatures(await loadCatalog(), Object.fromEntries(query));
    const endpoint = `/api/creatures?${query.toString()}`;
    return await getJson(endpoint, 10000);
  },

  // Get creature detail
  async getCreature(slug) {
    const endpoint = STATIC ? staticPath('creatures', slug) : `/api/creatures/${encodeURIComponent(slug)}`;
    return await getJson(endpoint, 30000);
  },

  // Get random creature
  async getRandom(filters = {}) {
    const query = toParams(filters, v => !v || v === 'all');
    if (STATIC) {
      const creature = engine.getRandomCreature(await loadCatalog(), Object.fromEntries(query));
      if (!creature) throw new Error('Random encounter unavailable');
      return creature;
    }
    // Random should not use aggressive caching
    const res = await fetch(`/api/random?${query.toString()}`);
    if (!res.ok) throw new Error('Random encounter unavailable');
    return await res.json();
  },

  // Compare two creatures
  async compare(slugA, slugB) {
    if (STATIC) {
      const [a, b] = await Promise.all([this.getCreature(slugA), this.getCreature(slugB)]);
      return engine.buildComparison(a, b);
    }
    const endpoint = `/api/compare?a=${encodeURIComponent(slugA)}&b=${encodeURIComponent(slugB)}`;
    return await getJson(endpoint, 30000);
  },

  // Get cultures
  async getCultures() {
    return await getJson(STATIC ? '/api/cultures.json' : '/api/cultures', 60000);
  },

  // Get single culture detail with creatures
  async getCultureDetail(id) {
    return await getJson(STATIC ? staticPath('cultures', id) : `/api/cultures/${encodeURIComponent(id)}`, 60000);
  },

  // Get macro-regions
  async getRegions() {
    return await getJson(STATIC ? '/api/regions.json' : '/api/regions', 60000);
  },

  // Get single region detail
  async getRegion(id) {
    return await getJson(STATIC ? staticPath('regions', id) : `/api/regions/${encodeURIComponent(id)}`, 60000);
  },

  // Get relationship graph
  async getRelationshipGraph(slug) {
    return await getJson(STATIC ? staticPath('graph', slug) : `/api/graph/${encodeURIComponent(slug)}`, 30000);
  },

  // Get claim-level evidence
  async getClaims(slug) {
    return await getJson(STATIC ? staticPath('claims', slug) : `/api/claims/${encodeURIComponent(slug)}`, 30000);
  },

  // Get categories
  async getCategories() {
    return await getJson(STATIC ? '/api/categories.json' : '/api/categories', 60000);
  },

  // Admin: Stats
  async getAdminStats() {
    if (!adminEnabled) staticOnly();
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to load admin statistics');
    return await res.json();
  },

  // Admin: Pending reviews
  async getReviews() {
    if (!adminEnabled) staticOnly();
    const res = await fetch('/api/admin/reviews');
    if (!res.ok) throw new Error('Failed to load review queue');
    return await res.json();
  },

  // Admin: Run research
  async runResearch(entityName, autoPublish = false) {
    if (!adminEnabled) staticOnly();
    const res = await fetch('/api/admin/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityName, autoPublish })
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error || 'Autonomous research failed');
    }
    // Clear creature cache
    CACHE.clear();
    return body;
  },

  // Admin: Approve review
  async approveReview(slug, updates = {}) {
    if (!adminEnabled) staticOnly();
    const res = await fetch(`/api/admin/reviews/${encodeURIComponent(slug)}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to approve draft');
    CACHE.clear();
    return body;
  },

  // Admin: Reject review
  async rejectReview(slug) {
    if (!adminEnabled) staticOnly();
    const res = await fetch(`/api/admin/reviews/${encodeURIComponent(slug)}/reject`, {
      method: 'POST'
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to reject draft');
    CACHE.clear();
    return body;
  }
};
