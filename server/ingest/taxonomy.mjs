/**
 * Mythics taxonomy: regions, cultural traditions and classifications.
 *
 * Cultures are derived from the *names* of Wikipedia categories a page belongs to
 * (e.g. "Javanese legendary creatures" → Javanese). A culture is never guessed from
 * free text. Region comes from the culture (or is null for transregional
 * religious traditions — we do not force geography onto them).
 *
 * Labels here are Mythics editorial translations of tradition names (ID/EN).
 */

export const REGIONS = [
  { id: 'southeast-asia', en: 'Southeast Asia', id_: 'Asia Tenggara', sort: 1,
    desc_en: 'Mainland and maritime Southeast Asia.', desc_id: 'Daratan dan kepulauan Asia Tenggara.' },
  { id: 'east-asia', en: 'East Asia', id_: 'Asia Timur', sort: 2,
    desc_en: 'China, Japan, Korea, Mongolia, Tibet and Vietnam as grouped by the source categories.',
    desc_id: 'Tiongkok, Jepang, Korea, Mongolia, Tibet, dan Vietnam sesuai pengelompokan kategori sumber.' },
  { id: 'south-asia', en: 'South Asia', id_: 'Asia Selatan', sort: 3,
    desc_en: 'The Indian subcontinent and the Himalaya.', desc_id: 'Anak benua India dan kawasan Himalaya.' },
  { id: 'central-asia', en: 'Central Asia & Turkic world', id_: 'Asia Tengah & Dunia Turkik', sort: 4,
    desc_en: 'Turkic and Central Asian traditions.', desc_id: 'Tradisi Turkik dan Asia Tengah.' },
  { id: 'caucasus', en: 'Caucasus', id_: 'Kaukasus', sort: 5,
    desc_en: 'Armenian and Georgian traditions.', desc_id: 'Tradisi Armenia dan Georgia.' },
  { id: 'middle-east', en: 'Middle East', id_: 'Timur Tengah', sort: 6,
    desc_en: 'Arabian, Iranian, Mesopotamian and ancient Anatolian traditions.',
    desc_id: 'Tradisi Arab, Iran, Mesopotamia, dan Anatolia kuno.' },
  { id: 'africa', en: 'Africa', id_: 'Afrika', sort: 7,
    desc_en: 'Traditions from across the African continent, including ancient Egypt.',
    desc_id: 'Tradisi dari seluruh benua Afrika, termasuk Mesir kuno.' },
  { id: 'europe', en: 'Europe', id_: 'Eropa', sort: 8,
    desc_en: 'Classical, Celtic, Germanic, Slavic, Finno-Ugric and other European traditions.',
    desc_id: 'Tradisi klasik, Kelt, Jermanik, Slavia, Finno-Ugrik, dan tradisi Eropa lainnya.' },
  { id: 'north-america', en: 'North America', id_: 'Amerika Utara', sort: 9,
    desc_en: 'Indigenous North American traditions and later regional folklore of the USA and Canada.',
    desc_id: 'Tradisi Pribumi Amerika Utara serta folklor regional Amerika Serikat dan Kanada.' },
  { id: 'central-america', en: 'Mesoamerica & Caribbean', id_: 'Mesoamerika & Karibia', sort: 10,
    desc_en: 'Mesoamerican (e.g. Aztec, Maya), Mexican and Caribbean traditions.',
    desc_id: 'Tradisi Mesoamerika (mis. Aztek, Maya), Meksiko, dan Karibia.' },
  { id: 'south-america', en: 'South America', id_: 'Amerika Selatan', sort: 11,
    desc_en: 'Andean, Amazonian, Mapuche, Guaraní and other South American traditions.',
    desc_id: 'Tradisi Andes, Amazon, Mapuche, Guaraní, dan tradisi Amerika Selatan lainnya.' },
  { id: 'oceania', en: 'Oceania', id_: 'Oseania', sort: 12,
    desc_en: 'Aboriginal Australian, Polynesian, Māori and Melanesian traditions.',
    desc_id: 'Tradisi Aborigin Australia, Polinesia, Māori, dan Melanesia.' }
];

/**
 * key = adjective as it appears in the Wikipedia category name.
 * [slug, name_en, name_id, kind, region|null, parentKey|null]
 * kind: national | ethnic | group | religious | historical | textual
 */
const C = (slug, en, id, kind, region, parent = null) => ({ slug, en, id, kind, region, parent });

