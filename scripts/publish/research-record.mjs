/**
 * The public library: only creatures whose fill status is "lengkap-bergambar" (verified research that
 * meets its tier target and has an approved image), each shown with its research entry instead of the
 * older imported or hand-written text.
 *
 * Kept from data/creatures.json: identity (id, slug), the approved images and the power profile.
 * Everything a reader sees as fact comes from the research entry, where every statement cites a quote.
 * Legacy fields the research does not cover (template timelines, learning notes, ability matrices)
 * are dropped rather than shown next to verified text.
 */
import { computeFillStatus } from '../gemini/fill-lib.mjs';

const RELATION_NOTE = { id: '', en: '' };
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : s);
const joinParas = (paras, lang) => (paras || []).map(p => p?.[lang]).filter(Boolean).join('\n\n');
const bi = t => (t ? { id: t.id, en: t.en } : undefined);

const commonsImage = (img, slug, i) => {
  const file = img.commons_file.replace(/^File:/, '');
  const path = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
  return {
    id: `commons-${slug}-${i + 1}`,
    creature_slug: slug,
    url: `${path}?width=1200`,
    thumbnail_url: `${path}?width=480`,
    preview_url: `${path}?width=800`,
    caption: bi(img.caption),
    source_name: 'Wikimedia Commons',
    source_url: img.commons_url,
    author: img.creator || 'Wikimedia Commons',
    license: img.license,
    image_type: img.image_type,
    is_primary: !!img.is_primary,
  };
};

/**
 * @param {object} e     research entry (mythics-entry/1)
 * @param {object|undefined} base  the creature's record in data/creatures.json, if any
 * @param {{ regionName: Map<string,string>, cultures: Set<string>, categories: Set<string>, slugs: Set<string> }} ctx
 */
