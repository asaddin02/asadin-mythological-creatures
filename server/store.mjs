/**
 * Write side of the data layer: persists research records as relational rows,
 * keeps revision snapshots, maintains the search index, links relations and flags
 * potential duplicates (never auto-merges).
 */

import { getDb, tx, now } from './db/index.mjs';
import { evaluate } from './quality.mjs';
import { computePowerProfile } from './power-engine.mjs';
import { slugify } from './ingest/research.mjs';
import { normalizeForMatch } from './ingest/extract.mjs';
import { CLASSIFICATIONS, ABILITIES, HABITATS } from './ingest/taxonomy.mjs';

const CAT = Object.fromEntries(CLASSIFICATIONS.map(c => [c.id, c]));
const ABL = Object.fromEntries(ABILITIES.map(a => [a.id, a]));
const HAB = Object.fromEntries(HABITATS.map(h => [`habitat-${h.id}`, h]));
const DISPOSITION = {
  'disposition-malevolent': ['described as malevolent or dangerous', 'digambarkan jahat atau berbahaya'],
  'disposition-benevolent': ['described as benevolent or protective', 'digambarkan baik atau melindungi'],
  'disposition-ambivalent': ['described both as harmful and as benevolent', 'digambarkan berbahaya sekaligus baik']
};
const RELATION_TEXT = {
  PARENT: ['parent', 'orang tua'], CHILD: ['child', 'anak'], SIBLING: ['sibling', 'saudara'], SPOUSE: ['spouse', 'pasangan'],
  RELATIVE: ['relative', 'kerabat'], POSSIBLE_VARIANT: ['possibly the same as / variant of', 'mungkin sama dengan / varian dari'],
  TYPE_OF: ['a type of', 'sejenis'], ASSOCIATED: ['associated with', 'terkait dengan'], ENEMY: ['enemy', 'musuh'],
  ALLY: ['ally', 'sekutu'], COUNTERPART: ['counterpart', 'padanan'], VARIANT: ['variant', 'varian']
};
const EDITOR_LOCKED_STATUSES = new Set(['ARCHIVED', 'DISPUTED', 'NEEDS_REVISION', 'APPROVED']);

export const normalizeName = s => normalizeForMatch(s).replace(/[^a-z0-9Ā-￿]+/g, ' ').trim();

function uniqueSlug(db, base, qid) {
  let slug = base || slugify(qid);
  const taken = db.prepare('SELECT wikidata_qid FROM creatures WHERE slug = ?').get(slug);
  if (!taken || taken.wikidata_qid === qid) return slug;
  slug = `${base}-${qid.toLowerCase()}`;
  return slug;
}

export function snapshotCreature(db, id) {
  const creature = db.prepare('SELECT * FROM creatures WHERE id = ?').get(id);
  if (!creature) return null;
  const pick = (sql) => db.prepare(sql).all(id);
  return {
    creature,
    translations: pick('SELECT lang, field, value, method FROM creature_translations WHERE creature_id = ?'),
    cultures: pick('SELECT culture_id, is_primary FROM creature_cultures WHERE creature_id = ?'),
    categories: pick('SELECT category_id, is_primary FROM creature_categories WHERE creature_id = ?'),
    abilities: pick('SELECT ability_id, layer, evidence_level FROM creature_abilities WHERE creature_id = ?'),
    images: pick('SELECT commons_file, license, is_primary FROM images WHERE creature_id = ?'),
    claims: pick('SELECT claim_type, layer, statement_en, evidence_level FROM claims WHERE creature_id = ?')
  };
}

