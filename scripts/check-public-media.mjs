#!/usr/bin/env node
/** Verify that each active illustration served through the public R2 route matches its reviewed asset. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const base = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || '').replace(/\/$/, '');
assert(/^https:\/\/[^/]+$/.test(base), 'Set PUBLIC_SITE_URL to the deployed HTTPS origin');
const { artworks } = JSON.parse(await readFile(new URL('assets/art/verified-manifest.json', root), 'utf8'));
const entries = Object.entries(artworks);
const failures = [];
let next = 0, verified = 0;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function worker() {
  while (next < entries.length) {
    const [slug, art] = entries[next++];
    const expected = hash(await readFile(new URL(`.${art.url}`, root)));
    const url = `${base}/media/art/${art.url.split('/').pop()}`;
    let error;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        assert.equal(response.status, 200, `HTTP ${response.status}`);
        assert.match(response.headers.get('content-type') || '', /^image\//);
        assert.equal(hash(Buffer.from(await response.arrayBuffer())), expected, 'Served image differs from the accepted artwork');
        verified++;
        error = null;
        break;
      } catch (failure) {
        error = failure.message;
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    if (error) failures.push({ slug, url, error });
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(JSON.stringify({ verified, expected: entries.length, failures }));
assert.deepEqual(failures, [], 'Every active R2 illustration must be publicly available and match its reviewed bytes');
