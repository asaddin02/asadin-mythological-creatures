/**
 * Discovery: builds the candidate universe of beings from
 *  (a) Wikipedia's "Legendary creatures by continent" category tree (culture + region evidence), and
 *  (b) Wikidata instances of "legendary creature" (Q2239243).
 *
 * The category tree is walked conservatively: we only descend into categories whose
 * names describe kinds of beings, and we skip deities, places, angels and scripture
 * figures (living religious doctrine — handled editorially, not by bulk ingestion).
 */

import { categoryMembers } from './wikipedia.mjs';

export const CATEGORY_ROOTS = [
  'Category:Legendary creatures by continent',
  'Category:Yōkai',
  'Category:Islamic legendary creatures',
  'Category:Christian legendary creatures',
  'Category:Jewish legendary creatures',
  'Category:Buddhist legendary creatures',
  'Category:Hindu legendary creatures'
];

const BEING_WORDS =
  /(legendary creatures|creatures|beings|ghosts|demons|dragons|yōkai|yokai|spirits|fairies|giants|monsters|merfolk|elementals|jinn|serpents|birds|shapeshifters|vampires|werewolves|undead|trolls|dwarves|elves|nymphs|swan maidens|firedrakes|cryptids|goblins|ogres|hybrids|revenants|witches|bogeymen|mermaids|sea monsters|water spirits|by continent|by country|by culture)/i;

const SKIP =
  /(deit|gods|goddess|angel|archangel|cherubim|seraphim|quranic|biblical|satan|lilith|goliath|baphomet|moroni|exorcism|apocrypha|locations|places|houses|buildings|castles|cemeteries|ships|popular culture|fiction|films?\b|television|video games?|novels?|comics|works about|lists? of|stubs|in art\b|people|writers|scholars|researchers|organizations|websites|hoaxes|albums|songs|characters in|media|games|books|anime|manga|franchise|sightings|incidents|hunters|festivals|sports|mascots|heraldry|coats of arms|logos|sculptures|paintings|images)/i;

export function shouldDescend(category) {
  const name = category.replace(/^Category:/, '');
  return BEING_WORDS.test(name) && !SKIP.test(name);
}

/**
 * Walk the category tree.
 * @returns {Promise<Map<string, string[][]>>} page title -> list of category paths (root → leaf)
 */
export async function crawlCategoryTree({ maxDepth = 5, onProgress } = {}) {
  const seen = new Set();
  const pages = new Map();
  let visited = 0;

  async function walk(category, path, depth) {
    if (seen.has(category) || depth > maxDepth) return;
    seen.add(category);
    const { pages: members, subcats } = await categoryMembers(category);
    visited++;
    if (onProgress && visited % 50 === 0) onProgress(visited, pages.size);
    const fullPath = [...path, category.replace(/^Category:/, '')];
    for (const title of members) {
      if (/^(List|Lists|Outline|Index) of /i.test(title)) continue;
      if (!pages.has(title)) pages.set(title, []);
      pages.get(title).push(fullPath);
    }
    for (const sub of subcats) {
      if (shouldDescend(sub)) await walk(sub, fullPath, depth + 1);
    }
  }

  for (const root of CATEGORY_ROOTS) await walk(root, [], 0);
  return pages;
}
