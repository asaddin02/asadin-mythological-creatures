/**
 * Mythics Power Profile Engine
 * 
 * IMPORTANT DISCLAIMER:
 * There is NO canonical or historical numeric power level in world mythology or folklore.
 * This power profile is an editorial, entertainment-oriented derived visualization computed
 * deterministically from documented abilities, traits, and traditional lore attributes.
 * It is never presented as objective mythological truth.
 */

// Dimension weighting rules based on documented traits & abilities
const TRAIT_SIGNALS = {
  physical: {
    traits: ['supernatural strength', 'colossal size', 'giant', 'apex predator', 'crushing force', 'warrior', 'stone skin', 'beast'],
    keywords: ['crush', 'tear', 'lift', 'strength', 'might', 'massive', 'mountain-cleaving', 'titan', 'devour', 'physical prowess'],
    base: 35
  },
  supernatural: {
    traits: ['immortal', 'divine authority', 'magic', 'curses', 'necromancy', 'shapeshifter', 'spirit realm', 'possession', 'celestial', 'elemental affinity'],
    keywords: ['sorcery', 'curse', 'spell', 'divine', 'ethereal', 'astral', 'resurrection', 'weather control', 'miracle', 'supernatural', 'cosmic'],
    base: 40
  },
  durability: {
    traits: ['invulnerable', 'immortal', 'armored scales', 'regeneration', 'undead', 'stone body', 'intangible'],
    keywords: ['impenetrable', 'cannot be killed', 'regrow', 'hardened', 'resilient', 'unyielding', 'withstand', 'endure'],
    base: 30
  },
  mobility: {
    traits: ['flight', 'teleportation', 'superspeed', 'aquatic mastery', 'wind riding', 'phase shifting', 'leaping'],
    keywords: ['fly', 'soar', 'swift', 'wings', 'instantaneous', 'shadow-step', 'traverse oceans', 'cloud-rider', 'gale'],
    base: 35
  },
  intelligence: {
    traits: ['ancient wisdom', 'prophecy', 'trickster', 'riddles', 'omniscience', 'architect', 'teacher', 'illusionist'],
    keywords: ['wisdom', 'riddle', 'cunning', 'clever', 'foresee', 'knowledge', 'guide', 'deceiver', 'outsmart', 'scholar'],
    base: 40
  },
  influence: {
    traits: ['cosmic guardian', 'ruler of realms', 'harbinger of doom', 'aura of terror', 'nature lord', 'divine mandate', 'cultural icon'],
    keywords: ['revered', 'feared across lands', 'ruler', 'domain', 'army', 'mass dread', 'worshipped', 'apocalyptic', 'monarch'],
    base: 35
  }
};

/**
 * Deterministically compute power profile from creature metadata
 * @param {Object} creature
 * @returns {Object} power_profile
 */
export function calculatePowerProfile(creature) {
  const documentedAbilities = creature.documented_abilities || [];
  const traits = (creature.traits || []).map(t => t.toLowerCase());
  const classification = (creature.classification || '').toLowerCase();
  
  // Aggregate text for keyword scan from abilities and short description
  const abilityTexts = documentedAbilities.map(a => {
    const nameStr = typeof a.name === 'object' ? `${a.name.id || ''} ${a.name.en || ''}` : String(a.name || '');
    const descStr = typeof a.description === 'object' ? `${a.description.id || ''} ${a.description.en || ''}` : String(a.description || '');
    return `${nameStr} ${descStr}`.toLowerCase();
  }).join(' ');

  const descText = ((creature.short_description?.en || '') + ' ' + (creature.short_description?.id || '')).toLowerCase();
  const fullCorpus = `${abilityTexts} ${descText} ${traits.join(' ')}`;

  const scores = {};
  const explanations = [];

  for (const [dimension, config] of Object.entries(TRAIT_SIGNALS)) {
    let score = config.base;
    const triggers = [];

    // Trait matches (+10 each)
    for (const trait of config.traits) {
      if (traits.some(t => t.includes(trait) || trait.includes(t))) {
        score += 10;
        triggers.push(`Trait: "${trait}"`);
      }
    }

    // Keyword matches in abilities/description (+4 each, max +24)
    let keywordBonus = 0;
    for (const kw of config.keywords) {
      if (fullCorpus.includes(kw)) {
        keywordBonus += 4;
        triggers.push(`Lore factor: "${kw}"`);
        if (keywordBonus >= 24) break;
      }
    }
    score += keywordBonus;

    // Classification nuance
    if (classification.includes('deity') || classification.includes('divine')) {
      if (dimension === 'supernatural' || dimension === 'influence') score += 15;
    } else if (classification.includes('giant') || classification.includes('dragon')) {
      if (dimension === 'physical' || dimension === 'durability') score += 12;
    } else if (classification.includes('trickster') || classification.includes('yokai')) {
      if (dimension === 'intelligence') score += 12;
    } else if (classification.includes('spirit') || classification.includes('ghost')) {
      if (dimension === 'supernatural') score += 10;
      if (dimension === 'physical') score = Math.max(15, score - 15); // Ethereal beings usually have lower physical mass
    }

    // Clamp between 10 and 98 (we avoid fake 100/100 absolutes)
    const finalScore = Math.min(98, Math.max(15, Math.round(score)));
    scores[dimension] = finalScore;

    if (triggers.length > 0) {
      explanations.push(`${dimension.charAt(0).toUpperCase() + dimension.slice(1)} (${finalScore}/100) derived from: ${triggers.slice(0, 3).join(', ')}`);
    }
  }

  return {
    dimensions: scores,
    calculated_basis: explanations,
    disclaimer: {
      id: "Mythics Power Profile — klasifikasi editorial/hiburan yang diturunkan secara deterministik dari atribut tradisi terdokumentasi; bukan peringkat kanonik dari budaya sumber.",
      en: "Mythics Power Profile — editorial/entertainment classification deterministically derived from documented traditional attributes; not a canonical rating from the source tradition."
    }
  };
}
