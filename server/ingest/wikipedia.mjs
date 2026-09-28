/**
 * Wikipedia access (MediaWiki Action API): category crawl, page categories,
 * full plain-text extracts split into sections, page images.
 * Wikipedia text is CC BY-SA 4.0 — every excerpt we store keeps its source URL and licence.
 */

import { fetchJson, chunk } from './http.mjs';

export const WIKIPEDIA_LICENSE = {
  name: 'CC BY-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/'
};

const api = lang => `https://${lang}.wikipedia.org/w/api.php`;

export function pageUrl(lang, title) {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
}

async function query(lang, params) {
  const results = [];
  let cont = {};
  for (let guard = 0; guard < 50; guard++) {
    const qs = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', ...params, ...cont });
    const data = await fetchJson(`${api(lang)}?${qs}`);
    if (!data) break;
    results.push(data);
    if (!data.continue) break;
    cont = data.continue;
  }
  return results;
}

/** Direct members (pages in ns 0 and subcategories) of a category. */
export async function categoryMembers(category, lang = 'en') {
  const pages = [];
  const subcats = [];
  const batches = await query(lang, {
    list: 'categorymembers',
    cmtitle: category.startsWith('Category:') ? category : `Category:${category}`,
    cmtype: 'page|subcat',
    cmlimit: '500'
  });
  for (const b of batches) {
    for (const m of b.query?.categorymembers || []) {
      if (m.ns === 14) subcats.push(m.title);
      else if (m.ns === 0) pages.push(m.title);
    }
  }
  return { pages, subcats };
}

/** Visible (non-hidden) categories for many pages. Returns Map<title, string[]>. */
export async function pageCategories(titles, lang = 'en') {
  const out = new Map();
  for (const batch of chunk(titles, 50)) {
    const batches = await query(lang, {
      prop: 'categories',
      titles: batch.join('|'),
      clshow: '!hidden',
      cllimit: 'max',
      redirects: '1'
    });
    for (const b of batches) {
      const redirects = new Map((b.query?.redirects || []).map(r => [r.to, r.from]));
      for (const p of b.query?.pages || []) {
        if (p.missing) continue;
        const cats = (p.categories || []).map(c => c.title.replace(/^Category:/, ''));
        const key = p.title;
        out.set(key, [...(out.get(key) || []), ...cats]);
        if (redirects.has(key)) out.set(redirects.get(key), out.get(key));
      }
    }
  }
  return out;
}

/** Wikidata QIDs and lead images for pages. Returns Map<title, { qid, pageimage, touched }>. */
export async function pageProps(titles, lang = 'en') {
  const out = new Map();
  for (const batch of chunk(titles, 50)) {
    const batches = await query(lang, {
      prop: 'pageprops|pageimages|info',
      ppprop: 'wikibase_item|disambiguation',
      piprop: 'name',
      titles: batch.join('|'),
      redirects: '1'
    });
    for (const b of batches) {
      for (const p of b.query?.pages || []) {
        if (p.missing) continue;
        const prev = out.get(p.title) || {};
        out.set(p.title, {
          qid: p.pageprops?.wikibase_item || prev.qid || null,
          disambiguation: p.pageprops?.disambiguation !== undefined || prev.disambiguation || false,
          pageimage: p.pageimage || prev.pageimage || null,
          revid: p.lastrevid || prev.revid || null
        });
      }
    }
  }
  return out;
}

/**
 * Full plain-text extract of one page, split into sections.
 * @returns {Promise<{ title: string, url: string, revid: number|null, sections: { heading: string, level: number, text: string }[] } | null>}
 */
export async function pageSections(title, lang = 'en') {
  const qs = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    prop: 'extracts|info',
    explaintext: '1',
    exsectionformat: 'wiki',
    redirects: '1',
    titles: title
  });
  const data = await fetchJson(`${api(lang)}?${qs}`);
  const page = data?.query?.pages?.[0];
  if (!page || page.missing || !page.extract) return null;

  const sections = [];
  let current = { heading: '', level: 1, lines: [] };
  for (const line of page.extract.split('\n')) {
    const m = line.match(/^(={2,6})\s*(.+?)\s*\1\s*$/);
    if (m) {
      sections.push(current);
      current = { heading: m[2], level: m[1].length, lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);

  return {
    title: page.title,
    url: pageUrl(lang, page.title),
    revid: page.lastrevid || null,
    sections: sections
      .map(s => ({ heading: s.heading, level: s.level, text: s.lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() }))
      .filter(s => s.text.length > 0)
  };
}