export const CULTURES = {
  // ---- Southeast Asia
  'Southeast Asian': C('southeast-asian', 'Southeast Asian (regional group)', 'Asia Tenggara (kelompok regional)', 'group', 'southeast-asia'),
  Indonesian: C('indonesian', 'Indonesian', 'Indonesia', 'national', 'southeast-asia'),
  Javanese: C('javanese', 'Javanese', 'Jawa', 'ethnic', 'southeast-asia', 'Indonesian'),
  Balinese: C('balinese', 'Balinese', 'Bali', 'ethnic', 'southeast-asia', 'Indonesian'),
  Sundanese: C('sundanese', 'Sundanese', 'Sunda', 'ethnic', 'southeast-asia', 'Indonesian'),
  Malaysian: C('malaysian', 'Malaysian', 'Malaysia', 'national', 'southeast-asia'),
  Malay: C('malay', 'Malay', 'Melayu', 'ethnic', 'southeast-asia'),
  Philippine: C('philippine', 'Philippine', 'Filipina', 'national', 'southeast-asia'),
  Thai: C('thai', 'Thai', 'Thailand', 'national', 'southeast-asia'),
  Burmese: C('burmese', 'Burmese', 'Myanmar', 'national', 'southeast-asia'),
  Cambodian: C('cambodian', 'Cambodian', 'Kamboja', 'national', 'southeast-asia'),
  Laotian: C('laotian', 'Laotian', 'Laos', 'national', 'southeast-asia'),
  Vietnamese: C('vietnamese', 'Vietnamese', 'Vietnam', 'national', 'east-asia'),
  // ---- East Asia
  'East Asian': C('east-asian', 'East Asian (regional group)', 'Asia Timur (kelompok regional)', 'group', 'east-asia'),
  Chinese: C('chinese', 'Chinese', 'Tionghoa', 'national', 'east-asia'),
  'Classic of Mountains and Seas': C('chinese', 'Chinese', 'Tionghoa', 'national', 'east-asia'),
  Japanese: C('japanese', 'Japanese', 'Jepang', 'national', 'east-asia'),
  'Japanese bathroom': C('japanese', 'Japanese', 'Jepang', 'national', 'east-asia'),
  Yōkai: C('japanese', 'Japanese', 'Jepang', 'national', 'east-asia'),
  Ainu: C('ainu', 'Ainu', 'Ainu', 'ethnic', 'east-asia'),
  Okinawan: C('okinawan', 'Okinawan (Ryukyuan)', 'Okinawa (Ryukyu)', 'ethnic', 'east-asia'),
  Korean: C('korean', 'Korean', 'Korea', 'national', 'east-asia'),
  Mongolian: C('mongolian', 'Mongolian', 'Mongolia', 'national', 'east-asia'),
  Tibetan: C('tibetan', 'Tibetan', 'Tibet', 'ethnic', 'east-asia'),
  // ---- South Asia
  'South Asian': C('south-asian', 'South Asian (regional group)', 'Asia Selatan (kelompok regional)', 'group', 'south-asia'),
  Indian: C('indian', 'Indian', 'India', 'national', 'south-asia'),
  Hindu: C('hindu', 'Hindu', 'Hindu', 'religious', 'south-asia'),
  Hinduism: C('hindu', 'Hindu', 'Hindu', 'religious', 'south-asia'),
  Meitei: C('meitei', 'Meitei (Manipur)', 'Meitei (Manipur)', 'ethnic', 'south-asia'),
  Bangladeshi: C('bangladeshi', 'Bangladeshi', 'Bangladesh', 'national', 'south-asia'),
  Himalayan: C('himalayan', 'Himalayan (regional group)', 'Himalaya (kelompok regional)', 'group', 'south-asia'),
  Bhutanese: C('bhutanese', 'Bhutanese', 'Bhutan', 'national', 'south-asia', 'Himalayan'),
  Nepalese: C('nepalese', 'Nepalese', 'Nepal', 'national', 'south-asia', 'Himalayan'),
  Pakistani: C('pakistani', 'Pakistani', 'Pakistan', 'national', 'south-asia'),
  'Sri Lankan': C('sri-lankan', 'Sri Lankan', 'Sri Lanka', 'national', 'south-asia'),
  'Sri Lanka': C('sri-lankan', 'Sri Lankan', 'Sri Lanka', 'national', 'south-asia'),
  // ---- Central Asia & Caucasus
  Turkic: C('turkic', 'Turkic', 'Turkik', 'group', 'central-asia'),
  Armenian: C('armenian', 'Armenian', 'Armenia', 'national', 'caucasus'),
  Georgian: C('georgian', 'Georgian', 'Georgia', 'national', 'caucasus'),
  // ---- Middle East
  'Middle Eastern': C('middle-eastern', 'Middle Eastern (regional group)', 'Timur Tengah (kelompok regional)', 'group', 'middle-east'),
  Arabian: C('arabian', 'Arabian', 'Arab', 'ethnic', 'middle-east'),
  Jinn: C('arabian', 'Arabian', 'Arab', 'ethnic', 'middle-east'),
  Jinniyyat: C('arabian', 'Arabian', 'Arab', 'ethnic', 'middle-east'),
  Iranian: C('iranian', 'Iranian', 'Iran', 'group', 'middle-east'),
  'Ancient Iranian': C('ancient-iranian', 'Ancient Iranian', 'Iran kuno', 'historical', 'middle-east', 'Iranian'),
  Persian: C('persian', 'Persian', 'Persia', 'ethnic', 'middle-east', 'Iranian'),
  Zoroastrian: C('zoroastrian', 'Zoroastrian', 'Zoroastrianisme', 'religious', 'middle-east', 'Persian'),
  Mesopotamian: C('mesopotamian', 'Mesopotamian', 'Mesopotamia', 'historical', 'middle-east', 'ancient Near East'),
  'ancient Near East': C('ancient-near-east', 'Ancient Near Eastern', 'Timur Dekat kuno', 'historical', 'middle-east'),
  'Ancient Anatolian': C('ancient-anatolian', 'Ancient Anatolian', 'Anatolia kuno', 'historical', 'middle-east'),
  Hittite: C('hittite', 'Hittite', 'Het (Hittite)', 'historical', 'middle-east', 'Ancient Anatolian'),
  Hurrian: C('hurrian', 'Hurrian', 'Hurri', 'historical', 'middle-east', 'Ancient Anatolian'),
  // ---- Africa
  'West African': C('west-african', 'West African (regional group)', 'Afrika Barat (kelompok regional)', 'group', 'africa'),
  'Central African': C('central-african', 'Central African (regional group)', 'Afrika Tengah (kelompok regional)', 'group', 'africa'),
  'East African': C('east-african', 'East African (regional group)', 'Afrika Timur (kelompok regional)', 'group', 'africa'),
  'North African': C('north-african', 'North African (regional group)', 'Afrika Utara (kelompok regional)', 'group', 'africa'),
  'Southern African': C('southern-african', 'Southern African (regional group)', 'Afrika bagian selatan (kelompok regional)', 'group', 'africa'),
  'South African': C('south-african', 'South African', 'Afrika Selatan', 'national', 'africa'),
  Zulu: C('zulu', 'Zulu', 'Zulu', 'ethnic', 'africa', 'South African'),
  Egyptian: C('egyptian', 'Ancient Egyptian', 'Mesir kuno', 'historical', 'africa'),
  // ---- Europe
  'Medieval European': C('medieval-european', 'Medieval European', 'Eropa Abad Pertengahan', 'historical', 'europe'),
  Albanian: C('albanian', 'Albanian', 'Albania', 'national', 'europe'),
  Baltic: C('baltic', 'Baltic', 'Baltik', 'group', 'europe'),
  Basque: C('basque', 'Basque', 'Basque', 'ethnic', 'europe'),
  British: C('british', 'British', 'Britania', 'group', 'europe'),
  English: C('english', 'English', 'Inggris', 'national', 'europe', 'British'),
  Northumbrian: C('northumbrian', 'Northumbrian', 'Northumbria', 'ethnic', 'europe', 'English'),
  Cornish: C('cornish', 'Cornish', 'Cornwall', 'ethnic', 'europe', 'British'),
  Manx: C('manx', 'Manx', 'Manx (Pulau Man)', 'ethnic', 'europe', 'British'),
  Scottish: C('scottish', 'Scottish', 'Skotlandia', 'national', 'europe', 'British'),
  Welsh: C('welsh', 'Welsh', 'Wales', 'national', 'europe', 'British'),
  Celtic: C('celtic', 'Celtic', 'Kelt', 'group', 'europe'),
  Irish: C('irish', 'Irish', 'Irlandia', 'national', 'europe', 'Celtic'),
  Breton: C('breton', 'Breton', 'Breton', 'ethnic', 'europe', 'Celtic'),
  'Finno-Ugric': C('finno-ugric', 'Finno-Ugric', 'Finno-Ugrik', 'group', 'europe'),
  Estonian: C('estonian', 'Estonian', 'Estonia', 'national', 'europe', 'Finno-Ugric'),
  Finnish: C('finnish', 'Finnish', 'Finlandia', 'national', 'europe', 'Finno-Ugric'),
  Hungarian: C('hungarian', 'Hungarian', 'Hongaria', 'national', 'europe', 'Finno-Ugric'),
  French: C('french', 'French', 'Prancis', 'national', 'europe'),
  Germanic: C('germanic', 'Germanic', 'Jermanik', 'group', 'europe'),
  Dutch: C('dutch', 'Dutch', 'Belanda', 'national', 'europe', 'Germanic'),
  German: C('german', 'German', 'Jerman', 'national', 'europe', 'Germanic'),
  Scandinavian: C('scandinavian', 'Scandinavian', 'Skandinavia', 'group', 'europe', 'Germanic'),
  Norse: C('norse', 'Norse', 'Nordik (Norse)', 'historical', 'europe', 'Scandinavian'),
  Danish: C('danish', 'Danish', 'Denmark', 'national', 'europe', 'Scandinavian'),
  Greek: C('greek', 'Greek', 'Yunani', 'historical', 'europe'),
  Italian: C('italian', 'Italian', 'Italia', 'national', 'europe'),
  Roman: C('roman', 'Ancient Roman', 'Romawi kuno', 'historical', 'europe'),
  Portuguese: C('portuguese', 'Portuguese', 'Portugis', 'national', 'europe'),
  Romani: C('romani', 'Romani', 'Romani', 'ethnic', 'europe'),
  Romanian: C('romanian', 'Romanian', 'Rumania', 'national', 'europe'),
  Slavic: C('slavic', 'Slavic', 'Slavia', 'group', 'europe'),
  Polish: C('polish', 'Polish', 'Polandia', 'national', 'europe', 'Slavic'),
  Spanish: C('spanish', 'Spanish', 'Spanyol', 'national', 'europe'),
  Cantabrian: C('cantabrian', 'Cantabrian', 'Kantabria', 'ethnic', 'europe', 'Spanish'),
  Catalan: C('catalan', 'Catalan', 'Katalan', 'ethnic', 'europe', 'Spanish'),
  Goetic: C('goetic', 'Goetia (European grimoire tradition)', 'Goetia (tradisi grimoire Eropa)', 'textual', 'europe'),
  // ---- North America
  'Native American': C('native-american', 'Native American (group)', 'Pribumi Amerika (kelompok)', 'group', 'north-america'),
  American: C('american', 'American (USA)', 'Amerika Serikat', 'national', 'north-america'),
  Canadian: C('canadian', 'Canadian', 'Kanada', 'national', 'north-america'),
  // ---- Mesoamerica & Caribbean
  Caribbean: C('caribbean', 'Caribbean', 'Karibia', 'group', 'central-america'),
  Mexican: C('mexican', 'Mexican', 'Meksiko', 'national', 'central-america'),
  Mesoamerican: C('mesoamerican', 'Mesoamerican', 'Mesoamerika', 'group', 'central-america'),
  'Indigenous Mesoamerican': C('indigenous-mesoamerican', 'Indigenous Mesoamerican', 'Pribumi Mesoamerika', 'group', 'central-america', 'Mesoamerican'),
  'Spanish-language Mesoamerican': C('hispanic-mesoamerican', 'Spanish-language Mesoamerican', 'Mesoamerika berbahasa Spanyol', 'group', 'central-america', 'Mesoamerican'),
  Aztec: C('aztec', 'Aztec (Mexica)', 'Aztek (Mexica)', 'historical', 'central-america', 'Indigenous Mesoamerican'),
  Maya: C('maya', 'Maya', 'Maya', 'ethnic', 'central-america', 'Indigenous Mesoamerican'),
  'Latin American': C('latin-american', 'Latin American (group)', 'Amerika Latin (kelompok)', 'group', null),
  'Spanish-language Latin American': C('hispanic-latin-american', 'Spanish-language Latin American', 'Amerika Latin berbahasa Spanyol', 'group', null, 'Latin American'),
  // ---- South America
  'South American': C('south-american', 'South American (regional group)', 'Amerika Selatan (kelompok regional)', 'group', 'south-america'),
  'Spanish-language South American': C('hispanic-south-american', 'Spanish-language South American', 'Amerika Selatan berbahasa Spanyol', 'group', 'south-america'),
  Brazilian: C('brazilian', 'Brazilian', 'Brasil', 'national', 'south-america'),
  'Indigenous Amazonian': C('indigenous-amazonian', 'Indigenous Amazonian', 'Pribumi Amazon', 'group', 'south-america', 'Indigenous South American'),
  'Indigenous South American': C('indigenous-south-american', 'Indigenous South American', 'Pribumi Amerika Selatan', 'group', 'south-america'),
  'Indigenous Andean': C('indigenous-andean', 'Indigenous Andean', 'Pribumi Andes', 'group', 'south-america', 'Indigenous South American'),
  Aymara: C('aymara', 'Aymara', 'Aymara', 'ethnic', 'south-america', 'Indigenous Andean'),
  Quechua: C('quechua', 'Quechua', 'Quechua', 'ethnic', 'south-america', 'Indigenous Andean'),
  Mapuche: C('mapuche', 'Mapuche', 'Mapuche', 'ethnic', 'south-america', 'Indigenous South American'),
  Guaraní: C('guarani', 'Guaraní', 'Guaraní', 'ethnic', 'south-america', 'Indigenous South American'),
  Tupí: C('tupi', 'Tupí', 'Tupí', 'ethnic', 'south-america', 'Indigenous South American'),
  Chilote: C('chilote', 'Chilote (Chiloé)', 'Chilote (Chiloé)', 'ethnic', 'south-america'),
  // ---- Oceania
  Australian: C('australian', 'Australian (post-colonial folklore)', 'Australia (folklor pasca-kolonial)', 'national', 'oceania'),
  'Australian Aboriginal': C('australian-aboriginal', 'Aboriginal Australian', 'Aborigin Australia', 'ethnic', 'oceania'),
  Melanesian: C('melanesian', 'Melanesian', 'Melanesia', 'group', 'oceania'),
  'New Zealand': C('new-zealand', 'New Zealand', 'Selandia Baru', 'national', 'oceania'),
  Polynesian: C('polynesian', 'Polynesian', 'Polinesia', 'group', 'oceania'),
  Māori: C('maori', 'Māori', 'Māori', 'ethnic', 'oceania', 'Polynesian'),
  Hawaiian: C('hawaiian', 'Hawaiian', 'Hawaii', 'ethnic', 'oceania', 'Polynesian'),
  // ---- Transregional religious / textual traditions (no forced region)
  Buddhist: C('buddhist', 'Buddhist', 'Buddha', 'religious', null),
  Buddhism: C('buddhist', 'Buddhist', 'Buddha', 'religious', null),
  Islamic: C('islamic', 'Islamic', 'Islam', 'religious', null),
  Islam: C('islamic', 'Islamic', 'Islam', 'religious', null),
  Christian: C('christian', 'Christian', 'Kristen', 'religious', null),
  Christianity: C('christian', 'Christian', 'Kristen', 'religious', null),
  Jewish: C('jewish', 'Jewish', 'Yahudi', 'religious', null),
  Judaism: C('jewish', 'Jewish', 'Yahudi', 'religious', null),
  'Hebrew Bible': C('jewish', 'Jewish', 'Yahudi', 'religious', null),
  Bible: C('biblical', 'Biblical', 'Alkitab', 'textual', null)
};