export function addRevision(db, creatureId, changedBy, note) {
  const snap = snapshotCreature(db, creatureId);
  if (!snap) return;
  const version = (db.prepare('SELECT MAX(version) v FROM revisions WHERE creature_id = ?').get(creatureId)?.v || 0) + 1;
  db.prepare('INSERT INTO revisions (creature_id, version, snapshot, changed_by, change_note, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(creatureId, version, JSON.stringify(snap), changedBy, note || null, now());
}

export function addReview(db, creatureId, decision, reviewer, notes) {
  db.prepare('INSERT INTO editorial_reviews (creature_id, decision, reviewer, notes, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(creatureId, decision, reviewer, notes || null, now());
}

function upsertSources(db, sources) {
  const ids = new Map();
  const up = db.prepare(`INSERT INTO sources (source_key, tier, source_type, title, author, publisher, publication_year, url, language,
      revision_id, license, license_url, retrieved_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(source_key) DO UPDATE SET tier=excluded.tier, source_type=excluded.source_type, title=excluded.title,
      author=excluded.author, publisher=excluded.publisher, url=excluded.url, language=excluded.language,
      revision_id=COALESCE(excluded.revision_id, sources.revision_id), license=excluded.license,
      license_url=excluded.license_url, retrieved_at=excluded.retrieved_at
    RETURNING id`);
  for (const s of sources) {
    const row = up.get(s.key, s.tier, s.source_type, s.title, s.author ?? null, s.publisher ?? null, s.publication_year ?? null,
      s.url ?? null, s.language ?? null, s.revision_id ?? null, s.license ?? null, s.license_url ?? null, s.retrieved_at ?? null);
    ids.set(s.key, row.id);
  }
  return ids;
}

function clearAutoRows(db, id) {
  for (const table of ['creature_cultures', 'creature_categories', 'creature_traits', 'creature_abilities', 'creature_relations',
    'creature_variants', 'creature_stories', 'creature_places', 'historical_events', 'power_profiles', 'creature_names', 'creature_texts']) {
    db.prepare(`DELETE FROM ${table} WHERE creature_id = ?`).run(id);
  }
  db.prepare("DELETE FROM images WHERE creature_id = ? AND selection_basis != 'editorial'").run(id);
  db.prepare("DELETE FROM creature_translations WHERE creature_id = ? AND method != 'editorial'").run(id);
  db.prepare("DELETE FROM claims WHERE creature_id = ? AND method != 'editorial'").run(id);
}

function insertClaim(db, creatureId, sourceIds, claim, evidence) {
  const row = db.prepare(`INSERT INTO claims (creature_id, claim_type, layer, statement_en, statement_id, evidence_level, confidence, method, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
    .get(creatureId, claim.type, claim.layer, claim.en, claim.id ?? null, claim.evidence_level, claim.confidence, claim.method, now());
  // one row per source: merge locators/quotes from the same source
  const bySource = new Map();
  for (const ev of evidence) {
    const sid = sourceIds.get(ev.source_key);
    if (!sid) continue;
    const cur = bySource.get(sid) || { quotes: [], locators: [] };
    if (ev.quote) cur.quotes.push(ev.quote);
    if (ev.locator) cur.locators.push(ev.locator);
    bySource.set(sid, cur);
  }
  const ins = db.prepare('INSERT INTO claim_sources (claim_id, source_id, evidence_quote, evidence_locator) VALUES (?, ?, ?, ?)');
  for (const [sid, v] of bySource) ins.run(row.id, sid, v.quotes.join(' … ') || null, v.locators.join('; ') || null);
  return row.id;
}

/** Rebuild the full-text rows for one creature. */
export function indexCreature(db, id) {
  db.prepare('DELETE FROM creature_search WHERE creature_id = ?').run(id);
  db.prepare('DELETE FROM creature_name_trigram WHERE creature_id = ?').run(id);
  const names = db.prepare('SELECT DISTINCT name FROM creature_names WHERE creature_id = ?').all(id).map(r => r.name);
  const bodyParts = [];
  for (const r of db.prepare('SELECT value FROM creature_translations WHERE creature_id = ?').all(id)) bodyParts.push(r.value);
  for (const r of db.prepare(`SELECT c.name_en, c.name_id FROM creature_cultures cc JOIN cultures c ON c.id = cc.culture_id WHERE cc.creature_id = ?`).all(id)) {
    bodyParts.push(r.name_en, r.name_id);
  }
  for (const r of db.prepare(`SELECT k.name_en, k.name_id FROM creature_categories x JOIN categories k ON k.id = x.category_id WHERE x.creature_id = ?`).all(id)) {
    bodyParts.push(r.name_en, r.name_id);
  }
  for (const r of db.prepare(`SELECT a.name_en, a.name_id FROM creature_abilities x JOIN abilities a ON a.id = x.ability_id
      WHERE x.creature_id = ? AND x.layer != 'MODERN_INTERPRETATION'`).all(id)) bodyParts.push(r.name_en, r.name_id);
  for (const r of db.prepare(`SELECT t.name_en, t.name_id FROM creature_traits x JOIN traits t ON t.id = x.trait_id WHERE x.creature_id = ?`).all(id)) {
    bodyParts.push(r.name_en, r.name_id);
  }
  const reg = db.prepare(`SELECT r.name_en, r.name_id FROM creatures c JOIN regions r ON r.id = c.primary_region_id WHERE c.id = ?`).get(id);
  if (reg) bodyParts.push(reg.name_en, reg.name_id);
  const overview = db.prepare("SELECT body FROM creature_texts WHERE creature_id = ? AND kind = 'overview' AND lang = 'en'").get(id);
  if (overview) bodyParts.push(overview.body.slice(0, 400));
  db.prepare('INSERT INTO creature_search (names, body, creature_id) VALUES (?, ?, ?)').run(names.join(' | '), bodyParts.filter(Boolean).join(' | '), id);
  db.prepare('INSERT INTO creature_name_trigram (names, creature_id) VALUES (?, ?)').run(names.join(' | '), id);
}

/**
 * Persist a research record.
 * @param {object} r research record
 * @param {{ publish?: boolean, reviewer?: string, note?: string }} opts
 *   publish=true lets an entry that passes the QC gate go live (batch scale mode);
 *   otherwise it lands in REVIEW for an editor (Research button mode).
 */
export function saveRecord(r, { publish = false, reviewer = 'pipeline', note } = {}) {
  return tx(db => {
    const existing = db.prepare('SELECT * FROM creatures WHERE wikidata_qid = ?').get(r.qid)
      || (r.slug ? db.prepare('SELECT * FROM creatures WHERE slug = ?').get(r.slug) : null);
    const ts = now();

    const duplicateOfPublished = db.prepare(`SELECT DISTINCT c.slug, c.wikidata_qid FROM creature_names n JOIN creatures c ON c.id = n.creature_id
        WHERE n.normalized = ? AND n.name_type IN ('canonical','label') AND c.status = 'PUBLISHED' AND c.wikidata_qid != ?`)
      .all(normalizeName(r.canonical_name), r.qid)
      .filter(x => !(r.different_from || []).includes(x.wikidata_qid))
      .map(x => x.slug);
    const qc = evaluate(r, { duplicateOfPublished });

    let status;
    if (existing && EDITOR_LOCKED_STATUSES.has(existing.status)) status = existing.status;
    // A refresh never silently unpublishes: a failed QC on a live entry is logged for editors instead.
    else if (existing?.status === 'PUBLISHED') status = 'PUBLISHED';
    else status = publish && qc.passed ? 'PUBLISHED' : 'REVIEW';
    const editorialState = existing?.editorial_state === 'editor_reviewed'
      ? 'editor_reviewed'
      : status === 'PUBLISHED' ? 'auto_qc_passed' : 'unreviewed';

    let id;
    const primaryCat = r.categories.find(c => c.is_primary)?.category_id || null;
    const primaryCulture = r.cultures.find(c => c.is_primary)?.culture_id || null;
    const primaryImage = r.images.find(i => i.is_primary);
    const values = [
      r.canonical_name, primaryCat, primaryCulture, r.primary_region_id, status, editorialState, qc.tier, qc.completeness,
      qc.confidence, r.popularity, primaryImage ? 1 : 0, JSON.stringify(qc.checks), r.enwiki_title, r.idwiki_title,
      JSON.stringify(r.different_from || [])
    ];
    if (existing) {
      addRevision(db, existing.id, reviewer, note || 'Refreshed from sources');
      id = existing.id;
      db.prepare(`UPDATE creatures SET canonical_name=?, primary_category_id=?, primary_culture_id=?, primary_region_id=?, status=?,
          editorial_state=?, content_tier=?, completeness=?, confidence=?, popularity=?, has_image=?, qc_report=?, enwiki_title=?,
          idwiki_title=?, different_from=?, wikidata_qid=?, updated_at=?, last_ingested_at=?,
          published_at=CASE WHEN ?='PUBLISHED' THEN COALESCE(published_at, ?) ELSE published_at END
        WHERE id=?`).run(...values, r.qid, ts, ts, status, ts, id);
      clearAutoRows(db, id);
    } else {
      const slug = uniqueSlug(db, r.slug || slugify(r.canonical_name), r.qid);
      id = db.prepare(`INSERT INTO creatures (canonical_name, primary_category_id, primary_culture_id, primary_region_id, status,
          editorial_state, content_tier, completeness, confidence, popularity, has_image, qc_report, enwiki_title, idwiki_title,
          different_from, slug, wikidata_qid, created_at, updated_at, last_ingested_at, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
        .get(...values, slug, r.qid, ts, ts, ts, status === 'PUBLISHED' ? ts : null).id;
    }

    const sourceIds = upsertSources(db, r.sources);
    const sid = key => sourceIds.get(key) ?? null;

    /* names & translations & texts */
    const insName = db.prepare(`INSERT OR IGNORE INTO creature_names (creature_id, name, normalized, language, name_type, source_id)
      VALUES (?, ?, ?, ?, ?, ?)`);
    for (const n of r.names) insName.run(id, n.name, normalizeName(n.name), n.language ?? null, n.name_type, sid(n.source_key));
    const insTr = db.prepare(`INSERT INTO creature_translations (creature_id, lang, field, value, method, source_id) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(creature_id, lang, field) DO NOTHING`);
    for (const t of r.translations) insTr.run(id, t.lang, t.field, t.value, t.method, sid(t.source_key));
    const insText = db.prepare(`INSERT INTO creature_texts (creature_id, lang, kind, layer, heading, body, truncated, position, source_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const t of r.texts) insText.run(id, t.lang, t.kind, t.layer, t.heading ?? null, t.body, t.truncated ? 1 : 0, t.position, sid(t.source_key));

    /* cultures & categories */
    const cultureNames = new Map(db.prepare('SELECT id, name_en, name_id FROM cultures').all().map(c => [c.id, c]));
    for (const c of r.cultures) {
      const cn = cultureNames.get(c.culture_id);
      if (!cn) continue;
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'culture', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED', confidence: 'MEDIUM', method: c.method,
        en: `Recorded in the ${cn.name_en} tradition.`, id: `Tercatat dalam tradisi ${cn.name_id}.`
      }, c.evidence);
      db.prepare('INSERT OR IGNORE INTO creature_cultures (creature_id, culture_id, is_primary, claim_id) VALUES (?, ?, ?, ?)')
        .run(id, c.culture_id, c.is_primary ? 1 : 0, claimId);
    }
    for (const c of r.categories) {
      const k = CAT[c.category_id];
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'classification', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED', confidence: 'MEDIUM', method: c.method,
        en: `Classified as: ${k.en}.`, id: `Diklasifikasikan sebagai: ${k.id_}.`
      }, c.evidence);
      db.prepare('INSERT OR IGNORE INTO creature_categories (creature_id, category_id, is_primary, claim_id) VALUES (?, ?, ?, ?)')
        .run(id, c.category_id, c.is_primary ? 1 : 0, claimId);
    }

    /* abilities (tradition and modern kept apart by layer) */
    for (const a of r.abilities) {
      const ab = ABL[a.ability_id];
      const modern = a.layer === 'MODERN_INTERPRETATION';
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'ability', layer: a.layer, evidence_level: a.evidence_level, confidence: 'LOW', method: 'text_extraction',
        en: modern ? `Modern media depicts: ${ab.en.toLowerCase()}.` : `Attributed ability: ${ab.en.toLowerCase()}.`,
        id: modern ? `Media modern menggambarkan: ${ab.id_.toLowerCase()}.` : `Kemampuan yang disebutkan: ${ab.id_.toLowerCase()}.`
      }, [{ source_key: a.source_key, quote: a.quote, locator: a.locator }]);
      db.prepare('INSERT OR IGNORE INTO creature_abilities (creature_id, ability_id, layer, evidence_level, claim_id) VALUES (?, ?, ?, ?, ?)')
        .run(id, a.ability_id, a.layer, a.evidence_level, claimId);
    }

    /* traits (habitat / disposition) */
    for (const t of r.traits) {
      const [en, idText] = t.trait_id.startsWith('habitat-')
        ? [`Associated with: ${HAB[t.trait_id].en.toLowerCase()}.`, `Dikaitkan dengan: ${HAB[t.trait_id].id_.toLowerCase()}.`]
        : [`${DISPOSITION[t.trait_id][0][0].toUpperCase()}${DISPOSITION[t.trait_id][0].slice(1)}.`,
          `${DISPOSITION[t.trait_id][1][0].toUpperCase()}${DISPOSITION[t.trait_id][1].slice(1)}.`];
      const claimId = insertClaim(db, id, sourceIds, {
        type: t.trait_id.startsWith('habitat-') ? 'habitat' : 'disposition', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED',
        confidence: 'LOW', method: 'text_extraction', en, id: idText
      }, [{ source_key: t.source_key, quote: t.quote, locator: t.locator }]);
      db.prepare('INSERT OR IGNORE INTO creature_traits (creature_id, trait_id, claim_id) VALUES (?, ?, ?)').run(id, t.trait_id, claimId);
    }

    /* timeline */
    for (const e of r.events) {
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'attestation', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED', confidence: e.confidence,
        method: e.quote ? 'text_extraction' : 'structured_data', en: e.description_en, id: e.description_id
      }, [{ source_key: e.source_key, quote: e.quote, locator: e.locator }]);
      db.prepare(`INSERT INTO historical_events (creature_id, event_type, date_text, sort_year, description_en, description_id, claim_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, e.event_type, e.date_text, e.sort_year, e.description_en, e.description_id, claimId);
    }

    /* relations (targets linked to creatures in a later pass) */
    for (const rel of r.relations) {
      const [en, idText] = RELATION_TEXT[rel.relation_type];
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'relation', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED', confidence: 'MEDIUM', method: 'structured_data',
        en: `${rel.target_label_en}: ${en}.`, id: `${rel.target_label_id || rel.target_label_en}: ${idText}.`
      }, [{ source_key: rel.source_key, quote: null, locator: rel.locator }]);
      db.prepare(`INSERT OR IGNORE INTO creature_relations (creature_id, relation_type, target_qid, target_label_en, target_label_id, claim_id)
        VALUES (?, ?, ?, ?, ?, ?)`).run(id, rel.relation_type, rel.target_qid, rel.target_label_en, rel.target_label_id ?? null, claimId);
    }

    /* stories & places */
    for (const st of r.stories) {
      const story = db.prepare(`INSERT INTO stories (wikidata_qid, kind, title_en, title_id, description_en, description_id, url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(wikidata_qid) DO UPDATE SET kind=excluded.kind, title_en=excluded.title_en, title_id=excluded.title_id,
            description_en=excluded.description_en, description_id=excluded.description_id, url=excluded.url
          RETURNING id`)
        .get(st.qid, st.kind, st.title_en, st.title_id ?? null, st.description_en ?? null, st.description_id ?? null, st.url);
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'story', layer: st.kind === 'modern_media' ? 'MODERN_INTERPRETATION' : 'ATTRIBUTED',
        evidence_level: st.kind === 'modern_media' ? 'MODERN_INTERPRETATION' : 'ATTRIBUTED', confidence: 'MEDIUM',
        method: 'structured_data', en: `Appears in: ${st.title_en}.`, id: `Muncul dalam: ${st.title_id || st.title_en}.`
      }, [{ source_key: st.source_key, quote: null, locator: st.locator }]);
      db.prepare('INSERT OR IGNORE INTO creature_stories (creature_id, story_id, role, claim_id) VALUES (?, ?, ?, ?)').run(id, story.id, null, claimId);
    }
    for (const pl of r.places) {
      const place = db.prepare(`INSERT INTO places (wikidata_qid, name_en, name_id, description_en) VALUES (?, ?, ?, ?)
          ON CONFLICT(wikidata_qid) DO UPDATE SET name_en=excluded.name_en, name_id=excluded.name_id, description_en=excluded.description_en
          RETURNING id`).get(pl.qid, pl.name_en, pl.name_id ?? null, pl.description_en ?? null);
      const claimId = insertClaim(db, id, sourceIds, {
        type: 'place', layer: 'ATTRIBUTED', evidence_level: 'ATTRIBUTED', confidence: 'MEDIUM', method: 'structured_data',
        en: `Associated place (${pl.relation}): ${pl.name_en}.`, id: `Tempat terkait (${pl.relation}): ${pl.name_id || pl.name_en}.`
      }, [{ source_key: pl.source_key, quote: null, locator: pl.locator }]);
      db.prepare('INSERT OR IGNORE INTO creature_places (creature_id, place_id, relation, claim_id) VALUES (?, ?, ?, ?)')
        .run(id, place.id, pl.relation, claimId);
    }

    /* images */
    const insImg = db.prepare(`INSERT OR IGNORE INTO images (creature_id, commons_file, remote_url, url_330, url_500, url_960, source_url, author,
        credit, license, license_url, usage_terms, rights_status, attribution_required, attribution, restrictions, image_type,
        image_type_basis, date_text, width, height, mime, is_primary, selection_basis, relevance_note, caption_en, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`);
    for (const img of r.images) {
      const row = insImg.get(id, img.commons_file, img.remote_url, img.urls[330], img.urls[500], img.urls[960], img.source_url,
        img.author, img.credit, img.license, img.license_url, img.usage_terms, img.rights_status, img.attribution_required ? 1 : 0,
        img.attribution, img.restrictions, img.image_type, img.image_type_basis, img.date_text, img.width, img.height, img.mime,
        img.is_primary ? 1 : 0, img.selection_basis, img.relevance_note, img.description, img.confidence);
      if (row && sid(img.source_key)) db.prepare('INSERT OR IGNORE INTO image_sources (image_id, source_id) VALUES (?, ?)').run(row.id, sid(img.source_key));
    }

    /* power profile from evidenced rows */
    const profile = computePowerProfile({
      abilities: r.abilities,
      categories: r.categories,
      popularity: r.popularity,
      habitats: r.traits.filter(t => t.trait_id.startsWith('habitat-')).map(t => t.trait_id.slice(8))
    });
    const insPower = db.prepare('INSERT INTO power_profiles (creature_id, dimension, score, basis) VALUES (?, ?, ?, ?)');
    for (const p of profile) insPower.run(id, p.dimension, p.score, JSON.stringify(p.basis));

    addReview(db, id, qc.passed ? 'auto_qc_pass' : 'auto_qc_fail', 'auto-qc',
      qc.passed ? `QC passed (${qc.tier}); status ${status}.` : `Failed: ${qc.checks.filter(c => !c.ok && c.severity === 'error').map(c => c.message).join('; ')}`);
    indexCreature(db, id);
    return { id, qid: r.qid, status, qc };
  });
}

