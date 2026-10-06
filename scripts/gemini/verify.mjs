#!/usr/bin/env node
/**
 * Checks a Gemini research submission against docs/gemini/00-instruksi-utama.md:
 * structure and taxonomy IDs, claim/source wiring, that every quote really occurs on
 * its source page, and that every image exists on Commons under a free licence with
 * some documented link to the creature. Whether a statement follows from its quote, and
 * whether prose stays within its claims, needs a reader, so the report puts every claim
 * next to its quote and downloads image thumbnails for a visual check.
 *
 * Input:  data/gemini/inbox/<batch>*.md|json (later files override earlier ones per slug)
 * Output: data/gemini/reviews/<batch>.review.json|.review.md|.fix-draft.md
 *
 * Usage: node scripts/gemini/verify.mjs batch-001 [--refresh]
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchImageInfo, plainText } from '../../server/ingest/commons.mjs';
import { fetchJson } from '../../server/ingest/http.mjs';
import { ABILITIES, HABITATS } from '../../server/ingest/taxonomy.mjs';
import { tierShortfall } from './tier.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const batchId = process.argv[2];
const REFRESH = process.argv.includes('--refresh');
if (!/^batch-\d{3,4}$/.test(batchId || '')) {
  console.error('Usage: node scripts/gemini/verify.mjs batch-001 [--refresh]');
  process.exit(1);
}

const CACHE = join(ROOT, 'data', 'cache', 'gemini-verify');
const THUMBS = join(CACHE, 'thumbs', batchId);
const REVIEWS = join(ROOT, 'data', 'gemini', 'reviews');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36 MythicsSourceVerifier/1.0 (+https://github.com/asaddin02/asadin-mythological-creatures)';
const readJson = async p => JSON.parse(await readFile(join(ROOT, p), 'utf8'));

// ---------------------------------------------------------------- taxonomy
const [categories, cultures, regions, traits, creatures, manifest] = await Promise.all([
  readJson('data/categories.json'), readJson('data/cultures.json'), readJson('data/regions.json'),
  readJson('data/traits.json'), readJson('data/creatures.json'), readJson(`data/gemini/batches/${batchId}.json`)
]);
const ENUM = {
  classification: new Set(categories.map(c => c.id)),
  culture: new Set(cultures.map(c => c.id)),
  region: new Set([...regions.map(r => r.id), 'transregional']),
  trait: new Set(traits.map(t => t.id)),
  habitat: new Set(HABITATS.map(h => h.id)),
  ability: new Set(ABILITIES.map(a => a.id)),
  relation: new Set(['parent', 'child', 'sibling', 'spouse', 'relative', 'variant', 'possible-variant', 'type-of', 'associated', 'enemy', 'ally', 'counterpart']),
  imageType: new Set(['traditional-artwork', 'historical-illustration', 'sculpture-or-relief', 'artifact', 'performance-or-ritual', 'modern-illustration', 'photograph-of-site']),
  sourceType: new Set(['journal-article', 'academic-book', 'thesis', 'museum-or-archive', 'cultural-agency', 'primary-text', 'folklore-collection', 'encyclopedia', 'wikipedia', 'news', 'other']),
  context: new Set(['traditional-belief', 'religious-tradition', 'historical-record', 'scholarly-interpretation', 'etymology', 'modern-popular-culture']),
  disposition: new Set(['malevolent', 'benevolent', 'ambivalent', 'protective', 'trickster']),
  nameType: new Set(['alias', 'regional', 'native-script', 'transliteration', 'translation', 'epithet']),
  placeType: new Set(['temple', 'archaeological-site', 'region', 'mountain', 'river', 'lake', 'sea', 'forest', 'village', 'city', 'other']),
  medium: new Set(['film', 'television', 'literature', 'comics', 'video-game', 'music', 'other']),
  jenis: new Set(['hantu', 'roh', 'peri', 'dewa', 'iblis/setan', 'malaikat', 'orang suci', 'jin', 'yokai', 'naga/ular mitos', 'raksasa', 'tokoh legenda', 'makhluk campuran', 'hewan mitos', 'kriptid', 'monster', 'pengubah wujud', 'penjaga', 'makhluk air', 'makhluk langit', 'makhluk mirip manusia', 'makhluk legenda'])
};
const BLOCKED_HOST = /(^|\.)(fandom\.com|wikia\.(com|org)|pinterest\.[a-z.]+|quora\.com|reddit\.com|tiktok\.com|youtube\.com|youtu\.be|facebook\.com|instagram\.com|twitter\.com|x\.com)$/i;
// Pages whose text is rendered client-side or behind a viewer: a missing quote there is not proof of fabrication.
const DYNAMIC_HOST = /(^|\.)(books\.google\.[a-z.]+|google\.[a-z.]+|archive\.org|jstor\.org|academia\.edu|researchgate\.net|scribd\.com|sciencedirect\.com)$/i;
// ---------------------------------------------------------------- text helpers
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', shy: '' };
const decodeEntities = s => s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : ' ';
  }
  return ENTITIES[e.toLowerCase()] ?? m;
});
function htmlToText(html) {
  return decodeEntities(html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<sup\b[^>]*class="[^"]*(reference|noprint)[^"]*"[\s\S]*?<\/sup>/gi, '')
    .replace(/<\/?(a|i|b|em|strong|span|abbr|small|cite|bdi|u|mark|q|font|sub|sup)\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ' '));
}
const strictNorm = s => String(s ?? '').normalize('NFKC')
  .replace(/[­​-‏⁠﻿]/g, '')
  .replace(/[‘’‚‛′`´ʼ]/g, "'").replace(/[“”„‟″«»]/g, '"').replace(/[‐‑‒–—―−]/g, '-').replace(/…/g, '...')
  .replace(/\s+/g, ' ').trim().toLowerCase();
const looseNorm = s => strictNorm(s).normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const words = s => looseNorm(s).split(' ').filter(Boolean);
const shingles = (ws, n) => {
  const out = [];
  for (let i = 0; i + n <= ws.length; i++) out.push(ws.slice(i, i + n).join(' '));
  return out;
};
const STOPWORDS = new Set('the and that with from this which were was are for into its his her their they them also has have had been being said called known often most more than such other some many one two who whose when where there what about after before over under between among upon onto would could should will can may might not only very much like each both either same then thus these those does did done make made'.split(' '));
const ENGLISH_MARKERS = new Set(['the', 'and', 'of', 'in', 'is', 'was', 'to', 'a']);
const hash = s => createHash('sha1').update(s).digest('hex');
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const nonEmpty = v => typeof v === 'string' && v.trim().length > 0;

// ---------------------------------------------------------------- read submission
async function readSubmission() {
  const dir = join(ROOT, 'data', 'gemini', 'inbox');
  const files = [];
  for (const name of await readdir(dir).catch(() => [])) {
    if (!name.startsWith(batchId) || !/\.(md|json|txt)$/.test(name)) continue;
    // Base file first, then fix-1, fix-2, …; mtime is useless after a git checkout, which gives every file the same time.
    files.push({ name, round: Number(name.match(/-fix-(\d+)\./)?.[1] || 0) });
  }
  files.sort((a, b) => a.round - b.round || a.name.localeCompare(b.name));
  const entries = new Map();
  const problems = [];
  for (const { name } of files) {
    const raw = await readFile(join(dir, name), 'utf8');
    const blocks = [...raw.matchAll(/```(?:json|JSON)?\s*\n([\s\S]*?)```/g)].map(m => m[1]);
    if (!blocks.length && raw.trim().startsWith('{')) blocks.push(raw);
    if (!blocks.length && raw.trim().startsWith('[')) blocks.push(raw);
    blocks.forEach((block, i) => {
      let data;
      try {
        data = JSON.parse(block);
      } catch (err) {
        problems.push({ file: name, block: i + 1, message: `JSON tidak valid: ${err.message}`, preview: block.trim().slice(0, 80) });
        return;
      }
      for (const entry of Array.isArray(data) ? data : data.entries || [data]) {
        if (!isObj(entry) || !entry.slug) {
          problems.push({ file: name, block: i + 1, message: 'Blok tidak berisi objek entri dengan slug' });
          continue;
        }
        entries.set(entry.slug, { entry, file: name });
      }
    });
  }
  return { files: files.map(f => f.name), entries, problems };
}

// ---------------------------------------------------------------- source pages
const pageCache = new Map();
async function loadPage(url) {
  if (pageCache.has(url)) return pageCache.get(url);
  const promise = (async () => {
    const file = join(CACHE, 'pages', `${hash(url)}.json`);
    if (!REFRESH) {
      try {
        const cached = JSON.parse(await readFile(file, 'utf8'));
        const stale = (isWikipedia(url) && cached.status === 200 && !cached.wiki_sections) || (pageProblem(cached) && !cached.archive_tried);
        if (!stale) return cached;
      } catch {}
    }
    let page = await fetchPage(url);
    // Museums and publishers (The Met, UCL, Smithsonian …) often answer bots with 403/429; read the page from the Wayback Machine instead.
    if (pageProblem(page)) {
      const archived = await archivedCopy(url);
      page = archived && !pageProblem(archived) ? { ...archived, url, archive_url: archived.url, direct_problem: pageProblem(page) } : page;
      page.archive_tried = true;
    }
    await mkdir(join(CACHE, 'pages'), { recursive: true });
    await writeFile(file, JSON.stringify(page));
    return page;
  })();
  pageCache.set(url, promise);
  return promise;
}
async function archivedCopy(url) {
  try {
    const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
    const snapshot = (await res.json())?.archived_snapshots?.closest;
    if (!snapshot?.available || !snapshot.url) return null;
    // The id_ flag returns the page as archived, without the Wayback toolbar.
    return fetchPage(snapshot.url.replace(/^http:/, 'https:').replace(/\/web\/(\d+)\//, '/web/$1id_/'));
  } catch {
    return null;
  }
}
async function fetchPage(url) {
  const page = { url, fetched_at: new Date().toISOString() };
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8', 'Accept-Language': 'en,id;q=0.9' }
    });
    page.status = res.status;
    page.final_url = res.url;
    page.content_type = res.headers.get('content-type') || '';
    if (res.ok) {
      if (/pdf/i.test(page.content_type) || /\.pdf($|\?)/i.test(res.url)) {
        const pdf = join(CACHE, 'pages', `${hash(url)}.pdf`);
        await mkdir(join(CACHE, 'pages'), { recursive: true });
        await writeFile(pdf, Buffer.from(await res.arrayBuffer()));
        const { stdout } = await promisify(execFile)('pdftotext', ['-q', '-enc', 'UTF-8', pdf, '-'], { maxBuffer: 64 * 1024 * 1024 });
        page.text = stdout.replace(/(\p{L})-\n(\p{L})/gu, '$1$2');
      } else {
        const html = await res.text();
        page.text = htmlToText(html);
        if (isWikipedia(url)) page.wiki_sections = wikiSections(html);
      }
    }
  } catch (err) {
    page.error = err.name === 'TimeoutError' ? 'timeout' : err.message;
  }
  return page;
}
const isWikipedia = url => {
  try {
    return /(^|\.)wikipedia\.org$/.test(new URL(url).hostname);
  } catch {
    return false;
  }
};
// Maintenance boxes that say a Wikipedia section has no sources (en and id wording).
const UNSOURCED_BOX = /does not cite any sources|needs additional citations|tidak memiliki referensi|tidak mencantumkan (referensi|sumber)|memerlukan (lebih banyak )?(referensi|rujukan)|(butuh|perlu) rujukan tambahan/i;
const CN_MARK = 'qqcnqq';
/** Split a Wikipedia article into sections, noting unsourced-section boxes and [citation needed] markers. */
function wikiSections(html) {
  const marked = html.replace(/<sup\b[^>]*class="[^"]*Template-Fact[^"]*"[\s\S]*?<\/sup>/gi, ` ${CN_MARK} `);
  return marked.split(/<h[23]\b/i).map((part, i) => {
    const text = htmlToText(`<h2${part}`).replace(/\s+/g, ' ').trim();
    const box = text.search(UNSOURCED_BOX);
    return { heading: text.slice(0, 60), unsourced: box >= 0 && (i === 0 || box < 1500), loose: ` ${looseNorm(text)} ` };
  });
}
const pageIndex = new Map();
function indexed(page) {
  if (!pageIndex.has(page.url)) pageIndex.set(page.url, { strict: strictNorm(page.text || ''), loose: ` ${looseNorm(page.text || '')} ` });
  return pageIndex.get(page.url);
}
function pageProblem(page) {
  if (page.error) return `tidak bisa dibuka (${page.error})`;
  if (!page.status || page.status >= 400) return `HTTP ${page.status}`;
  if ((page.text || '').trim().length < 300) return 'halaman hampir tanpa teks (mungkin dirender JavaScript)';
  return null;
}