/** Region-only adjectives (continents): they give a region, never a culture. */
const CONTINENTS = {
  African: 'africa',
  Asian: null, // too broad: subregion must come from a more specific category
  European: 'europe',
  'North American': 'north-america',
  'South American': 'south-america',
  Oceanian: 'oceania'
};

const TYPE_SUFFIX =
  '(?:legendary creatures|legendary creature|folkloric beings|ghosts|demons|dragons|giants|dwarves|creatures)';

/**
 * Extract the tradition adjective from a category name.
 * @returns {{ culture: object|null, region: string|null, adjective: string|null }}
 */
export function cultureFromCategory(categoryName) {
  const name = categoryName.replace(/^Category:/, '').trim();
  let adjective = null;

  let m = name.match(new RegExp(`^(.+?) ${TYPE_SUFFIX}$`));
  if (m) adjective = m[1];
  if (!adjective) {
    m = name.match(/^(?:Legendary creatures|Creatures|Monsters|Dragons|Demons|Giants|Serpents|Creatures described) (?:in|of|described in) (?:the )?(.+?)(?: mythology| folklore)?$/);
    if (m) adjective = m[1];
  }
  if (!adjective) {
    m = name.match(/\bin (?:the )?(.+?) (?:mythology|folklore)$/);
    if (m) adjective = m[1];
  }
  if (!adjective && CULTURES[name]) adjective = name; // e.g. "Yōkai", "Jinn"
  if (!adjective) return { culture: null, region: null, adjective: null };

  if (adjective in CONTINENTS) return { culture: null, region: CONTINENTS[adjective], adjective };
  const culture = CULTURES[adjective] || null;
  return { culture, region: culture?.region ?? null, adjective };
}

