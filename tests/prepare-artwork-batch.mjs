import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = await mkdtemp(join(tmpdir(), 'mythics-commons-batch-'));
const save = (path, value) => writeFile(join(root, path), JSON.stringify(value));
const read = async path => JSON.parse(await readFile(join(root, path), 'utf8'));
try {
  for (const directory of ['scripts/gemini', 'data', 'assets/art']) {
    await mkdir(join(root, directory), { recursive: true });
  }
  await copyFile(new URL('../scripts/prepare-artwork-batch.mjs', import.meta.url), join(root, 'scripts/prepare-artwork-batch.mjs'));
  await writeFile(join(root, 'scripts/gemini/fill-lib.mjs'), `
    import { readFile } from 'node:fs/promises';
    export async function computeFillStatus() {
      const fixture = JSON.parse(await readFile(new URL('../../data/fixture.json', import.meta.url)));
      return { status: fixture.status, entries: new Map(Object.entries(fixture.entries)), counts: {} };
    }
  `);
  const states = {
    plain: 'lengkap-informasi', commons: 'lengkap-bergambar',
    active: 'lengkap-bergambar', excluded: 'lengkap-bergambar', incomplete: 'belum-lengkap',
  };
  const entries = Object.fromEntries(Object.keys(states).map(slug => [slug, {
    identity: { canonical_name: slug }, claims: [{ id: `${slug}-c01`, statement: 'A winged body.' }],
    images: slug === 'commons' ? [{ commons_file: 'File:Reference.jpg', is_primary: true }] : [],
  }]));
  const fixture = { entries, status: Object.fromEntries(Object.entries(states).map(([slug, status]) => [slug, { status, batch: 'batch-001' }])) };
  await save('data/fixture.json', fixture);
  await save('data/creatures.json', Object.keys(states).map(slug => ({ slug })));
  await save('assets/art/verified-manifest.json', { artworks: { active: { url: '/active.webp' } } });
  await save('data/artwork-exclusions.json', { items: { excluded: { reason: 'excluded' } } });
  const policy = { name: 'nama-besar', fidelity: 'unchanged approved policy' };
  await save('data/artwork-nama-besar.json', { policy });
  const run = (...args) => spawnSync(process.execPath, ['scripts/prepare-artwork-batch.mjs', '--tool', 'OpenAI built-in image_gen', '--worker', 'codex', ...args], { cwd: root, encoding: 'utf8' });

  const original = run();
  assert.equal(original.status, 0, original.stderr);
  const normal = await read('data/artwork-batch-2.json');
  assert.deepEqual(normal.items.map(i => i.slug), ['plain']);
  assert(Array.isArray(normal.selection_criteria), 'Default ledger format stays unchanged');
  await rm(join(root, 'data/artwork-batch-2.json'));
  assert.notEqual(run('--slugs', 'commons').status, 0, 'Commons excluded by default');
  for (const slug of ['active', 'excluded', 'incomplete']) {
    assert.notEqual(run('--allow-commons', '--slugs', slug).status, 0, `${slug} must remain ineligible`);
  }
  const commons = run('--allow-commons', '--slugs', 'commons', '--policy', 'nama-besar');
  assert.equal(commons.status, 0, commons.stderr);
  const batch = await read('data/artwork-batch-2.json');
  assert.deepEqual(batch.items.map(i => i.slug), ['commons']);
  assert.equal(batch.selection_criteria.commons_only, true);
  assert.deepEqual(batch.items[0].research, entries.commons, 'Embedded Commons research and images are preserved');
  assert.deepEqual(batch.user_policy, policy, 'Approved policy is copied unchanged');
  const beforeCollision = await readFile(join(root, 'data/artwork-batch-2.json'), 'utf8');
  assert.notEqual(run('--allow-commons', '--slugs', 'commons').status, 0, 'Existing batch cannot be overwritten');
  assert.equal(await readFile(join(root, 'data/artwork-batch-2.json'), 'utf8'), beforeCollision);
  assert.equal(run('--allow-commons').status, 0);
  const mixed = await read('data/artwork-batch-3.json');
  assert.deepEqual(new Set(mixed.items.map(i => i.slug)), new Set(['plain', 'commons']));
  assert.equal(mixed.selection_criteria.commons_only, false);
  assert.deepEqual(await read('data/fixture.json'), fixture, 'Accepted research is never modified');
  console.log('Artwork batch checks passed: default selection, Commons opt-in, exclusions, active artwork, unchanged research/policy, mixed selection, and overwrite protection.');
} finally {
  await rm(root, { recursive: true, force: true });
}