/** exact | loose (punctuation/diacritics differ) | partial | missing | too-short */
function findQuote(quote, page) {
  const idx = indexed(page);
  const segments = String(quote).split(/\s*(?:\.\.\.|…|\[\.\.\.\])\s*/).map(s => s.trim()).filter(s => words(s).length >= 3);
  if (!segments.length) return { status: 'too-short' };
  if (segments.every(s => idx.strict.includes(strictNorm(s)))) return { status: 'exact' };
  if (segments.every(s => idx.loose.includes(` ${looseNorm(s)} `))) return { status: 'loose' };
  const sh = shingles(words(quote), 5);
  const coverage = sh.length ? sh.filter(s => idx.loose.includes(` ${s} `)).length / sh.length : 0;
  return { status: coverage >= 0.5 ? 'partial' : 'missing', coverage: Math.round(coverage * 100) };
}

// ---------------------------------------------------------------- per-entry checks
function checkEntry(entry, expected) {
  const issues = [];
  const add = (level, where, message) => issues.push({ level, where, message });
  const slug = entry.slug;
  const claims = Array.isArray(entry.claims) ? entry.claims : [];
  const sources = Array.isArray(entry.sources) ? entry.sources : [];
  const claimsById = new Map();
  const sourcesById = new Map();
  const usedClaims = new Set();
  const usedSources = new Set();

  if (entry.schema !== 'mythics-entry/1') add('error', 'schema', 'Nilai "schema" harus "mythics-entry/1".');
  if (entry.batch_id !== batchId) add('error', 'batch_id', `batch_id harus "${batchId}".`);
  if (!expected) add('error', 'slug', `Slug "${slug}" tidak ada di daftar batch ini.`);
  else {
    if (entry.task !== expected.task) add('error', 'task', `task harus "${expected.task}".`);
    if (entry.tier !== expected.tier) add('error', 'tier', `tier harus "${expected.tier}".`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.researched_at || '')) add('warn', 'researched_at', 'researched_at harus tanggal YYYY-MM-DD.');

  // sources
  sources.forEach((s, i) => {
    const where = `sources[${i}]${s?.id ? ` (${s.id})` : ''}`;
    if (!isObj(s)) return add('error', where, 'Sumber harus berupa objek.');
    if (!new RegExp(`^${slug}-s\\d+$`).test(s.id || '')) add('error', where, `ID sumber harus berpola ${slug}-s1, ${slug}-s2, …`);
    if (sourcesById.has(s.id)) add('error', where, `ID sumber ${s.id} dipakai dua kali.`);
    sourcesById.set(s.id, s);
    let url;
    try {
      url = new URL(s.url);
    } catch {
      return add('error', where, `URL tidak valid: ${s.url}`);
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') add('error', where, `URL harus http(s): ${s.url}`);
    if ((url.pathname === '/' || url.pathname === '') && !url.search) add('error', where, `URL ${s.url} adalah halaman depan situs. Cantumkan halaman spesifik yang memuat kutipannya.`);
    if (BLOCKED_HOST.test(url.hostname)) add('error', where, `Sumber dari ${url.hostname} dilarang (§4). Ganti dengan sumber lain.`);
    if (!nonEmpty(s.title)) add('error', where, 'Sumber tanpa judul.');
    if (!ENUM.sourceType.has(s.type)) add('error', where, `type "${s.type}" tidak ada di §8.9.`);
    if (s.type !== 'wikipedia' && /(^|\.)wikipedia\.org$/.test(url.hostname)) add('warn', where, 'Halaman Wikipedia harus bertipe "wikipedia".');
  });

  // claims
  claims.forEach((c, i) => {
    const where = `claims[${i}]${c?.id ? ` (${c.id})` : ''}`;
    if (!isObj(c)) return add('error', where, 'Klaim harus berupa objek.');
    if (!new RegExp(`^${slug}-c\\d{2,}$`).test(c.id || '')) add('error', where, `ID klaim harus berpola ${slug}-c01, ${slug}-c02, …`);
    if (claimsById.has(c.id)) add('error', where, `ID klaim ${c.id} dipakai dua kali.`);
    claimsById.set(c.id, c);
    if (!sourcesById.has(c.source_id)) add('error', where, `source_id "${c.source_id}" tidak ada di sources.`);
    else usedSources.add(c.source_id);
    if (!nonEmpty(c.quote)) add('error', where, 'quote kosong.');
    else if (c.quote.length < 30 || c.quote.length > 400) add('warn', where, `Panjang quote ${c.quote.length} karakter; aturannya 30–400.`);
    if (!ENUM.context.has(c.context)) add('error', where, `context "${c.context}" tidak ada di §8.10.`);
    if (!isObj(c.statement) || !nonEmpty(c.statement.id) || !nonEmpty(c.statement.en)) add('error', where, 'statement harus punya teks id dan en.');
  });

  const refs = (ids, where) => {
    if (!Array.isArray(ids) || !ids.length) return add('error', where, 'claim_ids kosong: setiap isi harus didukung klaim.');
    for (const id of ids) {
      if (!claimsById.has(id)) add('error', where, `claim_ids menunjuk "${id}" yang tidak ada di claims.`);
      else usedClaims.add(id);
    }
  };
  const text = (node, where, { claims: needClaims = true, required = false, max = 0 } = {}) => {
    if (node === null || node === undefined) {
      if (required) add('error', where, 'Wajib diisi.');
      return;
    }
    if (!isObj(node)) return add('error', where, 'Harus berupa objek {"id","en"}.');
    for (const lang of ['id', 'en']) {
      if (!nonEmpty(node[lang])) add('error', `${where}.${lang}`, 'Teks kosong.');
      else {
        if (/\*\*|__|^#+\s|<\/?[a-z][^>]*>/m.test(node[lang])) add('warn', `${where}.${lang}`, 'Mengandung Markdown/HTML; harus teks biasa.');
        if (max && node[lang].length > max) add('warn', `${where}.${lang}`, `Panjang ${node[lang].length} karakter; maksimal ${max}.`);
      }
    }
    if (needClaims) refs(node.claim_ids, where);
  };
  const valued = (node, where, set, label, { required = false } = {}) => {
    if (node === null || node === undefined) {
      if (required) add('error', where, 'Wajib diisi.');
      return;
    }
    if (!isObj(node)) return add('error', where, 'Harus berupa objek {"value","claim_ids"}.');
    if (set && !set.has(node.value)) add('error', where, `Nilai "${node.value}" tidak ada di ${label}.`);
    refs(node.claim_ids, where);
  };
  const list = (value, where) => {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
      add('error', where, 'Harus berupa daftar [].');
      return [];
    }
    return value;
  };

  // identity
  const id = entry.identity;
  if (!isObj(id)) add('error', 'identity', 'Wajib diisi.');
  else {
    if (!nonEmpty(id.canonical_name)) add('error', 'identity.canonical_name', 'Wajib diisi.');
    if (!isObj(id.display_name) || !nonEmpty(id.display_name.id) || !nonEmpty(id.display_name.en)) add('error', 'identity.display_name', 'Harus punya id dan en.');
    if (id.native_name != null) {
      if (!isObj(id.native_name) || !nonEmpty(id.native_name.text)) add('error', 'identity.native_name', 'Harus {"text","script","claim_ids"} atau null.');
      else refs(id.native_name.claim_ids, 'identity.native_name');
    }
    if (id.wikidata_qid != null && !/^Q\d+$/.test(id.wikidata_qid)) add('error', 'identity.wikidata_qid', 'Harus berbentuk Q123 atau null.');
    // Agents have written QIDs from memory; the batch manifest holds the item the worklist was built from.
    else if (id.wikidata_qid != null && expected?.qid && id.wikidata_qid !== expected.qid) add('error', 'identity.wikidata_qid', `Tidak sama dengan QID di prompt batch (${expected.qid}). Salin QID dari prompt batch, jangan dari ingatan.`);
    refs(id.claim_ids, 'identity');
  }
  list(entry.alternate_names, 'alternate_names').forEach((n, i) => {
    const where = `alternate_names[${i}]`;
    if (!nonEmpty(n?.name)) return add('error', where, 'name kosong.');
    if (!ENUM.nameType.has(n.name_type)) add('error', where, `name_type "${n.name_type}" tidak dikenal.`);
    refs(n.claim_ids, `${where} (${n.name})`);
  });

  valued(entry.jenis, 'jenis', ENUM.jenis, '§8.11', { required: true });
  valued(entry.classification, 'classification', ENUM.classification, '§8.1', { required: true });
  if (isObj(entry.culture)) {
    if (entry.culture.value === null) {
      if (!nonEmpty(entry.culture.suggested_new)) add('error', 'culture', 'Kalau value null, isi suggested_new.');
      else add('manual', 'culture', `Mengusulkan tradisi baru: "${entry.culture.suggested_new}".`);
      refs(entry.culture.claim_ids, 'culture');
    } else valued(entry.culture, 'culture', ENUM.culture, '§8.2');
  } else add('error', 'culture', 'Wajib diisi (value atau suggested_new).');
  valued(entry.region, 'region', ENUM.region, '§8.3', { required: true });
  if (entry.countries != null) {
    if (!isObj(entry.countries) || !Array.isArray(entry.countries.value)) add('error', 'countries', 'Harus {"value":[...],"claim_ids"} atau null.');
    else refs(entry.countries.claim_ids, 'countries');
  }
  if (entry.era != null) {
    if (!isObj(entry.era)) add('error', 'era', 'Harus objek atau null.');
    else {
      text(entry.era.text, 'era.text', { claims: false, required: true });
      refs(entry.era.claim_ids, 'era');
    }
  }
  list(entry.habitats, 'habitats').forEach((h, i) => valued(h, `habitats[${i}]`, ENUM.habitat, '§8.5'));
  valued(entry.disposition, 'disposition', ENUM.disposition, 'daftar disposition');
  list(entry.traits, 'traits').forEach((t, i) => valued(t, `traits[${i}]`, ENUM.trait, '§8.4'));

  // prose
  text(entry.short_description, 'short_description', { required: true, max: 280 });
  const paragraphs = list(entry.long_description, 'long_description');
  if (!paragraphs.length) add('error', 'long_description', 'Minimal 1 paragraf.');
  if (paragraphs.length > 6) add('warn', 'long_description', `${paragraphs.length} paragraf; maksimal 6.`);
  if (entry.tier === 'rich' && paragraphs.length === 1) add('warn', 'long_description', 'Tingkat rich sebaiknya 2–6 paragraf.');
  paragraphs.forEach((p, i) => text(p, `long_description[${i}]`));
  text(entry.cultural_context, 'cultural_context');
  if (entry.etymology != null) {
    if (!isObj(entry.etymology)) add('error', 'etymology', 'Harus objek atau null.');
    else {
      if (!nonEmpty(entry.etymology.original_form)) add('error', 'etymology.original_form', 'Wajib diisi bila etymology tidak null.');
      text(entry.etymology.literal_meaning, 'etymology.literal_meaning', { claims: false, required: true });
      refs(entry.etymology.claim_ids, 'etymology');
    }
  }
  if (entry.story_mode != null) {
    if (!isObj(entry.story_mode)) add('error', 'story_mode', 'Harus objek atau null.');
    else for (const k of ['who', 'origin', 'role', 'famous_for']) text(entry.story_mode[k], `story_mode.${k}`);
  }
  text(entry.did_you_know, 'did_you_know');
  list(entry.abilities, 'abilities').forEach((a, i) => {
    const where = `abilities[${i}]`;
    if (a?.ability_id != null && !ENUM.ability.has(a.ability_id)) add('error', where, `ability_id "${a.ability_id}" tidak ada di §8.6.`);
    text(a?.name, `${where}.name`, { claims: false, required: true });
    text(a?.description, `${where}.description`, { claims: false, required: true });
    refs(a?.claim_ids, where);
  });
  list(entry.weaknesses, 'weaknesses').forEach((w, i) => {
    text(w?.name, `weaknesses[${i}].name`, { claims: false, required: true });
    text(w?.description, `weaknesses[${i}].description`, { claims: false, required: true });
    refs(w?.claim_ids, `weaknesses[${i}]`);
  });
  list(entry.variants, 'variants').forEach((v, i) => {
    if (!nonEmpty(v?.name)) add('error', `variants[${i}].name`, 'Wajib diisi.');
    text(v?.tradition, `variants[${i}].tradition`, { claims: false, required: true });
    text(v?.description, `variants[${i}].description`, { claims: false, required: true });
    refs(v?.claim_ids, `variants[${i}]`);
  });
  list(entry.stories, 'stories').forEach((s, i) => {
    for (const k of ['title', 'role', 'summary']) text(s?.[k], `stories[${i}].${k}`, { claims: false, required: true });
    refs(s?.claim_ids, `stories[${i}]`);
  });
  list(entry.places, 'places').forEach((p, i) => {
    if (!ENUM.placeType.has(p?.type)) add('error', `places[${i}].type`, `type "${p?.type}" tidak dikenal.`);
    text(p?.name, `places[${i}].name`, { claims: false, required: true });
    text(p?.description, `places[${i}].description`, { claims: false, required: true });
    refs(p?.claim_ids, `places[${i}]`);
  });
  list(entry.timeline, 'timeline').forEach((t, i) => {
    if (!nonEmpty(t?.period)) add('error', `timeline[${i}].period`, 'Wajib diisi.');
    text(t?.title, `timeline[${i}].title`, { claims: false, required: true });
    text(t?.description, `timeline[${i}].description`, { claims: false, required: true });
    refs(t?.claim_ids, `timeline[${i}]`);
  });
  list(entry.relations, 'relations').forEach((r, i) => {
    if (!nonEmpty(r?.target_name)) add('error', `relations[${i}].target_name`, 'Wajib diisi.');
    if (!ENUM.relation.has(r?.relation_type)) add('error', `relations[${i}].relation_type`, `"${r?.relation_type}" tidak ada di §8.7.`);
    text(r?.note, `relations[${i}].note`, { claims: false, required: true });
    refs(r?.claim_ids, `relations[${i}]`);
  });
  list(entry.modern_depictions, 'modern_depictions').forEach((m, i) => {
    if (!nonEmpty(m?.title)) add('error', `modern_depictions[${i}].title`, 'Wajib diisi.');
    if (!ENUM.medium.has(m?.medium)) add('error', `modern_depictions[${i}].medium`, `"${m?.medium}" tidak dikenal.`);
    text(m?.description, `modern_depictions[${i}].description`, { claims: false, required: true });
    refs(m?.claim_ids, `modern_depictions[${i}]`);
  });
  if (entry.tradition_vs_modern != null) {
    text(entry.tradition_vs_modern.traditional, 'tradition_vs_modern.traditional', { claims: false, required: true });
    text(entry.tradition_vs_modern.modern, 'tradition_vs_modern.modern', { claims: false, required: true });
    refs(entry.tradition_vs_modern.claim_ids, 'tradition_vs_modern');
  }
  list(entry.learning_questions, 'learning_questions').forEach((q, i) => text(q, `learning_questions[${i}]`, { claims: false, required: true }));
  list(entry.conflicts, 'conflicts').forEach((c, i) => {
    text(c?.topic, `conflicts[${i}].topic`, { claims: false, required: true });
    list(c?.positions, `conflicts[${i}].positions`).forEach((p, j) => {
      text(p?.summary, `conflicts[${i}].positions[${j}].summary`, { claims: false, required: true });
      refs(p?.claim_ids, `conflicts[${i}].positions[${j}]`);
    });
  });

  // images (remote checks come later)
  const images = list(entry.images, 'images');
  if (images.length > 3) add('warn', 'images', `${images.length} gambar; maksimal 3.`);
  if (images.length && images.filter(i => i?.is_primary === true).length !== 1) add('error', 'images', 'Tepat satu gambar harus is_primary: true.');
  images.forEach((img, i) => {
    const where = `images[${i}]`;
    if (!/^File:.+\.[a-z0-9]+$/i.test(img?.commons_file || '')) add('error', where, 'commons_file harus berbentuk "File:<nama>.<ekstensi>".');
    if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(img?.commons_url || '')) add('error', where, 'commons_url harus halaman berkas di commons.wikimedia.org.');
    if (!ENUM.imageType.has(img?.image_type)) add('error', where, `image_type "${img?.image_type}" tidak ada di §8.8.`);
    text(img?.shows, `${where}.shows`, { claims: false, required: true });
    text(img?.caption, `${where}.caption`, { claims: false, required: true });
    if (!nonEmpty(img?.evidence)) add('error', where, 'evidence kosong: tulis bukti bahwa gambar ini menggambarkan makhluk ini.');
    if (!nonEmpty(img?.license)) add('error', where, 'license kosong.');
  });

  // coverage & tier
  sources.forEach(s => {
    if (s?.id && !usedSources.has(s.id)) add('warn', `sources (${s.id})`, 'Sumber ini tidak dipakai klaim mana pun; hapus atau pakai.');
  });
  claims.forEach(c => {
    if (c?.id && !usedClaims.has(c.id)) add('warn', `claims (${c.id})`, 'Klaim ini tidak dirujuk bagian teks mana pun.');
  });
  const gaps = list(entry.gaps, 'gaps');
  const short = tierShortfall(entry);
  if (short.length) add(gaps.length ? 'manual' : 'warn', 'tier', `Di bawah target ${entry.tier}: ${short.join(', ')}.${gaps.length ? ' gaps sudah diisi; nilai apakah pencariannya memadai.' : ' Cari sumber tambahan, atau jelaskan di gaps apa yang sudah dicari.'}`);
  return { issues, claimsById, sourcesById };
}

