#!/usr/bin/env node
/**
 * Re-plans the batches nobody has started into batches of at most --size beings (default 50),
 * one culture group per batch, so an agent researches one tradition at a time.
 *
 * - Batches that already have an answer in data/gemini/inbox/ or an entry in progress.json
 *   keep their number and content; the new batches continue after the highest of them.
 * - DROP removes duplicates of existing entries, non-beings and characters from modern works
 *   (decided by hand on 2026-09-30); they are kept in worklist.dropped with the reason.
 * - RENAME gives a homonym of an existing Mythics entry a name the verifier will not take
 *   for a duplicate. Other shared names get a hint naming the other beings.
 * - Culture comes from the current Mythics entry (enrich) or from Wikidata (P495 country of
 *   origin, P1080 narrative universe, P2596 culture, P361 part of, P17, P172, P140, P1269),
 *   classes and description, and finally from the language of the only Wikipedia editions.
 *
 * Usage: node scripts/gemini/regroup.mjs [--size 50] [--dry-run]
 */
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { getEntities, getLabels } from '../../server/ingest/wikidata.mjs';
import { fetchJson, chunk } from '../../server/ingest/http.mjs';
import { writeBatch } from './make-batch.mjs';

const ROOT = new URL('../../', import.meta.url);
const { values: args } = parseArgs({ options: { size: { type: 'string', default: '50' }, 'dry-run': { type: 'boolean', default: false } } });
const SIZE = Number(args.size);

const DUPLICATE = 'duplikat entri yang sudah ada';
const DROP = new Map([
  ['quetzalcoatl-q179818', `${DUPLICATE} (quetzalcoatl)`],
  ['fenrir-q182560', `${DUPLICATE} (fenrir)`],
  ['jormungandr-q181227', `${DUPLICATE} (jormungandr)`],
  ['aello-q380832', `${DUPLICATE} (aello)`],
  ['jarita-q13564497', `${DUPLICATE} (jarita; item Wikidata ganda, hanya mlwiki)`],
  ['jenglot-q13199423', `${DUPLICATE} (jenglot; item Wikidata ganda, hanya suwiki)`],
  ['pesanta-q118136837', `${DUPLICATE} (pesanta; item Wikidata ganda, hanya cawiki)`],
  ['dragon-king-q939440', `${DUPLICATE} (dragon-king)`],
  ['saint-michael', `${DUPLICATE} (michael, batch-028)`],
  ['chiron-q134996901', 'duplikat chiron; item Wikidata tanpa artikel Wikipedia'],
  ['nihang', `${DUPLICATE} (nihang-mythology)`],
  ['lilith-q3240860', 'tokoh Marvel Comics'],
  ['karthon-the-quester', 'tokoh Marvel Comics'],
  ['necile', 'tokoh novel tahun 1902'],
  ['little-mermaid', 'tokoh dongeng karya H. C. Andersen'],
  ['a-bao-a-qu', 'ciptaan Borges dalam Book of Imaginary Beings'],
  ['grace-in-christianity', 'konsep teologi, bukan makhluk'],
  ['divine-providence', 'konsep teologi, bukan makhluk'],
  ['territorial-spirit', 'konsep teologi modern, bukan makhluk tertentu'],
  ['abraxas-q207730', 'kata mistik; makhluknya diteliti lewat item abraxas'],
  ['turtle-island', 'nama benua Amerika Utara, bukan makhluk'],
  ['eierlegende-wollmilchsau', 'ungkapan bahasa Jerman, bukan makhluk mitologi'],
  ['mythical-bee', 'artikel topik tentang lebah dalam mitologi, bukan makhluk tertentu'],
  ['bugonia', 'ritual, bukan makhluk'],
  ['zimbabwe-bird', 'lambang negara berupa pahatan, bukan makhluk'],
  ['hung-shing-temple', 'kuil, bukan makhluk'],
  ['ikasuri-no-kami', 'kuil (jinja), bukan makhluk'],
  ['tongoenabiagus', 'tempat pemujaan, bukan makhluk'],
  ['ghosts-in-chinese-culture', 'artikel daftar Wikipedia'],
  ['wd-q141363836', 'artefak arkeologi'],
  ['flying-spaghetti-monster', 'dewa parodi modern (Pastafarianisme, 2005)'],
  ['slime', 'makhluk fiksi modern (organisme berlendir dalam fiksi)'],
  ['nazi-zombies', 'trope film horor modern']
]);
const RENAME = new Map([
  ['portunes-q1570477', 'Portunes (Roman god)'],
  ['lamia-q12284666', 'Lamia (Bulgarian folklore)'],
  ['dvalinn-q118525447', 'Dvalinn (stag)']
]);

