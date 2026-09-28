/**
 * Mythics Client-side API Service
 * Handles data fetching, in-memory caching, error management,
 * and seamless fallback handling.
 */

const CACHE = new Map();

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
  // Query creatures
  async getCreatures(params = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.set(k, v);
      }
    }
    const endpoint = `/api/creatures?${query.toString()}`;
    return await getJson(endpoint, 10000);
  },

  // Get creature detail
  async getCreature(slug) {
    const endpoint = `/api/creatures/${encodeURIComponent(slug)}`;
    return await getJson(endpoint, 30000);
  },

  // Get random creature
  async getRandom(filters = {}) {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v && v !== 'all') query.set(k, v);
    }
    // Random should not use aggressive caching
    const res = await fetch(`/api/random?${query.toString()}`);
    if (!res.ok) throw new Error('Random encounter unavailable');
    return await res.json();
  },

  // Compare two creatures
  async compare(slugA, slugB) {
    const endpoint = `/api/compare?a=${encodeURIComponent(slugA)}&b=${encodeURIComponent(slugB)}`;
    return await getJson(endpoint, 30000);
  },

  // Get cultures
  async getCultures() {
    return await getJson('/api/cultures', 60000);
  },

  // Get categories
  async getCategories() {
    return await getJson('/api/categories', 60000);
  },

  // Admin: Stats
  async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to load admin statistics');
    return await res.json();
  },

  // Admin: Pending reviews
  async getReviews() {
    const res = await fetch('/api/admin/reviews');
    if (!res.ok) throw new Error('Failed to load review queue');
    return await res.json();
  },

  // Admin: Run research
  async runResearch(entityName, autoPublish = false) {
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
    const res = await fetch(`/api/admin/reviews/${encodeURIComponent(slug)}/reject`, {
      method: 'POST'
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to reject draft');
    CACHE.clear();
    return body;
  }
};
