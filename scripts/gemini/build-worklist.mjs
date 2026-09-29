#!/usr/bin/env node
/**
 * Builds the full Gemini work plan: every current Mythics entry plus new beings from
 * Wikidata until the target is reached, split into batches (rich: 5, core: 10).
 *
 * New beings must be an instance of a being class (legendary creature, ghost, kami; deities
 * only to fill up to the target, most documented first), have at least one Wikipedia
 * article, and not be a character from a modern work, a parade figure, an angel, a human,
 * or an Abrahamic conception of God. Order: legacy rewrites, then Southeast Asia, then by
 * number of Wikipedia editions, so the best documented beings are researched first.
 *
 * Writes data/gemini/worklist.json and data/gemini/batches|docs/gemini/batches/batch-NNN.
 * batch-001 (the pilot) is left untouched.
 *
 * Usage: node scripts/gemini/build-worklist.mjs [--target 5000]
 */
import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { sparql, getEntities, getLabels } from '../../server/ingest/wikidata.mjs';
import { isExcludedByClasses } from '../../server/ingest/taxonomy.mjs';
import { writeBatch } from './make-batch.mjs';

const ROOT = new URL('../../', import.meta.url);
const { values: args } = parseArgs({ options: { target: { type: 'string', default: '5000' } } });
const TARGET = Number(args.target);
const PILOT = new Set(['pocong', 'wewe-gombel', 'garuda', 'kitsune', 'medusa']);
const BATCH_SIZE = { rich: 5, core: 10 };
const RICH_SITELINKS = 50;

const ROOTS = [
  { qid: 'Q2239243', name: 'legendary creature' },
  { qid: 'Q45529', name: 'ghost' },
  { qid: 'Q524158', name: 'kami' },
  { qid: 'Q178885', name: 'deity', fill: true }
];
// Classes that make an item a parade figure, a character from a modern work, a holy figure, or not a being.
const EXCLUDED_CLASS = /processional giant|(film|literary|comics|television|animated|manga|anime|video game|mascot|fictional|opera|novel|play) character|^character$|fictional|in a work of fiction|movie monster|film monster|chinese zodiac|^human$|pokémon|puppet|statue|deified/i;
const KEEP_CLASS = /^$/;
const ABRAHAMIC_GOD = /^(god|allah|yahweh|jehovah|elohim|jesus|holy spirit|trinity)\b/i;
const SEA_COUNTRIES = new Set(['Q252', 'Q833', 'Q928', 'Q869', 'Q881', 'Q424', 'Q819', 'Q836', 'Q334', 'Q921', 'Q574']);
const SEA_WORDS = /indonesia|javanese|balinese|sundanese|malay|filipino|philippine|thai|vietnam|khmer|cambodia|burmese|myanmar|lao|dayak|batak|minangkabau|bugis|nusantara|borneo|sumatra|sulawesi|maluku|papua/i;
const OTHER_WIKIS = ['jawiki', 'zhwiki', 'dewiki', 'frwiki', 'eswiki', 'ruwiki', 'itwiki', 'ptwiki', 'plwiki', 'kowiki', 'hiwiki', 'jvwiki', 'suwiki', 'mswiki', 'tlwiki', 'thwiki', 'viwiki'];

/** Kind of being in plain Indonesian, from Wikidata classes (first match wins) or the current Mythics classification. */
const JENIS = [
  [/fallen angel|demon|devil|rakshasa|asura|\bdiv\b|daeva|shaitan/i, 'iblis/setan'],
  [/angel|archangel|cherub|seraph/i, 'malaikat'],
  [/\bsaints?\b/i, 'orang suci'],
  [/jinn|djinn|genie/i, 'jin'],
  [/ghost|revenant|undead|vampire|wraith|spectre|specter/i, 'hantu'],
  [/yōkai|yokai|\boni\b|yaoguai/i, 'yokai'],
  [/fair(y|ies)|nymph|naiad|dryad|oceanid|nereid|sprite|\belf\b|hamadryad/i, 'peri'],
  [/deit(y|ies)|\bgods?\b|goddess|potamoi|titan|kami|kunitsukami|loa|orisha/i, 'dewa'],
  [/spirit/i, 'roh'],
  [/dragon|serpent|naga|wyrm/i, 'naga/ular mitos'],
  [/giant|cyclop|ogre|troll/i, 'raksasa'],
  [/demigod|hero|legendary figure|mythical character|mythological .*character|folklore character|mythic humanoid/i, 'tokoh legenda'],
  [/centaur|hybrid|merfolk|mermaid|harpy|sphinx/i, 'makhluk campuran'],
  [/animal|horse|bird|dog|cattle|fish|cat\b|snake/i, 'hewan mitos'],
  [/cryptid|lake monster/i, 'kriptid'],
  [/monster/i, 'monster'],
  [/mythical creature|legendary creature/i, 'makhluk legenda']
];
const JENIS_BY_CLASSIFICATION = { spirit: 'roh', monster: 'monster', dragon: 'naga/ular mitos', demon: 'iblis/setan', deity: 'dewa', undead: 'hantu', yokai: 'yokai', giant: 'raksasa', shapeshifter: 'pengubah wujud', guardian: 'penjaga', trickster: 'penipu', aquatic: 'makhluk air', celestial: 'makhluk langit', 'legendary-figure': 'tokoh legenda', jinn: 'jin', fairy: 'peri', bird: 'hewan mitos', hybrid: 'makhluk campuran', cryptid: 'kriptid', humanoid: 'makhluk mirip manusia', 'legendary-creature': 'makhluk legenda' };
const jenisOf = (classes, description) => {
  const texts = [...classes, description].filter(Boolean);
  return JENIS.find(([rx]) => texts.some(c => rx.test(c)))?.[1] || null;
};
const classesOf = e => (e?.claims?.P31 || []).map(c => classLabel(c.mainsnak?.datavalue?.value?.id)).filter(Boolean);

