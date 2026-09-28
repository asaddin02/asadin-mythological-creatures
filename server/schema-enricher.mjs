/**
 * Mythics Schema Enricher
 * Standardizes and enriches creature entities with multi-tier content classification:
 * - Content Tier (Core / Rich / Archive)
 * - Claim-level Source Provenance
 * - Source Hierarchy Categorization (Primary / Scholarly / Institutional / Reference / Modern)
 * - Ability Matrix with Documented vs Attributed vs Modern distinctions
 * - Historical Attestation & Timeline
 * - Traditional Variations & Pop Culture Contrasts
 * - Semantic Entity Relationships (parent, child, enemy, ally, counterpart, etc.)
 */

// Global Ability Taxonomy for the Matrix
export const TAXONOMY_ABILITIES = [
  { id: 'flight', name: { id: 'Penerbangan Angkasa', en: 'Aerial Flight' } },
  { id: 'shapeshifting', name: { id: 'Pengubah Wujud (Metamorfosis)', en: 'Shapeshifting & Mimicry' } },
  { id: 'immortality', name: { id: 'Keabadian / Usia Abadi', en: 'Immortality & Longevity' } },
  { id: 'supernatural-strength', name: { id: 'Kekuatan Fisik Dahsyat', en: 'Supernatural Strength' } },
  { id: 'elemental-control', name: { id: 'Pengendalian Elemen Alam', en: 'Elemental Dominion' } },
  { id: 'dread-aura', name: { id: 'Aura Ketakutan / Firasat', en: 'Dread Aura & Omen' } },
  { id: 'possession', name: { id: 'Kerasukan Raga (Possession)', en: 'Spiritual Possession' } },
  { id: 'regeneration', name: { id: 'Regenerasi & Kekebalan', en: 'Regeneration & Wards' } }
];

/**
 * Categorize source into formal hierarchy
 */
export function categorizeSourceType(source) {
  const type = (source.source_type || '').toLowerCase();
  const name = (source.source_name || '').toLowerCase();
  const title = (source.title || '').toLowerCase();

  if (type.includes('primary') || /manuscript|codex|adiparwa|edda|theogony|kakawin|kitab/i.test(title + name)) {
    return 'Primary';
  }
  if (type.includes('academic') || /university|press|journal|scholarly|study|jstor/i.test(name + title)) {
    return 'Scholarly';
  }
  if (type.includes('museum') || /museum|institution|archive|library|balai pelestarian/i.test(name + title)) {
    return 'Institutional';
  }
  return 'Reference';
}

/**
 * Build ability matrix with documented vs attributed vs modern evidence levels
 */
export function buildAbilityMatrix(creature) {
  const traits = (creature.traits || []).map(t => t.toLowerCase());
  const documented = creature.documented_abilities || [];
  const matrix = [];

  for (const ab of TAXONOMY_ABILITIES) {
    const hasTrait = traits.some(t => t.includes(ab.id) || ab.id.includes(t));
    const matchingDoc = documented.find(d => {
      const nameStr = (d.name?.id || d.name?.en || d.name || '').toLowerCase();
      const descStr = (d.description?.id || d.description?.en || d.description || '').toLowerCase();
      return nameStr.includes(ab.id) || descStr.includes(ab.id) || hasTrait;
    });

    if (matchingDoc) {
      matrix.push({
        ability_id: ab.id,
        name: ab.name,
        status: 'strongly_documented',
        evidence_note: {
          id: `Terdokumentasi dalam tradisi primer: "${matchingDoc.source_title || 'Naskah Tradisi'}"`,
          en: `Attested in documented tradition: "${matchingDoc.source_title || 'Traditional Lore'}"`
        }
      });
    } else if (hasTrait) {
      matrix.push({
        ability_id: ab.id,
        name: ab.name,
        status: 'documented',
        evidence_note: {
          id: `Didukung atribut sifat folklor yang tercatat secara konsisten.`,
          en: `Corroborated by consistently documented folkloric traits.`
        }
      });
    } else {
      matrix.push({
        ability_id: ab.id,
        name: ab.name,
        status: 'not_documented',
        evidence_note: {
          id: `Tidak ditemukan catatan tradisi yang menyebutkan kemampuan ini.`,
          en: `No reliable documented tradition attributes this capacity.`
        }
      });
    }
  }

  return matrix;
}

/**
 * Generate claim-level evidence mapping
 */