// Titles and structural words that are capitalised without naming anything specific.
const DETAIL_STOP = new Set(('dewa dewi sang resi rsi raja ratu kuil candi sungai gunung pulau museum kitab lord king queen god goddess sage temple shrine river mount mountain '
  + 'island museum book saint prince princess sir the in on of and dalam pada di dan atau yang').split(' '));
const SKIP_KEYS = new Set(['claims', 'sources', 'images', 'gaps', 'learning_questions', 'claim_ids', 'schema', 'batch_id', 'slug', 'task', 'tier', 'researched_at', 'identity', 'alternate_names', 'classification', 'culture', 'region', 'habitats', 'disposition', 'traits', 'ability_id', 'relation_type', 'medium', 'type', 'earliest_attestation']);

/**
 * Names and numbers in the prose that neither a quote nor a claim statement of the entry contains:
 * the usual sign of detail added from memory. Statements count because they translate their quotes
 * (Wisnu for Vishnu); whether they do so faithfully is part of the manual review.
 */
const PROPER_NAME_FIELD = /^(variants\[\d+\]\.name|relations\[\d+\]\.target_name|modern_depictions\[\d+\]\.title)$/;
const LABEL_FIELD = /^(abilities|weaknesses)\[\d+\]\.name$|^timeline\[\d+\]\.title$/;
function checkDetails(entry, issues) {
  const corpus = ` ${(entry.claims || []).map(c => [c.quote, c.statement?.id, c.statement?.en].map(looseNorm).join(' ')).join(' ')} `;
  const own = new Set([entry.identity?.canonical_name, entry.identity?.display_name?.id, entry.identity?.display_name?.en, entry.identity?.native_name?.text,
    ...(entry.alternate_names || []).map(n => n?.name)].filter(nonEmpty).flatMap(words));
  const known = key => key.length < 3 || own.has(key) || DETAIL_STOP.has(key) || corpus.includes(` ${key} `);
  const found = new Map();
  const note = (where, token) => {
    if (!found.has(where)) found.set(where, new Set());
    found.get(where).add(token);
  };
  const scan = (text, where) => {
    for (const n of String(text).match(/\b\d{2,4}\b/g) || []) if (!corpus.includes(` ${n} `)) note(where, n);
    if (PROPER_NAME_FIELD.test(where)) {
      if (!words(text).every(known)) note(where, text);
      return;
    }
    if (LABEL_FIELD.test(where)) return;
    for (const sentence of String(text).split(/(?<=[.!?:;])\s+/)) {
      sentence.split(/[\s,()"“”'‘’/—–]+/).filter(Boolean).forEach((t, i) => {
        if (i === 0 || !/^\p{Lu}/u.test(t)) return;
        if (!words(t).every(known)) note(where, t.replace(/[.,;:!?]+$/, ''));
      });
    }
  };
  const walk = (node, path) => {
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
    if (!isObj(node)) return;
    for (const [k, v] of Object.entries(node)) {
      if (SKIP_KEYS.has(k)) continue;
      const where = path ? `${path}.${k}` : k;
      if (typeof v === 'string') scan(v, where.replace(/\.(id|en)$/, ''));
      else if (typeof v === 'number' && k === 'year') scan(String(Math.abs(v)), where);
      else walk(v, where);
    }
  };
  walk(entry, '');
  for (const [where, tokens] of found) {
    issues.push({ level: 'warn', where, message: `Tidak muncul di kutipan mana pun: ${[...tokens].join(', ')}. Tambahkan klaim yang kutipannya memuat hal ini, atau hapus dari teks.` });
  }
}

