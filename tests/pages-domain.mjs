import assert from 'node:assert/strict';
import { test } from 'node:test';
import { reserveName } from '../scripts/pages-domain.mjs';

const old = { id: 'original', name: 'mythics', subdomain: 'mythics-99o.pages.dev' };
function mockApi({ assigned = 'mythics.pages.dev', creationFails = false, deployed = false } = {}) {
  const calls = [];
  const api = async (method, path, body) => {
    calls.push({ method, path, body });
    if (method === 'PATCH') return { ...old, name: body.name };
    if (method === 'POST' && creationFails) throw new Error('Creation failed');
    if (method === 'POST' || method === 'GET') return { id: 'new', name: 'mythics', subdomain: assigned, ...(deployed ? { canonical_deployment: { id: 'deployment' } } : {}) };
    if (method === 'DELETE') return null;
    throw new Error(`Unexpected ${method} ${path}`);
  };
  return { api, calls };
}

test('An available clean domain keeps the original live project as a backup', async () => {
  const { api, calls } = mockApi();
  const result = await reserveName(api, 'mythics', [old], () => {});
  assert.equal(result.outcome, 'reserved');
  assert.equal(result.site_url, 'https://mythics.pages.dev');
  assert.match(result.backup, /^mythics-backup-/);
  assert.deepEqual(calls.map(c => c.method), ['PATCH', 'POST']);
});

test('An unavailable domain removes only the new empty project and restores the original', async () => {
  const { api, calls } = mockApi({ assigned: 'mythics-new.pages.dev' });
  const result = await reserveName(api, 'mythics', [old], () => {});
  assert.equal(result.outcome, 'unavailable');
  assert.equal(result.restored, old.subdomain);
  assert.deepEqual(calls.map(c => c.method), ['PATCH', 'POST', 'GET', 'DELETE', 'PATCH']);
  assert.equal(calls.at(-1).body.name, 'mythics');
  assert.match(calls.at(-1).path, /^\/projects\/mythics-backup-/);
});

test('Failed creation restores the original project name', async () => {
  const { api, calls } = mockApi({ creationFails: true });
  await assert.rejects(reserveName(api, 'mythics', [old], () => {}), /Creation failed/);
  assert.deepEqual(calls.map(c => c.method), ['PATCH', 'POST', 'PATCH']);
  assert.equal(calls.at(-1).body.name, 'mythics');
});

test('A clean domain already owned by the account causes no mutations', async () => {
  const { api, calls } = mockApi();
  const result = await reserveName(api, 'mythics', [{ ...old, subdomain: 'mythics.pages.dev' }]);
  assert.equal(result.outcome, 'already-owned');
  assert.deepEqual(calls, []);
});

test('A new project that unexpectedly has a deployment is never deleted', async () => {
  const { api, calls } = mockApi({ assigned: 'mythics-new.pages.dev', deployed: true });
  await assert.rejects(reserveName(api, 'mythics', [old], () => {}), /retaining both/);
  assert.equal(calls.some(c => c.method === 'DELETE'), false);
});
