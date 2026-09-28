/**
 * Wikidata access: discovery (SPARQL), entity fetch (wbgetentities),
 * title → QID resolution and name search.
 * Wikidata content is CC0.
 */

import { fetchJson, chunk } from './http.mjs';

const API = 'https://www.wikidata.org/w/api.php';
const SPARQL = 'https://query.wikidata.org/sparql';

/** Root classes whose (transitive) instances count as mythological/folkloric beings. */
export const DISCOVERY_ROOTS = {
  Q2239243: 'legendary creature'
};

export async function sparql(query, { ttlMs } = {}) {
  const body = new URLSearchParams({ query }).toString();
  const data = await fetchJson(SPARQL, {
    method: 'POST',
    body,
    ttlMs,
    timeoutMs: 90000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/sparql-results+json'
    }
  });
  return data?.results?.bindings || [];
}

const qidOf = uri => uri.split('/').pop();

/**
 * Discover QIDs of beings (instances of subclasses of the root classes)
 * that have an English Wikipedia article, with sitelink counts.
 */
export async function discoverBeings() {
  const out = new Map();
  for (const root of Object.keys(DISCOVERY_ROOTS)) {
    const rows = await sparql(`
      SELECT ?item ?sl WHERE {
        ?item wdt:P31/wdt:P279* wd:${root} .
        ?item wikibase:sitelinks ?sl .
        ?a schema:about ?item; schema:isPartOf <https://en.wikipedia.org/> .
      }`);
    for (const r of rows) {
      const qid = qidOf(r.item.value);
      out.set(qid, Math.max(out.get(qid) || 0, Number(r.sl.value)));
    }
  }
  return [...out.entries()].map(([qid, sitelinks]) => ({ qid, sitelinks }));
}

/**
 * Fetch full entities in batches of 50.
 * @returns {Promise<Map<string, object>>}
 */
export async function getEntities(qids, { props = 'labels|descriptions|aliases|claims|sitelinks', languages } = {}) {
  const out = new Map();
  for (const batch of chunk([...new Set(qids)], 50)) {
    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: batch.join('|'),
      props,
      format: 'json',
      maxlag: '5'
    });
    if (languages) params.set('languages', languages);
    const data = await fetchJson(`${API}?${params}`);
    for (const [id, entity] of Object.entries(data?.entities || {})) {
      if (entity.missing === undefined) out.set(id, entity);
    }
  }
  return out;
}

/** Labels/descriptions only, for referenced items (cultures, classes, countries). */
export async function getLabels(qids) {
  return getEntities(qids, { props: 'labels|descriptions|claims', languages: 'en|id' });
}

/** Resolve Wikipedia titles to QIDs via sitelinks. */
export async function resolveTitles(titles, site = 'enwiki') {
  const out = new Map();
  for (const batch of chunk(titles, 50)) {
    const params = new URLSearchParams({
      action: 'wbgetentities',
      sites: site,
      titles: batch.join('|'),
      props: 'sitelinks',
      sitefilter: site,
      format: 'json'
    });
    if (batch.length === 1) params.set('normalize', '1');
    const data = await fetchJson(`${API}?${params}`);
    for (const [id, entity] of Object.entries(data?.entities || {})) {
      if (entity.missing !== undefined) continue;
      const title = entity.sitelinks?.[site]?.title;
      if (title) out.set(title, id);
    }
  }
  return out;
}

/** Free-text search for an entity by name (used by the Research button). */
export async function searchEntity(name, language = 'en') {
  const params = new URLSearchParams({
    action: 'wbsearchentities',
    search: name,
    language,
    uselang: language,
    type: 'item',
    limit: '10',
    format: 'json'
  });
  const data = await fetchJson(`${API}?${params}`, { ttlMs: 24 * 3600 * 1000 });
  return (data?.search || []).map(s => ({ qid: s.id, label: s.label, description: s.description || '' }));
}

/** Transitive superclasses of a class (for classification). */
export async function superclassesOf(classQids) {
  if (classQids.length === 0) return new Map();
  const out = new Map();
  for (const batch of chunk(classQids, 150)) {
    const rows = await sparql(`
      SELECT ?c ?super WHERE {
        VALUES ?c { ${batch.map(q => `wd:${q}`).join(' ')} }
        ?c wdt:P279* ?super .
      }`);
    for (const r of rows) {
      const c = qidOf(r.c.value);
      if (!out.has(c)) out.set(c, new Set());
      out.get(c).add(qidOf(r.super.value));
    }
  }
  return out;
}

/* ---------- entity helpers ---------- */

export function claimValues(entity, prop) {
  return (entity?.claims?.[prop] || [])
    .filter(c => c.rank !== 'deprecated' && c.mainsnak?.snaktype === 'value')
    .map(c => c.mainsnak.datavalue?.value)
    .filter(v => v !== undefined);
}

export function claimQids(entity, prop) {
  return claimValues(entity, prop)
    .map(v => (typeof v === 'object' && v.id ? v.id : null))
    .filter(Boolean);
}

export function claimStrings(entity, prop) {
  return claimValues(entity, prop)
    .map(v => (typeof v === 'string' ? v : v?.text ? { text: v.text, language: v.language } : null))
    .filter(Boolean);
}

export function label(entity, lang) {
  return entity?.labels?.[lang]?.value || null;
}

export function description(entity, lang) {
  return entity?.descriptions?.[lang]?.value || null;
}

export function aliases(entity, lang) {
  return (entity?.aliases?.[lang] || []).map(a => a.value);
}

export function sitelinkTitle(entity, site) {
  return entity?.sitelinks?.[site]?.title || null;
}

export function entityUrl(qid) {
  return `https://www.wikidata.org/wiki/${qid}`;
}
