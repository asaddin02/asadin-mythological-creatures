/**
 * Mythics Power Profile — editorial visualisation, not a canonical ranking.
 *
 * Every point comes from a stored, evidenced attribute (an attributed ability,
 * an evidenced classification, or a measurable signal such as the number of
 * Wikipedia language editions). A dimension with no evidenced basis has no score
 * (null) instead of a made-up default.
 */

export const DIMENSIONS = ['physical', 'supernatural', 'durability', 'mobility', 'intelligence', 'influence'];

const ABILITY_WEIGHTS = {
  physical: { 'supernatural-strength': 45 },
  supernatural: {
    magic: 25, shapeshifting: 18, possession: 18, curse: 15, 'elemental-control': 22, immortality: 10, prophecy: 12,
    'mind-manipulation': 12, invisibility: 12, teleportation: 12, healing: 12, petrification: 20, regeneration: 8
  },
  durability: { immortality: 45, regeneration: 35 },
  mobility: { flight: 45, teleportation: 35, invisibility: 10 },
  intelligence: { prophecy: 35, 'mind-manipulation': 25, magic: 15, shapeshifting: 10 },
  influence: {}
};

const CATEGORY_WEIGHTS = {
  physical: { giant: 35, dragon: 25, monster: 15, hybrid: 10 },
  supernatural: { deity: 30, spirit: 12, demon: 15, jinn: 15, fairy: 10, yokai: 10 },
  durability: { undead: 20, dragon: 12, giant: 12, deity: 15 },
  mobility: { bird: 25, aquatic: 10 },
  intelligence: { deity: 15, jinn: 10 },
  influence: { deity: 20 }
};

const EVIDENCE_FACTOR = { ATTRIBUTED: 1, DOCUMENTED: 1, STRONGLY_DOCUMENTED: 1, OCCASIONALLY_REPORTED: 0.6 };

/**
 * @param {{ abilities: {ability_id: string, layer: string, evidence_level: string}[],
 *           categories: {category_id: string}[], popularity: number, habitats?: string[] }} input
 * @returns {{ dimension: string, score: number|null, basis: {label: string, points: number, kind: string}[] }[]}
 */
export function computePowerProfile({ abilities = [], categories = [], popularity = 0, habitats = [] }) {
  const tradition = abilities.filter(a => a.layer !== 'MODERN_INTERPRETATION');
  const catIds = new Set(categories.map(c => c.category_id));

  return DIMENSIONS.map(dimension => {
    const basis = [];
    for (const a of tradition) {
      const w = ABILITY_WEIGHTS[dimension][a.ability_id];
      if (!w) continue;
      const points = Math.round(w * (EVIDENCE_FACTOR[a.evidence_level] ?? 0.5));
      basis.push({ kind: 'ability', ref: a.ability_id, label: `Attributed ability: ${a.ability_id} (${a.evidence_level})`, points });
    }
    for (const [cat, w] of Object.entries(CATEGORY_WEIGHTS[dimension])) {
      if (catIds.has(cat)) basis.push({ kind: 'classification', ref: cat, label: `Classification: ${cat}`, points: w });
    }
    if (dimension === 'mobility' && habitats.includes('sky')) {
      basis.push({ kind: 'habitat', ref: 'sky', label: 'Habitat associated with the sky', points: 10 });
    }
    if (dimension === 'influence' && popularity > 0) {
      // Cultural reach: number of Wikipedia language editions with an article (log scale).
      const points = Math.round(Math.min(70, (Math.log10(1 + popularity) / Math.log10(1 + 150)) * 70));
      basis.push({ kind: 'reach', ref: String(popularity), label: `Cultural reach: articles in ${popularity} Wikipedia language editions`, points });
    }
    if (!basis.length) return { dimension, score: null, basis };
    const score = Math.max(1, Math.min(95, basis.reduce((s, b) => s + b.points, 0)));
    return { dimension, score, basis };
  });
}

export const POWER_DISCLAIMER = {
  en: 'Mythics Power Profile is an editorial classification for visualisation and entertainment. The values are not a canonical ranking or an objective measure of power in the original tradition. Each value lists the evidenced attributes it was calculated from; dimensions without evidence show no value.',
  id: 'Mythics Power Profile adalah klasifikasi editorial untuk tujuan visualisasi dan hiburan. Nilai ini bukan ranking kanonik atau ukuran objektif kekuatan dalam tradisi asli. Setiap nilai mencantumkan atribut berbukti yang menjadi dasar perhitungannya; dimensi tanpa bukti tidak diberi nilai.'
};

/**
 * Backward-compatible helper for legacy creature objects and existing API tests
 */
export function calculatePowerProfile(creature) {
  if (!creature) {
    return {
      dimensions: { physical: 30, supernatural: 30, durability: 30, mobility: 30, intelligence: 30, influence: 30 },
      calculated_basis: [],
      disclaimer: POWER_DISCLAIMER
    };
  }

  const abilities = (creature.documented_abilities || []).map(a => {
    const rawName = typeof a.name === 'object' ? (a.name.en || a.name.id || '') : String(a.name || '');
    return {
      ability_id: rawName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      layer: 'DOCUMENTED_TRADITION',
      evidence_level: a.evidence_level || 'DOCUMENTED'
    };
  });

  for (const t of (creature.traits || [])) {
    abilities.push({
      ability_id: String(t).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      layer: 'DOCUMENTED_TRADITION',
      evidence_level: 'DOCUMENTED'
    });
  }

  const categories = [{ category_id: (creature.classification || '').toLowerCase() }];
  const habitats = creature.habitat ? [creature.habitat.toLowerCase()] : [];
  const popularity = (creature.sources || []).length * 15;

  const profile = computePowerProfile({ abilities, categories, popularity, habitats });
  const dimensions = {};
  const basis = [];

  for (const item of profile) {
    dimensions[item.dimension] = item.score ?? 35;
    for (const b of item.basis) {
      basis.push(`${item.dimension}: ${b.label} (+${b.points} pts)`);
    }
  }

  return {
    dimensions,
    calculated_basis: basis.length ? basis : ['Derived deterministically from documented traits and classification.'],
    disclaimer: POWER_DISCLAIMER
  };
}

