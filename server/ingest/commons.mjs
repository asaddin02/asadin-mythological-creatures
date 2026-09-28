/**
 * Wikimedia Commons image metadata: real file existence, licence, author, date,
 * and a conservative image-type classification from Commons categories.
 * Nothing here is guessed: when a field is missing it stays null/UNKNOWN.
 */

import { fetchJson, chunk } from './http.mjs';

const API = 'https://commons.wikimedia.org/w/api.php';
export const DETAIL_WIDTH = 960;
export const THUMB_WIDTHS = [330, 500, 960];

const EXT_FIELDS = [
  'LicenseShortName', 'LicenseUrl', 'UsageTerms', 'Artist', 'Credit', 'AttributionRequired',
  'Copyrighted', 'DateTimeOriginal', 'ImageDescription', 'ObjectName', 'Categories', 'Restrictions', 'License'
].join('|');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

/** Strip HTML from Commons metadata and decode common entities. Output is plain text. */
export function plainText(html, max = 300) {
  if (!html) return null;
  const text = String(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : ' ';
      }
      return ENTITIES[e.toLowerCase()] ?? ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function rightsStatus(licenseShort, copyrighted) {
  const l = String(licenseShort || '').toLowerCase();
  if (/public domain|^pd\b|^pd-|cc0|no restrictions|no known copyright/.test(l) || String(copyrighted).toLowerCase() === 'false') {
    return 'PUBLIC_DOMAIN';
  }
  if (/^cc[ -]by|^cc-by|gfdl|free art|^attribution|^ogl|open government|^fal\b|\bgpl\b|\blgpl\b|^mit\b|^bsd\b/.test(l)) return 'OPEN_LICENSE';
  return 'UNKNOWN';
}

function yearOf(dateText) {
  const m = String(dateText || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  return m ? Number(m[1]) : null;
}

const TYPE_RULES = [
  ['AI_GENERATED_INTERPRETATION', /\bAI[- ]generated\b|artificial intelligence|stable diffusion|midjourney|dall-?e/i],
  ['MANUSCRIPT', /\bmanuscripts?\b|\bcodex\b|\bcodices\b|illuminated/i],
  ['SCULPTURE', /\bsculptures?\b|\bstatues?\b|\breliefs?\b|\bcarvings?\b|\bfigurines?\b|\bstatuettes?\b/i],
  ['PAINTING', /\bpaintings?\b|oil on canvas|\bfrescos?\b|\bmurals?\b/i],
  ['HISTORICAL_ILLUSTRATION', /\bwoodblock|ukiyo-e|\bwoodcuts?\b|\bengravings?\b|\betchings?\b|\blithograph|\billustrations?\b|\bdrawings?\b|\bprints\b/i],
  ['ARTIFACT', /\bmasks?\b|\bartifacts?\b|\bartefacts?\b|archaeolog|\bpottery\b|\bamulets?\b|\bcoins?\b|\bseals\b|digital representation of 3D work|PD-Art-3D/i],
  ['HISTORICAL_ARTWORK', /digital representation of 2D work|\bPD-Art\b|Google Art Project works/i],
  ['PHOTO', /\bphotographs?\b|\bphotos?\b|\btaken with\b/i]
];

/**
 * Classify an image type from Commons categories/title/description.
 * @returns {{ type: string, basis: string|null, year: number|null }}
 */
export function classifyImage({ categories, title, description, dateText }) {
  const year = yearOf(dateText);
  const cats = String(categories || '').split('|').filter(Boolean);
  for (const [type, rx] of TYPE_RULES) {
    const hit = cats.find(c => rx.test(c)) || (rx.test(title || '') ? title : null) || (rx.test(description || '') ? 'file description' : null);
    if (!hit) continue;
    let finalType = type;
    if (['PAINTING', 'HISTORICAL_ILLUSTRATION', 'HISTORICAL_ARTWORK'].includes(type) && year && year >= 1930) {
      finalType = 'MODERN_ARTWORK';
    }
    const where = cats.includes(hit) ? `Commons category "${hit}"` : hit === title ? 'file name' : 'file description';
    return { type: finalType, basis: `${where}${year ? `; dated ${year}` : ''}`, year };
  }
  return { type: 'UNKNOWN', basis: null, year };
}

const BROWSER_NATIVE = /^image\/(jpeg|png|gif|webp|svg\+xml)$/;

/** Remove tracking query parameters Commons appends to file URLs. */
export function cleanUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    for (const key of [...u.searchParams.keys()]) if (key.startsWith('utm_')) u.searchParams.delete(key);
    return u.toString();
  } catch {
    return url;
  }
}