const slugify = text => String(text || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stripDisambiguation = title => String(title || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

const creatures = JSON.parse(await readFile(new URL('data/creatures.json', ROOT), 'utf8'));
const creaturesBySlug = new Map(creatures.map(c => [c.slug, c]));
const existingQids = new Set(creatures.map(c => c.source_identity).filter(Boolean));
const usedSlugs = new Set(creatures.map(c => c.slug));

// ------------------------------------------------------------ candidates from Wikidata
const found = new Map();
for (const root of ROOTS) {
  const notLegendary = root.qid === 'Q2239243' ? '' : 'FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q2239243 }';
  const rows = await sparql(`SELECT DISTINCT ?item WHERE {
    ?item wdt:P31/wdt:P279* wd:${root.qid} . ${notLegendary}
    ?a schema:about ?item; schema:isPartOf ?w . ?w wikibase:wikiGroup "wikipedia" . }`);
  let n = 0;
  for (const r of rows) {
    const qid = r.item.value.split('/').pop();
    if (!found.has(qid)) {
      found.set(qid, root);
      n++;
    }
  }
  console.log(`${root.name}: ${rows.length} item, ${n} baru`);
}
const allQids = [...new Set([...found.keys(), ...existingQids])];
console.log(`Mengambil ${allQids.length} entitas Wikidata…`);
const entities = await getEntities(allQids, { props: 'labels|descriptions|sitelinks|claims', languages: 'en|id' });
const classQids = new Set();
for (const e of entities.values()) for (const c of e.claims?.P31 || []) if (c.mainsnak?.datavalue) classQids.add(c.mainsnak.datavalue.value.id);
const classEntities = await getLabels([...classQids]);
const classLabel = q => classEntities.get(q)?.labels?.en?.value || null;

const wikisOf = e => Object.keys(e.sitelinks || {}).filter(k => /wiki$/.test(k) && !/^(commons|species|meta|wikidata|mediawiki|sources|outreach|simple)wiki$/.test(k));
function wikiLinks(e) {
  const links = [];
  for (const wiki of ['enwiki', 'idwiki', ...OTHER_WIKIS, ...wikisOf(e)]) {
    const title = e.sitelinks?.[wiki]?.title;
    if (title && !links.some(l => l.wiki === wiki)) links.push({ wiki, title });
    if (links.length >= 4) break;
  }
  return links;
}
const isSea = (e, text) => (e?.claims?.P495 || []).some(c => SEA_COUNTRIES.has(c.mainsnak?.datavalue?.value?.id)) || SEA_WORDS.test(text || '');

// ------------------------------------------------------------ work items
const items = [];
for (const c of creatures) {
  if (PILOT.has(c.slug)) continue;
  const e = c.source_identity ? entities.get(c.source_identity) : null;
  const sitelinks = e ? wikisOf(e).length : 0;
  const legacy = !c.source_identity;
  const sea = c.region === 'Southeast Asia' || isSea(e, c.culture);
  items.push({
    slug: c.slug,
    canonical_name: c.canonical_name,
    task: legacy ? 'rewrite' : 'enrich',
    qid: c.source_identity || null,
    sitelinks,
    group: legacy ? 0 : sea ? 1 : 2,
    wiki_links: e ? wikiLinks(e) : [],
    classes: classesOf(e),
    jenis: jenisOf(classesOf(e), e?.descriptions?.en?.value) || JENIS_BY_CLASSIFICATION[c.classification] || 'makhluk legenda',
    description_en: e?.descriptions?.en?.value || null
  });
}

const fresh = [];
const skipped = new Map();
for (const [qid, root] of found) {
  if (existingQids.has(qid)) continue;
  const e = entities.get(qid);
  if (!e) continue;
  const classes = (e.claims?.P31 || []).map(c => classLabel(c.mainsnak?.datavalue?.value?.id)).filter(Boolean);
  const label = e.labels?.en?.value || stripDisambiguation(e.sitelinks?.enwiki?.title) || e.labels?.id?.value || stripDisambiguation(e.sitelinks?.[wikisOf(e)[0]]?.title);
  const bad = classes.find(l => EXCLUDED_CLASS.test(l) && !KEEP_CLASS.test(l));
  const reason = bad || (isExcludedByClasses(classes) && 'non-being class') || (ABRAHAMIC_GOD.test(label || '') && 'Abrahamic God') || (!label && 'no label');
  if (reason) {
    skipped.set(reason, (skipped.get(reason) || 0) + 1);
    continue;
  }
  let slug = slugify(label);
  if (!slug || usedSlugs.has(slug)) slug = slug ? `${slug}-${qid.toLowerCase()}` : `wd-${qid.toLowerCase()}`;
  usedSlugs.add(slug);
  const description = e.descriptions?.en?.value || null;
  fresh.push({
    slug,
    canonical_name: label,
    task: 'new',
    qid,
    sitelinks: wikisOf(e).length,
    group: isSea(e, `${description} ${classes.join(' ')}`) ? 1 : 2,
    fill: Boolean(root.fill),
    wiki_links: wikiLinks(e),
    classes,
    jenis: jenisOf(classes, description) || 'makhluk legenda',
    description_en: description
  });
}
console.log('Dikecualikan:', Object.fromEntries([...skipped.entries()].sort((a, b) => b[1] - a[1])));

// Deities only fill what the being classes leave short of the target, most documented first.
const byDocumentation = (a, b) => a.group - b.group || b.sitelinks - a.sitelinks || a.slug.localeCompare(b.slug);
const core = fresh.filter(i => !i.fill).sort(byDocumentation);
const room = Math.max(0, TARGET - PILOT.size - items.length - core.length);
const fill = fresh.filter(i => i.fill).sort((a, b) => b.sitelinks - a.sitelinks).slice(0, room);
const plan = [...items, ...core, ...fill].sort(byDocumentation).slice(0, TARGET - PILOT.size);
for (const item of plan) item.tier = item.group <= 1 || item.sitelinks >= RICH_SITELINKS ? 'rich' : 'core';

// ------------------------------------------------------------ batches
for (const dir of ['data/gemini/batches/', 'docs/gemini/batches/']) {
  for (const name of await readdir(new URL(dir, ROOT))) {
    if (/^batch-\d+\.(json|md)$/.test(name) && name !== 'batch-001.json' && name !== 'batch-001.md') await rm(new URL(dir + name, ROOT));
  }
}
const batches = [];
let current = null;
for (const item of plan) {
  if (!current || current.tier !== item.tier || current.items.length >= BATCH_SIZE[item.tier]) {
    current = { id: `batch-${String(batches.length + 2).padStart(3, '0')}`, tier: item.tier, items: [] };
    batches.push(current);
  }
  current.items.push(item);
  item.batch_id = current.id;
}
for (const b of batches) await writeBatch({ id: b.id, items: b.items, creaturesBySlug });

const worklist = {
  built_at: new Date().toISOString(),
  target: TARGET,
  pilot: { batch_id: 'batch-001', slugs: [...PILOT] },
  counts: {
    total: plan.length + PILOT.size,
    rewrite: plan.filter(i => i.task === 'rewrite').length + PILOT.size,
    enrich: plan.filter(i => i.task === 'enrich').length,
    new: plan.filter(i => i.task === 'new').length,
    new_deities: plan.filter(i => i.fill).length,
    rich: plan.filter(i => i.tier === 'rich').length + PILOT.size,
    core: plan.filter(i => i.tier === 'core').length,
    southeast_asia: plan.filter(i => i.group === 1).length,
    jenis: Object.fromEntries(Object.entries(plan.reduce((t, i) => ({ ...t, [i.jenis]: (t[i.jenis] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1])),
    batches: batches.length + 1
  },
  items: plan.map(({ group, fill, ...rest }) => ({ ...rest, southeast_asia: group === 1, deity_fill: fill || false }))
};
await writeFile(new URL('data/gemini/worklist.json', ROOT), JSON.stringify(worklist, null, 1) + '\n');
console.log(worklist.counts);
console.log(`Batch: batch-002 … ${batches.at(-1).id}`);
