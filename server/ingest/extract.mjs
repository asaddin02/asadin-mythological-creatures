/**
 * Evidence extraction from source text.
 *
 * Every extracted fact keeps the exact sentence it came from (the evidence quote) and
 * the section it was found in. Sentences from "popular culture"/"modern" sections are
 * kept apart as MODERN_INTERPRETATION and never mixed with tradition.
 * Extraction is pattern-based and conservative; results are labelled as automatic.
 */

const SKIP_HEADINGS = /^(see also|references|notes|footnotes|citations|sources|bibliography|further reading|external links|gallery|works cited|literature|explanatory notes|lihat pula|lihat juga|referensi|rujukan|catatan|catatan kaki|pranala luar|daftar pustaka|sumber|bacaan lanjut|bacaan lebih lanjut|galeri|kepustakaan)$/i;
const MODERN_HEADINGS = /(popular culture|in fiction|\bmodern\b|\bmedia\b|in literature|in film|\bfilms?\b|television|video games?|\bgames\b|comics|anime|manga|contemporary|legacy|adaptations?|in music|sightings|cultural references|appearances|portrayals?|depictions in|budaya populer|budaya pop|dalam film|\bfilm\b|adaptasi|media populer|era modern)/i;
const ANALYSIS_HEADINGS = /(analysis|interpretations?|psychoanaly|feminis|nihilis|symbolism|theories|theory|scholarship|comparative|eponym|namesakes?|science|flags|emblems|heraldry|astronomy|biology|taxonomy|mentioned in|parallels|in art\b|art$|archaeology|reception)/i;
const KIND_RULES = [
  ['etymology', /\b(etymolog\w*|names?|naming|terminology|nomenclature|word origin|etimologi|asal nama|penamaan|nama)\b/i],
  ['appearance', /\b(appearance|description|depictions?|physical|characteristics|features|iconography|forms?|penampilan|deskripsi|wujud|ciri(-ciri)?|penggambaran|rupa)\b/i],
  ['behavior', /\b(behaviou?r|habits|nature|powers|abilities|attributes|perilaku|sifat|kemampuan|kesaktian)\b/i],
  ['lore', /\b(legends?|folklore|myths?|story|stories|tales?|origins?|beliefs?|traditions?|history|accounts|cosmology|role|worship|religion|mythology|rituals?|variants?|versions?|regional|legenda|mitos|cerita|kisah|asal-usul|asal usul|kepercayaan|sejarah|tradisi|mitologi|ritual|versi)\b/i]
];

/** Classify a section heading (and its parent heading) into a content kind. */
export function sectionKind(heading, parentHeading = '') {
  if (!heading) return 'overview';
  if (SKIP_HEADINGS.test(heading.trim())) return 'skip';
  if (MODERN_HEADINGS.test(heading) || MODERN_HEADINGS.test(parentHeading)) return 'modern';
  if (ANALYSIS_HEADINGS.test(heading) || ANALYSIS_HEADINGS.test(parentHeading)) return 'analysis';
  for (const [kind, rx] of KIND_RULES) if (rx.test(heading)) return kind;
  if (parentHeading) for (const [kind, rx] of KIND_RULES) if (rx.test(parentHeading)) return kind;
  return 'other';
}

/** Attach a kind to every section, inheriting from the enclosing level-2 heading. */
export function classifySections(sections) {
  let parent = '';
  return sections.map(s => {
    if (s.level <= 2) parent = s.heading;
    const kind = sectionKind(s.heading, s.level > 2 ? parent : '');
    return { ...s, kind, parentHeading: s.level > 2 ? parent : '' };
  });
}

/** Trim text at a sentence boundary without cutting words. */
export function trimText(text, max) {
  if (!text || text.length <= max) return { text: text || '', truncated: false };
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'), cut.lastIndexOf('。'));
  const end = lastStop > max * 0.5 ? lastStop + 1 : cut.lastIndexOf(' ');
  return { text: `${cut.slice(0, end > 0 ? end : max).trim()} …`, truncated: true };
}

const ABBREVIATIONS = /\b(translit|lit|c|ca|e\.g|i\.e|etc|vs|St|Dr|Mr|Mrs|No|bhs|Jw|Skt|Jav|Bal|approx|pron|pl|sing|var|cf|ed|trans)\.$/i;

export function firstSentence(text, max = 280) {
  if (!text) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  const rx = /[.!?](?=\s|$)/g;
  let m;
  while ((m = rx.exec(clean))) {
    const candidate = clean.slice(0, m.index + 1);
    if (candidate.length < 40 || ABBREVIATIONS.test(candidate)) continue;
    if ((candidate.match(/\(/g) || []).length > (candidate.match(/\)/g) || []).length) continue;
    return candidate.length > max ? trimText(candidate, max).text : candidate;
  }
  return clean.length > max ? trimText(clean, max).text : clean;
}