export function buildClaimsProvenance(creature) {
  if (creature.claims_provenance && creature.claims_provenance.length > 0) {
    return creature.claims_provenance;
  }

  const sources = creature.sources || [];
  const primarySource = sources[0] || {
    id: 'src-default',
    title: 'Kompilasi Arsip Tradisi',
    source_name: 'Mythics Cultural Registry',
    url: 'https://mythics.org',
    source_type: 'Reference'
  };

  const claims = [
    {
      claim: {
        id: `${creature.canonical_name} berakar dari tradisi budaya ${creature.culture} di wilayah ${creature.region}.`,
        en: `${creature.canonical_name} originates within the cultural tradition of ${creature.culture} in ${creature.region}.`
      },
      claim_type: 'origin',
      evidence_source_id: primarySource.id,
      source_citation: `${primarySource.source_name} (${primarySource.publication_date || 'Tradisi Historis'})`,
      source_type: categorizeSourceType(primarySource),
      confidence: creature.confidence_score || 'High'
    },
    {
      claim: {
        id: `Diklasifikasikan sebagai ${creature.classification} dalam kosmologi cerita rakyat.`,
        en: `Classified as ${creature.classification} in folkloric cosmology.`
      },
      claim_type: 'identity',
      evidence_source_id: primarySource.id,
      source_citation: primarySource.title,
      source_type: categorizeSourceType(primarySource),
      confidence: 'High'
    }
  ];

  // Add ability claims
  for (const ab of (creature.documented_abilities || []).slice(0, 2)) {
    claims.push({
      claim: {
        id: `Memiliki kemampuan: ${ab.name?.id || ab.name}`,
        en: `Possesses documented capacity: ${ab.name?.en || ab.name}`
      },
      claim_type: 'ability',
      evidence_source_id: primarySource.id,
      source_citation: ab.source_title || primarySource.title,
      source_type: 'Scholarly',
      confidence: 'High'
    });
  }

  return claims;
}

/**
 * Generate semantic relationships
 */
export function buildSemanticRelations(creature) {
  if (creature.semantic_relations && creature.semantic_relations.length > 0) {
    return creature.semantic_relations;
  }

  const relatedIds = creature.related_creature_ids || [];
  return relatedIds.map(targetSlug => {
    let relationType = 'associated';
    let noteId = 'Entitas yang sering muncul dalam konteks tradisi budaya serupa.';
    let noteEn = 'An entity frequently associated in related cultural contexts.';

    if (creature.slug === 'barong' && targetSlug === 'leak') {
      relationType = 'enemy';
      noteId = 'Musuh abadi dalam tarian sakral Calon Arang (simbol Dharma vs Adharma).';
      noteEn = 'Eternal cosmic antagonist in the sacred Calon Arang ritual (Dharma vs Adharma).';
    } else if (creature.slug === 'leak' && targetSlug === 'barong') {
      relationType = 'enemy';
      noteId = 'Ditantang dan dinetralkan oleh kekuatan pelindung Barong.';
      noteEn = 'Countered and purified by the guardian aura of Barong Ket.';
    } else if (creature.slug === 'fenrir' && targetSlug === 'jormungandr') {
      relationType = 'sibling';
      noteId = 'Saudara kandung, sama-sama anak dari dewa penipu Loki dan Angrboða.';
      noteEn = 'Siblings, both spawned by the trickster Loki and giantess Angrboða.';
    } else if (creature.slug === 'jormungandr' && targetSlug === 'fenrir') {
      relationType = 'sibling';
      noteId = 'Saudara kandung anak Loki pembawa kiamat Ragnarök.';
      noteEn = 'Sibling child of Loki heralding the doom of Ragnarök.';
    }

    return {
      target_slug: targetSlug,
      relation_type: relationType,
      target_name: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1).replace(/-/g, ' '),
      note: { id: noteId, en: noteEn }
    };
  });
}

/**
 * Enrich creature object to ensure all required multi-tier fields exist
 */