const GROUPS = [
  ['nusantara', 'Nusantara & Asia Tenggara', /indonesia|javanese|balinese|sundanese|malay|filipino|philippine|tagalog|visayan|thai|vietnam|khmer|cambodia|burmese|myanmar|lao\b|laos|dayak|batak|minangkabau|bugis|borneo|sumatra|sulawesi|maluku|papua|southeast-asian|brunei|timor|singapore/i],
  ['jepang', 'Jepang (yokai & kami)', /japan|yōkai|yokai|\bkami\b|amatsukami|kunitsukami|gongen|shinto|ryukyu|ainu|\boni\b|shinshi|setsuwa|heike|yūrei/i],
  ['tiongkok', 'Tiongkok, Korea & Asia Timur', /chin(a|ese)|taoist|korea|tibet|mongol|yaoguai|investiture|journey to the west|four symbols|hong kong|macau|taiwan|east asian/i],
  ['india', 'India, Hindu & Buddha', /hindu|india|vedic|rigved|ramayana|mahabharata|rakshasa|\bnaga\b|nāga|nagaraja|yak[sṣ]a|\bdevi\b|buddh|nepal|sri lanka|sanskrit|tamil|bengal|meitei|jain|asura|\bdeva\b|puran/i],
  ['mesir', 'Mesir kuno', /egypt/i],
  ['timurtengah', 'Mesopotamia, Levant & Persia', /mesopotam|sumer|akkad|babylon|semitic|mandae|gnostic|manichae|yazid|assyria|canaan|ugarit|phoenic|hittite|hurrian|persia|iran|zoroastr|elam|arabian|pre-islamic|anatolia/i],
  ['abrahamik', 'Malaikat, iblis & tradisi Abrahamik', /angel|archangel|cherub|seraph|biblical|bible|enoch|tobit|revelation|judaism|jewish|christian|islam|jinn|djinn|demonolog|goetia|goetic|lesser key|pseudomonarchia|grimoire|devil|\bhell\b|watcher|mormon|qur|talmud|kabbal/i],
  ['yunani', 'Yunani & Romawi', /greek|roman|potamoi|oceanid|nereid|naiad|nymph|oread|hamadryad|titan|centaur|cyclop|olymp|hellen|etruscan|\bgiants\b|dionysiaca|theogony/i],
  ['nordik', 'Nordik & Jermanik', /norse|germanic|german|scandinav|icelan|norw|swed|danish|denmark|faroe|edda|dwar(f|ves)|jötunn|jotunn|valkyr|\balp\b|dutch|netherland|flemish|belgi|austria|swiss|frisian|texel|cologne/i],
  ['kelt', 'Kelt & Kepulauan Britania', /celtic|irish|ireland|scottish|scotland|welsh|wales|cornish|cornwall|manx|breton|brittany|gaelic|english|england|british|northumbria|tuatha|mabinogi|arthurian|lancashire|yorkshire/i],
  ['slavia', 'Slavia, Baltik, Finlandia & Eropa Timur', /slav|russia|ukrain|polish|poland|czech|slovak|serbia|croat|bosnia|bulgaria|romania|moldova|hungar|lithuan|latvia|baltic|albania|georgia|armenia|finn|estonia|karelia|kalevala|sami|belarus|sloven|macedonia|bogatyr/i],
  ['eropa', 'Eropa Barat & Selatan', /french|france|spanish|spain|catalan|basque|portug|italian|italy|galician|asturian|cantabr|sardinia|sicil|corsica|medieval|europe|malta|alpine|occitan|lombard|milan|siena|monaco|luxembourg|andorra|heraldr|bestiar/i],
  ['turkik', 'Turkik, Siberia, Kaukasus & Asia Tengah', /turk|tengri|altai|yakut|sakha|siberia|kazakh|kyrgyz|uzbek|tatar|bashkir|chuvash|mongolic|chitral|pakistan|afghan|caucas|ossetia|chechen|dagestan|circassian|kalash|hunza|azerbaij|buryat|kashmir/i],
  ['afrika', 'Afrika', /africa|yoruba|orisha|igbo|akan|ashanti|zulu|xhosa|bantu|dahomey|vodun|songhai|serer|ethiopia|somali|swahili|kenya|congo|nigeria|ghana|benin|madagascar|malagasy|berber|guanche|morocc|maghreb|\bsan\b|hausa|dogon|\bmali\b|zimbabwe|shona|bakongo|zambia|\bila\b/i],
  ['amerika', 'Amerika (pribumi, Latin & Utara)', /america|aztec|maya|inca|mesoamerica|nahua|andean|quechua|guarani|tupi|mapuche|chilote|brazil|mexic|caribbean|haiti|vodou|ta[ií]no|cuba|puerto ric|dominican|jamaica|native|inuit|cherokee|navajo|hopi|lakota|ojibwe|algonqu|iroquo|salish|canad|united states|appalach|cryptid|urban legend|argentin|peru|bolivia|chile|colombia|venezuel|ecuador|salvador|guatemala|hondura|costa rica|panama|nicaragua|uruguay|paraguay|laurentian|quebec|acadian|louisiana|ozark|kwakwaka|mixtec|zapotec|olmec|toltec|muisca|mohawk|anishinaabe|seneca|shoshone|apache|pueblo|zuni|crow nation|tlingit|haida/i],
  ['oseania', 'Oseania & Australia', /austral|aborigin|maori|polynes|hawai|samoa|tonga|fiji|melanes|micrones|easter island|rapa nui|new zealand|tahiti|solomon|vanuatu|makira|dreaming|mariana|chamorro|guam|marquesa|cook islands|rotuma|kiribati|nauru|palau/i]
];
const LABEL = Object.fromEntries([...GROUPS.map(([key, label]) => [key, label]), ['lain', 'Lintas budaya & lainnya']]);
const ORDER = [...GROUPS.map(([key]) => key), 'lain'];
// Mythics culture ids of current entries → group.
const CULTURE_GROUP = {
  'japanese-folklore': 'jepang', 'tradition-ainu': 'jepang', 'tradition-okinawan': 'jepang',
  'chinese-mythology': 'tiongkok', 'tradition-korean': 'tiongkok', 'tradition-taiwanese': 'tiongkok', 'tradition-tibetan': 'tiongkok', 'tradition-east-asian': 'tiongkok',
  'indonesian-folklore': 'nusantara', 'philippine-folklore': 'nusantara', 'tradition-southeast-asian': 'nusantara', 'tradition-malaysian': 'nusantara', 'tradition-thai': 'nusantara', 'tradition-vietnamese': 'nusantara', 'tradition-cambodian': 'nusantara', 'tradition-burmese': 'nusantara',
  'tradition-hindu': 'india', 'tradition-buddhist': 'india', 'tradition-meitei': 'india', 'tradition-indian': 'india', 'tradition-nepalese': 'india', 'south-asian-traditions': 'india', 'tradition-south-asian': 'india', 'tradition-sri-lankan': 'india', 'tradition-bangladeshi': 'india',
  'egyptian-mythology': 'mesir',
  'tradition-mesopotamian': 'timurtengah', 'tradition-arabian': 'timurtengah', 'tradition-persian': 'timurtengah', 'tradition-canaanite': 'timurtengah', 'tradition-hittite': 'timurtengah', 'tradition-hurrian': 'timurtengah', 'tradition-ancient-near-east': 'timurtengah', 'tradition-ancient-iranian': 'timurtengah', 'middle-eastern-folklore': 'timurtengah', 'tradition-middle-eastern': 'timurtengah',
  'tradition-christian': 'abrahamik', 'tradition-jewish': 'abrahamik', 'tradition-islamic': 'abrahamik', 'tradition-biblical': 'abrahamik', 'tradition-goetic': 'abrahamik',
  'greek-mythology': 'yunani', 'tradition-roman': 'yunani',
  'norse-mythology': 'nordik', 'tradition-german': 'nordik', 'tradition-germanic': 'nordik', 'tradition-scandinavian': 'nordik', 'tradition-dutch': 'nordik', 'tradition-danish': 'nordik', 'tradition-icelandic': 'nordik',
  'celtic-folklore': 'kelt', 'tradition-english': 'kelt', 'tradition-irish': 'kelt', 'tradition-scottish': 'kelt', 'tradition-welsh': 'kelt', 'tradition-northumbrian': 'kelt', 'tradition-manx': 'kelt', 'tradition-breton': 'kelt', 'tradition-cornish': 'kelt', 'tradition-british': 'kelt',
  'slavic-folklore': 'slavia', 'tradition-romanian': 'slavia', 'tradition-albanian': 'slavia', 'tradition-finnish': 'slavia', 'tradition-hungarian': 'slavia', 'tradition-polish': 'slavia', 'tradition-russian': 'slavia', 'tradition-baltic': 'slavia', 'tradition-estonian': 'slavia', 'tradition-finno-ugric': 'slavia', 'tradition-georgian': 'slavia', 'tradition-armenian': 'slavia',
  'tradition-medieval-european': 'eropa', 'tradition-french': 'eropa', 'tradition-cantabrian': 'eropa', 'tradition-basque': 'eropa', 'tradition-italian': 'eropa', 'tradition-catalan': 'eropa', 'tradition-spanish': 'eropa', 'tradition-portuguese': 'eropa',
  'tradition-turkic': 'turkik', 'tradition-mongolian': 'turkik', 'tradition-pakistani': 'turkik',
  'african-traditions': 'afrika', 'tradition-west-african': 'afrika', 'tradition-central-african': 'afrika', 'tradition-east-african': 'afrika', 'tradition-north-african': 'afrika', 'tradition-southern-african': 'afrika', 'tradition-south-african': 'afrika', 'tradition-zulu': 'afrika', 'tradition-bantu': 'afrika', 'tradition-kongo': 'afrika',
  'tradition-australian-aboriginal': 'oseania', 'tradition-maori': 'oseania', 'tradition-polynesian': 'oseania', 'tradition-hawaiian': 'oseania', 'tradition-melanesian': 'oseania', 'tradition-australian': 'oseania', 'tradition-new-zealand': 'oseania'
};
const AMERICAS = /american|mesoamerican|caribbean|latin|mexic|aztec|maya|inca|andean|quechua|aymara|guarani|tupi|mapuche|chilote|brazil|canad|inuit|algonquian|ojibwe|iroquois|cherokee|lakota|costa-rican|amazon/;
// Language of the Wikipedia editions → group, for beings Wikidata says little about.
const WIKI_GROUP = {
  ja: 'jepang', zh: 'tiongkok', zh_classical: 'tiongkok', zh_yue: 'tiongkok', ko: 'tiongkok', vi: 'nusantara', th: 'nusantara', id: 'nusantara', jv: 'nusantara', su: 'nusantara', ms: 'nusantara', tl: 'nusantara', ceb: 'nusantara', pam: 'nusantara',
  ru: 'slavia', uk: 'slavia', pl: 'slavia', cs: 'slavia', sk: 'slavia', sr: 'slavia', hr: 'slavia', bg: 'slavia', sl: 'slavia', be: 'slavia', lt: 'slavia', lv: 'slavia', et: 'slavia', fi: 'slavia', hu: 'slavia', ro: 'slavia', sq: 'slavia', ka: 'slavia', hy: 'slavia',
  ca: 'eropa', es: 'eropa', eu: 'eropa', gl: 'eropa', ast: 'eropa', it: 'eropa', fr: 'eropa', pt: 'eropa', oc: 'eropa', nrm: 'eropa',
  de: 'nordik', nl: 'nordik', fy: 'nordik', da: 'nordik', sv: 'nordik', no: 'nordik', nn: 'nordik', is: 'nordik', fo: 'nordik',
  ga: 'kelt', cy: 'kelt', gd: 'kelt', br: 'kelt', kw: 'kelt', gv: 'kelt',
  hi: 'india', ml: 'india', ta: 'india', te: 'india', kn: 'india', bn: 'india', mr: 'india', ne: 'india', as: 'india',
  fa: 'timurtengah', ar: 'timurtengah', ku: 'timurtengah', he: 'abrahamik',
  tr: 'turkik', az: 'turkik', azb: 'turkik', av: 'turkik', kk: 'turkik', ky: 'turkik', ba: 'turkik', tt: 'turkik', sah: 'turkik', cv: 'turkik', mn: 'turkik', bxr: 'turkik', ur: 'turkik',
  qu: 'amerika', gn: 'amerika', nah: 'amerika', mi: 'oseania', haw: 'oseania',
  yo: 'afrika', sw: 'afrika', zu: 'afrika', ha: 'afrika', ig: 'afrika', am: 'afrika', ff: 'afrika', sn: 'afrika', el: 'yunani', la: 'yunani'
};
const CULTURE_PROPS = ['P495', 'P1080', 'P2596', 'P361', 'P17', 'P172', 'P140', 'P1269'];