// ---------------------------------------------------------------- remote checks
async function checkQuotes(entry, ctx, issues) {
  const results = [];
  for (const c of entry.claims || []) {
    const source = ctx.sourcesById.get(c.source_id);
    const row = { id: c.id, source_id: c.source_id, host: null, statement: c.statement?.en || '', statement_id: c.statement?.id || '', quote: c.quote, context: c.context };
    results.push(row);
    // An agent once shifted every quote one claim down: the quotes were real, the statements unsupported.
    // For English quotes, flag a statement that shares almost no content word with its own quote.
    const content = s => new Set(words(s).filter(w => w.length > 3 && !STOPWORDS.has(w)).map(w => w.slice(0, 5)));
    const quoteWords = words(c.quote || '');
    const english = quoteWords.length && quoteWords.filter(w => ENGLISH_MARKERS.has(w)).length / quoteWords.length >= 0.12;
    const stmt = content(c.statement?.en || '');
    if (english && stmt.size >= 3) {
      const q = content(c.quote);
      const shared = [...stmt].filter(w => q.has(w)).length / stmt.size;
      if (shared < 0.2) issues.push({ level: 'warn', where: `claims (${c.id})`, message: 'Pernyataan hampir tidak berbagi kata dengan kutipannya sendiri. Pastikan kutipan ini benar-benar mendukung pernyataan ini (bukan kutipan milik klaim lain).' });
    }
    if (!source || !nonEmpty(c.quote)) {
      row.status = 'skipped';
      continue;
    }
    let host;
    try {
      host = new URL(source.url).hostname;
    } catch {
      row.status = 'skipped';
      continue;
    }
    row.host = host;
    const page = await loadPage(source.url);
    const problem = pageProblem(page);
    if (problem) {
      row.status = 'unreachable';
      row.detail = problem;
      continue;
    }
    const match = findQuote(c.quote, page);
    row.status = match.status;
    if (match.coverage !== undefined) row.detail = `${match.coverage}% potongan 5 kata cocok`;
    if (page.archive_url) {
      row.archive_url = page.archive_url;
      // An old snapshot may predate the text that was quoted, so a miss there is not proof of a bad quote.
      if (['partial', 'missing'].includes(match.status)) {
        row.status = 'unreachable';
        row.detail = `${page.direct_problem}; arsip Wayback tidak memuat kutipan`;
        continue;
      }
      row.detail = `${page.direct_problem}; dicek lewat arsip Wayback`;
    }
    if (match.status === 'partial') {
      if (DYNAMIC_HOST.test(host)) row.status = 'unreachable';
      else issues.push({ level: 'error', where: `claims (${c.id})`, message: `Kutipan tidak persis sama dengan teks di ${source.url} (hanya ${match.coverage}% cocok). Buka lagi halamannya dan salin ulang kutipannya kata per kata.` });
    } else if (match.status === 'missing') {
      if (DYNAMIC_HOST.test(host)) {
        row.status = 'unreachable';
        row.detail = 'halaman dinamis; teks tidak terbaca otomatis';
      } else issues.push({ level: 'error', where: `claims (${c.id})`, message: `Kutipan tidak ditemukan di ${source.url}. Jangan mengubah kutipan agar terlihat cocok: buka halamannya dan salin teks yang benar-benar ada, atau hapus klaim ini beserta teks yang bergantung padanya.` });
    } else if (match.status === 'too-short') {
      issues.push({ level: 'error', where: `claims (${c.id})`, message: 'Kutipan terlalu pendek untuk diperiksa (minimal 3 kata per potongan).' });
    }
  }
  for (const row of results) {
    if (!['exact', 'loose'].includes(row.status)) continue;
    const page = await loadPage(ctx.sourcesById.get(row.source_id).url);
    if (!page.wiki_sections) continue;
    const tail = words(row.quote).slice(-5).join(' ');
    const section = page.wiki_sections.find(sec => sec.loose.includes(` ${tail} `));
    if (!section) continue;
    const after = section.loose.slice(section.loose.indexOf(` ${tail} `) + tail.length + 2).split(' ').slice(0, 12);
    if (section.unsourced) {
      row.wiki_flag = 'bagian tanpa sumber';
      issues.push({ level: 'warn', where: `claims (${row.id})`, message: `Kutipan berasal dari bagian Wikipedia "${section.heading}" yang ditandai tidak mencantumkan sumber. Dukung klaim ini dengan sumber lain yang independen, atau hapus.` });
    } else if (after.includes(CN_MARK)) {
      row.wiki_flag = 'citation needed';
      issues.push({ level: 'warn', where: `claims (${row.id})`, message: 'Kalimat yang dikutip ditandai "citation needed/butuh rujukan" di Wikipedia. Dukung klaim ini dengan sumber lain yang independen, atau hapus.' });
    }
  }
  const unreachable = results.filter(r => r.status === 'unreachable');
  if (unreachable.length) {
    const hosts = [...new Set(unreachable.map(r => `${r.host}${r.detail ? ` (${r.detail})` : ''}`))];
    issues.push({ level: 'manual', where: 'claims', message: `${unreachable.length} kutipan tidak bisa dicek otomatis: ${hosts.join('; ')}.` });
  }
  return results;
}