/** Split text into sentences (keeps abbreviations like "c." reasonably intact). */
export function sentences(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?][”"’)]?)\s+(?=[A-Z"“‘(À-ɏ])/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 700);
}

const NEGATION = /\b(not|n't|never|cannot|unable|no longer|neither|nor|without|lacks?)\b/i;
const HEDGE = /\b(some (accounts|versions|stories|sources|traditions|tales|legends)|sometimes|occasionally|in some|rarely|a few|certain (accounts|versions|stories))\b/i;

/* ability id → pattern (sentence must match; negation just before the match is rejected) */
export const ABILITY_PATTERNS = {
  flight: /\b(fl(?:y|ies|ying|ew|own)\b(?! (?:into a rage|in the face))|flight\b|soar(?:s|ing|ed)?\b|airborne\b)/i,
  shapeshifting: /\b(shape-?shift\w*|shape-?chang\w*|transform(?:s|ed|ing)? (?:itself |himself |herself |themselves )?into\b|take(?:s|n)? (?:on )?the (?:form|shape|guise|appearance) of|assum(?:e|es|ed|ing) the (?:form|shape|guise) of|change(?:s|d)? (?:its|his|her|their) (?:form|shape)|metamorphos\w*|disguise(?:s|d)? (?:itself|himself|herself|themselves) as|can appear (?:as|in the form of))/i,
  immortality: /\b(immortal(?:ity)?\b|cannot (?:be killed|die)|undying\b|eternal life|live(?:s)? forever|never (?:dies|die|ages))/i,
  'supernatural-strength': /\b((?:superhuman|supernatural|immense|great|enormous|tremendous|incredible|prodigious|herculean) strength|strong enough to|extraordinarily strong)/i,
  regeneration: /\b(regenerat\w*|regrow\w*|grow(?:s)? back|heal(?:s)? (?:itself|its (?:own )?wounds))/i,
  magic: /\b(magic(?:al)? (?:powers?|abilities|arts)|sorcer(?:y|er|ess)\b|witchcraft\b|cast(?:s|ing)? (?:a )?spells?|enchant(?:s|ed|ment|ments)\b|wield(?:s)? magic|uses? magic)/i,
  possession: /\b(possess(?:es|ed|ing)? (?:a |the |their )?(?:person|people|humans?|victims?|bod(?:y|ies)|women|men|children|hosts?|individuals?|someone)|(?:spirit|demonic|fox) possession|kitsunetsuki|enter(?:s)? (?:the |a )?(?:body|bodies) of)/i,
  prophecy: /\b(prophec\w*|prophes\w*|prophetic\b|foretell\w*|foretold\b|foresee\w*|omen(?:s)? of|portend\w*|harbinger\b|herald(?:s|ed)? (?:death|doom|disaster|misfortune)|predict(?:s|ed)? (?:the )?(?:future|death))/i,
  'elemental-control': /\b(control(?:s|led|ling)? (?:the )?(?:weather|rain|winds?|water|fire|storms?|thunder|lightning|sea|waves)|(?:summon|bring|cause|produce|create|send)s? (?:rain|storms?|winds?|thunder|lightning|floods?|droughts?|hail|fog)|breath(?:e|es|ing)? (?:fire|flames)|fire-breathing|rainmak\w*)/i,
  invisibility: /\b(invisib\w*|become(?:s)? invisible|(?:is|are|remain(?:s)?) unseen|cannot be seen)/i,
  healing: /\b(heal(?:s|ed|ing)? (?:the |people|humans|wounds|sick|diseases?|illness)|cure(?:s|d)? (?:disease|illness|the sick|ailments)|healing (?:powers?|abilities|properties))/i,
  teleportation: /\b(teleport\w*|vanish(?:es)? and reappear\w*|(?:appear|disappear)s? (?:and (?:disappear|appear)s? )?at will)/i,
  'mind-manipulation': /\b(hypnoti\w*|mesmeri[sz]\w*|beguil\w*|lure(?:s|d)? (?:men|people|victims|travell?ers|sailors|children|humans|young men|fishermen)|bewitch\w*|drive(?:s|n)? (?:people|men|victims|them) (?:mad|insane)|charm(?:s|ed)? (?:men|people|victims)|induc(?:e|es|ing) (?:madness|fear|paralysis))/i,
  curse: /\b(curses (?:people|humans|those|anyone|victims|them)|place(?:s)? a curse|(?:bring|cause|inflict|spread)s? (?:misfortune|bad luck|disease|illness|plague|death|sickness|calamity))/i,
  petrification: /\b(turn(?:s|ed|ing)? (?:people |men |those |anyone |them |victims )?(?:in)?to stone|petrif\w*)/i,
  venom: /\b(venom(?:ous)?\b|poisonous (?:breath|bite|blood|gaze)|deadly poison)/i
};

export const HABITAT_PATTERNS = {
  water: /\b(rivers?|lakes?|seas?|oceans?|waters?|swamps?|marsh(?:es)?|wells?|springs?|ponds?|wetlands?|bogs?|streams?|lagoons?|waterfalls?)\b/i,
  forest: /\b(forests?|woods|woodlands?|jungles?|trees?|banyan|bamboo|groves?)\b/i,
  mountain: /\b(mountains?|hills?|highlands?|volcano(?:es)?)\b/i,
  cave: /\b(caves?|caverns?|grottos?)\b/i,
  graveyard: /\b(graves?|graveyards?|cemeter(?:y|ies)|tombs?|burial grounds?)\b/i,
  dwelling: /\b(houses?|homes?|households?|villages?|dwellings?|barns?|stables?)\b/i,
  sky: /\b(sky|skies|clouds?|heavens)\b/i,
  underworld: /\b(underworld|netherworld|hell|infernal realm)\b/i,
  desert: /\b(deserts?|dunes?)\b/i,
  fields: /\b(fields?|roads?|crossroads|paths?|rice paddies|paddy fields?)\b/i
};
const HABITAT_VERB = /\b(lives?|lived|living|dwell(?:s|ed|ing)?|dwelt|inhabit(?:s|ed|ing)?|resid(?:e|es|ed|ing)|haunt(?:s|ed|ing)?|is found|are found|can be found|makes? (?:its|their) home|nests?|lurk(?:s|ed|ing)?|roams?)\b/i;

const DISPOSITION = {
  malevolent: /\b(malevolent|malicious|evil|harmful|dangerous|vengeful|bloodthirsty|murderous|man-eating|devours? (?:humans|people|children|travell?ers))\b/i,
  benevolent: /\b(benevolent|protective|helpful|benign|guardian|friendly|kind-hearted|brings? (?:good luck|fortune|prosperity)|protects? (?:people|humans|villages|travell?ers|households))\b/i
};

const ATTESTATION = /\b((?:earliest|first) (?:known |recorded |written |surviving |extant )?(?:reference|mention|record|attestation|account|appearance|depiction|description|source)s?|(?:first|earliest) (?:appears?|appeared|recorded|attested|mentioned|described|documented)|is first attested)\b/i;
const DATE_EXPR = /(\b\d{1,2}(?:st|nd|rd|th)[- ]centur(?:y|ies)(?: (?:BC|BCE|AD|CE))?|\b(?:c\.|circa|around|about) \d{3,4}(?: (?:BC|BCE|AD|CE))?|\b\d{3,4} (?:BC|BCE|AD|CE)\b|\b(?:AD|CE) \d{2,4}\b|\bin (?:1[0-9]{3}|20[0-2][0-9])\b|\b(?:1[0-9]{3}|20[0-2][0-9])s?\b)/i;

const RELAXED_KINDS = new Set(['overview', 'appearance', 'behavior']);
const PRONOUN_START = /^(it|they|she|he|its|their|this (?:creature|being|spirit|ghost|demon|monster)|these (?:creatures|beings|spirits)|the (?:creature|being|spirit|ghost|demon|monster|serpent|dragon|beast|fox|entity|figure))\b/i;

export function normalizeForMatch(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/** Index of the first mention of any subject name in the sentence (-1 if none). */
function subjectIndex(normSentence, names) {
  let best = -1;
  for (const n of names) {
    let from = 0;
    for (;;) {
      const i = normSentence.indexOf(n, from);
      if (i < 0) break;
      const before = i === 0 ? ' ' : normSentence[i - 1];
      if (!/[a-z0-9]/.test(before)) {
        if (best < 0 || i < best) best = i;
        break;
      }
      from = i + 1;
    }
  }
  return best;
}

/**
 * Is the match about the subject? In lead/appearance/behaviour sections a sentence that
 * starts with a pronoun or names the subject before the match is accepted; elsewhere the
 * subject must be named within 120 characters before the match.
 */
function anchored(sentence, matchIndex, names, kind) {
  const norm = normalizeForMatch(sentence);
  const idx = subjectIndex(norm, names);
  if (RELAXED_KINDS.has(kind)) {
    if (idx >= 0 && idx <= matchIndex) return true;
    return PRONOUN_START.test(sentence) && matchIndex <= 250;
  }
  return idx >= 0 && idx <= matchIndex && matchIndex - idx <= 100;
}

/** A capitalised word in mid-sentence is usually a title or proper noun ("Ovid's Metamorphoses"). */
function looksLikeTitle(sentence, index, matched) {
  return index > 0 && /^[A-Z]/.test(matched) && !/[.!?"“]\s*$/.test(sentence.slice(0, index));
}

function negatedBefore(sentence, index) {
  const window = sentence.slice(Math.max(0, index - 45), index);
  return NEGATION.test(window);
}

function quote(sentence) {
  return sentence.length > 400 ? `${sentence.slice(0, 397)}…` : sentence;
}

/**
 * Extract abilities, habitats, disposition and attestation statements from classified sections.
 * @param {{ heading: string, kind: string, text: string }[]} sections
 * @returns {{ abilities: object[], habitats: object[], disposition: object|null, attestations: object[] }}
 */
export function extractEvidence(sections, { names = [] } = {}) {
  const subjectNames = [...new Set(names.map(normalizeForMatch).map(n => n.trim()).filter(n => n.length >= 3))];
  const abilities = new Map();
  const habitats = new Map();
  const dispositionHits = { malevolent: null, benevolent: null };
  const attestations = [];

  for (const section of sections) {
    if (section.kind === 'skip' || section.kind === 'analysis' || section.kind === 'etymology') continue;
    const layer = section.kind === 'modern' ? 'MODERN_INTERPRETATION' : 'ATTRIBUTED';
    const locator = section.heading ? `section "${section.heading}"` : 'lead section';
    for (const sentence of sentences(section.text)) {
      for (const [id, rx] of Object.entries(ABILITY_PATTERNS)) {
        const m = rx.exec(sentence);
        if (!m || negatedBefore(sentence, m.index) || looksLikeTitle(sentence, m.index, m[0])) continue;
        if (!anchored(sentence, m.index, subjectNames, section.kind)) continue;
        const key = `${id}|${layer}`;
        if (abilities.has(key)) continue;
        abilities.set(key, {
          ability_id: id,
          layer,
          evidence_level: layer === 'MODERN_INTERPRETATION' ? 'MODERN_INTERPRETATION' : HEDGE.test(sentence) ? 'OCCASIONALLY_REPORTED' : 'ATTRIBUTED',
          quote: quote(sentence),
          locator,
          matched: m[0]
        });
      }
      if (layer !== 'ATTRIBUTED') continue;

      const verb = HABITAT_VERB.exec(sentence);
      if (verb && anchored(sentence, verb.index, subjectNames, section.kind)) {
        for (const [id, rx] of Object.entries(HABITAT_PATTERNS)) {
          const m = rx.exec(sentence.slice(verb.index));
          if (!m || habitats.has(id) || m.index > 90 || negatedBefore(sentence, verb.index + m.index)) continue;
          habitats.set(id, { habitat_id: id, quote: quote(sentence), locator, matched: m[0] });
        }
      }
      for (const [kind, rx] of Object.entries(DISPOSITION)) {
        const m = rx.exec(sentence);
        if (m && !dispositionHits[kind] && !negatedBefore(sentence, m.index) && anchored(sentence, m.index, subjectNames, section.kind)) {
          dispositionHits[kind] = { quote: quote(sentence), locator, matched: m[0] };
        }
      }
      const att = ATTESTATION.exec(sentence);
      if (att && subjectIndex(normalizeForMatch(sentence), subjectNames) >= 0) {
        const d = DATE_EXPR.exec(sentence);
        if (d && attestations.length < 3) attestations.push({ date_text: d[0], quote: quote(sentence), locator });
      }
    }
  }

  let disposition = null;
  if (dispositionHits.malevolent && dispositionHits.benevolent) {
    disposition = { value: 'ambivalent', evidence: [dispositionHits.malevolent, dispositionHits.benevolent] };
  } else if (dispositionHits.malevolent) {
    disposition = { value: 'malevolent', evidence: [dispositionHits.malevolent] };
  } else if (dispositionHits.benevolent) {
    disposition = { value: 'benevolent', evidence: [dispositionHits.benevolent] };
  }

  return { abilities: [...abilities.values()], habitats: [...habitats.values()], disposition, attestations };
}

/** Approximate sortable year from a date expression (negative for BCE). */
export function sortYear(dateText) {
  if (!dateText) return null;
  const bc = /\b(BC|BCE)\b/i.test(dateText);
  const century = dateText.match(/(\d{1,2})(?:st|nd|rd|th)[- ]centur/i);
  if (century) {
    const c = Number(century[1]);
    return bc ? -(c * 100 - 50) : c * 100 - 50;
  }
  const year = dateText.match(/\d{2,4}/);
  if (!year) return null;
  return bc ? -Number(year[0]) : Number(year[0]);
}