const norm = s => String(s || '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const read = async (p, fallback) => JSON.parse(await readFile(new URL(p, ROOT), 'utf8').catch(() => JSON.stringify(fallback)));

const worklist = await read('data/gemini/worklist.json', null);
const progress = await read('data/gemini/progress.json', {});
const creatures = await read('data/creatures.json', []);
const creaturesBySlug = new Map(creatures.map(c => [c.slug, c]));
const inbox = await readdir(new URL('data/gemini/inbox/', ROOT)).catch(() => []);

// A batch is started once it has an answer or a progress entry; its content is frozen.
const batchNo = id => Number(String(id).split('-')[1]);
const started = new Set([...Object.keys(progress), ...inbox.map(n => n.match(/^batch-\d+/)?.[0]).filter(Boolean)]);
const lastStarted = Math.max(...[...started].map(batchNo));
const frozen = worklist.items.filter(i => started.has(i.batch_id));
const open = worklist.items.filter(i => !started.has(i.batch_id));
const dropped = [...(worklist.dropped || [])];
const todo = [];
for (const item of open) {
  if (DROP.has(item.slug)) dropped.push({ ...item, batch_id: null, dropped_reason: DROP.get(item.slug) });
  else todo.push(RENAME.has(item.slug) ? { ...item, canonical_name: RENAME.get(item.slug), hint: `Nama ini dibedakan dari entri Mythics lain yang bernama sama. Pakai \`canonical_name\` persis "${RENAME.get(item.slug)}" dan teliti makhluk sesuai Wikidata ${item.qid}.` } : item);
}

// ---------------------------------------------------------------- culture per item
const qids = todo.map(i => i.qid).filter(Boolean);
const entities = await getEntities(qids, { props: 'claims', languages: 'en' });
const refs = new Set();
for (const e of entities.values()) for (const p of CULTURE_PROPS) for (const c of e.claims?.[p] || []) if (c.mainsnak?.datavalue?.value?.id) refs.add(c.mainsnak.datavalue.value.id);
const labels = await getLabels([...refs]);
const cultureText = qid => {
  const e = entities.get(qid);
  if (!e) return '';
  return CULTURE_PROPS.flatMap(p => (e.claims?.[p] || []).map(c => labels.get(c.mainsnak?.datavalue?.value?.id)?.labels?.en?.value)).filter(Boolean).join(' | ');
};
let groupOf = function (item) {
  const culture = item.task === 'new' ? null : creaturesBySlug.get(item.slug)?.culture;
  if (culture && CULTURE_GROUP[culture]) return CULTURE_GROUP[culture];
  if (culture && AMERICAS.test(culture)) return 'amerika';
  const text = [cultureText(item.qid), ...item.classes, item.description_en || '', culture || ''].join(' | ');
  for (const [key, , rx] of GROUPS) if (rx.test(text)) return key;
  // A well-known being has editions in many languages, which say nothing about its origin; English plus one other language usually does.
  const links = item.wiki_links || [];
  if (links.some(w => w.wiki === 'enwiki') && links.length > 2) return 'lain';
  for (const w of links) {
    const group = WIKI_GROUP[w.wiki.replace(/wiki$/, '')];
    if (group) return group;
  }
  return 'lain';
}

// Beings still without a group: match the opening of their English Wikipedia article.
const unplaced = todo.filter(i => groupOf(i) === 'lain' && i.wiki_links?.some(w => w.wiki === 'enwiki'));
const intro = new Map();
for (const part of chunk(unplaced, 20)) {
  const titles = part.map(i => i.wiki_links.find(w => w.wiki === 'enwiki').title);
  const params = new URLSearchParams({ action: 'query', prop: 'extracts', exintro: '1', explaintext: '1', exsentences: '3', exlimit: '20', redirects: '1', format: 'json', titles: titles.join('|') });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
  const redirect = new Map([...(data?.query?.normalized || []), ...(data?.query?.redirects || [])].map(r => [r.to, r.from]));
  for (const page of Object.values(data?.query?.pages || {})) {
    let title = page.title;
    while (redirect.has(title)) title = redirect.get(title);
    intro.set(title, page.extract || '');
  }
  for (const [i, item] of part.entries()) item.intro_en = intro.get(titles[i]) || '';
}
const _groupOf = groupOf;
groupOf = item => {
  const group = _groupOf(item);
  if (group !== 'lain' || !item.intro_en) return group;
  return GROUPS.find(([, , rx]) => rx.test(item.intro_en))?.[0] || 'lain';
};

// Other beings with the same name, anywhere in the plan, so the agent researches the right one.
const byName = new Map();
for (const i of [...frozen, ...todo]) {
  const key = norm(String(i.canonical_name).replace(/\s*\([^)]*\)\s*$/, ''));
  if (!byName.has(key)) byName.set(key, []);
  byName.get(key).push(i);
}
for (const item of todo) {
  if (item.hint?.startsWith('Ada makhluk lain')) delete item.hint;
  const others = byName.get(norm(String(item.canonical_name).replace(/\s*\([^)]*\)\s*$/, ''))).filter(o => o.slug !== item.slug);
  if (!others.length || others.length > 8 || RENAME.has(item.slug)) continue;
  const list = others.map(o => `\`${o.slug}\`${o.description_en ? ` (${o.description_en})` : ''}`).join('; ');
  item.hint = `Ada makhluk lain bernama sama di daftar kerja: ${list}. Teliti hanya makhluk yang sesuai Wikidata ${item.qid || 'dan deskripsi di atas'}${item.task === 'new' ? `, dan tulis \`canonical_name\` dengan pembeda singkat dalam kurung yang didukung sumber, misalnya "${item.canonical_name} (…)"` : ''}.`;
}

// ---------------------------------------------------------------- batches
const groups = new Map(ORDER.map(key => [key, []]));
for (const item of todo) {
  const { intro_en, ...rest } = item;
  groups.get(groupOf(item)).push({ ...rest, group: groupOf(item) });
}
const byDocumentation = (a, b) => (a.tier === b.tier ? 0 : a.tier === 'rich' ? -1 : 1) || b.sitelinks - a.sitelinks || a.slug.localeCompare(b.slug);
const batches = [];
for (const key of ORDER) {
  const items = groups.get(key).sort(byDocumentation);
  if (!items.length) continue;
  const parts = Math.ceil(items.length / SIZE);
  const per = Math.ceil(items.length / parts);
  for (let p = 0; p < parts; p++) {
    const id = `batch-${String(lastStarted + batches.length + 1).padStart(3, '0')}`;
    const slice = items.slice(p * per, (p + 1) * per);
    for (const item of slice) item.batch_id = id;
    batches.push({ id, title: `${LABEL[key]}${parts > 1 ? ` (${p + 1}/${parts})` : ''}`, items: slice });
  }
}

console.log(`Batch yang sudah dimulai tetap: ${started.size} (sampai batch-${String(lastStarted).padStart(3, '0')}), ${frozen.length} makhluk.`);
console.log(`Dibuang: ${dropped.length - (worklist.dropped || []).length} item. Direncanakan ulang: ${todo.length} makhluk dalam ${batches.length} batch (maks ${SIZE}).`);
for (const key of ORDER) if (groups.get(key).length) console.log(`  ${LABEL[key]}: ${groups.get(key).length}`);
if (args['dry-run']) process.exit(0);

for (const dir of ['data/gemini/batches/', 'docs/gemini/batches/']) {
  for (const name of await readdir(new URL(dir, ROOT))) {
    const id = name.match(/^(batch-\d+)\.(json|md)$/)?.[1];
    if (id && !started.has(id)) await rm(new URL(dir + name, ROOT));
  }
}
for (const b of batches) await writeBatch({ id: b.id, title: b.title, items: b.items, creaturesBySlug });

const items = [...frozen, ...batches.flatMap(b => b.items)];
const count = (list, test) => list.filter(test).length;
worklist.regrouped_at = new Date().toISOString();
worklist.batch_size = SIZE;
const pilot = worklist.pilot?.slugs?.length || 0;
worklist.counts = {
  total: items.length + pilot,
  rewrite: count(items, i => i.task === 'rewrite') + pilot,
  enrich: count(items, i => i.task === 'enrich'),
  new: count(items, i => i.task === 'new'),
  rich: count(items, i => i.tier === 'rich') + pilot,
  core: count(items, i => i.tier === 'core'),
  dropped: dropped.length,
  jenis: Object.fromEntries(Object.entries(items.reduce((t, i) => ({ ...t, [i.jenis]: (t[i.jenis] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])),
  groups: Object.fromEntries(ORDER.filter(key => groups.get(key).length).map(key => [LABEL[key], groups.get(key).length])),
  batches: lastStarted + batches.length
};
worklist.items = items;
worklist.dropped = dropped;
await writeFile(new URL('data/gemini/worklist.json', ROOT), JSON.stringify(worklist, null, 2) + '\n');
console.log(`Batch baru: ${batches[0].id} … ${batches.at(-1).id}`);