/** Link relation targets and variants to creatures that exist in the DB. */
export function linkRelations() {
  const db = getDb();
  db.exec(`UPDATE creature_relations SET target_creature_id = (
      SELECT c.id FROM creatures c WHERE c.wikidata_qid = creature_relations.target_qid)
    WHERE target_qid IS NOT NULL`);
}

/**
 * Flag creatures that share a name. Canonical/label collisions demote the less
 * documented auto-published entry to REVIEW; alias collisions are only flagged.
 * @returns {{ strong: number, weak: number, demoted: string[] }}
 */
export function detectDuplicates() {
  const db = getDb();
  const rows = db.prepare(`SELECT n.creature_id, n.normalized, n.name, n.name_type, c.wikidata_qid, c.popularity, c.status,
      c.editorial_state, c.slug, c.different_from
    FROM creature_names n JOIN creatures c ON c.id = n.creature_id
    WHERE n.name_type IN ('canonical','label','alias') AND (n.language IN ('en','id') OR n.language IS NULL) AND length(n.normalized) >= 4`).all();
  const byName = new Map();
  for (const r of rows) {
    if (!byName.has(r.normalized)) byName.set(r.normalized, []);
    byName.get(r.normalized).push(r);
  }
  let strong = 0;
  let weak = 0;
  const demoted = [];
  const ins = db.prepare(`INSERT INTO duplicate_candidates (creature_id, other_creature_id, reason, created_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(creature_id, other_creature_id) DO NOTHING`);
  return tx(() => {
    for (const [normalized, list] of byName) {
      const ids = [...new Set(list.map(l => l.creature_id))];
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const a = list.find(l => l.creature_id === ids[i]);
          const b = list.find(l => l.creature_id === ids[j]);
          const distinct = JSON.parse(a.different_from || '[]').includes(b.wikidata_qid) || JSON.parse(b.different_from || '[]').includes(a.wikidata_qid);
          if (distinct) continue;
          const isStrong = list.filter(l => l.creature_id === a.creature_id || l.creature_id === b.creature_id)
            .every(l => l.name_type !== 'alias');
          const [lo, hi] = a.creature_id < b.creature_id ? [a, b] : [b, a];
          const res = ins.run(lo.creature_id, hi.creature_id,
            `${isStrong ? 'Same name' : 'Shared alternate name'}: “${list.find(l => l.creature_id === a.creature_id).name}”`, now());
          if (!res.changes) continue;
          if (isStrong) {
            strong++;
            const weaker = a.popularity <= b.popularity ? a : b;
            if (weaker.status === 'PUBLISHED' && weaker.editorial_state === 'auto_qc_passed') {
              db.prepare("UPDATE creatures SET status = 'REVIEW', updated_at = ? WHERE id = ?").run(now(), weaker.creature_id);
              addReview(db, weaker.creature_id, 'duplicate_resolution', 'auto-qc', `Moved to review: possible duplicate of ${(weaker === a ? b : a).slug} (${normalized}).`);
              demoted.push(weaker.slug);
            }
          } else {
            weak++;
          }
        }
      }
    }
    return { strong, weak, demoted };
  });
}