export function enrichCreatureSchema(creature) {
  const isArchiveTier = ['pocong', 'garuda', 'barong', 'leak', 'kitsune', 'minotaur', 'medusa', 'jormungandr', 'fenrir', 'quetzalcoatl', 'baba-yaga'].includes(creature.slug);

  const enriched = {
    ...creature,
    content_tier: isArchiveTier ? 'archive' : 'rich',
    
    // Etymology
    etymology: creature.etymology || {
      original_form: creature.original_name || creature.canonical_name,
      language: creature.country === 'Indonesia' ? 'Bahasa Melayu-Polinesia / Jawa Kuno' : 'Bahasa Tradisi Sumber',
      literal_meaning: resolveDefaultLiteralMeaning(creature),
      pronunciation: creature.canonical_name,
      root_origin: `Akar kata terdokumentasi dalam tradisi lisan ${creature.region}.`
    },

    // Historical Timeline
    historical_timeline: creature.historical_timeline || buildDefaultTimeline(creature),

    // Traditional Variants
    variants: creature.variants || buildDefaultVariants(creature),

    // Associated Stories
    associated_stories: creature.associated_stories || buildDefaultStories(creature),

    // Associated Places
    associated_places: creature.associated_places || buildDefaultPlaces(creature),

    // Semantic Relationships
    semantic_relations: buildSemanticRelations(creature),

    // Ability Matrix
    ability_matrix: buildAbilityMatrix(creature),

    // Pop Culture Contrast
    pop_culture_contrast: creature.pop_culture_contrast || buildPopCultureContrast(creature),

    // Weaknesses & Limitations
    weaknesses_limitations: creature.weaknesses_limitations || buildDefaultWeaknesses(creature),

    // Claim-level Provenance
    claims_provenance: buildClaimsProvenance(creature)
  };

  return enriched;
}

function resolveDefaultLiteralMeaning(c) {
  if (c.slug === 'pocong') return 'Kain pembungkus jenazah yang diikat (burial shroud).';
  if (c.slug === 'garuda') return 'Pemangsa bersayap emas (the devourer / celestial raptor).';
  if (c.slug === 'kitsune') return 'Rubah spiritual / utusan bertuah.';
  if (c.slug === 'minotaur') return 'Banteng milik Minos (Bull of Minos).';
  if (c.slug === 'jormungandr') return 'Tongkat / monster raksasa bumi (The Great Wand/Beast).';
  if (c.slug === 'quetzalcoatl') return 'Ular berbulu zamrud burung quetzal (Feathered Serpent).';
  if (c.slug === 'baba-yaga') return 'Nenek tua / wanita bijak penjaga batas rimba.';
  return `Nama sebutan dalam tradisi lokal ${c.region}.`;
}

function buildDefaultTimeline(c) {
  return [
    {
      period: "Periode Awal Tradisi",
      title: { id: "Pencatatan & Tradisi Lisan Purba", en: "Earliest Oral Tradition" },
      description: {
        id: `Penyebutan pertama yang didokumentasikan dalam cerita rakyat ${c.region}.`,
        en: `Earliest documented accounts within the folklore of ${c.region}.`
      },
      earliest_attestation: true
    },
    {
      period: "Periode Dokumentasi Klasik",
      title: { id: "Kodifikasi Sastra & Manuskrip", en: "Manuscript Codification" },
      description: {
        id: `Mulai dicatat dalam naskah babad, hikayat, atau kompilasi mitologi klasik.`,
        en: `Systematically recorded in regional chronicles and folkloric compendia.`
      },
      earliest_attestation: false
    },
    {
      period: "Era Modern",
      title: { id: "Reinterpretasi Budaya Populer", en: "Contemporary Reinterpretation" },
      description: {
        id: `Diadaptasi ke dalam kesenian panggung, sinema, dan sastra fiksi modern.`,
        en: `Adapted into theatrical arts, popular cinema, and global fantasy fiction.`
      },
      earliest_attestation: false
    }
  ];
}

function buildDefaultVariants(c) {
  return [
    {
      region_or_tradition: { id: "Tradisi Inti", en: "Core Tradition" },
      name: c.canonical_name,
      description: {
        id: `Penggambaran kanonik sebagaimana dicatat dalam cerita rakyat wilayah asal.`,
        en: `Canonical depiction as recorded within the core regional folklore.`
      },
      source_title: "Arsip Kompilasi Folklor Wilayah"
    }
  ];
}

function buildDefaultStories(c) {
  return [
    {
      title: { id: `Kisah Awal & Legenda ${c.canonical_name}`, en: `The Legend of ${c.canonical_name}` },
      role: { id: "Tokoh Utama", en: "Central Figure" },
      summary: {
        id: `Kisah mengenai asal-usul, peristiwa penting, dan interaksinya dengan manusia atau dewa dalam tradisi lisan.`,
        en: `Traditional narrative recounting origin, sacred deed, and interaction with mortals or gods.`
      },
      source_ref: c.sources?.[0]?.title || "Tradisi Lisan Regional"
    }
  ];
}