export function toSiteRecord(e, base, ctx) {
  const slug = e.slug;
  const sourceById = new Map(e.sources.map(s => [s.id, s]));
  const culture = ctx.cultures.has(e.culture?.value) ? e.culture.value : base?.culture || 'transregional';
  const classification = ctx.categories.has(e.classification?.value) ? e.classification.value : base?.classification;
  const aiImages = (base?.images || []).filter(i => i.ai_generated);
  const images = [...aiImages, ...(e.images || []).map((img, i) => commonsImage(img, slug, i))];
  if (images.length && !images.some(i => i.is_primary)) images[0] = { ...images[0], is_primary: true };

  return {
    id: base?.id || slug,
    slug,
    canonical_name: e.identity.canonical_name,
    original_name: e.identity.native_name?.text || base?.original_name || e.identity.canonical_name,
    display_name: bi(e.identity.display_name),
    alternate_names: (e.alternate_names || []).map(a => ({ name: a.name, language: a.language, name_type: a.name_type })),
    short_description: bi(e.short_description),
    long_description: { id: joinParas(e.long_description, 'id'), en: joinParas(e.long_description, 'en') },
    classification,
    jenis: e.jenis?.value,
    culture,
    region: ctx.regionName.get(e.region?.value) || base?.region,
    country: e.countries?.value?.join(', ') || undefined,
    era: e.era?.text?.en || undefined,
    habitat: cap(e.habitats?.[0]?.value) || undefined,
    behavior: cap(e.disposition?.value) || undefined,
    traits: (e.traits || []).map(t => t.value),
    etymology: e.etymology
      ? { original_form: e.etymology.original_form, language: e.etymology.language, literal_meaning: bi(e.etymology.literal_meaning) }
      : undefined,
    story_mode: e.story_mode
      ? Object.fromEntries(Object.entries(e.story_mode).filter(([, v]) => v).map(([k, v]) => [k, bi(v)]))
      : undefined,
    did_you_know: bi(e.did_you_know),
    cultural_context: bi(e.cultural_context),
    documented_abilities: (e.abilities || []).map(a => ({ ability_id: a.ability_id, name: a.name, description: a.description, evidence_level: 'Sourced' })),
    weaknesses_limitations: (e.weaknesses || []).map(w => ({ name: w.name, description: w.description, evidence_level: 'Sourced' })),
    variants: (e.variants || []).map(v => ({ name: v.name, region_or_tradition: v.tradition, description: v.description })),
    associated_stories: (e.stories || []).map(s => ({ title: s.title, role: s.role, summary: s.summary })),
    associated_places: (e.places || []).map(p => ({ name: p.name, type: p.type, description: p.description })),
    historical_timeline: (e.timeline || []).map(t => ({ period: t.period, title: t.title, description: t.description, earliest_attestation: !!t.earliest_attestation })),
    // A relation to a creature outside the public library keeps its name but gets a non-linking id.
    semantic_relations: (e.relations || []).map(r => {
      const target = slugify(r.target_name);
      return { target_slug: ctx.slugs.has(target) ? target : `ref-${target}`, target_name: r.target_name, relation_type: r.relation_type, note: r.note || RELATION_NOTE };
    }),
    related_creature_ids: (e.relations || []).map(r => slugify(r.target_name)).filter(s => ctx.slugs.has(s) && s !== slug),
    pop_culture_contrast: e.tradition_vs_modern
      ? { traditional_summary: e.tradition_vs_modern.traditional, modern_depiction: e.tradition_vs_modern.modern }
      : undefined,
    modern_depictions: (e.modern_depictions || []).map(m => ({ title: m.title, year: m.year, medium: m.medium, description: m.description })),
    conflicts: (e.conflicts || []).map(c => ({ topic: c.topic, positions: c.positions.map(p => ({ summary: p.summary })) })),
    learning_notes: e.learning_questions?.length
      ? { questions: e.learning_questions.map(q => ({ id: q.id, en: q.en })) }
      : undefined,
    images,
    sources: e.sources.map(s => ({
      id: s.id,
      title: s.title,
      source_name: s.publisher,
      author: s.author || undefined,
      publication_date: s.published || undefined,
      url: s.url,
      language: s.language,
      source_type: s.type,
      accessed_date: s.accessed,
      ...(s.type === 'wikipedia' ? { license: 'CC BY-SA 4.0' } : {}),
    })),
    claims_provenance: e.claims.map(c => {
      const s = sourceById.get(c.source_id);
      return {
        claim: c.statement,
        claim_type: c.context,
        evidence_source_id: c.source_id,
        quote: c.quote,
        locator: c.locator,
        source_citation: s ? `${s.publisher} — ${s.title}` : c.source_id,
        source_type: s?.type,
      };
    }),
    research_gaps: (e.gaps || []).map(g => ({ field: g.field, note: g.searched })),
    power_profile: base?.power_profile || { dimensions: {}, calculated_basis: [], disclaimer: { id: 'Skor belum tersedia.', en: 'No scores available.' } },
    content_tier: e.tier,
    completeness_score: base?.completeness_score,
    confidence_score: 'Verified',
    status: 'published',
    research_batch: e.batch_id,
    researched_at: e.researched_at,
    created_at: base?.created_at || `${e.researched_at}T00:00:00Z`,
    updated_at: `${e.researched_at}T00:00:00Z`,
    wikidata_qid: e.identity.wikidata_qid || undefined,
  };
}

/**
 * @param {{ creatures: object[], cultures: object[], categories: object[], regions: object[] }} data
 * @returns {Promise<object[]>} the public library, ordered by canonical name
 */
export async function publishedCreatures(data) {
  const { status, entries } = await computeFillStatus(data.creatures);
  const bySlug = new Map(data.creatures.map(c => [c.slug, c]));
  const publish = Object.entries(status).filter(([, v]) => v.status === 'lengkap-bergambar').map(([slug]) => slug);
  const ctx = {
    regionName: new Map([...data.regions.map(r => [r.id, r.name.en]), ['transregional', 'Transregional']]),
    cultures: new Set(data.cultures.map(c => c.id)),
    categories: new Set(data.categories.map(c => c.id)),
    slugs: new Set(publish),
  };
  return publish
    .map(slug => toSiteRecord(entries.get(slug), bySlug.get(slug), ctx))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name));
}
