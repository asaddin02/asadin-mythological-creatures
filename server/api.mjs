/**
 * Mythics API Route Handlers
 * REST endpoints for public discovery, detailed creature inspection,
 * comparison, random encounter, and administrative editorial workflow.
 */

import {
  queryCreatures,
  getCreatureIndex,
  getLibraryStats,
  getCreatureBySlug,
  getRandomCreature,
  compareCreatures,
  getCultures,
  getCultureById,
  getRegions,
  getRegionById,
  getRelationshipGraph,
  getCategories,
  getTraits,
  getAdminStats,
  getPendingReviews,
  approveReviewItem,
  rejectReviewItem,
  saveCreature,
  addJob,
  getJobs
} from './db.mjs';
import { researchEntity } from './ingestion.mjs';

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': statusCode === 200 ? 'public, max-age=60' : 'no-store'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message, details = null) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: message, details }));
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Handle API requests
 */
export async function handleApiRoute(req, res, url) {
  const pathname = url.pathname;
  const method = req.method;

  if (pathname === '/api/creature-index' && method === 'GET') return sendJson(res, 200, getCreatureIndex());
  if (pathname === '/api/library-stats' && method === 'GET') return sendJson(res, 200, getLibraryStats());

  // GET /api/creatures
  if (pathname === '/api/creatures' && method === 'GET') {
    const params = Object.fromEntries(url.searchParams);
    const result = queryCreatures(params);
    return sendJson(res, 200, result);
  }

  // GET /api/creatures/:slug
  const creatureMatch = pathname.match(/^\/api\/creatures\/([a-zA-Z0-9_-]+)$/);
  if (creatureMatch && method === 'GET') {
    const slug = creatureMatch[1];
    const creature = getCreatureBySlug(slug);
    if (!creature) {
      return sendError(res, 404, `Creature with slug "${slug}" not found`);
    }
    return sendJson(res, 200, creature);
  }

  // GET /api/random
  if (pathname === '/api/random' && method === 'GET') {
    const params = Object.fromEntries(url.searchParams);
    const creature = getRandomCreature(params);
    if (!creature) {
      return sendError(res, 404, 'No creature matched random parameters');
    }
    return sendJson(res, 200, creature);
  }

  // GET /api/compare
  if (pathname === '/api/compare' && method === 'GET') {
    const a = url.searchParams.get('a');
    const b = url.searchParams.get('b');
    if (!a || !b) {
      return sendError(res, 400, 'Both "a" and "b" creature slugs are required for comparison');
    }
    const comparison = compareCreatures(a, b);
    if (!comparison) {
      return sendError(res, 404, 'One or both creatures could not be located');
    }
    return sendJson(res, 200, comparison);
  }

  // GET /api/cultures
  if (pathname === '/api/cultures' && method === 'GET') {
    return sendJson(res, 200, getCultures());
  }

  // GET /api/cultures/:id
  const cultureDetailMatch = pathname.match(/^\/api\/cultures\/([a-zA-Z0-9_-]+)$/);
  if (cultureDetailMatch && method === 'GET') {
    const culture = getCultureById(cultureDetailMatch[1]);
    if (!culture) return sendError(res, 404, 'Culture tradition not found');
    return sendJson(res, 200, culture);
  }

  // GET /api/regions
  if (pathname === '/api/regions' && method === 'GET') {
    return sendJson(res, 200, getRegions());
  }

  // GET /api/regions/:id
  const regionMatch = pathname.match(/^\/api\/regions\/([a-zA-Z0-9_-]+)$/);
  if (regionMatch && method === 'GET') {
    const region = getRegionById(regionMatch[1]);
    if (!region) return sendError(res, 404, 'Region not found');
    return sendJson(res, 200, region);
  }

  // GET /api/graph/:slug
  const graphMatch = pathname.match(/^\/api\/graph\/([a-zA-Z0-9_-]+)$/);
  if (graphMatch && method === 'GET') {
    const graph = getRelationshipGraph(graphMatch[1]);
    if (!graph) return sendError(res, 404, 'Creature relationship graph not found');
    return sendJson(res, 200, graph);
  }

  // GET /api/claims/:slug
  const claimsMatch = pathname.match(/^\/api\/claims\/([a-zA-Z0-9_-]+)$/);
  if (claimsMatch && method === 'GET') {
    const creature = getCreatureBySlug(claimsMatch[1]);
    if (!creature) return sendError(res, 404, 'Creature not found');
    return sendJson(res, 200, creature.claims_provenance || []);
  }

  // GET /api/categories
  if (pathname === '/api/categories' && method === 'GET') {
    return sendJson(res, 200, getCategories());
  }

  // GET /api/traits
  if (pathname === '/api/traits' && method === 'GET') {
    return sendJson(res, 200, getTraits());
  }

  // GET /api/admin/stats
  if (pathname === '/api/admin/stats' && method === 'GET') {
    return sendJson(res, 200, getAdminStats());
  }

  // GET /api/admin/reviews
  if (pathname === '/api/admin/reviews' && method === 'GET') {
    return sendJson(res, 200, getPendingReviews());
  }

  // GET /api/admin/jobs
  if (pathname === '/api/admin/jobs' && method === 'GET') {
    return sendJson(res, 200, getJobs());
  }

  // POST /api/admin/research
  if (pathname === '/api/admin/research' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const entityName = body.entityName;
      const autoPublish = Boolean(body.autoPublish);

      if (!entityName || typeof entityName !== 'string' || !entityName.trim()) {
        return sendError(res, 400, 'entityName string is required');
      }

      const jobId = `job-${Date.now()}`;
      const startTime = Date.now();

      const researchResult = await researchEntity(entityName, { autoPublish });

      const durationMs = Date.now() - startTime;
      const jobRecord = {
        id: jobId,
        entityName,
        status: researchResult.success ? (autoPublish ? 'PUBLISHED' : 'REVIEW_REQUIRED') : 'FAILED',
        timestamp: new Date().toISOString(),
        durationMs,
        log: researchResult.log,
        error: researchResult.error || null
      };

      await addJob(jobRecord);

      if (!researchResult.success) {
        return sendError(res, 422, 'Automated research could not resolve reliable data', researchResult);
      }

      // If review required, store draft into reviews
      if (!autoPublish) {
        const reviews = getPendingReviews();
        const existingIdx = reviews.findIndex(r => r.slug === researchResult.draft.slug);
        if (existingIdx >= 0) {
          reviews[existingIdx] = researchResult.draft;
        } else {
          reviews.push(researchResult.draft);
        }
      } else {
        await saveCreature(researchResult.draft);
      }

      return sendJson(res, 200, {
        success: true,
        jobId,
        draft: researchResult.draft,
        log: researchResult.log
      });
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // POST /api/admin/reviews/:slug/approve
  const approveMatch = pathname.match(/^\/api\/admin\/reviews\/([a-zA-Z0-9_-]+)\/approve$/);
  if (approveMatch && method === 'POST') {
    try {
      const slug = approveMatch[1];
      const updates = await parseBody(req);
      const result = await approveReviewItem(slug, updates);
      if (!result.success) {
        return sendError(res, 404, result.error);
      }
      return sendJson(res, 200, { success: true, creature: result.creature });
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // POST /api/admin/reviews/:slug/reject
  const rejectMatch = pathname.match(/^\/api\/admin\/reviews\/([a-zA-Z0-9_-]+)\/reject$/);
  if (rejectMatch && method === 'POST') {
    const slug = rejectMatch[1];
    const result = await rejectReviewItem(slug);
    if (!result.success) {
      return sendError(res, 404, result.error);
    }
    return sendJson(res, 200, { success: true });
  }

  // POST /api/admin/creatures
  if (pathname === '/api/admin/creatures' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await saveCreature(body);
      if (!result.success) {
        return sendError(res, 400, result.error);
      }
      return sendJson(res, 200, { success: true, creature: result.creature });
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return sendError(res, 404, `API route not found: ${method} ${pathname}`);
}
