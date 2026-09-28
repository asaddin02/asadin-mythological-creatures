/**
 * Research: turns Wikidata QIDs into evidence-backed creature records.
 *
 * Output records are plain objects (no DB access). Every culture, classification,
 * ability, habitat, relation and attestation carries the source it came from and,
 * for text-derived facts, the exact quoted sentence. Nothing is generated to fill gaps:
 * a missing field simply stays missing.
 */

import * as wd from './wikidata.mjs';
import * as wp from './wikipedia.mjs';
import { fetchImageInfo, attributionText, isDisplayableMime } from './commons.mjs';
import { classifySections, extractEvidence, trimText, firstSentence, sortYear, normalizeForMatch } from './extract.mjs';
import {
  cultureFromCategory, cultureFromIdCategory, cultureFromWikidataLabel, cultureRank, classify, classifyIdCategory, isExcludedByClasses,
  CULTURE_LANGUAGES, CULTURES
} from './taxonomy.mjs';

export const LEGACY_SLUGS = {
  Q7206518: 'pocong', Q2362398: 'kuntilanak', Q4273060: 'genderuwo', Q188676: 'garuda', Q204753: 'barong',
  Q1964412: 'leak', Q692111: 'kitsune', Q730052: 'oni', Q129866: 'minotaur', Q160730: 'medusa',
  Q181227: 'jormungandr', Q182560: 'fenrir', Q273112: 'banshee', Q179818: 'quetzalcoatl', Q187002: 'baba-yaga',
  Q215605: 'long-dragon', Q7476246: 'wewe-gombel', Q17998776: 'banaspati'
};

const LEGENDARY_CREATURE = 'Q2239243';
const RELATION_PROPS = {
  P22: 'PARENT', P25: 'PARENT', P40: 'CHILD', P3373: 'SIBLING', P26: 'SPOUSE', P1038: 'RELATIVE',
  P460: 'POSSIBLE_VARIANT', P279: 'TYPE_OF'
};
const RELATION_LABEL = {
  P22: 'father', P25: 'mother', P40: 'child', P3373: 'sibling', P26: 'spouse', P1038: 'relative',
  P460: 'said to be the same as', P279: 'subclass of'
};
const PLACE_PROPS = { P276: 'location', P840: 'narrative location', P706: 'located on terrain feature' };
const CULTURE_PROPS = ['P361', 'P1080', 'P2596', 'P495'];
const TEXT_LIMITS = { overview: 1600, section: 1200 };
const SECTION_QUOTA = { etymology: 1, appearance: 1, behavior: 1, lore: 3, other: 2, modern: 1, analysis: 1 };
const ID_SECTION_QUOTA = { etymology: 1, appearance: 1, behavior: 1, lore: 2, other: 1, modern: 1, analysis: 0 };

const today = () => new Date().toISOString().slice(0, 10);

export function slugify(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[æ]/gi, 'ae')
    .replace(/[ø]/gi, 'o')
    .replace(/[ð]/gi, 'd')
    .replace(/[þ]/gi, 'th')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/* ---------------------------------------------------------------- sources */

function wikidataSource(qid, entity) {
  return {
    key: `wikidata:${qid}`,
    tier: 'REFERENCE',
    source_type: 'Structured knowledge base',
    title: `Wikidata item ${qid}${wd.label(entity, 'en') ? ` (“${wd.label(entity, 'en')}”)` : ''}`,
    author: 'Wikidata contributors',
    publisher: 'Wikimedia Foundation',
    url: wd.entityUrl(qid),
    language: 'mul',
    revision_id: entity?.lastrevid ? String(entity.lastrevid) : null,
    license: 'CC0 1.0',
    license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    retrieved_at: today()
  };
}