function checkCopying(entry, ctx, issues) {
  const texts = [];
  const push = (node, where) => node && ['id', 'en'].forEach(l => nonEmpty(node[l]) && texts.push({ where: `${where}.${l}`, text: node[l] }));
  push(entry.short_description, 'short_description');
  (entry.long_description || []).forEach((p, i) => push(p, `long_description[${i}]`));
  push(entry.cultural_context, 'cultural_context');
  push(entry.did_you_know, 'did_you_know');
  for (const k of ['who', 'origin', 'role', 'famous_for']) push(entry.story_mode?.[k], `story_mode.${k}`);
  (entry.stories || []).forEach((s, i) => push(s?.summary, `stories[${i}].summary`));
  const corpora = [...ctx.sourcesById.values()].map(s => pageCache.get(s.url)).filter(Boolean);
  return Promise.all(corpora).then(pages => {
    const loaded = pages.filter(p => !pageProblem(p)).map(p => indexed(p).loose);
    for (const t of texts) {
      const hit = shingles(words(t.text), 12).find(s => loaded.some(l => l.includes(` ${s} `)));
      if (hit) issues.push({ level: 'warn', where: t.where, message: `Ada rangkaian 12 kata yang sama persis dengan sumber ("${hit}…"). Tulis ulang dengan kata-kata sendiri.` });
    }
  });
}

