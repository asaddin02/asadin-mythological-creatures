#!/usr/bin/env node
/** Reproducible, source-attributed expansion of the public JSON library.
 * Run discovery first, then import. Cached Wikimedia responses support resumption.
 * Preserves existing records; never manufactures lore, translations, or power scores.
 */
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fetchJson, chunk } from "../server/ingest/http.mjs";
import { crawlCategoryTree } from "../server/ingest/discovery.mjs";
import {
  cultureFromCategory,
  cultureRecords,
  REGIONS,
  CLASSIFICATIONS,
  classify,
  cultureRank,
} from "../server/ingest/taxonomy.mjs";
import { LEGACY_SLUGS } from "../server/ingest/research.mjs";
const ROOT = new URL("../", import.meta.url);
const read = async (file) =>
  JSON.parse(await readFile(new URL(file, ROOT), "utf8"));
const save = async (file, data) => {
  const url = new URL(file, ROOT);
  await writeFile(
    new URL(file + ".tmp", ROOT),
    JSON.stringify(data, null, 2) + "\n",
  );
  await rename(new URL(file + ".tmp", ROOT), url);
};
const L = (id, en) => ({ id, en });
const clean = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
const slugify = (text) =>
  text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const urlFor = (lang, title) =>
  `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
const today = new Date().toISOString();
await mkdir(new URL("data/import/", ROOT), { recursive: true });
if (process.argv.includes("--discover")) {
  const paths = await crawlCategoryTree({
    maxDepth: 6,
    onProgress: (categories, pages) => console.log({ categories, pages }),
  });
  await save("data/import/discovery.json", Object.fromEntries(paths));
}
const discovery = await read("data/import/discovery.json");
const existing = await read("data/creatures.json");
const categories = await read("data/categories.json");
const cultures = await read("data/cultures.json");
const regions = await read("data/regions.json");
const original = existing.filter(
  (c) => c.import_method !== "wikipedia-category-library",
);
const imported = new Map(
  existing
    .filter((c) => c.import_method === "wikipedia-category-library")
    .map((c) => [c.source_identity, c]),
);
const legacySlugs = new Set(original.map((c) => c.slug));
const existingNames = new Set(
  original
    .flatMap((c) => [
      c.canonical_name,
      c.display_name?.en,
      c.display_name?.id,
      ...(c.alternate_names || []).map((a) => a.name),
    ])
    .filter(Boolean)
    .map(slugify),
);
const metadata = new Map(cultureRecords().map((c) => [c.id, c]));
const regionMap = new Map(REGIONS.map((r) => [r.id, r]));
const legacyCultureMap = {
  indonesian: "indonesian-folklore",
  japanese: "japanese-folklore",
  chinese: "chinese-mythology",
  greek: "greek-mythology",
  norse: "norse-mythology",
  slavic: "slavic-folklore",
  celtic: "celtic-folklore",
  egyptian: "egyptian-mythology",
  philippine: "philippine-folklore",
};
const exclusions = [];
const failed = [];
const stats = {
  discovered: Object.keys(discovery).length,
  accepted: 0,
  skipped: 0,
};
async function pages(titles, lang = "en") {
  const params = {
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "extracts|categories|pageprops|info|langlinks",
    titles: titles.join("|"),
    redirects: "1",
    exintro: "1",
    explaintext: "1",
    exlimit: "max",
    clshow: "!hidden",
    cllimit: "max",
    lllang: "id",
    lllimit: "max",
    ppprop: "wikibase_item|disambiguation",
  };
  let cont = {},
    result = new Map();
  for (let guard = 0; guard < 20; guard++) {
    const data = await fetchJson(
      `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({ ...params, ...cont })}`,
      { timeoutMs: 20000, retries: 2 },
    );
    for (const p of data?.query?.pages || []) {
      const old = result.get(p.pageid);
      result.set(p.pageid, {
        ...old,
        ...p,
        categories: [...(old?.categories || []), ...(p.categories || [])],
        langlinks: [...(old?.langlinks || []), ...(p.langlinks || [])],
      });
    }
    if (!data?.continue) break;
    cont = data.continue;
  }
  return [...result.values()];
}
function reject(p, reason) {
  exclusions.push({ title: p.title, pageid: p.pageid, reason });
  stats.skipped++;
}
function accepted(p) {
  const intro = clean(p.extract);
  const cats = (p.categories || []).map((c) =>
    c.title.replace(/^Category:/, ""),
  );
  if (
    p.missing ||
    p.pageprops?.disambiguation !== undefined ||
    !p.pageprops?.wikibase_item
  )
    return "Missing article, identity, or disambiguation page";
  if (/^(List|Lists|Outline|Index|Category) of /i.test(p.title))
    return "Index, not a being";
  if (intro.length < 100) return "Insufficient introductory material";
  if (
    /\b(?:is|was) (?:an? |the )?(?:\w+ ){0,3}(?:film|novel|television series|video game|album|song|book|festival|painting|sculpture|short story|fairy tale|folktale|folk tale)\b/i.test(
      intro.slice(0, 300),
    )
  )
    return "Work, event, or narrative rather than a being";
  if (
    cats.some((c) =>
      /^(?:\d{4} (?:births|deaths|films|novels)|Living people|Fictional .* introduced in|.* characters introduced in|.* hoaxes)/i.test(
        c,
      ),
    )
  )
    return "Person, modern fictional character, or hoax";
  if (
    !/\b(?:creature|monster|spirit|ghost|demon|dragon|giant|fairy|fairies|elf|elves|goblin|ogre|serpent|bird|beast|being|vampire|werewolf|deity|god|goddess|nymph|witch|mermaid|merman|yōkai|yokai|shapeshift|legend|myth|folklore|folkloric|supernatural|troll|dwarf|cryptid)\b/i.test(
      intro.slice(0, 700),
    )
  )
    return "Intro does not establish a legendary or folkloric subject";
  return null;
}
function make(p, idPage) {
  const qid = p.pageprops.wikibase_item;
  if (LEGACY_SLUGS[qid] && legacySlugs.has(LEGACY_SLUGS[qid])) return null;
  if (existingNames.has(slugify(p.title))) return null;
  const cats = (p.categories || []).map((c) =>
    c.title.replace(/^Category:/, ""),
  );
  const paths = discovery[p.title] || [];
  const signals = [...cats, ...paths.flat()]
    .map((c) => ({ ...cultureFromCategory(c), basis: c }))
    .filter((c) => c.culture)
    .sort(
      (a, b) =>
        b.weight - a.weight || cultureRank(a.culture) - cultureRank(b.culture),
    );
  const culture = signals[0]?.culture;
  const cultureId = culture
    ? legacyCultureMap[culture.slug] || "tradition-" + culture.slug
    : "cross-cultural";
  const region = regionMap.get(culture?.region);
  const classification = classify(cats)[0]?.id || "legendary-creature";
  let slug = slugify(p.title) || qid.toLowerCase();
  if (legacySlugs.has(slug)) return null;
  const other = [...imported.values()].find(
    (c) => c.slug === slug && c.source_identity !== qid,
  );
  if (other) slug += "-" + qid.toLowerCase();
  const en = clean(p.extract);
  const id = clean(idPage?.extract);
  const short = (text) =>
    text.length > 350 ? text.slice(0, 347).replace(/\s+\S*$/, "") + "…" : text;
  const source = (page, lang) => ({
    title: page.title,
    source_name: `Wikipedia (${lang})`,
    author: "Wikipedia contributors",
    url: urlFor(lang, page.title),
    revision_id: page.lastrevid,
    revision_url: `https://${lang}.wikipedia.org/w/index.php?oldid=${page.lastrevid}`,
    license: "CC BY-SA 4.0",
    license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
    accessed_date: today,
    source_type: "Reference encyclopedia",
    text_usage: "Introductory extract; whitespace normalized",
  });
  if (!cultures.some((c) => c.id === cultureId))
    cultures.push({
      id: cultureId,
      name: L(
        culture ? `Tradisi ${culture.id}` : "Lintas budaya / belum dipetakan",
        culture
          ? `${culture.en} traditions`
          : "Cross-cultural / not yet mapped",
      ),
      description: L(
        culture
          ? `Kelompok penelusuran untuk entri yang dikaitkan dengan tradisi ${culture.id} oleh kategori sumber. Periksa konteks setiap artikel.`
          : "Entri yang belum memiliki pemetaan budaya spesifik dari kategori sumber.",
        culture
          ? `Browsing group for entries associated with ${culture.en} traditions in source categories. Consult each article for context.`
          : "Entries without a specific cultural mapping from source categories.",
      ),
      region: region?.en || "Transregional",
      region_id: region?.id || null,
      country: culture?.en || "—",
      creature_count: 0,
      tradition_scope: L(
        "Pengelompokan kategori ensiklopedia; bukan satu sistem kepercayaan yang seragam.",
        "Encyclopedia category grouping, not a single uniform belief system.",
      ),
    });
  if (region) {
    let r = regions.find((r) => r.id === region.id);
    if (!r) {
      r = {
        id: region.id,
        slug: region.id,
        name: L(region.id_, region.en),
        description: L(region.desc_id, region.desc_en),
        cultures: [],
      };
      regions.push(r);
    }
    if (!r.cultures.includes(cultureId)) r.cultures.push(cultureId);
  }
  return {
    id: slug,
    slug,
    canonical_name: p.title,
    original_name: p.title,
    display_name: L(idPage?.title || p.title, p.title),
    alternate_names: [],
    short_description: L(
      id
        ? short(id)
        : `${p.title} · ${culture ? `tradisi ${culture.id}` : "entri lintas budaya"}. Ringkasan sumber tersedia dalam Bahasa Inggris.`,
      short(en),
    ),
    long_description: id ? L(id, en) : { en },
    classification,
    culture: cultureId,
    region: region?.en || "Transregional",
    country: "",
    era: "",
    origin_type: "Reference article",
    habitat: "",
    element: "",
    behavior: "",
    traits: [],
    documented_abilities: [],
    story_mode: {
      who: L(
        id ? short(id) : "Lihat ringkasan sumber berbahasa Inggris di bawah.",
        short(en),
      ),
      origin: L(
        culture ? `Kategori sumber: ${culture.id}` : "Belum dipetakan",
        culture ? `Source category: ${culture.en}` : "Not yet mapped",
      ),
      role: L(
        "Belum diringkas secara editorial.",
        "Not yet editorially summarized.",
      ),
      famous_for: L(
        "Baca deskripsi sumber dan rujukan.",
        "Read the source description and references.",
      ),
    },
    cultural_context: L(
      "Entri pengantar dari kategori dan ringkasan Wikipedia. Hubungan budaya merupakan pemetaan kategori; varian dan rincian cerita belum dikurasi satu per satu.",
      "An introductory entry drawn from Wikipedia categories and summaries. Cultural associations are category mappings; variants and narrative details have not been individually curated.",
    ),
    related_creature_ids: [],
    images: [],
    sources: [
      source(p, "en"),
      ...(idPage?.extract ? [source(idPage, "id")] : []),
    ],
    confidence_score: "Reference",
    completeness_score: id ? 45 : 35,
    status: "published",
    created_at: today,
    updated_at: today,
    content_tier: "core",
    power_profile: {
      dimensions: {},
      calculated_basis: [],
      disclaimer: L(
        "Skor belum tersedia: belum ada penilaian atribut berbasis bukti untuk entri pengantar ini.",
        "No scores available: this introductory entry has no evidence-based attribute assessment yet.",
      ),
    },
    learning_notes: {
      context: L(
        "Mulai dari ringkasan sumber. Catat definisi, konteks budaya, dan versi cerita yang disebutkan; rujukan lebih lanjut tersedia pada artikel asal.",
        "Start with the source introduction. Note definitions, cultural context, and narrative variants; further references are available in the original article.",
      ),
      questions: [
        L(
          "Klaim mana yang didukung oleh sumber rujukan pada artikel asal?",
          "Which claims are supported by references in the original article?",
        ),
      ],
      kind: "editorial-reading-guide",
    },
    source_identity: qid,
    source_pageid: p.pageid,
    source_categories: cats,
    classification_basis:
      classify(cats)[0]?.basis || "Legendary-creature category discovery",
    culture_basis: signals[0]?.basis || null,
    import_method: "wikipedia-category-library",
    translation_status: id ? "source-id-and-en" : "english-source-only",
    editorial_status: "reference-introduction",
  };
}
const titles = Object.keys(discovery);
for (const [index, batch] of chunk(titles, 20).entries()) {
  try {
    const sourcePages = await pages(batch);
    const candidates = sourcePages.filter((p) => {
      const reason = accepted(p);
      if (reason) {
        reject(p, reason);
        return false;
      }
      return true;
    });
    const idTitles = [
      ...new Set(
        candidates.flatMap((p) =>
          (p.langlinks || [])
            .filter((l) => l.lang === "id")
            .map((l) => l.title),
        ),
      ),
    ];
    const idPages = idTitles.length
      ? await pages(idTitles, "id").catch(() => [])
      : [];
    for (const p of candidates) {
      const idTitle = p.langlinks?.find((l) => l.lang === "id")?.title;
      const record = make(
        p,
        idPages.find((i) => i.title === idTitle),
      );
      if (record) imported.set(record.source_identity, record);
    }
  } catch (error) {
    failed.push({ titles: batch, error: error.message });
  }
  if (index % 5 === 0) {
    console.log(
      `Batch ${index + 1}/${Math.ceil(titles.length / 20)} · ${imported.size} accepted · ${exclusions.length} excluded`,
    );
    await save("data/import/checkpoint.json", [...imported.values()]);
  }
}
const records = [
  ...original,
  ...[...imported.values()].sort((a, b) =>
    a.canonical_name.localeCompare(b.canonical_name),
  ),
];
for (const c of cultures)
  c.creature_count = records.filter(
    (r) => r.culture === c.id && r.status === "published",
  ).length;
for (const c of CLASSIFICATIONS)
  if (!categories.some((x) => x.id === c.id))
    categories.push({
      id: c.id,
      name: L(c.id_, c.en),
      description: L(c.desc_id, c.desc_en),
    });
await save("data/categories.json", categories);
await save("data/cultures.json", cultures);
await save("data/regions.json", regions);
await save("data/creatures.json", records);
await save("data/import/report.json", {
  generated_at: today,
  discovered: titles.length,
  preserved: original.length,
  imported: imported.size,
  total: records.length,
  bilingual_source_entries: [...imported.values()].filter(
    (c) => c.translation_status === "source-id-and-en",
  ).length,
  exclusions,
  failed_batches: failed,
  method:
    "Wikipedia category discovery; reference introductions, not individually scholarly-reviewed records",
  license:
    "Wikipedia introductory extracts: CC BY-SA 4.0, original URL and revision retained",
});
console.log("COMPLETE", {
  total: records.length,
  imported: imported.size,
  excluded: exclusions.length,
  failed: failed.length,
});