function wikipediaSource(lang, page) {
  page = { url: wp.pageUrl(lang, page.title), ...page };
  return {
    key: `${lang}wiki:${page.title}`,
    tier: 'REFERENCE',
    source_type: 'Encyclopedia article',
    title: `“${page.title}” — ${lang === 'en' ? 'English' : 'Indonesian'} Wikipedia`,
    author: 'Wikipedia contributors',
    publisher: 'Wikimedia Foundation',
    url: page.url,
    language: lang,
    revision_id: page.revid ? String(page.revid) : null,
    license: wp.WIKIPEDIA_LICENSE.name,
    license_url: wp.WIKIPEDIA_LICENSE.url,
    retrieved_at: today()
  };
}

function commonsSource(img) {
  return {
    key: `commons:${img.commons_file}`,
    tier: 'REFERENCE',
    source_type: 'Media repository file page',
    title: `File:${img.commons_file} — Wikimedia Commons`,
    author: img.author || null,
    publisher: 'Wikimedia Commons',
    url: img.source_url,
    language: 'mul',
    license: img.license,
    license_url: img.license_url,
    retrieved_at: today()
  };
}

/* ---------------------------------------------------------------- helpers */

function upsertSource(rec, src) {
  const i = rec.sources.findIndex(x => x.key === src.key);
  if (i < 0) rec.sources.push(src);
  else rec.sources[i] = { ...rec.sources[i], ...Object.fromEntries(Object.entries(src).filter(([, v]) => v != null)) };
  return src.key;
}

const GENERIC_CLASS = /^(mythical character|mythological character|legendary creature|mythical creature|folklore character|fictional character|character|creature|being|entity|supernatural being|fictional entity|class of fictional entities)$/i;
const MODERN_WORK = /\b(film|movie|episode|television|tv series|video game|novel|comic|anime|manga|song|album|musical|play by|book by|short story|web series|\d{4} (?:american|british|indonesian|japanese|malaysian|thai|korean|chinese|filipino|mexican|french|german|italian|spanish))\b/i;

function workIsModern(entity) {
  const desc = wd.description(entity, 'en') || '';
  if (MODERN_WORK.test(desc)) return true;
  for (const prop of ['P577', 'P571']) {
    const v = wd.claimValues(entity, prop)[0];
    const m = v?.time?.match(/^\+(\d{4})/);
    if (m && Number(m[1]) >= 1850) return true;
  }
  return false;
}

function pickSections(sections, quota, limit) {
  const used = Object.fromEntries(Object.keys(quota).map(k => [k, 0]));
  const out = [];
  let position = 0;
  for (const s of sections) {
    if (s.kind === 'skip' || s.text.length < 80) continue;
    if (s.kind === 'overview') {
      const t = trimText(s.text, limit.overview);
      out.push({ kind: 'overview', heading: null, body: t.text, truncated: t.truncated, position: position++ });
      continue;
    }
    if (!(s.kind in quota) || used[s.kind] >= quota[s.kind]) continue;
    used[s.kind]++;
    const t = trimText(s.text, limit.section);
    out.push({ kind: s.kind, heading: s.heading, body: t.text, truncated: t.truncated, position: position++ });
  }
  return out;
}

function textLayer(kind) {
  return kind === 'modern' ? 'MODERN_INTERPRETATION' : 'ATTRIBUTED';
}

function wikidataTime(entity, prop) {
  const v = wd.claimValues(entity, prop)[0];
  if (!v?.time) return null;
  const m = v.time.match(/^([+-])(\d+)-/);
  if (!m) return null;
  const year = Number(m[2]) * (m[1] === '-' ? -1 : 1);
  const precision = v.precision;
  let text;
  if (precision <= 7) {
    const c = Math.ceil(Math.abs(year) / 100);
    text = `${c}th century${year < 0 ? ' BCE' : ''}`;
  } else if (precision === 8) {
    text = `${Math.floor(Math.abs(year) / 10) * 10}s${year < 0 ? ' BCE' : ''}`;
  } else {
    text = `${Math.abs(year)}${year < 0 ? ' BCE' : ''}`;
  }
  return { text, year };
}

/* ---------------------------------------------------------------- research */

