/**
 * Quality gate, completeness, confidence and content tier.
 *
 * Completeness = how much is filled in. Confidence = how strong the sources are.
 * They are deliberately independent: a fully filled entry sourced only from
 * reference works (Wikipedia/Wikidata) is capped at MEDIUM confidence.
 */

const TRADITION_LAYERS = new Set(['ATTRIBUTED', 'DOCUMENTED_TRADITION']);

/**
 * @param {object} r research record (see ingest/research.mjs)
 * @param {{ duplicateOfPublished?: string[] }} ctx
 */
export function evaluate(r, ctx = {}) {
  const has = {
    name: Boolean(r.canonical_name),
    classification: r.categories.length > 0,
    culture: r.cultures.length > 0,
    regionOrTransregional:
      Boolean(r.primary_region_id) || (r.cultures.length > 0 && r.cultures.every(c => c.transregional)),
    descriptionEn: r.texts.some(t => t.lang === 'en' && t.kind === 'overview') || r.translations.some(t => t.lang === 'en' && t.field === 'summary'),
    descriptionId: r.texts.some(t => t.lang === 'id' && t.kind === 'overview') || r.translations.some(t => t.lang === 'id' && t.field === 'summary'),
    source: r.sources.length > 0,
    image: r.images.some(i => i.is_primary && i.rights_status !== 'UNKNOWN'),
    imageRightsOk: r.images.filter(i => i.is_primary).every(i => i.rights_status !== 'UNKNOWN'),
    noDuplicate: !(ctx.duplicateOfPublished || []).length
  };

  const checks = [
    { id: 'canonical_name', ok: has.name, severity: 'error', message: 'Canonical name' },
    { id: 'classification', ok: has.classification, severity: 'error', message: 'Classification with evidence' },
    { id: 'culture', ok: has.culture, severity: 'error', message: 'Cultural tradition with evidence' },
    { id: 'region', ok: has.regionOrTransregional, severity: 'error', message: 'Region (or explicitly transregional tradition)' },
    { id: 'description', ok: has.descriptionEn || has.descriptionId, severity: 'error', message: 'Description in at least one language' },
    { id: 'source', ok: has.source, severity: 'error', message: 'At least one source' },
    { id: 'image_or_none', ok: true, severity: 'error', message: has.image ? 'Verified image' : 'Explicit "no verified image"' },
    { id: 'image_rights', ok: has.imageRightsOk, severity: 'error', message: 'Primary image has known reuse rights' },
    { id: 'no_duplicate', ok: has.noDuplicate, severity: 'error',
      message: has.noDuplicate ? 'No name collision with a published entry' : `Possible duplicate of: ${ctx.duplicateOfPublished.join(', ')}` },
    { id: 'translation_en', ok: has.descriptionEn, severity: 'warning', message: 'English description' },
    { id: 'translation_id', ok: has.descriptionId, severity: 'warning', message: 'Indonesian description' }
  ];
  const passed = checks.filter(c => c.severity === 'error').every(c => c.ok);

  /* completeness (weights sum to 100) */
  const tradAbilities = r.abilities.filter(a => TRADITION_LAYERS.has(a.layer));
  const parts = [
    [5, has.name],
    [6, r.translations.some(t => t.lang === 'en' && t.field === 'summary')],
    [6, r.translations.some(t => t.lang === 'id' && t.field === 'summary')],
    [6, has.classification],
    [8, has.culture],
    [4, Boolean(r.primary_region_id)],
    [8, r.texts.some(t => t.lang === 'en' && t.kind === 'overview')],
    [6, r.texts.some(t => t.lang === 'id' && t.kind === 'overview')],
    [4, r.names.filter(n => n.name_type === 'alias').length >= 1],
    [3, r.names.some(n => n.name_type === 'native' || (n.name_type === 'label' && !['en', 'id'].includes(n.language)))],
    [4, r.texts.some(t => t.kind === 'etymology')],
    [4, r.texts.some(t => t.kind === 'appearance' || t.kind === 'behavior')],
    [5, r.texts.some(t => t.kind === 'lore')],
    [5, tradAbilities.length > 0],
    [2, r.traits.some(t => t.trait_id.startsWith('habitat-'))],
    [8, has.image],
    [4, r.relations.length + r.stories.length + r.places.length > 0],
    [3, r.events.length > 0],
    [2, r.texts.some(t => t.kind === 'modern')],
    [5, new Set(r.sources.filter(s => !s.key.startsWith('commons:')).map(s => s.key)).size >= 2]
  ];
  const completeness = Math.round(parts.reduce((sum, [w, ok]) => sum + (ok ? w : 0), 0));

  /* confidence from source tiers, never from volume */
  const tiers = new Set(r.sources.map(s => s.tier));
  // HIGH needs a primary, scholarly or institutional source (added by editors).
  // Reference works (Wikipedia/Wikidata) can at most give MEDIUM.
  let confidence = 'LOW';
  if (tiers.has('PRIMARY') || tiers.has('SCHOLARLY') || tiers.has('INSTITUTIONAL')) confidence = 'HIGH';
  else if (has.culture && has.classification && r.texts.some(t => t.kind === 'overview')) confidence = 'MEDIUM';

  /* tier */
  let tier = 'none';
  if (passed) {
    tier = 'core';
    const richSignals = [
      r.names.filter(n => n.name_type === 'alias').length >= 2,
      r.texts.some(t => t.kind === 'etymology'),
      r.texts.some(t => t.kind === 'appearance' || t.kind === 'behavior'),
      r.texts.some(t => t.kind === 'lore'),
      tradAbilities.length > 0,
      r.relations.length + r.stories.length + r.places.length > 0,
      r.events.length > 0,
      has.descriptionId && has.descriptionEn
    ].filter(Boolean).length;
    if (richSignals >= 4) tier = 'rich';
    const scholarly = tiers.has('PRIMARY') || tiers.has('SCHOLARLY');
    if (tier === 'rich' && scholarly && r.events.length > 0) tier = 'archive';
  }

  return { checks, passed, completeness, confidence, tier };
}
