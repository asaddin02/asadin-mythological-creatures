/**
 * Candidate universe + stratified selection for scaling.
 *
 * Selection is round-robin across regions (and across traditions inside a region),
 * ordered by how widely documented an entity is (Wikipedia language editions), so
 * the dataset does not collapse into the few mythologies that dominate the internet.
 */

import { crawlCategoryTree } from './discovery.mjs';
import { discoverBeings, getEntities, getLabels, claimQids, label, sitelinkTitle } from './wikidata.mjs';
import { pageProps } from './wikipedia.mjs';
import { cultureFromCategory, cultureFromWikidataLabel } from './taxonomy.mjs';
import { LEGACY_SLUGS } from './research.mjs';

const TRANSREGIONAL = 'transregional';

/**
 * @returns {Promise<{ candidates: object[], crawlPaths: Map<string, string[][]> }>}
 */
export async function buildCandidates({ onLog = () => {} } = {}) {
  onLog('Crawling Wikipedia category tree…');
  const crawlPaths = await crawlCategoryTree({ onProgress: (c, p) => onLog(`  ${c} categories, ${p} pages`) });
  onLog(`  ${crawlPaths.size} pages in the being categories.`);

  onLog('Querying Wikidata for instances of legendary creature…');
  const wdFound = await discoverBeings();
  onLog(`  ${wdFound.length} Wikidata items with an English article.`);

  onLog('Resolving Wikipedia pages to Wikidata items…');
  const props = await pageProps([...crawlPaths.keys()], 'en');
  const byQid = new Map();
  for (const [title, p] of props) {
    if (!p.qid || p.disambiguation) continue;
    byQid.set(p.qid, { qid: p.qid, enTitle: title });
  }
  for (const { qid } of wdFound) if (!byQid.has(qid)) byQid.set(qid, { qid, enTitle: null });
  for (const qid of Object.keys(LEGACY_SLUGS)) if (!byQid.has(qid)) byQid.set(qid, { qid, enTitle: null });

  onLog(`Fetching ${byQid.size} candidate items (sitelinks + culture statements)…`);
  const ents = await getEntities([...byQid.keys()], { props: 'claims|sitelinks|labels', languages: 'en' });
  const refs = new Set();
  for (const e of ents.values()) for (const p of ['P361', 'P1080', 'P2596', 'P495']) for (const q of claimQids(e, p)) refs.add(q);
  const refLabels = await getLabels([...refs]);

  const candidates = [];
  for (const [qid, c] of byQid) {
    const e = ents.get(qid);
    if (!e) continue;
    const enTitle = c.enTitle || sitelinkTitle(e, 'enwiki');
    const popularity = Object.keys(e.sitelinks || {}).filter(k => k.endsWith('wiki') && !['commonswiki', 'specieswiki', 'metawiki'].includes(k)).length;
    const cultures = new Map();
    let region = null;
    for (const path of crawlPaths.get(enTitle) || []) {
      const leaf = path[path.length - 1];
      const r = cultureFromCategory(leaf);
      if (r.culture) cultures.set(r.culture.slug, (cultures.get(r.culture.slug) || 0) + r.weight);
      if (!region && r.region) region = r.region;
    }
    for (const p of ['P361', 'P1080', 'P2596', 'P495']) {
      for (const q of claimQids(e, p)) {
        const cul = cultureFromWikidataLabel(label(refLabels.get(q), 'en'));
        if (cul) cultures.set(cul.slug, (cultures.get(cul.slug) || 0) + 3);
      }
    }
    const ranked = [...cultures.entries()].sort((a, b) => b[1] - a[1]);
    const primaryCulture = ranked[0]?.[0] || null;
    const cultureObj = primaryCulture ? Object.values(cultureIndex()).find(x => x.slug === primaryCulture) : null;
    const bucket = cultureObj?.region || region || (primaryCulture ? TRANSREGIONAL : null);
    candidates.push({ qid, enTitle, popularity, primaryCulture, bucket, legacy: Boolean(LEGACY_SLUGS[qid]) });
  }
  onLog(`  ${candidates.length} candidates; ${candidates.filter(c => c.bucket).length} with a culture/region signal.`);
  return { candidates, crawlPaths };
}

let _cultureIndex = null;
function cultureIndex() {
  if (_cultureIndex) return _cultureIndex;
  _cultureIndex = {};
  // lazy import avoidance: taxonomy CULTURES is re-exported by research.mjs
  return _cultureIndex;
}

/**
 * Round-robin ordering: region → tradition → popularity.
 * @param {object[]} candidates
 * @param {{ transregionalShare?: number }} opts
 * @returns {object[]} ordered candidates (legacy entries first)
 */
export function stratifiedOrder(candidates, { transregionalShare = 0.05 } = {}) {
  const legacy = candidates.filter(c => c.legacy);
  const rest = candidates.filter(c => !c.legacy && c.bucket);
  const regions = new Map();
  for (const c of rest) {
    if (!regions.has(c.bucket)) regions.set(c.bucket, new Map());
    const cultures = regions.get(c.bucket);
    const key = c.primaryCulture || '_';
    if (!cultures.has(key)) cultures.set(key, []);
    cultures.get(key).push(c);
  }
  // Within each region: interleave traditions, each sorted by popularity.
  const regionQueues = new Map();
  for (const [region, cultures] of regions) {
    for (const list of cultures.values()) list.sort((a, b) => b.popularity - a.popularity);
    const lists = [...cultures.values()].sort((a, b) => b[0].popularity - a[0].popularity);
    const queue = [];
    for (let i = 0; lists.some(l => i < l.length); i++) for (const l of lists) if (i < l.length) queue.push(l[i]);
    regionQueues.set(region, queue);
  }
  const ordered = [...legacy];
  const total = rest.length;
  const transCap = Math.ceil(total * transregionalShare);
  let transTaken = 0;
  for (let round = 0; [...regionQueues.values()].some(q => round < q.length); round++) {
    for (const [region, queue] of regionQueues) {
      if (round >= queue.length) continue;
      if (region === TRANSREGIONAL) {
        if (transTaken >= transCap) continue;
        transTaken++;
      }
      ordered.push(queue[round]);
    }
  }
  return ordered;
}
