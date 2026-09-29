#!/usr/bin/env node
/** Validate imported subjects against Wikidata identities and explicit editorial exclusions. */
import { readFile, writeFile, rename } from "node:fs/promises";
import { chunk, fetchJson } from "../server/ingest/http.mjs";
import { claimQids, label } from "../server/ingest/wikidata.mjs";
import {
  isExcludedByClasses,
  cultureFromCategory,
  cultureRank,
  REGIONS,
} from "../server/ingest/taxonomy.mjs";
async function getEntities(
  ids,
  { props = "labels|claims", languages = "en|id" } = {},
) {
  const params = new URLSearchParams({
    action: "wbgetentities",
    ids: ids.join("|"),
    props,
    format: "json",
    languages,
  });
  const data = await fetchJson("https://www.wikidata.org/w/api.php?" + params, {
    timeoutMs: 15000,
    retries: 2,
  });
  return new Map(
    Object.entries(data?.entities || {}).filter(
      ([, e]) => e.missing === undefined,
    ),
  );
}
const getLabels = (ids) =>
  getEntities(ids, { props: "labels", languages: "en|id" });
const ROOT = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, ROOT), "utf8"));
const save = async (p, v) => {
  await writeFile(new URL(p + ".tmp", ROOT), JSON.stringify(v, null, 2) + "\n");
  await rename(new URL(p + ".tmp", ROOT), new URL(p, ROOT));
};
const records = await read("data/creatures.json");
const imported = records.filter(
  (c) => c.import_method === "wikipedia-category-library",
);
console.log(
  `Checking structured identities for ${imported.length} introductions…`,
);
const entities = new Map();
for (const [index, batch] of chunk(
  imported.filter(c => !c.identity_checked_at || process.argv.includes('--refresh')).map((c) => c.source_identity),
  15,
).entries()) {
  const result = await getEntities(batch, {
    props: "claims|descriptions",
    languages: "en|id",
  });
  for (const pair of result) entities.set(...pair);
  if (index % 10 === 0) console.log("Identity batch", index + 1, entities.size);
}
const classIds = [
  ...new Set([...entities.values()].flatMap((e) => claimQids(e, "P31"))),
];
const classes = new Map();
for (const batch of chunk(classIds, 15)) {
  const result = await getLabels(batch);
  for (const pair of result) classes.set(...pair);
}
const rejectTitles =
  /^(?:Ghosts (?:in|of)|Demons of Sri Lanka|Vampire folklore by region|Anti-vampire burial|Vampire burial|Vampire hunter|Vampire killing kit|Nosferatu \(word\)|New England vampire panic|Dragon \(zodiac\)|Dragon dance|Nine-Dragon Wall|Long \(Chinese surname\)|Dragon; Tiger|Southern Dragon kung fu|Pig dragon|Radical 212|Serpents in the Bible|Valþjófsstaður door|Dragon's teeth|Coat of arms|Botan Dōrō|Banchō Sarayashiki|Chinese ghost marriage|Fengdu Ghost City|Female Ghost|Yotsuya Kaidan|One Hundred Ghost Stories|Bomoh|Yūrei-zu|Great British Ghosts|Murder of |Doris Bither case|Ammons haunting case|Stambovsky v\. Ackley|Baldoon Mystery|Tawara Tōda Monogatari|Hyakki Yagyō|Hyakkai Zukan|Kitsunetsuki|Kyōka Hyaku Monogatari|Miyoshi Mononoke Museum|Shodoshima Yokai Art Museum|Weasel$|Tosa Obake Zōshi|Emperor Keikō|Exorcism in Islam|Maddock Horror Comedy Universe|Naga people|Mythical creatures in Burmese folklore|Hob Holes|Álfheimr|Classifications of fairies|The Elves and the Shoemaker|The Elfin Knight|Elves in fiction|Álfablót|Elfshot|Icelandic Elf School|Wið færstice|Monsters in Dungeons|Fairy ring|Fairy Flag|Fairy riding|Fairy path|Fairy-lock|Fairy Investigation Society|Fairy cup legend|Latoon fairy bush|Fairyland|Fairy fort|Iron in folklore|Teind$|Tales of the Tooth Fairies|The Tooth Fairy's Tats|Cultural depictions|Icelandic Christmas folklore|Calydonian boar hunt|Troll doll|Bound monster|Járnviðr|Serpent symbolism|A Libyan Myth|Barnacle goose myth|Legendary horses in the Jura|Bestiary$|Cynocephaly|Clinical lycanthropy|Valais witch trials|Werewolf witch trials|Wolfssegen|Sirenomelia|Zār$|Troll cross|Number of the beast|Witch's mark|Witching hour|Santa Fe courthouse ghost|The Cowherd and the Weaver Girl|ʿĀd$|Light of Saratoga|St. Louis light|Screaming skull|Haunting of the Octoroon Mistress)/i;
const excluded = [];
const retained = [];
for (const c of records) {
  if (c.import_method !== "wikipedia-category-library") {
    retained.push(c);
    continue;
  }
  const entity = entities.get(c.source_identity);
  const labels = entity ? claimQids(entity, "P31")
    .map((q) => label(classes.get(q), "en"))
    .filter(Boolean) : (c.structured_classes || []);
  const description = entity?.descriptions?.en?.value || c.structured_description || "";
  let reason = null;
  if (!entity && !c.identity_checked_at) reason = "Structured identity could not be resolved";
  else if (rejectTitles.test(c.canonical_name))
    reason =
      "Editorial scope: associated topic, work, place, ritual, or historical event";
  else if (isExcludedByClasses(labels))
    reason = "Non-being Wikidata class: " + labels.join(", ");
  else if (
    /\b(?:film|novel|television|video game|museum|surname|martial art|court case|disease|ritual|festival|painting|sculpture|ethnic group|musical|episode|dance|type of burial|biological species|taxon)\b/i.test(
      description,
    ) &&
    !/mythological (?:figure|being|creature)|legendary creature/i.test(
      description,
    )
  )
    reason = "Non-being subject description: " + description;
  if (reason) {
    excluded.push({ title: c.canonical_name, qid: c.source_identity, reason });
    continue;
  }
  c.structured_classes = labels;
  c.structured_description = description;
  if (entity) c.identity_checked_at = new Date().toISOString();
  // Improve the Indonesian summary only when Wikidata supplies actual Indonesian text.
  if (
    c.translation_status === "english-source-only" &&
    entity?.descriptions?.id?.value
  ) {
    c.short_description.id = entity.descriptions.id.value;
    if (!c.sources.some((s) => s.source_name === "Wikidata"))
      c.sources.push({
        title: c.canonical_name + " · Wikidata descriptions",
        source_name: "Wikidata",
        author: "Wikidata contributors",
        url: "https://www.wikidata.org/wiki/" + c.source_identity,
        license: "CC0",
        license_url: "https://creativecommons.org/publicdomain/zero/1.0/",
        source_type: "Structured metadata",
        accessed_date: c.identity_checked_at,
      });
  }
  retained.push(c);
}
const cultures = await read("data/cultures.json");
const regions = await read("data/regions.json");
const discovery = await read("data/import/discovery.json");
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
for (const record of retained.filter(
  (c) => c.import_method === "wikipedia-category-library",
)) {
  const signals = [
    ...(record.source_categories || []),
    ...(discovery[record.canonical_name] || []).flat(),
  ]
    .map((category) => ({ ...cultureFromCategory(category), basis: category }))
    .filter((c) => c.culture)
    .sort(
      (a, b) =>
        b.weight - a.weight || cultureRank(a.culture) - cultureRank(b.culture),
    );
  const signal = signals[0];
  if (!signal) continue;
  const culture = signal.culture,
    id = legacyCultureMap[culture.slug] || "tradition-" + culture.slug;
  const region = REGIONS.find((r) => r.id === culture.region);
  record.culture = id;
  record.culture_basis = signal.basis;
  record.region = region?.en || "Transregional";
  if (!cultures.some((c) => c.id === id))
    cultures.push({
      id,
      name: { id: `Tradisi ${culture.id}`, en: `${culture.en} traditions` },
      description: {
        id: `Kelompok penelusuran berdasarkan kategori sumber yang mengaitkan entri dengan tradisi ${culture.id}.`,
        en: `Browsing group based on source categories associating entries with ${culture.en} traditions.`,
      },
      region: record.region,
      region_id: region?.id || null,
      country: "",
      creature_count: 0,
    });
  const mapped = regions.find((r) => r.id === region?.id);
  if (mapped && !mapped.cultures.includes(id)) mapped.cultures.push(id);
}
for (const c of cultures)
  c.creature_count = retained.filter((r) => r.culture === c.id).length;
await save("data/regions.json", regions);
await save("data/creatures.json", retained);
await save("data/cultures.json", cultures);
const report = await read("data/import/report.json");
report.identity_audit = {
  checked: imported.length,
  excluded: [...new Map([...(report.identity_audit?.excluded || []), ...excluded].map(item => [item.qid, item])).values()],
  retained: retained.length,
  at: new Date().toISOString(),
};
report.total = retained.length;
report.imported = retained.filter(
  (c) => c.import_method === "wikipedia-category-library",
).length;
report.bilingual_source_entries = retained.filter(
  (c) => c.translation_status === "source-id-and-en",
).length;
await save("data/import/report.json", report);
console.log("AUDITED", { total: retained.length, excluded: excluded.length });