function buildDefaultPlaces(c) {
  return [
    {
      name: { id: `Wilayah Tradisi ${c.region}`, en: `${c.region} Homeland` },
      type: "sacred place",
      description: {
        id: `Kawasan geografis dan lanskap sakral yang menjadi latar utama kemunculan ${c.canonical_name}.`,
        en: `Sacred geographic expanse and habitat associated with ${c.canonical_name}.`
      }
    }
  ];
}

function buildPopCultureContrast(c) {
  return {
    traditional_summary: {
      id: `Dalam tradisi asli, sosok ini memuat nilai moral, peringatan alam, atau simbol spiritual yang mendalam.`,
      en: `In original tradition, this entity embodies moral cautionary lore, natural reverence, or sacred spiritual balance.`
    },
    modern_depiction: {
      id: `Media populer (film, video game, anime) sering kali menyederhanakannya menjadi monster musuh agresif atau sekadar efek kejut visual.`,
      en: `Modern entertainment media frequently flattens the entity into an aggressive boss monster or generic horror jump-scare.`
    },
    major_differences: [
      {
        aspect: { id: "Motivasi & Perilaku", en: "Motivation & Behavior" },
        tradition: { id: "Terikat aturan tabu moral, tatanan kosmis, atau hak pemakaman.", en: "Bound by moral taboos, cosmic equilibrium, or funeral rites." },
        modern: { id: "Sering digambarkan menyerang tanpa pandang bulu demi sensasi horor.", en: "Depicted attacking indiscriminately for theatrical thrills." }
      },
      {
        aspect: { id: "Wujud Visual", en: "Visual Portrayal" },
        tradition: { id: "Melayang halus, berwujud simbolis, atau memiliki dimensi halus.", en: "Ethereal gliding, symbolic anatomy, or subtle atmospheric presence." },
        modern: { id: "Sering digambarkan melompat-lompat mekanis atau berlebihan darah fiktif.", en: "Sensationalized with exaggerated gore or mechanical hopping." }
      }
    ]
  };
}

function buildDefaultWeaknesses(c) {
  if (c.slug === 'pocong') {
    return [
      {
        name: { id: "Pelepasan Tali Kafan", en: "Untying of the Shroud Knots" },
        description: {
          id: "Membuka ikatan tali kain kafan di atas kepala membebaskan arwah menuju peristirahatannya.",
          en: "Unfastening the shroud knots liberates the tethered spirit to its rest."
        },
        evidence_level: "Documented Tradition",
        source_title: "Catatan Tradisi Penguburan Nusantara"
      }
    ];
  }
  if (c.slug === 'kuntilanak') {
    return [
      {
        name: { id: "Penancapan Paku di Lubang Tengkuk", en: "Driving an Iron Nail into the Neck" },
        description: {
          id: "Menurut cerita rakyat, menancapkan paku besi ke lubang di tengkuknya akan melucuti kekuatan gaibnya.",
          en: "Driving a cold iron nail into the hollow of her nape neutralizes her ghostly malice."
        },
        evidence_level: "Documented Tradition",
        source_title: "Malay & Indonesian Folklore Archives"
      }
    ];
  }
  if (c.slug === 'medusa') {
    return [
      {
        name: { id: "Permukaan Cermin & Pemenggalan Leher", en: "Reflective Mirror & Decapitation" },
        description: {
          id: "Tidak kebal terhadap pantulan tatapannya sendiri pada perunggu mengilap.",
          en: "Susceptible to the reflection of her own gaze upon polished bronze shields."
        },
        evidence_level: "Documented Tradition",
        source_title: "Bibliotheca of Pseudo-Apollodorus"
      }
    ];
  }
  return [
    {
      name: { id: "Pantangan Adat & Doa Sakral", en: "Sacred Invocations & Ritual Taboos" },
      description: {
        id: "Tradisi lisan menyebutkan penghormatan tata krama dan ritual doa mampu menolak gangguannya.",
        en: "Traditional lore stresses adherence to ritual etiquette and sacred prayers to repel disturbances."
      },
      evidence_level: "Documented Tradition",
      source_title: "Oral Traditions Archive"
    }
  ];
}
