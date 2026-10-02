import { getAssessment, SCALES } from './scaling.js';
/**
 * Mythics Query Engine
 * Pure read-only queries over the library data, shared by the Node server (server/db.mjs),
 * the static site builder (scripts/build-site.mjs) and the browser on static hosting
 * (js/api-client.js). `data` is { creatures, cultures, categories, traits, regions }.
 */

/**
 * Normalize string for search: lowercase, remove diacritics/accents
 */
export function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Query creatures with filtering, search, and pagination
 */
export function queryCreatures(data, options = {}) {
  const { creatures, regions } = data;
  const {
    culture,
    classification,
    region,
    element,
    habitat,
    behavior,
    trait,
    tier,
    status = 'published',
    q,
    sort = 'default',
    page = 1,
    limit = 12,
    includeAllStatus = false
  } = options;

  let results = [...creatures];

  // Filter status
  if (!includeAllStatus) {
    results = results.filter(c => c.status === status);
  }

  if (tier === 'core') results = results.filter(c => c.content_tier === 'core');
  if (tier === 'rich') results = results.filter(c => c.content_tier !== 'core');

  for (const axis of ['power', 'threat', 'fear']) {
    const selected = options[axis];
    if (selected && selected !== 'all') results = results.filter(c =>
      selected === 'unassessed' ? !getAssessment(c)[axis] : getAssessment(c)[axis] === selected);
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
    const match = regions.find(r => [r.id, r.slug, r.name?.id, r.name?.en].some(value => normalizeText(value) === regNorm));
    results = results.filter(c => normalizeText(c.region) === regNorm || (match && ((match.cultures || []).includes(c.culture) || normalizeText(c.region) === normalizeText(match.name?.en))));
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
      const pA = SCALES.power.findIndex(level => level.id === getAssessment(a).power);
      const pB = SCALES.power.findIndex(level => level.id === getAssessment(b).power);
      return pB - pA;
    });
  }

  const total = results.length;
  let pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const totalPages = Math.ceil(total / limitNum) || 1;
  pageNum = Math.min(pageNum, totalPages);
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

function relatedSummary(c) {
  return {
    id: c.id,
    slug: c.slug,
    canonical_name: c.canonical_name,
    display_name: c.display_name,
    classification: c.classification,
    culture: c.culture,
    images: c.images?.slice(0, 1) || []
  };
}

/**
 * Get creature by slug with resolved related creatures
 */
export function getCreatureBySlug(data, slug) {
  const { creatures } = data;
  const normSlug = normalizeText(slug);
  const creature = creatures.find(c => normalizeText(c.slug) === normSlug || normalizeText(c.id) === normSlug);
  if (!creature) return null;

  // Resolve related beings
  let related = [];
  if (creature.related_creature_ids && creature.related_creature_ids.length > 0) {
    related = creatures
      .filter(c => creature.related_creature_ids.includes(c.id) || creature.related_creature_ids.includes(c.slug))
      .map(relatedSummary);
  }

  // If few related, supplement with same culture
  if (related.length < 3) {
    const supplement = creatures
      .filter(c => c.culture === creature.culture && c.id !== creature.id && !related.some(r => r.id === c.id))
      .slice(0, 3 - related.length)
      .map(relatedSummary);
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
export function getRandomCreature(data, filters = {}) {
  const { creatures } = data;
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
 * Compare two resolved creatures
 */
export function buildComparison(creatureA, creatureB) {
  if (!creatureA || !creatureB) return null;

  const dimsA = creatureA.power_profile?.dimensions || {};
  const dimsB = creatureB.power_profile?.dimensions || {};

  const dimensions = ['physical', 'supernatural', 'durability', 'mobility', 'intelligence', 'influence'];
  const comparisonMatrix = dimensions.map(dim => ({
    dimension: dim,
    valA: dimsA[dim] ?? null,
    valB: dimsB[dim] ?? null,
    difference: Number.isFinite(dimsA[dim]) && Number.isFinite(dimsB[dim]) ? dimsA[dim] - dimsB[dim] : null
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
 * Compare two creatures
 */
export function compareCreatures(data, slugA, slugB) {
  return buildComparison(getCreatureBySlug(data, slugA), getCreatureBySlug(data, slugB));
}

/**
 * Get single culture detail with associated creatures
 */
export function getCultureById(data, id) {
  const { creatures, cultures } = data;
  const normId = normalizeText(id);
  const culture = cultures.find(c => normalizeText(c.id) === normId || normalizeText(c.slug) === normId);
  if (!culture) return null;
  const cultCreatures = creatures.filter(c => c.culture === culture.id && c.status === 'published');
  return {
    ...culture,
    creatures: cultCreatures
  };
}

function inRegion(data, region, c) {
  const cult = data.cultures.find(cult => cult.id === c.culture);
  return (region.cultures || []).includes(c.culture) || cult?.region_id === region.id || normalizeText(c.region) === normalizeText(region.name?.en);
}

/**
 * Get all global macro-regions
 */
export function getRegions(data) {
  return data.regions.map(reg => ({
    ...reg,
    creature_count: data.creatures.filter(c => inRegion(data, reg, c)).length
  }));
}

/**
 * Get single region detail
 */
export function getRegionById(data, id) {
  const normId = normalizeText(id);
  const region = data.regions.find(r => normalizeText(r.id) === normId || normalizeText(r.slug) === normId);
  if (!region) return null;
  return {
    ...region,
    creatures: data.creatures.filter(c => inRegion(data, region, c))
  };
}

/**
 * Get Relationship Graph for interactive visual exploration
 */
export function getRelationshipGraph(data, slug) {
  const creature = getCreatureBySlug(data, slug);
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
    const targetCreature = data.creatures.find(c => c.slug === rel.target_slug);
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
export function getCategories(data) {
  return data.categories.map(cat => ({
    ...cat,
    count: data.creatures.filter(c => c.classification === cat.id && c.status === 'published').length
  }));
}

/** Lightweight complete index for selectors; no 100-record truncation. */
export function getCreatureIndex(data) {
  return data.creatures.filter(c => c.status === 'published').map(c => ({ slug: c.slug, canonical_name: c.canonical_name, display_name: c.display_name, culture: c.culture, content_tier: c.content_tier }));
}

export function getLibraryStats(data) {
  const published = data.creatures.filter(c => c.status === 'published');
  return { total: published.length, detailed: published.filter(c => c.content_tier !== 'core').length, introductory: published.filter(c => c.content_tier === 'core').length, english_source_only: published.filter(c => c.translation_status === 'english-source-only').length, cultures: new Set(published.map(c => c.culture)).size };
}