/** Distinct culture records (dedup aliases like Hinduism/Hindu) keyed by slug. */
export function cultureRecords() {
  const out = new Map();
  for (const [key, c] of Object.entries(CULTURES)) {
    if (out.has(c.slug)) continue;
    const parent = c.parent ? CULTURES[c.parent]?.slug || null : null;
    out.set(c.slug, { id: c.slug, name_en: c.en, name_id: c.id, kind: c.kind, region_id: c.region, parent_id: parent, category_key: key });
  }
  return [...out.values()];
}

/* ---------------------------------------------------------------- classifications */

export const CLASSIFICATIONS = [
  { id: 'dragon', en: 'Dragon & serpent', id_: 'Naga & ular mitologis',
    desc_en: 'Dragons, drakes and mythological serpents.', desc_id: 'Naga, drake, dan ular mitologis.',
    cat: /\b(dragons|serpents|firedrakes|wyverns)\b/i, cls: /\b(dragon|serpent|wyvern|drake|naga)\b/i },
  { id: 'undead', en: 'Undead & revenant', id_: 'Mayat hidup & revenan',
    desc_en: 'Vampires, revenants and other returning dead.', desc_id: 'Vampir, revenan, dan orang mati yang kembali.',
    cat: /\b(vampires|revenants|undead|zombies|ghouls)\b/i, cls: /\b(vampire|revenant|undead|zombie|ghoul)\b/i },
  { id: 'spirit', en: 'Ghost & spirit', id_: 'Hantu & roh',
    desc_en: 'Ghosts, spirits of the dead and nature spirits.', desc_id: 'Hantu, roh orang mati, dan roh alam.',
    cat: /\b(ghosts|spirits|poltergeists)\b/i, cls: /\b(ghost|spirit|phantom|apparition|poltergeist)\b/i },
  { id: 'demon', en: 'Demon', id_: 'Iblis & setan',
    desc_en: 'Beings described as demons in their tradition.', desc_id: 'Makhluk yang disebut iblis/setan dalam tradisinya.',
    cat: /\b(demons|devils)\b/i, cls: /\b(demon|devil|fiend|rakshasa|asura)\b/i },
  { id: 'jinn', en: 'Jinn', id_: 'Jin',
    desc_en: 'Jinn of Arabian and Islamic tradition.', desc_id: 'Jin dalam tradisi Arab dan Islam.',
    cat: /\b(jinn|jinniyyat)\b/i, cls: /\b(jinn|djinn|genie|ifrit)\b/i },
  { id: 'giant', en: 'Giant, ogre & troll', id_: 'Raksasa, ogre & troll',
    desc_en: 'Giants, ogres and trolls.', desc_id: 'Raksasa, ogre, dan troll.',
    cat: /\b(giants|ogres|trolls)\b/i, cls: /\b(giant|ogre|troll|jötunn|titan)\b/i },
  { id: 'fairy', en: 'Fairy & little folk', id_: 'Peri & makhluk kecil',
    desc_en: 'Fairies, elves, dwarves, goblins, elementals and related folk.', desc_id: 'Peri, elf, kurcaci, goblin, elemental, dan sejenisnya.',
    cat: /\b(fairies|elves|dwarves|goblins|hobgoblins|elementals|swan maidens|tooth fairies|nymphs|brownies)\b/i, cls: /\b(fairy|faerie|elf|dwarf|goblin|hobgoblin|nymph|sprite|brownie|elemental)\b/i },
  { id: 'aquatic', en: 'Water being', id_: 'Makhluk perairan',
    desc_en: 'Merfolk, sea monsters and water spirits.', desc_id: 'Manusia duyung, monster laut, dan roh air.',
    cat: /\b(merfolk|mermaids|sea monsters|water spirits|lake monsters)\b/i, cls: /\b(mermaid|merman|merfolk|sea monster|water spirit|lake monster|water horse)\b/i },
  { id: 'shapeshifter', en: 'Shapeshifter', id_: 'Pengubah wujud',
    desc_en: 'Werewolves and other beings defined by transformation.', desc_id: 'Manusia serigala dan makhluk lain yang dicirikan oleh perubahan wujud.',
    cat: /\b(shapeshifters|werewolves|therianthropes)\b/i, cls: /\b(shapeshifter|werewolf|therianthrope|skin-walker)\b/i },
  { id: 'yokai', en: 'Yōkai', id_: 'Yōkai',
    desc_en: 'Supernatural beings of Japanese folklore.', desc_id: 'Makhluk supernatural dalam folklor Jepang.',
    cat: /\byōkai\b/i, cls: /\byōkai\b/i },
  { id: 'bird', en: 'Legendary bird', id_: 'Burung legendaris',
    desc_en: 'Mythological birds and bird-like beings.', desc_id: 'Burung mitologis dan makhluk menyerupai burung.',
    cat: /\b(legendary birds|mythological birds)\b/i, cls: /\bbird\b/i },
  { id: 'hybrid', en: 'Hybrid being', id_: 'Makhluk hibrida',
    desc_en: 'Beings combining human and animal (or several animal) forms.', desc_id: 'Makhluk yang menggabungkan wujud manusia dan hewan (atau beberapa hewan).',
    cat: /\b(hybrids|hybrid creatures)\b/i, cls: /\bhybrid\b/i },
  { id: 'cryptid', en: 'Cryptid', id_: 'Kriptid',
    desc_en: 'Creatures from modern-era sighting reports and legends.', desc_id: 'Makhluk dari laporan penampakan dan legenda era modern.',
    cat: /\bcryptids\b/i, cls: /\bcryptid\b/i },
  { id: 'deity', en: 'Deity & divine being', id_: 'Dewa & makhluk ilahi',
    desc_en: 'Beings worshipped or described as divine.', desc_id: 'Makhluk yang dipuja atau digambarkan sebagai ilahi.',
    cat: /\b(deities|gods|goddesses)\b/i, cls: /\b(deity|god|goddess|divinity)\b/i },
  { id: 'monster', en: 'Monster & beast', id_: 'Monster & binatang mitologis',
    desc_en: 'Monsters and legendary animals.', desc_id: 'Monster dan hewan legendaris.',
    cat: /\b(monsters|legendary animals|mythical animals)\b/i, cls: /\b(monster|beast|animal)\b/i },
  { id: 'humanoid', en: 'Humanoid being', id_: 'Makhluk humanoid',
    desc_en: 'Human-like beings of folklore and myth.', desc_id: 'Makhluk menyerupai manusia dalam folklor dan mitos.',
    cat: null, cls: /\bhumanoid\b/i },
  { id: 'legendary-creature', en: 'Legendary creature (general)', id_: 'Makhluk legendaris (umum)',
    desc_en: 'Listed as a legendary creature by the sources; no more specific class recorded.',
    desc_id: 'Tercatat sebagai makhluk legendaris oleh sumber; belum ada kelas yang lebih spesifik.',
    cat: null, cls: null }
];

