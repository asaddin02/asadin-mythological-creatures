/**
 * Polite, cached HTTP client for ingestion.
 *
 * - Only talks to an allowlist of Wikimedia hosts (no arbitrary fetch / SSRF).
 * - Serialises requests per host with a minimum interval (Wikimedia API etiquette).
 * - Retries 429/5xx with backoff, honouring Retry-After.
 * - Caches responses on disk so rebuilds do not hit external APIs again.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CACHE_DIR = process.env.MYTHICS_CACHE_DIR || join(ROOT, 'data', 'cache');

export const USER_AGENT =
  'MythicsBot/2.0 (+https://github.com/asaddin02/asadin-mythological-creatures) node-fetch';

export const ALLOWED_HOSTS = new Set([
  'www.wikidata.org',
  'query.wikidata.org',
  'en.wikipedia.org',
  'id.wikipedia.org',
  'commons.wikimedia.org'
]);

const MIN_INTERVAL_MS = {
  'query.wikidata.org': 1500,
  default: 120
};

const DEFAULT_TTL_MS = 30 * 24 * 3600 * 1000;
const lastRequestAt = new Map();
const hostQueues = new Map();

export function assertAllowedUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (url.protocol !== 'https:') throw new Error(`Blocked non-https URL: ${rawUrl}`);
  if (!ALLOWED_HOSTS.has(url.hostname)) throw new Error(`Blocked host: ${url.hostname}`);
  return url;
}

function cachePath(key) {
  const hash = createHash('sha1').update(key).digest('hex');
  return join(CACHE_DIR, hash.slice(0, 2), `${hash}.json`);
}

async function readCache(key, ttlMs) {
  const file = cachePath(key);
  try {
    const info = await stat(file);
    if (Date.now() - info.mtimeMs > ttlMs) return null;
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

async function writeCache(key, data) {
  const file = cachePath(key);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data));
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function enqueue(host, task) {
  const prev = hostQueues.get(host) || Promise.resolve();
  const next = prev.catch(() => {}).then(async () => {
    const interval = MIN_INTERVAL_MS[host] ?? MIN_INTERVAL_MS.default;
    const wait = (lastRequestAt.get(host) || 0) + interval - Date.now();
    if (wait > 0) await sleep(wait);
    try {
      return await task();
    } finally {
      lastRequestAt.set(host, Date.now());
    }
  });
  hostQueues.set(host, next);
  return next;
}

/**
 * Fetch JSON from an allowlisted host.
 * @param {string} url
 * @param {{ method?: string, body?: string, headers?: object, ttlMs?: number, cacheKey?: string, retries?: number, timeoutMs?: number, noCache?: boolean }} opts
 */
export async function fetchJson(url, opts = {}) {
  const parsed = assertAllowedUrl(url);
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const key = opts.cacheKey || `${opts.method || 'GET'} ${url} ${opts.body || ''}`;

  if (!opts.noCache) {
    const cached = await readCache(key, ttlMs);
    if (cached !== null) return cached.__notFound ? null : cached;
  }

  const retries = opts.retries ?? 4;
  let attempt = 0;
  for (;;) {
    const result = await enqueue(parsed.hostname, async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs || 60000);
      try {
        const res = await fetch(url, {
          method: opts.method || 'GET',
          body: opts.body,
          redirect: 'error',
          signal: controller.signal,
          headers: {
            'User-Agent': USER_AGENT,
            'Api-User-Agent': USER_AGENT,
            Accept: 'application/json',
            ...(opts.headers || {})
          }
        });
        if (res.status === 404) return { notFound: true };
        if (res.status === 429 || res.status >= 500) {
          const retryAfter = Number(res.headers.get('retry-after')) || 0;
          return { retry: true, retryAfter, status: res.status };
        }
        if (!res.ok) return { error: `HTTP ${res.status} for ${url}` };
        return { data: await res.json() };
      } catch (err) {
        return { retry: true, retryAfter: 0, status: err.name };
      } finally {
        clearTimeout(timer);
      }
    });

    if (result.data !== undefined) {
      if (result.data?.error?.code === 'maxlag' && attempt < retries + 4) {
        attempt++;
        await sleep(5000 * Math.min(attempt, 6));
        continue;
      }
      if (result.data?.error) {
        throw new Error(`API error ${result.data.error.code}: ${result.data.error.info} (${url})`);
      }
      if (!opts.noCache) await writeCache(key, result.data);
      return result.data;
    }
    if (result.notFound) {
      if (!opts.noCache) await writeCache(key, { __notFound: true });
      return null;
    }
    if (result.retry && attempt < retries) {
      attempt++;
      await sleep(Math.max(result.retryAfter * 1000, 1500 * 2 ** attempt));
      continue;
    }
    throw new Error(result.error || `Request failed after ${attempt} retries (${result.status}): ${url}`);
  }
}

export function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

const MEDIA_HOSTS = new Set(['upload.wikimedia.org', 'thumb.wikimedia.org']);

/**
 * HEAD-check a Wikimedia media URL (used by validation to prove images actually load).
 * @returns {Promise<number>} HTTP status (0 on network error)
 */
export async function checkMediaUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return 0;
  }
  if (url.protocol !== 'https:' || !MEDIA_HOSTS.has(url.hostname)) return 0;
  return enqueue(url.hostname, async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': USER_AGENT } });
        if (res.status === 429 || res.status >= 500) {
          await sleep(2000 * (attempt + 1));
          continue;
        }
        return res.status;
      } catch {
        await sleep(1000 * (attempt + 1));
      }
    }
    return 0;
  });
}
