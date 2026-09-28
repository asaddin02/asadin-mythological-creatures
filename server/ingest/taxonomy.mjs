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
  // ---- Additional traditions reachable through Wikidata statements
  Russian: C('russian', 'Russian', 'Rusia', 'national', 'europe', 'Slavic'),
  Ukrainian: C('ukrainian', 'Ukrainian', 'Ukraina', 'national', 'europe', 'Slavic'),
  Czech: C('czech', 'Czech', 'Ceko', 'national', 'europe', 'Slavic'),
  Serbian: C('serbian', 'Serbian', 'Serbia', 'national', 'europe', 'Slavic'),
  Bulgarian: C('bulgarian', 'Bulgarian', 'Bulgaria', 'national', 'europe', 'Slavic'),
  Croatian: C('croatian', 'Croatian', 'Kroasia', 'national', 'europe', 'Slavic'),
  Slovak: C('slovak', 'Slovak', 'Slowakia', 'national', 'europe', 'Slavic'),
  Swedish: C('swedish', 'Swedish', 'Swedia', 'national', 'europe', 'Scandinavian'),
  Norwegian: C('norwegian', 'Norwegian', 'Norwegia', 'national', 'europe', 'Scandinavian'),
  Icelandic: C('icelandic', 'Icelandic', 'Islandia', 'national', 'europe', 'Scandinavian'),
  Faroese: C('faroese', 'Faroese', 'Faroe', 'ethnic', 'europe', 'Scandinavian'),
  Lithuanian: C('lithuanian', 'Lithuanian', 'Lituania', 'national', 'europe', 'Baltic'),
  Latvian: C('latvian', 'Latvian', 'Latvia', 'national', 'europe', 'Baltic'),
  Sámi: C('sami', 'Sámi', 'Sámi', 'ethnic', 'europe', 'Finno-Ugric'),
  Etruscan: C('etruscan', 'Etruscan', 'Etruska', 'historical', 'europe'),
  Gaulish: C('gaulish', 'Gaulish', 'Galia', 'historical', 'europe', 'Celtic'),
  'Anglo-Saxon': C('anglo-saxon', 'Anglo-Saxon', 'Anglo-Saxon', 'historical', 'europe', 'Germanic'),
  Turkish: C('turkish', 'Turkish', 'Turki', 'national', 'central-asia', 'Turkic'),
  Kazakh: C('kazakh', 'Kazakh', 'Kazakh', 'ethnic', 'central-asia', 'Turkic'),
  Kyrgyz: C('kyrgyz', 'Kyrgyz', 'Kirgiz', 'ethnic', 'central-asia', 'Turkic'),
  Tatar: C('tatar', 'Tatar', 'Tatar', 'ethnic', 'central-asia', 'Turkic'),
  Circassian: C('circassian', 'Circassian', 'Sirkasia', 'ethnic', 'caucasus'),
  Ossetian: C('ossetian', 'Ossetian', 'Ossetia', 'ethnic', 'caucasus'),
  Kurdish: C('kurdish', 'Kurdish', 'Kurdi', 'ethnic', 'middle-east'),
  Sumerian: C('sumerian', 'Sumerian', 'Sumeria', 'historical', 'middle-east', 'Mesopotamian'),
  Akkadian: C('akkadian', 'Akkadian', 'Akkadia', 'historical', 'middle-east', 'Mesopotamian'),
  Babylonian: C('babylonian', 'Babylonian', 'Babilonia', 'historical', 'middle-east', 'Mesopotamian'),
  Assyrian: C('assyrian', 'Assyrian', 'Asyur', 'historical', 'middle-east', 'Mesopotamian'),
  Canaanite: C('canaanite', 'Canaanite', 'Kanaan', 'historical', 'middle-east', 'ancient Near East'),
  Phoenician: C('phoenician', 'Phoenician', 'Fenisia', 'historical', 'middle-east', 'ancient Near East'),
  Arab: C('arabian', 'Arabian', 'Arab', 'ethnic', 'middle-east'),
  Yoruba: C('yoruba', 'Yoruba', 'Yoruba', 'ethnic', 'africa', 'West African'),
  Akan: C('akan', 'Akan', 'Akan', 'ethnic', 'africa', 'West African'),
  Igbo: C('igbo', 'Igbo', 'Igbo', 'ethnic', 'africa', 'West African'),
  Hausa: C('hausa', 'Hausa', 'Hausa', 'ethnic', 'africa', 'West African'),
  Berber: C('berber', 'Berber (Amazigh)', 'Berber (Amazigh)', 'ethnic', 'africa', 'North African'),
  Malagasy: C('malagasy', 'Malagasy', 'Madagaskar', 'ethnic', 'africa'),
  Ethiopian: C('ethiopian', 'Ethiopian', 'Etiopia', 'national', 'africa', 'East African'),
  Taiwanese: C('taiwanese', 'Taiwanese', 'Taiwan', 'national', 'east-asia'),
  Shinto: C('japanese', 'Japanese', 'Jepang', 'national', 'east-asia'),
  Taoist: C('chinese', 'Chinese', 'Tionghoa', 'national', 'east-asia'),
  Vedic: C('hindu', 'Hindu', 'Hindu', 'religious', 'south-asia'),
  Jain: C('jain', 'Jain', 'Jain', 'religious', 'south-asia'),
  Tamil: C('tamil', 'Tamil', 'Tamil', 'ethnic', 'south-asia'),
  Bengali: C('bengali', 'Bengali', 'Bengali', 'ethnic', 'south-asia'),
  Sinhalese: C('sinhalese', 'Sinhalese', 'Sinhala', 'ethnic', 'south-asia', 'Sri Lankan'),
  Dayak: C('dayak', 'Dayak', 'Dayak', 'ethnic', 'southeast-asia', 'Indonesian'),
  Batak: C('batak', 'Batak', 'Batak', 'ethnic', 'southeast-asia', 'Indonesian'),
  Minangkabau: C('minangkabau', 'Minangkabau', 'Minangkabau', 'ethnic', 'southeast-asia', 'Indonesian'),
  Bugis: C('bugis', 'Bugis', 'Bugis', 'ethnic', 'southeast-asia', 'Indonesian'),
  Toraja: C('toraja', 'Toraja', 'Toraja', 'ethnic', 'southeast-asia', 'Indonesian'),
  Visayan: C('visayan', 'Visayan', 'Visaya', 'ethnic', 'southeast-asia', 'Philippine'),
  Tagalog: C('tagalog', 'Tagalog', 'Tagalog', 'ethnic', 'southeast-asia', 'Philippine'),
  Khmer: C('cambodian', 'Cambodian', 'Kamboja', 'national', 'southeast-asia'),
  Lao: C('laotian', 'Laotian', 'Laos', 'national', 'southeast-asia'),
  Hmong: C('hmong', 'Hmong', 'Hmong', 'ethnic', 'southeast-asia'),
  Inuit: C('inuit', 'Inuit', 'Inuit', 'ethnic', 'north-america', 'Native American'),
  Algonquian: C('algonquian', 'Algonquian', 'Algonquian', 'group', 'north-america', 'Native American'),
  Ojibwe: C('ojibwe', 'Ojibwe', 'Ojibwe', 'ethnic', 'north-america', 'Native American'),
  Cherokee: C('cherokee', 'Cherokee', 'Cherokee', 'ethnic', 'north-america', 'Native American'),
  Lakota: C('lakota', 'Lakota', 'Lakota', 'ethnic', 'north-america', 'Native American'),
  Navajo: C('navajo', 'Navajo (Diné)', 'Navajo (Diné)', 'ethnic', 'north-america', 'Native American'),
  Iroquois: C('iroquois', 'Iroquois (Haudenosaunee)', 'Iroquois (Haudenosaunee)', 'ethnic', 'north-america', 'Native American'),
  Haida: C('haida', 'Haida', 'Haida', 'ethnic', 'north-america', 'Native American'),
  Inca: C('inca', 'Inca', 'Inka', 'historical', 'south-america', 'Indigenous Andean'),
  Muisca: C('muisca', 'Muisca', 'Muisca', 'historical', 'south-america', 'Indigenous South American'),
  Taíno: C('taino', 'Taíno', 'Taíno', 'ethnic', 'central-america', 'Caribbean'),
  Haitian: C('haitian', 'Haitian', 'Haiti', 'national', 'central-america', 'Caribbean'),
  Jamaican: C('jamaican', 'Jamaican', 'Jamaika', 'national', 'central-america', 'Caribbean'),
  'Puerto Rican': C('puerto-rican', 'Puerto Rican', 'Puerto Riko', 'national', 'central-america', 'Caribbean'),
  Cuban: C('cuban', 'Cuban', 'Kuba', 'national', 'central-america', 'Caribbean'),
  Trinidadian: C('trinidadian', 'Trinidadian', 'Trinidad', 'national', 'central-america', 'Caribbean'),
  Argentine: C('argentine', 'Argentine', 'Argentina', 'national', 'south-america', 'Spanish-language South American'),
  Chilean: C('chilean', 'Chilean', 'Chili', 'national', 'south-america', 'Spanish-language South American'),
  Peruvian: C('peruvian', 'Peruvian', 'Peru', 'national', 'south-america', 'Spanish-language South American'),
  Colombian: C('colombian', 'Colombian', 'Kolombia', 'national', 'south-america', 'Spanish-language South American'),
  Venezuelan: C('venezuelan', 'Venezuelan', 'Venezuela', 'national', 'south-america', 'Spanish-language South American'),
  Bolivian: C('bolivian', 'Bolivian', 'Bolivia', 'national', 'south-america', 'Spanish-language South American'),
  Paraguayan: C('paraguayan', 'Paraguayan', 'Paraguay', 'national', 'south-america', 'Spanish-language South American'),
  Guatemalan: C('guatemalan', 'Guatemalan', 'Guatemala', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  Honduran: C('honduran', 'Honduran', 'Honduras', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  Salvadoran: C('salvadoran', 'Salvadoran', 'El Salvador', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  Nicaraguan: C('nicaraguan', 'Nicaraguan', 'Nikaragua', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  'Costa Rican': C('costa-rican', 'Costa Rican', 'Kosta Rika', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  Panamanian: C('panamanian', 'Panamanian', 'Panama', 'national', 'central-america', 'Spanish-language Mesoamerican'),
  Tongan: C('tongan', 'Tongan', 'Tonga', 'ethnic', 'oceania', 'Polynesian'),
  Samoan: C('samoan', 'Samoan', 'Samoa', 'ethnic', 'oceania', 'Polynesian'),
  Tahitian: C('tahitian', 'Tahitian', 'Tahiti', 'ethnic', 'oceania', 'Polynesian'),
  Fijian: C('fijian', 'Fijian', 'Fiji', 'ethnic', 'oceania', 'Melanesian'),
  Papuan: C('papuan', 'Papuan', 'Papua', 'ethnic', 'oceania', 'Melanesian'),
  Micronesian: C('micronesian', 'Micronesian', 'Mikronesia', 'group', 'oceania'),
  Bantu: C('bantu', 'Bantu (group)', 'Bantu (kelompok)', 'group', 'africa'),
  Kongo: C('kongo', 'Kongo', 'Kongo', 'ethnic', 'africa', 'Central African'),
  'West African Vodun': C('west-african', 'West African (regional group)', 'Afrika Barat (kelompok regional)', 'group', 'africa'),
  Madurese: C('madurese', 'Madurese', 'Madura', 'ethnic', 'southeast-asia', 'Indonesian'),
  Betawi: C('betawi', 'Betawi', 'Betawi', 'ethnic', 'southeast-asia', 'Indonesian'),
  Acehnese: C('acehnese', 'Acehnese', 'Aceh', 'ethnic', 'southeast-asia', 'Indonesian'),
  Jainism: C('jain', 'Jain', 'Jain', 'religious', 'south-asia'),
  Taoism: C('chinese', 'Chinese', 'Tionghoa', 'national', 'east-asia'),
  Zoroastrianism: C('zoroastrian', 'Zoroastrian', 'Zoroastrianisme', 'religious', 'middle-east', 'Persian'),
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
  '(?:legendary creatures|legendary creature|folkloric beings|ghosts|demons|dragons|giants|dwarves|creatures|gods|goddesses|deities|spirits|monsters|folklore|mythology|religion|legends)';
const RELIGION_IN = /\bin (Buddhism|Hinduism|Islam|Christianity|Judaism|Jainism|Shinto|Taoism|Zoroastrianism)$/;

const STRONG_SUFFIX = /^(.+?) (legendary creatures|legendary creature|folkloric beings|ghosts|demons|dragons|giants|dwarves|creatures|spirits|monsters)$/;
const MEDIUM_SUFFIX = /^(.+?) (gods|goddesses|deities|folklore|mythology|religion|legends)$/;

/**
 * Extract the tradition from a category name. Tries every pattern and keeps the first
 * adjective that resolves to a known tradition (or, failing that, a continent).
 * weight: 3 = creature-specific category ("Javanese ghosts"), 2 = tradition topic
 * ("Balinese folklore", "Aztec gods"), 1 = loose association ("Birds in Buddhism").
 * @returns {{ culture: object|null, region: string|null, adjective: string|null, weight: number }}
 */
export function cultureFromCategory(categoryName) {
  const name = categoryName.replace(/^Category:/, '').trim();
  const candidates = [];
  let m = name.match(STRONG_SUFFIX);
  if (m) candidates.push([m[1], 3]);
  m = name.match(/^(?:Legendary creatures|Creatures|Monsters|Dragons|Demons|Giants|Serpents|Creatures described) (?:in|of|described in) (?:the )?(.+?)(?: mythology| folklore)?$/);
  if (m) candidates.push([m[1], 3]);
  m = name.match(MEDIUM_SUFFIX);
  if (m) candidates.push([m[1], 2]);
  m = name.match(/\bin (?:the )?(.+?) (?:mythology|folklore)$/);
  if (m) candidates.push([m[1], 2]);
  m = name.match(RELIGION_IN);
  if (m) candidates.push([m[1], 1]);
  if (CULTURES[name]) candidates.push([name, 2]);

  for (const [adjective, weight] of candidates) {
    if (CULTURES[adjective]) return { culture: CULTURES[adjective], region: CULTURES[adjective].region ?? null, adjective, weight };
  }
  for (const [adjective] of candidates) {
    if (adjective in CONTINENTS) return { culture: null, region: CONTINENTS[adjective], adjective, weight: 0 };
  }
  return { culture: null, region: null, adjective: null, weight: 0 };
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


/** Country / polity labels (Wikidata P495 etc.) → tradition key in CULTURES. */
export const COUNTRY_TO_CULTURE = {
  Indonesia: 'Indonesian', Malaysia: 'Malaysian', Philippines: 'Philippine', Thailand: 'Thai', Myanmar: 'Burmese',
  Cambodia: 'Cambodian', Laos: 'Laotian', Vietnam: 'Vietnamese', China: 'Chinese', "People's Republic of China": 'Chinese',
  Taiwan: 'Taiwanese', Japan: 'Japanese', Korea: 'Korean', 'South Korea': 'Korean', 'North Korea': 'Korean',
  Mongolia: 'Mongolian', Tibet: 'Tibetan', India: 'Indian', Nepal: 'Nepalese', Bhutan: 'Bhutanese', Bangladesh: 'Bangladeshi',
  Pakistan: 'Pakistani', 'Sri Lanka': 'Sri Lankan', Armenia: 'Armenian', Georgia: 'Georgian', Iran: 'Iranian', Persia: 'Persian',
  Turkey: 'Turkish', Greece: 'Greek', 'Ancient Greece': 'Greek', Italy: 'Italian', 'Ancient Rome': 'Roman', 'Roman Empire': 'Roman',
  France: 'French', Spain: 'Spanish', Portugal: 'Portuguese', Germany: 'German', Netherlands: 'Dutch', Denmark: 'Danish',
  Norway: 'Norwegian', Sweden: 'Swedish', Iceland: 'Icelandic', 'Faroe Islands': 'Faroese', Finland: 'Finnish', Estonia: 'Estonian',
  Hungary: 'Hungarian', Albania: 'Albanian', Romania: 'Romanian', Poland: 'Polish', Russia: 'Russian', Ukraine: 'Ukrainian',
  'Czech Republic': 'Czech', Czechia: 'Czech', Serbia: 'Serbian', Bulgaria: 'Bulgarian', Croatia: 'Croatian', Slovakia: 'Slovak',
  Lithuania: 'Lithuanian', Latvia: 'Latvian', Ireland: 'Irish', Scotland: 'Scottish', Wales: 'Welsh', England: 'English',
  'United Kingdom': 'British', 'Isle of Man': 'Manx', Cornwall: 'Cornish', Brittany: 'Breton', 'Basque Country': 'Basque',
  Catalonia: 'Catalan', Cantabria: 'Cantabrian', 'United States': 'American', 'United States of America': 'American',
  Canada: 'Canadian', Mexico: 'Mexican', Brazil: 'Brazilian', Argentina: 'Argentine', Chile: 'Chilean', Peru: 'Peruvian',
  Colombia: 'Colombian', Venezuela: 'Venezuelan', Bolivia: 'Bolivian', Paraguay: 'Paraguayan', Guatemala: 'Guatemalan',
  Honduras: 'Honduran', 'El Salvador': 'Salvadoran', Nicaragua: 'Nicaraguan', 'Costa Rica': 'Costa Rican', Panama: 'Panamanian',
  Haiti: 'Haitian', Jamaica: 'Jamaican', 'Puerto Rico': 'Puerto Rican', Cuba: 'Cuban', 'Trinidad and Tobago': 'Trinidadian',
  Australia: 'Australian', 'New Zealand': 'New Zealand', Hawaii: 'Hawaiian', Tonga: 'Tongan', Samoa: 'Samoan', Fiji: 'Fijian',
  'Papua New Guinea': 'Papuan', 'South Africa': 'South African', Egypt: 'Egyptian', 'Ancient Egypt': 'Egyptian',
  Ethiopia: 'Ethiopian', Madagascar: 'Malagasy', Nigeria: 'West African', Ghana: 'West African', Benin: 'West African',
  Mesopotamia: 'Mesopotamian', Sumer: 'Sumerian', Babylonia: 'Babylonian', Assyria: 'Assyrian', 'Aztec Empire': 'Aztec',
  'Maya civilization': 'Maya', 'Inca Empire': 'Inca', 'Kazakhstan': 'Kazakh', Kyrgyzstan: 'Kyrgyz'
};

/**
 * Tradition from a Wikidata item label such as "Norse mythology", "folklore of Indonesia" or "Japan".
 * Returns a CULTURES entry or null.
 */
export function cultureFromWikidataLabel(label) {
  if (!label) return null;
  let m = label.match(/^(.+?) (?:mythology|folklore|religion|legends?|paganism|tradition|traditions|cosmology|demonology|legendarium)$/i);
  if (m && CULTURES[m[1]]) return CULTURES[m[1]];
  m = label.match(/^(?:folklore|mythology|culture|religion|legends) of (?:the )?(.+)$/i);
  if (m && COUNTRY_TO_CULTURE[m[1]]) return CULTURES[COUNTRY_TO_CULTURE[m[1]]] || null;
  if (COUNTRY_TO_CULTURE[label]) return CULTURES[COUNTRY_TO_CULTURE[label]] || null;
  if (CULTURES[label] && CULTURES[label].kind === 'religious') return CULTURES[label];
  return null;
}

const KIND_RANK = { historical: 0, ethnic: 1, religious: 2, national: 3, textual: 4, group: 5 };
export function cultureRank(culture) {
  return KIND_RANK[culture?.kind] ?? 9;
}

/** Wikidata label language(s) most likely to carry a tradition's own name form. */
export const CULTURE_LANGUAGES = {
  japanese: ['ja'], ainu: ['ain', 'ja'], okinawan: ['ryu', 'ja'], chinese: ['zh'], taiwanese: ['zh'], korean: ['ko'],
  mongolian: ['mn'], tibetan: ['bo'], vietnamese: ['vi'], greek: ['el', 'grc'], roman: ['la'], norse: ['non', 'is'],
  icelandic: ['is'], scandinavian: ['sv', 'no', 'da'], danish: ['da'], swedish: ['sv'], norwegian: ['nb', 'no'],
  slavic: ['ru', 'uk', 'pl', 'cs'], russian: ['ru'], ukrainian: ['uk'], polish: ['pl'], czech: ['cs'], serbian: ['sr'],
  bulgarian: ['bg'], croatian: ['hr'], slovak: ['sk'], arabian: ['ar'], islamic: ['ar'], persian: ['fa'], iranian: ['fa'],
  zoroastrian: ['fa'], jewish: ['he'], hindu: ['sa', 'hi'], indian: ['hi', 'sa'], buddhist: ['sa', 'pi'], thai: ['th'],
  burmese: ['my'], cambodian: ['km'], laotian: ['lo'], indonesian: ['id'], javanese: ['jv'], balinese: ['ban'],
  sundanese: ['su'], malay: ['ms'], malaysian: ['ms'], philippine: ['tl'], tagalog: ['tl'], visayan: ['ceb'],
  armenian: ['hy'], georgian: ['ka'], aztec: ['nah'], quechua: ['qu'], aymara: ['ay'], guarani: ['gn'], maori: ['mi'],
  hawaiian: ['haw'], irish: ['ga'], welsh: ['cy'], scottish: ['gd'], manx: ['gv'], cornish: ['kw'], breton: ['br'],
  basque: ['eu'], catalan: ['ca'], finnish: ['fi'], estonian: ['et'], hungarian: ['hu'], albanian: ['sq'], romanian: ['ro'],
  german: ['de'], dutch: ['nl'], french: ['fr'], spanish: ['es'], italian: ['it'], portuguese: ['pt'], brazilian: ['pt'],
  turkic: ['tr', 'kk', 'ky', 'tt', 'az'], turkish: ['tr'], kazakh: ['kk'], kyrgyz: ['ky'], tatar: ['tt'], zulu: ['zu'],
  yoruba: ['yo'], egyptian: ['egy', 'ar'], mesopotamian: ['akk', 'sux'], sumerian: ['sux'], akkadian: ['akk'],
  tamil: ['ta'], bengali: ['bn'], bangladeshi: ['bn'], nepalese: ['ne'], 'sri-lankan': ['si', 'ta'], sinhalese: ['si'],
  meitei: ['mni'], lithuanian: ['lt'], latvian: ['lv'], sami: ['se'], malagasy: ['mg'], ethiopian: ['am'], kurdish: ['ku']
};


/** Indonesian Wikipedia category names ("Mitologi Jawa", "Hantu Indonesia") → tradition key. */
const ID_PLACE_TO_CULTURE = {
  Indonesia: 'Indonesian', Nusantara: 'Indonesian', Jawa: 'Javanese', Bali: 'Balinese', Sunda: 'Sundanese',
  Melayu: 'Malay', Malaysia: 'Malaysian', Filipina: 'Philippine', Jepang: 'Japanese', Tiongkok: 'Chinese',
  Tionghoa: 'Chinese', Korea: 'Korean', Yunani: 'Greek', Nordik: 'Norse', India: 'Indian', Hindu: 'Hindu',
  Batak: 'Batak', Dayak: 'Dayak', Minangkabau: 'Minangkabau', Bugis: 'Bugis', Toraja: 'Toraja', Madura: 'Madurese',
  Betawi: 'Betawi', Aceh: 'Acehnese', Thailand: 'Thai', Vietnam: 'Vietnamese', Mesir: 'Egyptian', Romawi: 'Roman'
};
const ID_CATEGORY = /^(?:Kategori:)?(?:Mitologi|Hantu|Cerita rakyat|Folklor|Legenda|Makhluk halus|Makhluk mitologi|Makhluk legendaris|Dewi|Dewa|Tokoh legendaris|Siluman) (.+)$/;

export function cultureFromIdCategory(categoryName) {
  const m = String(categoryName || '').match(ID_CATEGORY);
  if (!m) return null;
  const key = ID_PLACE_TO_CULTURE[m[1].trim()];
  return key ? CULTURES[key] : null;
}

/** Indonesian Wikipedia type categories → classification id. */
const ID_TYPE_CATEGORIES = [
  [/^(?:Kategori:)?(Hantu|Makhluk halus)\b/i, 'spirit'],
  [/^(?:Kategori:)?(Jin)\b/i, 'jinn'],
  [/^(?:Kategori:)?(Setan|Iblis)\b/i, 'demon'],
  [/^(?:Kategori:)?(Naga)\b/i, 'dragon'],
  [/^(?:Kategori:)?(Raksasa)\b/i, 'giant'],
  [/^(?:Kategori:)?(Dewa|Dewi)\b/i, 'deity'],
  [/^(?:Kategori:)?(Peri)\b/i, 'fairy'],
  [/^(?:Kategori:)?(Siluman)\b/i, 'shapeshifter'],
  [/^(?:Kategori:)?(Makhluk mitologi|Makhluk legendaris|Makhluk legenda)\b/i, 'legendary-creature']
];

export function classifyIdCategory(categoryName) {
  for (const [rx, id] of ID_TYPE_CATEGORIES) if (rx.test(categoryName)) return id;
  return null;
}