/**
 * Classify from Wikipedia categories and Wikidata P31 class labels.
 * @returns {{ id: string, basis: string, method: 'category'|'structured_data' }[]} ordered by priority
 */
export function classify(pageCategories = [], classLabels = []) {
  const found = [];
  for (const cls of CLASSIFICATIONS) {
    if (cls.id === 'legendary-creature') continue;
    const cat = cls.cat ? pageCategories.find(c => cls.cat.test(c)) : null;
    if (cat) {
      found.push({ id: cls.id, basis: `Wikipedia category "${cat}"`, method: 'category' });
      continue;
    }
    const lbl = cls.cls ? classLabels.find(l => cls.cls.test(l.label)) : null;
    if (lbl) found.push({ id: cls.id, basis: `Wikidata: instance of "${lbl.label}" (${lbl.qid})`, method: 'structured_data' });
  }
  return found;
}

/* ---------------------------------------------------------------- abilities */

export const ABILITIES = [
  { id: 'flight', en: 'Flight', id_: 'Terbang' },
  { id: 'shapeshifting', en: 'Shapeshifting', id_: 'Mengubah wujud' },
  { id: 'immortality', en: 'Immortality', id_: 'Keabadian' },
  { id: 'supernatural-strength', en: 'Supernatural strength', id_: 'Kekuatan luar biasa' },
  { id: 'regeneration', en: 'Regeneration', id_: 'Regenerasi' },
  { id: 'magic', en: 'Magic & sorcery', id_: 'Sihir' },
  { id: 'possession', en: 'Possession', id_: 'Merasuki' },
  { id: 'prophecy', en: 'Prophecy & omens', id_: 'Ramalan & pertanda' },
  { id: 'elemental-control', en: 'Elemental / weather control', id_: 'Mengendalikan elemen/cuaca' },
  { id: 'invisibility', en: 'Invisibility', id_: 'Tak kasatmata' },
  { id: 'healing', en: 'Healing', id_: 'Penyembuhan' },
  { id: 'teleportation', en: 'Teleportation', id_: 'Teleportasi' },
  { id: 'mind-manipulation', en: 'Luring & mind manipulation', id_: 'Memikat & memengaruhi pikiran' },
  { id: 'curse', en: 'Curses & bringing misfortune', id_: 'Kutukan & membawa malapetaka' },
  { id: 'petrification', en: 'Petrification', id_: 'Membatukan' },
  { id: 'venom', en: 'Venom & poison', id_: 'Bisa & racun' }
];