/**
 * @param {string[]} qids
 * @param {{ crawlPaths?: Map<string, string[][]>, onLog?: (msg: string) => void }} opts
 * @returns {Promise<{ records: object[], excluded: { qid: string, reason: string }[] }>}
 */
export async function researchBatch(qids, { crawlPaths = new Map(), onLog = () => {} } = {}) {
  const excluded = [];
  const entities = await wd.getEntities(qids, { props: 'labels|descriptions|aliases|claims|sitelinks|info' });

  // Referenced items: classes, culture statements, relations, stories, places.
  const refQids = new Set();
  for (const e of entities.values()) {
    for (const p of ['P31', ...CULTURE_PROPS, ...Object.keys(RELATION_PROPS), 'P1441', ...Object.keys(PLACE_PROPS)]) {
      for (const q of wd.claimQids(e, p)) refQids.add(q);
    }
  }
  const refs = await wd.getLabels([...refQids]);
  const refLabel = (q, lang = 'en') => wd.label(refs.get(q), lang) || null;

  const enTitles = [];
  for (const e of entities.values()) {
    const en = wd.sitelinkTitle(e, 'enwiki');
    if (en) enTitles.push(en);
  }
  const idTitles = [...entities.values()].map(e => wd.sitelinkTitle(e, 'idwiki')).filter(Boolean);
  const [enCats, enProps, idCats] = await Promise.all([
    wp.pageCategories(enTitles, 'en'),
    wp.pageProps(enTitles, 'en'),
    wp.pageCategories(idTitles, 'id')
  ]);

  const records = [];
  const imageWanted = new Map(); // qid -> [{ file, basis }]

  for (const qid of qids) {
    const e = entities.get(qid);
    if (!e) {
      excluded.push({ qid, reason: 'Wikidata item not found' });
      continue;
    }
    const classes = wd.claimQids(e, 'P31').map(q => ({ qid: q, label: refLabel(q) || q }));
    if (!LEGACY_SLUGS[qid] && isExcludedByClasses(classes.map(c => c.label))) {
      excluded.push({ qid, reason: `Not a being (instance of: ${classes.map(c => c.label).join(', ')})` });
      continue;
    }
    const enTitle = wd.sitelinkTitle(e, 'enwiki');
    const idTitle = wd.sitelinkTitle(e, 'idwiki');
    if (enTitle && enProps.get(enTitle)?.disambiguation) {
      excluded.push({ qid, reason: 'Disambiguation page' });
      continue;
    }
    const stripDisambig = t => (t ? t.replace(/\s*\([^)]*\)\s*$/, '').trim() : null);
    // Display name: the English Wikipedia title (most common English name), else the labels.
    const canonical = stripDisambig(enTitle) || wd.label(e, 'en') || stripDisambig(idTitle) || wd.label(e, 'id');
    if (!canonical) {
      excluded.push({ qid, reason: 'No English or Indonesian label/article' });
      continue;
    }

    const rec = {
      qid,
      slug: LEGACY_SLUGS[qid] || null,
      canonical_name: canonical,
      enwiki_title: enTitle,
      idwiki_title: idTitle,
      popularity: Object.keys(e.sitelinks || {}).filter(k => k.endsWith('wiki') && !['commonswiki', 'specieswiki', 'metawiki'].includes(k)).length,
      sources: [wikidataSource(qid, e)],
      names: [],
      translations: [],
      texts: [],
      cultures: [],
      categories: [],
      primary_region_id: null,
      abilities: [],
      traits: [],
      events: [],
      relations: [],
      stories: [],
      places: [],
      images: [],
      different_from: wd.claimQids(e, 'P1889'),
      log: []
    };
    const wdKey = `wikidata:${qid}`;
    if (enTitle) upsertSource(rec, wikipediaSource('en', { title: enTitle }));
    if (idTitle) upsertSource(rec, wikipediaSource('id', { title: idTitle }));

    /* names */
    const addName = (name, language, type, key = wdKey) => {
      if (!name || name.length > 120) return;
      if (rec.names.some(n => n.name === name && n.language === language && n.name_type === type)) return;
      rec.names.push({ name, language, name_type: type, source_key: key });
    };
    addName(canonical, 'en', 'canonical');
    if (wd.label(e, 'en') && wd.label(e, 'en').toLowerCase() !== canonical.toLowerCase()) addName(wd.label(e, 'en'), 'en', 'label');
    if (wd.label(e, 'id')) addName(wd.label(e, 'id'), 'id', 'label');
    for (const a of wd.aliases(e, 'en')) addName(a, 'en', 'alias');
    for (const a of wd.aliases(e, 'id')) addName(a, 'id', 'alias');
    for (const prop of ['P1559', 'P1705']) {
      for (const v of wd.claimStrings(e, prop)) if (typeof v === 'object') addName(v.text, v.language, 'native');
    }

    /* cultures: Wikipedia categories (own categories of the page) + Wikidata statements */
    const pageCats = [
      ...(enTitle ? enCats.get(enTitle) || [] : []),
      ...(enTitle ? (crawlPaths.get(enTitle) || []).map(p => p[p.length - 1]) : [])
    ];
    const uniqueCats = [...new Set(pageCats)];
    const cultureEvidence = new Map();
    let regionHint = null;
    const enwikiKey = enTitle ? `enwiki:${enTitle}` : null;
    const addCultureEvidence = (culture, weight, evidence, method) => {
      const ev = cultureEvidence.get(culture.slug) || { culture, evidence: [], methods: new Set(), score: 0 };
      ev.evidence.push(evidence);
      ev.methods.add(method);
      ev.score += weight;
      cultureEvidence.set(culture.slug, ev);
    };
    for (const cat of uniqueCats) {
      const { culture, region, weight } = cultureFromCategory(cat);
      if (!culture && region && !regionHint) regionHint = region;
      if (!culture) continue;
      addCultureEvidence(culture, weight, { source_key: enwikiKey, locator: `Wikipedia category “${cat}”`, quote: null }, 'category');
    }
    for (const prop of CULTURE_PROPS) {
      for (const q of wd.claimQids(e, prop)) {
        const lbl = refLabel(q);
        const culture = cultureFromWikidataLabel(lbl);
        if (!culture) continue;
        const propName = { P361: 'part of', P1080: 'from narrative universe', P2596: 'culture', P495: 'country of origin' }[prop];
        addCultureEvidence(culture, prop === 'P495' ? 2 : 3,
          { source_key: wdKey, locator: `Wikidata ${prop} (${propName}): “${lbl}” (${q})`, quote: null }, 'structured_data');
      }
    }
    if (idTitle) {
      for (const cat of idCats.get(idTitle) || []) {
        const culture = cultureFromIdCategory(cat);
        if (!culture) continue;
        addCultureEvidence(culture, 2,
          { source_key: `idwiki:${idTitle}`, locator: `Kategori Wikipedia Indonesia “${cat.replace(/^Kategori:/, '')}”`, quote: null }, 'category');
      }
    }
    const cultureList = [...cultureEvidence.values()].sort(
      (a, b) => b.score - a.score || cultureRank(a.culture) - cultureRank(b.culture)
    );
    rec.cultures = cultureList.map((c, i) => ({
      culture_id: c.culture.slug,
      is_primary: i === 0,
      transregional: c.culture.region == null,
      evidence: c.evidence,
      method: c.methods.has('structured_data') && !c.methods.has('category') ? 'structured_data' : 'category'
    }));
    rec.primary_region_id = cultureList.find(c => c.culture.region)?.culture.region || regionHint || null;
    if (!rec.cultures.length) rec.log.push('No culture evidence found (Wikipedia categories / Wikidata statements).');

    /* classification */
    const classes2 = classify(uniqueCats, classes);
    const isLegendary = classes.some(c => c.qid === LEGENDARY_CREATURE) || uniqueCats.some(c => /legendary creatures|folkloric beings/i.test(c));
    if (!classes2.length && idTitle) {
      for (const cat of idCats.get(idTitle) || []) {
        const cid = classifyIdCategory(cat);
        if (cid && !classes2.some(c => c.id === cid)) {
          classes2.push({ id: cid, basis: `Kategori Wikipedia Indonesia “${cat.replace(/^Kategori:/, '')}”`, method: 'category', source: `idwiki:${idTitle}` });
        }
      }
    }
    rec.categories = classes2.map((c, i) => ({
      category_id: c.id,
      is_primary: i === 0,
      evidence: [{ source_key: c.source || (c.method === 'category' ? enwikiKey : wdKey), locator: c.basis, quote: null }],
      method: c.method
    }));
    if (!rec.categories.length && isLegendary) {
      const basis = classes.some(c => c.qid === LEGENDARY_CREATURE)
        ? { source_key: wdKey, locator: `Wikidata: instance of “legendary creature” (${LEGENDARY_CREATURE})` }
        : { source_key: enwikiKey, locator: `Wikipedia category “${uniqueCats.find(c => /legendary creatures|folkloric beings/i.test(c))}”` };
      rec.categories.push({ category_id: 'legendary-creature', is_primary: true, evidence: [{ ...basis, quote: null }], method: basis.source_key === wdKey ? 'structured_data' : 'category' });
    }

    /* translations (short strings) */
    const descEn = wd.description(e, 'en');
    const descId = wd.description(e, 'id');
    rec.translations.push({ lang: 'en', field: 'name', value: canonical, method: 'source', source_key: enTitle ? `enwiki:${enTitle}` : wdKey });
    if (wd.label(e, 'id')) rec.translations.push({ lang: 'id', field: 'name', value: wd.label(e, 'id'), method: 'source', source_key: wdKey });
    if (descEn) rec.translations.push({ lang: 'en', field: 'summary', value: descEn, method: 'source', source_key: wdKey });
    if (descId) rec.translations.push({ lang: 'id', field: 'summary', value: descId, method: 'source', source_key: wdKey });

    /* relations, stories, places, attestation (structured) */
    for (const [prop, type] of Object.entries(RELATION_PROPS)) {
      for (const q of wd.claimQids(e, prop)) {
        const lbl = refLabel(q);
        if (!lbl) continue;
        if (prop === 'P279' && GENERIC_CLASS.test(lbl)) continue;
        rec.relations.push({
          relation_type: type, target_qid: q, target_label_en: lbl, target_label_id: refLabel(q, 'id'),
          source_key: wdKey, locator: `Wikidata ${prop} (${RELATION_LABEL[prop]})`
        });
      }
    }
    for (const q of wd.claimQids(e, 'P1441')) {
      const lbl = refLabel(q);
      if (!lbl) continue;
      rec.stories.push({
        qid: q, title_en: lbl, title_id: refLabel(q, 'id'), description_en: wd.description(refs.get(q), 'en'),
        description_id: wd.description(refs.get(q), 'id'),
        kind: workIsModern(refs.get(q)) ? 'modern_media' : 'traditional_text',
        url: wd.entityUrl(q), source_key: wdKey, locator: 'Wikidata P1441 (present in work)'
      });
    }
    for (const [prop, relation] of Object.entries(PLACE_PROPS)) {
      for (const q of wd.claimQids(e, prop)) {
        const lbl = refLabel(q);
        if (!lbl) continue;
        rec.places.push({
          qid: q, name_en: lbl, name_id: refLabel(q, 'id'), description_en: wd.description(refs.get(q), 'en'),
          relation, source_key: wdKey, locator: `Wikidata ${prop} (${relation})`
        });
      }
    }
    const earliest = wikidataTime(e, 'P1249');
    if (earliest) {
      rec.events.push({
        event_type: 'earliest_attestation', date_text: earliest.text, sort_year: earliest.year,
        description_en: `Earliest written record: ${earliest.text} (per Wikidata)`,
        description_id: `Catatan tertulis paling awal: ${earliest.text} (menurut Wikidata)`,
        quote: null, source_key: wdKey, locator: 'Wikidata P1249 (time of earliest written record)', confidence: 'MEDIUM'
      });
    }

    /* culture-language labels (not claimed as "original script", only as labels in that language) */
    for (const c of rec.cultures) {
      for (const lang of CULTURE_LANGUAGES[c.culture_id] || []) {
        const lbl = wd.label(e, lang);
        if (lbl && lbl.toLowerCase() !== canonical.toLowerCase()) addName(lbl, lang, 'label');
      }
    }

    /* images wanted: Wikidata P18 first, then the Wikipedia lead image */
    const wanted = wd.claimStrings(e, 'P18').filter(v => typeof v === 'string').map(f => ({ file: f, basis: 'wikidata_P18' }));
    const pageImage = enTitle ? enProps.get(enTitle)?.pageimage : null;
    if (pageImage) wanted.push({ file: pageImage.replace(/_/g, ' '), basis: 'wikipedia_pageimage' });
    imageWanted.set(qid, wanted);

    rec._entity = e;
    records.push(rec);
  }

  /* Wikipedia texts + evidence extraction (one request per article, cached) */
  for (const rec of records) {
    const names = rec.names.filter(n => ['canonical', 'label', 'alias'].includes(n.name_type) && ['en', 'id'].includes(n.language)).map(n => n.name);
    if (rec.enwiki_title) {
      const page = await wp.pageSections(rec.enwiki_title, 'en');
      if (page) {
        const src = wikipediaSource('en', page);
        upsertSource(rec, src);
        const classified = classifySections(page.sections);
        for (const t of pickSections(classified, SECTION_QUOTA, TEXT_LIMITS)) {
          rec.texts.push({ lang: 'en', ...t, layer: textLayer(t.kind), source_key: src.key });
        }
        if (!rec.translations.some(t => t.lang === 'en' && t.field === 'summary')) {
          const lead = classified.find(s => s.kind === 'overview');
          const first = firstSentence(lead?.text);
          if (first) rec.translations.push({ lang: 'en', field: 'summary', value: first, method: 'source', source_key: src.key });
        }
        const ev = extractEvidence(classified, { names: [...names, page.title] });
        for (const a of ev.abilities) rec.abilities.push({ ...a, source_key: src.key });
        for (const h of ev.habitats) {
          rec.traits.push({ trait_id: `habitat-${h.habitat_id}`, quote: h.quote, locator: h.locator, source_key: src.key });
        }
        if (ev.disposition) {
          rec.traits.push({
            trait_id: `disposition-${ev.disposition.value}`,
            quote: ev.disposition.evidence.map(x => x.quote).join(' … '),
            locator: ev.disposition.evidence.map(x => x.locator).join('; '),
            source_key: src.key
          });
        }
        for (const a of ev.attestations) {
          rec.events.push({
            event_type: 'attestation_statement', date_text: a.date_text, sort_year: sortYear(a.date_text),
            description_en: 'Statement about early attestation (quoted from source)',
            description_id: 'Pernyataan tentang atestasi awal (dikutip dari sumber)',
            quote: a.quote, source_key: src.key, locator: a.locator, confidence: 'LOW'
          });
        }
      } else {
        rec.log.push(`English Wikipedia article "${rec.enwiki_title}" could not be read.`);
      }
    }
    if (rec.idwiki_title) {
      const page = await wp.pageSections(rec.idwiki_title, 'id');
      if (page) {
        const src = wikipediaSource('id', page);
        upsertSource(rec, src);
        const classified = classifySections(page.sections);
        for (const t of pickSections(classified, ID_SECTION_QUOTA, TEXT_LIMITS)) {
          rec.texts.push({ lang: 'id', ...t, layer: textLayer(t.kind), source_key: src.key });
        }
        if (!rec.translations.some(t => t.lang === 'id' && t.field === 'summary')) {
          const lead = classified.find(s => s.kind === 'overview');
          const first = firstSentence(lead?.text);
          if (first) rec.translations.push({ lang: 'id', field: 'summary', value: first, method: 'source', source_key: src.key });
        }
        if (!rec.translations.some(t => t.lang === 'id' && t.field === 'name')) {
          rec.translations.push({ lang: 'id', field: 'name', value: page.title, method: 'source', source_key: src.key });
        }
      }
    }
  }

  /* images: real Commons metadata, displayable + known rights only for primary */
  const allFiles = [...imageWanted.values()].flat().map(w => w.file);
  const info = await fetchImageInfo(allFiles);
  for (const rec of records) {
    const seen = new Set();
    for (const w of imageWanted.get(rec.qid) || []) {
      const img = info.get(w.file) || info.get(w.file.replace(/_/g, ' '));
      if (!img || seen.has(img.commons_file)) continue;
      seen.add(img.commons_file);
      if (!isDisplayableMime(img.mime) || !img.urls[330]) {
        rec.log.push(`Image "${img.commons_file}" skipped: not a displayable image (${img.mime}).`);
        continue;
      }
      const src = commonsSource(img);
      upsertSource(rec, src);
      const haystack = normalizeForMatch(`${img.commons_file} ${img.description || ''}`);
      const mentions = rec.names.some(n => n.name.length >= 3 && haystack.includes(normalizeForMatch(n.name)));
      rec.images.push({
        ...img,
        attribution: attributionText(img),
        selection_basis: w.basis,
        source_key: src.key,
        is_primary: false,
        confidence: mentions ? 'HIGH' : w.basis === 'wikidata_P18' ? 'MEDIUM' : 'LOW',
        relevance_note: mentions
          ? 'File name or Commons description names this being.'
          : w.basis === 'wikidata_P18'
            ? 'Chosen as the representative image on Wikidata; file does not name the being.'
            : 'Lead image of the Wikipedia article; file does not name the being — may be illustrative only.'
      });
    }
    const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const primary = [...rec.images]
      .filter(i => i.rights_status !== 'UNKNOWN')
      .sort((a, b) => rank[a.confidence] - rank[b.confidence])[0];
    if (primary) primary.is_primary = true;
    if (!rec.images.length) rec.log.push('No verified image (no Wikidata P18 / Wikipedia lead image on Commons).');
    delete rec._entity;
  }

  onLog(`Researched ${records.length} entities, excluded ${excluded.length}.`);
  return { records, excluded };
}

/** Resolve a free-text name to candidate Wikidata items that look like beings. */
export async function resolveName(name) {
  const [en, id] = await Promise.all([wd.searchEntity(name, 'en'), wd.searchEntity(name, 'id')]);
  const seen = new Map();
  for (const r of [...en, ...id]) if (!seen.has(r.qid)) seen.set(r.qid, r);
  const candidates = [...seen.values()];
  if (!candidates.length) return [];
  const ents = await wd.getEntities(candidates.map(c => c.qid), { props: 'claims|sitelinks|labels', languages: 'en|id' });
  const classQids = new Set();
  for (const e of ents.values()) for (const q of wd.claimQids(e, 'P31')) classQids.add(q);
  const labels = await wd.getLabels([...classQids]);
  return candidates
    .map(c => {
      const e = ents.get(c.qid);
      const classes = wd.claimQids(e, 'P31').map(q => wd.label(labels.get(q), 'en') || q);
      return {
        ...c,
        classes,
        excluded: isExcludedByClasses(classes),
        has_article: Boolean(wd.sitelinkTitle(e, 'enwiki') || wd.sitelinkTitle(e, 'idwiki'))
      };
    })
    .filter(c => !c.excluded && c.has_article);
}

export { CULTURES };
