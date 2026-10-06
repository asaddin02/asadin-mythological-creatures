/** Snapshot a named revision without installing artwork or changing source research. */
import assert from 'node:assert/strict';
import { mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { computeFillStatus } from './gemini/fill-lib.mjs';
import { root, read, save, hash, existing, assetPath, assertBaseline } from './artwork-presentation-lib.mjs';

export async function prepareNamedRevision(options) {
  const { revision, directory, ledgerPath } = options;
  assert(/^[a-z0-9-]+$/.test(options.worker), 'A worker name is required');
  if (options.limit) assert(/^[1-9]\d*$/.test(options.limit), 'Limit must be a positive integer');
  const policy = read('data/artwork-nama-besar.json');
  assert.equal(options.policy, policy.policy.name, 'Unknown approved artwork policy');
  const manifest = read('assets/art/verified-manifest.json');
  if (existing(ledgerPath)) {
    const ledger = read(ledgerPath);
    assertBaseline(ledger, manifest);
    if (options.slugs) assert.deepEqual(options.slugs.split(',').map(s => s.trim()).sort(),
      ledger.items.map(i => i.slug).sort(), 'Cannot change an existing revision selection');
    console.log(JSON.stringify({ ledgerPath, target: ledger.target, complete: ledger.complete, retained_existing_ledger: true }));
    return;
  }
  const creatures = read('data/creatures.json');
  const bySlug = new Map(creatures.map(c => [c.slug, c]));
  const { status, entries } = await computeFillStatus(creatures);
  let selected = policy.siap.filter(i => i.status === 'lengkap-bergambar');
  if (options.slugs) {
    const wanted = new Set(options.slugs.split(',').map(s => s.trim()).filter(Boolean));
    assert(wanted.size, 'Select at least one creature');
    for (const slug of wanted) assert(selected.some(i => i.slug === slug), `Not a ready illustrated big name: ${slug}`);
    selected = selected.filter(i => wanted.has(i.slug));
  }
  if (options.limit) selected = selected.slice(0, Number(options.limit));
  assert(selected.length, 'No ready illustrated creatures selected');
  const selectedSlugs = new Set(selected.map(i => i.slug));
  for (const i of selected) {
    assert.equal(status[i.slug]?.status, 'lengkap-bergambar', `Research must still be complete: ${i.slug}`);
    assert(entries.has(i.slug), `Missing accepted research: ${i.slug}`);
    const review = read(`data/gemini/reviews/${status[i.slug].batch}.review.json`).entries.find(e => e.slug === i.slug);
    assert.equal(review?.verdict, 'lulus-otomatis');
  }
  mkdirSync(resolve(root, `${directory}/originals`), { recursive: true });
  mkdirSync(resolve(root, `${directory}/rejected`), { recursive: true });
  mkdirSync(resolve(root, `${directory}/backups`), { recursive: true });
  const baseline = Object.entries(manifest.artworks).map(([slug, artwork]) => {
    const { images, ...facts } = bySlug.get(slug);
    const nativeAvailable = artwork.original_file && existing(artwork.original_file);
    return { slug, url: artwork.url, sha256: hash(`.${artwork.url}`),
      original_file: artwork.original_file || null, native_sha256: nativeAvailable ? hash(artwork.original_file) : null,
      original_available_at_start: Boolean(nativeAvailable),
      historical_native_sha256: artwork.presentation_revision?.native_sha256 || artwork.root_visual_review?.native_sha256 || null,
      creature_sha256: createHash('sha256').update(JSON.stringify(facts)).digest('hex') };
  });
  const snapshots = new Map(baseline.map(i => [i.slug, i]));
  const items = selected.map((row, index) => {
    const old = manifest.artworks[row.slug], snapshot = snapshots.get(row.slug);
    const webpBackup = `${directory}/backups/${row.slug}.webp`;
    if (existing(webpBackup)) assert.equal(hash(webpBackup), snapshot.sha256, 'Never overwrite an earlier WebP backup');
    else copyFileSync(resolve(root, `.${old.url}`), resolve(root, webpBackup));
    const nativeBackup = snapshot.native_sha256 ? `${directory}/backups/${row.slug}.png` : null;
    if (nativeBackup) {
      if (existing(nativeBackup)) assert.equal(hash(nativeBackup), snapshot.native_sha256, 'Never overwrite an earlier PNG backup');
      else copyFileSync(assetPath(old.original_file), resolve(root, nativeBackup));
    }
    return { index: index + 1, slug: row.slug, canonical_name: entries.get(row.slug).identity.canonical_name,
      worker: options.worker, status: 'pending', fill_status: status[row.slug].status,
      rationale: policy.policy.intent, old_artwork: old, old_webp_sha256: snapshot.sha256,
      old_native_sha256: snapshot.native_sha256, historical_native_sha256: snapshot.historical_native_sha256,
      old_webp_backup: webpBackup, old_native_backup: nativeBackup,
      review_path: `data/gemini/reviews/${status[row.slug].batch}.review.json`,
      research: entries.get(row.slug), receipt_path: `${directory}/${row.slug}.json` };
  });
  const ledger = { revision, title: 'Source-supported monumental big-name artwork revisions',
    tool: 'OpenAI built-in image_gen', status: 'in-progress', started_at: new Date().toISOString(),
    user_policy: policy.policy, require_root_visual_review: true, screening_complete: true,
    target: items.length, complete: 0, catalogue_slugs: creatures.map(c => c.slug).sort(), baseline,
    screening: baseline.map(i => ({ slug: i.slug, worker: options.worker,
      decision: selectedSlugs.has(i.slug) ? 'revise' : 'keep',
      rationale: selectedSlugs.has(i.slug) ? policy.policy.intent : 'Outside the selected big-name revision' })), items };
  save(ledgerPath, ledger);
  console.log(JSON.stringify({ ledgerPath, directory, target: items.length,
    preserved_webps: items.length, preserved_native: items.filter(i => i.old_native_backup).length,
    unavailable_historical_native: items.filter(i => !i.old_native_sha256).map(i => i.slug) }));
}