export const HABITATS = [
  { id: 'water', en: 'Water (rivers, lakes, sea)', id_: 'Perairan (sungai, danau, laut)' },
  { id: 'forest', en: 'Forest & trees', id_: 'Hutan & pepohonan' },
  { id: 'mountain', en: 'Mountains & hills', id_: 'Pegunungan & perbukitan' },
  { id: 'cave', en: 'Caves', id_: 'Gua' },
  { id: 'graveyard', en: 'Graves & cemeteries', id_: 'Kuburan & pemakaman' },
  { id: 'dwelling', en: 'Houses & villages', id_: 'Rumah & permukiman' },
  { id: 'sky', en: 'Sky', id_: 'Langit' },
  { id: 'underworld', en: 'Underworld', id_: 'Dunia bawah' },
  { id: 'desert', en: 'Desert', id_: 'Gurun' },
  { id: 'fields', en: 'Fields & roads', id_: 'Ladang & jalan' }
];

/**
 * Wikidata P31 class labels that mean "this item is not a being" — such items are never ingested.
 * Anchored matching: "folklore character" or "fictional taxon" must NOT be excluded.
 */
const NON_BEING_EXACT = new Set([
  'human', 'person', 'wikimedia list article', 'wikimedia disambiguation page', 'wikimedia category',
  'film', 'feature film', 'book', 'novel', 'literary work', 'written work', 'television series',
  'television program', 'video game', 'album', 'song', 'single', 'painting', 'sculpture', 'building',
  'castle', 'house', 'city', 'town', 'village', 'mountain', 'lake', 'river', 'island', 'country',
  'ethnic group', 'mythology', 'folklore', 'religion', 'organization', 'website', 'festival', 'holiday',
  'ritual', 'dance', 'concept', 'genre', 'literary genre', 'term', 'word', 'phrase', 'surname', 'given name',
  'family name', 'dynasty', 'story', 'tale', 'folk tale', 'fairy tale', 'poem', 'play', 'opera',
  'media franchise', 'comic', 'anime television series', 'manga series', 'board game', 'ship', 'disease',
  'hoax', 'incident', 'event', 'urban legend', 'legend', 'motif', 'tale type', 'fictional human',
  'human who may be fictional', 'historical character', 'saint', 'archangel', 'angel', 'prophet',
  'haunted house', 'haunted location', 'cemetery', 'musical group', 'fictional character'
]);

export function isNonBeingClass(label) {
  return NON_BEING_EXACT.has(String(label || '').toLowerCase().trim());
}

const STRONG_NON_BEING = new Set([
  'human', 'wikimedia list article', 'wikimedia disambiguation page', 'wikimedia category', 'film',
  'feature film', 'book', 'novel', 'literary work', 'written work', 'television series', 'television program',
  'video game', 'album', 'song', 'single', 'painting', 'building', 'city', 'town', 'village', 'country',
  'ethnic group', 'website', 'organization', 'musical group', 'haunted house', 'cemetery'
]);

/**
 * An item is excluded when any class is a strong non-being (human, film, list…) or when
 * every class it has is a non-being class. Items with no P31 at all are kept (their
 * Wikipedia categories are then the only evidence).
 */
export function isExcludedByClasses(labels) {
  const lower = labels.map(l => String(l || '').toLowerCase().trim()).filter(Boolean);
  if (lower.some(l => STRONG_NON_BEING.has(l))) return true;
  return lower.length > 0 && lower.every(l => NON_BEING_EXACT.has(l));
}
