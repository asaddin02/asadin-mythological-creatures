/**
 * Tier targets for a research entry, shared by the verifier and the fill status.
 * core: 6 claims, 2 sources. rich: 15 claims, 3 sources, 2 publishers besides Wikipedia.
 * Claims count by distinct quote (owner's decision, 7 October 2026): one quote split into several claims counts once.
 */
export const TIER_MIN = { rich: { claims: 15, sources: 3, nonWiki: 2 }, core: { claims: 6, sources: 2, nonWiki: 0 } };

/** Publisher family of a URL: every Wikipedia language edition counts as one. */
export function familyOf(url) {
  try {
    const parts = new URL(url).hostname.replace(/^www\./, '').split('.');
    if (parts.slice(-2).join('.') === 'wikipedia.org') return 'wikipedia.org';
    const n = /^(co|ac|go|or|com|net|org|edu|gov|sch|web|my)$/.test(parts.at(-2)) && parts.at(-1).length === 2 ? 3 : 2;
    return parts.slice(-n).join('.');
  } catch {
    return null;
  }
}

/** @returns {string[]} what the entry lacks for its tier, e.g. "4 klaim (target 6)"; empty when it meets the target. */
export function tierShortfall(entry) {
  const min = TIER_MIN[entry?.tier];
  if (!min) return [];
  const claims = Array.isArray(entry.claims) ? entry.claims : [];
  const sources = Array.isArray(entry.sources) ? entry.sources : [];
  const nonWiki = new Set(sources.map(s => familyOf(s?.url)).filter(f => f && f !== 'wikipedia.org')).size;
  const quotes = new Set(claims.map(c => `${c?.source_id}\u0000${String(c?.quote ?? '').replace(/\s+/g, ' ').trim()}`)).size;
  const short = [];
  if (quotes < min.claims) short.push(quotes < claims.length ? `${quotes} kutipan berbeda dari ${claims.length} klaim (target ${min.claims})` : `${claims.length} klaim (target ${min.claims})`);
  if (sources.length < min.sources) short.push(`${sources.length} sumber (target ${min.sources})`);
  if (nonWiki < min.nonWiki) short.push(`${nonWiki} penerbit selain Wikipedia (target ${min.nonWiki}; Wikipedia semua bahasa dihitung satu)`);
  return short;
}