function sizedUrl(thumbUrl, originalUrl, width, originalWidth, mime) {
  if (!thumbUrl) return BROWSER_NATIVE.test(mime || '') ? originalUrl : null;
  if (originalWidth && originalWidth <= width && BROWSER_NATIVE.test(mime || '')) return originalUrl;
  return thumbUrl.replace(new RegExp(`(^|[/-])${DETAIL_WIDTH}px-`), `$1${width}px-`);
}

/**
 * Fetch metadata for Commons files.
 * @param {string[]} fileNames names without the "File:" prefix
 * @returns {Promise<Map<string, object>>} keyed by normalized file name (spaces, no prefix)
 */
export async function fetchImageInfo(fileNames) {
  const out = new Map();
  const names = [...new Set(fileNames.filter(Boolean).map(n => n.replace(/^File:/i, '').replace(/_/g, ' ')))];
  for (const batch of chunk(names, 50)) {
    const qs = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      prop: 'imageinfo',
      titles: batch.map(n => `File:${n}`).join('|'),
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: String(DETAIL_WIDTH),
      iiextmetadatafilter: EXT_FIELDS,
      iiextmetadatalanguage: 'en'
    });
    const data = await fetchJson(`${API}?${qs}`);
    const normalized = new Map((data?.query?.normalized || []).map(n => [n.to, n.from]));
    for (const page of data?.query?.pages || []) {
      const info = page.imageinfo?.[0];
      if (page.missing || !info) continue;
      const meta = info.extmetadata || {};
      const v = key => meta[key]?.value ?? null;
      const name = page.title.replace(/^File:/, '');
      const licenseShort = plainText(v('LicenseShortName'), 80);
      const rights = rightsStatus(licenseShort, v('Copyrighted'));
      const author = plainText(v('Artist'), 200);
      const credit = plainText(v('Credit'), 200);
      const dateText = plainText(String(v('DateTimeOriginal') || '').replace(/\s*date QS:[\s\S]*$/i, ''), 80);
      const description = plainText(v('ImageDescription'), 400);
      const typeInfo = classifyImage({ categories: v('Categories'), title: name, description, dateText });
      const record = {
        commons_file: name,
        remote_url: cleanUrl(info.url),
        source_url: info.descriptionurl,
        width: info.width || null,
        height: info.height || null,
        mime: info.mime || null,
        urls: Object.fromEntries(THUMB_WIDTHS.map(w => [w, cleanUrl(sizedUrl(info.thumburl, info.url, w, info.width, info.mime))])),
        author,
        credit,
        license: licenseShort,
        license_url: v('LicenseUrl') ? String(v('LicenseUrl')).trim() : null,
        usage_terms: plainText(v('UsageTerms'), 120),
        attribution_required: String(v('AttributionRequired') || '').toLowerCase() === 'true',
        rights_status: rights,
        restrictions: plainText(v('Restrictions'), 120),
        date_text: dateText,
        description,
        image_type: typeInfo.type,
        image_type_basis: typeInfo.basis,
        year: typeInfo.year
      };
      out.set(name, record);
      const from = normalized.get(page.title);
      if (from) out.set(from.replace(/^File:/, ''), record);
    }
  }
  return out;
}

export function attributionText(img) {
  const who = img.author || img.credit || 'Unknown author';
  return `${who} — ${img.license || 'licence not stated'} — via Wikimedia Commons`;
}

/** Only raster/vector images that browsers render natively are usable in the UI. */
export function isDisplayableMime(mime) {
  return BROWSER_NATIVE.test(mime || '') || mime === 'image/tiff';
}