/** Editorial status change with review log and revision snapshot. */
export function setStatus(slug, status, reviewer, notes) {
  return tx(db => {
    const c = db.prepare('SELECT id, status FROM creatures WHERE slug = ?').get(slug);
    if (!c) return null;
    addRevision(db, c.id, reviewer, `Status ${c.status} → ${status}${notes ? `: ${notes}` : ''}`);
    const decision = { PUBLISHED: 'approve', APPROVED: 'approve', ARCHIVED: 'reject', NEEDS_REVISION: 'needs_revision', DISPUTED: 'dispute', REVIEW: 'note' }[status] || 'note';
    db.prepare(`UPDATE creatures SET status = ?, editorial_state = CASE WHEN ? IN ('PUBLISHED','APPROVED') THEN 'editor_reviewed' ELSE editorial_state END,
        updated_at = ?, published_at = CASE WHEN ? = 'PUBLISHED' THEN COALESCE(published_at, ?) ELSE published_at END WHERE id = ?`)
      .run(status, status, now(), status, now(), c.id);
    addReview(db, c.id, decision, reviewer, notes);
    return { id: c.id, slug, status };
  });
}

/** Editorial edit of a short translation (name/summary). Stored with method 'editorial' so refreshes keep it. */
export function editTranslation(slug, lang, field, value, reviewer) {
  return tx(db => {
    const c = db.prepare('SELECT id FROM creatures WHERE slug = ?').get(slug);
    if (!c) return null;
    addRevision(db, c.id, reviewer, `Edited ${field} (${lang})`);
    db.prepare(`INSERT INTO creature_translations (creature_id, lang, field, value, method, source_id) VALUES (?, ?, ?, ?, 'editorial', NULL)
      ON CONFLICT(creature_id, lang, field) DO UPDATE SET value=excluded.value, method='editorial', source_id=NULL`)
      .run(c.id, lang, field, value);
    addReview(db, c.id, 'edit', reviewer, `Edited ${field} (${lang}).`);
    indexCreature(db, c.id);
    return { id: c.id, slug };
  });
}

export function resolveDuplicate(candidateId, status, reviewer) {
  return tx(db => {
    const d = db.prepare('SELECT * FROM duplicate_candidates WHERE id = ?').get(candidateId);
    if (!d) return null;
    db.prepare('UPDATE duplicate_candidates SET status = ?, resolved_at = ? WHERE id = ?').run(status, now(), candidateId);
    addReview(db, d.creature_id, 'duplicate_resolution', reviewer, `Duplicate candidate #${candidateId} marked ${status}.`);
    return { id: candidateId, status };
  });
}