const licenseKey = s => {
  const l = String(s || '').toLowerCase();
  if (/cc0|cc-zero/.test(l)) return 'cc0';
  if (/public domain|^pd\b|^pd-|cc-?pd|pdm/.test(l)) return 'public-domain';
  return l
    .replace(/creative commons|attribution|share ?alike|unported|generic|international|licen[cs]e|deed/g, m => ({ 'creative commons': 'cc', attribution: 'by', 'share alike': 'sa', sharealike: 'sa' }[m] ?? ''))
    .replace(/[^a-z0-9.]+/g, '');
};
const NOT_FREE = /\bnc\b|-nc\b|noncommercial|non-commercial|\bnd\b|-nd\b|noderiv|fair use|non-free|all rights reserved/i;

async function checkImages(entry, issues) {
  const images = (entry.images || []).filter(i => /^File:/.test(i?.commons_file || ''));
  if (!images.length) return [];
  const info = await fetchImageInfo(images.map(i => i.commons_file));
  const names = [
    entry.identity?.canonical_name, entry.identity?.display_name?.id, entry.identity?.display_name?.en,
    entry.identity?.native_name?.text, entry.slug.replace(/-/g, ' '), ...(entry.alternate_names || []).map(n => n?.name)
  ].filter(nonEmpty).map(looseNorm).filter(n => n.length >= 3);
  const results = [];
  await mkdir(THUMBS, { recursive: true });
  for (const [i, img] of images.entries()) {
    const name = img.commons_file.replace(/^File:/i, '').replace(/_/g, ' ');
    const rec = info.get(name);
    const where = `images[${i}] (${img.commons_file})`;
    const row = { file: img.commons_file, claimed_license: img.license, evidence: img.evidence, image_type: img.image_type };
    results.push(row);
    if (!rec) {
      issues.push({ level: 'error', where, message: 'Berkas ini tidak ada di Wikimedia Commons. Jangan membuat nama berkas; salin dari halaman berkas yang benar-benar kamu buka.' });
      row.status = 'missing';
      continue;
    }
    Object.assign(row, { commons_license: rec.license, rights: rec.rights_status, author: rec.author, date: rec.date_text, description: rec.description, restrictions: rec.restrictions });
    if (rec.rights_status === 'UNKNOWN' || NOT_FREE.test(rec.license || '')) issues.push({ level: 'error', where, message: `Lisensi di Commons ("${rec.license}") tidak bebas atau tidak jelas. Ganti gambarnya.` });
    else if (licenseKey(rec.license) !== licenseKey(img.license)) {
      issues.push({ level: 'error', where, message: `Lisensi yang ditulis ("${img.license}") berbeda dengan Commons ("${rec.license}"). Salin persis dari halaman berkasnya.` });
    }
    if (rec.restrictions) issues.push({ level: 'manual', where, message: `Commons mencatat batasan: ${rec.restrictions}.` });
    if (nonEmpty(img.creator) && rec.author && !looseNorm(rec.author).includes(looseNorm(img.creator)) && !looseNorm(img.creator).includes(looseNorm(rec.author))) {
      issues.push({ level: 'warn', where, message: `creator ("${img.creator}") berbeda dengan Commons ("${rec.author}").` });
    }
    // relevance: does anything on Commons tie this file to the creature?
    const extra = await fetchJson(`https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
      action: 'query', format: 'json', formatversion: '2', prop: 'categories|globalusage', titles: `File:${name}`, cllimit: 'max', gulimit: '100', guprop: 'namespace'
    })}`).catch(() => null);
    const page = extra?.query?.pages?.[0] || {};
    const cats = (page.categories || []).map(c => c.title.replace(/^Category:/, ''));
    const usage = (page.globalusage || []).filter(u => String(u.ns) === '0').map(u => `${u.wiki}: ${u.title.replace(/_/g, ' ')}`);
    row.categories = cats;
    row.used_on = usage.slice(0, 15);
    const evidence = [];
    const has = hay => names.some(n => ` ${looseNorm(hay)} `.includes(` ${n} `));
    if (has(name)) evidence.push('nama berkas');
    if (rec.description && has(rec.description)) evidence.push('deskripsi berkas');
    const cat = cats.find(has);
    if (cat) evidence.push(`kategori "${cat}"`);
    const used = usage.find(has);
    if (used) evidence.push(`dipakai di ${used}`);
    row.auto_evidence = evidence;
    issues.push({ level: 'manual', where, message: evidence.length ? `Keterkaitan otomatis: ${evidence.join(', ')}. Cek visual tetap diperlukan.` : 'Tidak ada keterkaitan otomatis dengan nama makhluk di Commons. Cek visual dan buktinya secara manual.' });
    if (rec.urls?.[500]) {
      try {
        const res = await fetch(rec.urls[500], { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
        if (res.ok) {
          const ext = (rec.mime || 'image/jpeg').split('/')[1].replace('jpeg', 'jpg').replace('svg+xml', 'png');
          row.thumb = join(THUMBS, `${entry.slug}-${i + 1}.${ext}`);
          await writeFile(row.thumb, Buffer.from(await res.arrayBuffer()));
        }
      } catch {}
    }
  }
  return results;
}

// ---------------------------------------------------------------- run
const submission = await readSubmission();
const expected = new Map(manifest.entries.map(e => [e.slug, e]));
const existingNames = new Map(creatures.map(c => [looseNorm(c.canonical_name), c.slug]));
const report = { batch_id: batchId, checked_at: new Date().toISOString(), files: submission.files, parse_problems: submission.problems, missing: [], entries: [] };
report.missing = [...expected.keys()].filter(s => !submission.entries.has(s));

for (const [slug, { entry, file }] of submission.entries) {
  process.stdout.write(`Memeriksa ${slug} … `);
  if (entry.skip) {
    const issues = [];
    if (entry.task !== 'new') issues.push({ level: 'error', where: 'skip', message: 'skip hanya boleh untuk task "new".' });
    if (!nonEmpty(entry.skip.reason) || !/^https?:\/\//.test(entry.skip.evidence_url || '')) issues.push({ level: 'error', where: 'skip', message: 'skip harus punya reason dan evidence_url.' });
    issues.push({ level: 'manual', where: 'skip', message: `Diusulkan dilewati: ${entry.skip.reason} (${entry.skip.evidence_url}).` });
    const verdict = issues.some(i => i.level === 'error') ? 'perlu-perbaikan' : 'skip';
    report.entries.push({ slug, file, verdict, counts: { claims: 0, sources: 0, images: 0 }, issues, claims: [], images: [] });
    console.log(`${verdict}`);
    continue;
  }
  const ctx = checkEntry(entry, expected.get(slug));
  const { issues } = ctx;
  if (entry.task === 'new') {
    const dup = existingNames.get(looseNorm(entry.identity?.canonical_name));
    if (creatures.some(c => c.slug === slug) || dup) issues.push({ level: 'error', where: 'slug', message: `Makhluk ini sudah ada di Mythics (${dup || slug}).` });
  }
  checkDetails(entry, issues);
  const claims = await checkQuotes(entry, ctx, issues);
  await checkCopying(entry, ctx, issues);
  const images = await checkImages(entry, issues);
  const errors = issues.filter(i => i.level === 'error').length;
  const verdict = errors ? 'perlu-perbaikan' : 'lulus-otomatis';
  report.entries.push({ slug, file, verdict, counts: { claims: claims.length, sources: (entry.sources || []).length, images: images.length }, issues, claims, images });
  console.log(`${verdict} (${errors} error, ${issues.filter(i => i.level === 'warn').length} peringatan)`);
}

// ---------------------------------------------------------------- write reports
await mkdir(REVIEWS, { recursive: true });
await writeFile(join(REVIEWS, `${batchId}.review.json`), JSON.stringify(report, null, 2) + '\n');

const esc = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ');
const md = [`# Review ${batchId}`, '', `Diperiksa ${report.checked_at}. Berkas: ${report.files.join(', ') || '(tidak ada)'}.`, ''];
if (report.parse_problems.length) md.push('## Blok yang gagal dibaca', ...report.parse_problems.map(p => `- ${p.file} blok ${p.block}: ${p.message}`), '');
if (report.missing.length) md.push(`**Belum dikirim:** ${report.missing.join(', ')}`, '');
for (const e of report.entries) {
  const tally = e.claims.reduce((t, c) => ({ ...t, [c.status]: (t[c.status] || 0) + 1 }), {});
  md.push(`## ${e.slug} — ${e.verdict}`, '', `Klaim ${e.counts.claims} (${Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(', ')}), sumber ${e.counts.sources}, gambar ${e.counts.images}.`, '');
  for (const level of ['error', 'warn', 'manual']) {
    const items = e.issues.filter(i => i.level === level);
    if (items.length) md.push(`**${level}**`, ...items.map(i => `- \`${i.where}\` ${i.message}`), '');
  }
  md.push('| klaim | status | sumber | pernyataan (en) | kutipan |', '|---|---|---|---|---|');
  for (const c of e.claims) md.push(`| ${c.id} | ${c.status}${c.detail ? ` (${esc(c.detail)})` : ''} | ${esc(c.host)} | ${esc(c.statement)} | ${esc(c.quote)} |`);
  md.push('');
  for (const img of e.images) {
    md.push(`- Gambar ${img.file}: lisensi Commons "${img.commons_license ?? '-'}" (${img.rights ?? img.status}); pembuat ${img.author ?? '-'}; tanggal ${img.date ?? '-'}`);
    md.push(`  - deskripsi: ${img.description ?? '-'}`, `  - kategori: ${(img.categories || []).join('; ') || '-'}`, `  - dipakai di: ${(img.used_on || []).join('; ') || '-'}`, `  - bukti dari Gemini: ${img.evidence ?? '-'}`, `  - thumbnail: ${img.thumb ?? '-'}`);
  }
  md.push('');
}
await writeFile(join(REVIEWS, `${batchId}.review.md`), md.join('\n'));

const fix = [`# Perbaikan ${batchId}`, '', 'Pemeriksaan menemukan masalah di bawah. Perbaiki semuanya, lalu kirim ulang **entri lengkap** untuk setiap makhluk yang disebut, satu blok ```json per makhluk, dengan `batch_id` yang sama. Jangan kirim ulang entri yang tidak disebut.', '', 'Kalau kutipan tidak ditemukan, jangan mengubahnya supaya terlihat cocok. Buka lagi halamannya dan salin teks yang benar-benar ada, atau hapus klaim itu beserta teks yang bergantung padanya.', ''];
if (report.parse_problems.length) fix.push('## JSON yang gagal dibaca', ...report.parse_problems.map(p => `- Blok ${p.block} (${p.preview ?? ''}…): ${p.message}`), '');
if (report.missing.length) fix.push(`## Belum dikirim`, `Kerjakan juga: ${report.missing.join(', ')}.`, '');
for (const e of report.entries) {
  const items = e.issues.filter(i => i.level !== 'manual');
  if (!items.length) continue;
  fix.push(`## ${e.slug}`, ...items.map(i => `- \`${i.where}\`: ${i.message}`), '');
}
await writeFile(join(REVIEWS, `${batchId}.fix-draft.md`), fix.join('\n'));

const total = report.entries.length;
const failing = report.entries.filter(e => e.verdict === 'perlu-perbaikan').length;
console.log(`\n${total} entri diperiksa, ${failing} perlu perbaikan, ${report.missing.length} belum dikirim, ${report.parse_problems.length} blok gagal dibaca.`);
console.log(`Laporan: data/gemini/reviews/${batchId}.review.md`);
