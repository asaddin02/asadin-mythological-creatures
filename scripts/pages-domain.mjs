#!/usr/bin/env node
/** Inspect the account's Pages namespace, or reserve a clean name without deleting the live site. */
import { appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export async function reserveName(api, target, projects, report = console.log) {
  const desired = `${target}.pages.dev`;
  const owner = projects.find(project => project.subdomain === desired);
  if (owner) return { outcome: 'already-owned', project: owner.name, site_url: `https://${desired}` };
  const current = projects.find(project => project.name === target);
  const backup = current ? `${target}-backup-${Date.now()}` : null;
  if (current) {
    const renamed = await api('PATCH', `/projects/${target}`, { name: backup });
    if (renamed.id !== current.id || renamed.subdomain !== current.subdomain) {
      throw new Error('Unexpected rename response. The existing project has not been deleted; inspect it before continuing.');
    }
    report(`Preserved live project: ${backup} (${renamed.subdomain})`);
  }
  let created;
  try {
    created = await api('POST', '/projects', { name: target, production_branch: 'main' });
  } catch (error) {
    if (current) await api('PATCH', `/projects/${backup}`, { name: target });
    throw error;
  }
  report(`Cloudflare assigned: ${created.subdomain}`);
  if (created.subdomain !== desired) {
    // Only remove the empty project created by this call. The original live project stays intact.
    const fresh = await api('GET', `/projects/${target}`);
    if (fresh.id !== created.id || fresh.canonical_deployment || fresh.latest_deployment) {
      throw new Error('The new project changed unexpectedly; retaining both projects for inspection.');
    }
    await api('DELETE', `/projects/${target}`);
    if (current) await api('PATCH', `/projects/${backup}`, { name: target });
    return { outcome: 'unavailable', assigned: created.subdomain, restored: current?.subdomain || null };
  }
  return { outcome: 'reserved', project: target, site_url: `https://${desired}`, backup };
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const target = process.env.PAGES_TARGET || 'mythics';
  if (!token || !account) throw new Error('Cloudflare credentials are required.');
  if (!/^[a-z0-9][a-z0-9-]{0,50}$/.test(target)) throw new Error('Invalid Pages target.');
  const api = async (method, path, body) => {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000),
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(`${method} ${path}: ${JSON.stringify(json.errors)}`);
    return json.result;
  };
  const projects = await api('GET', '/projects?per_page=100');
  // Never print deployment configs, environment variables, tokens, or raw account responses.
  console.log(JSON.stringify({ projects: projects.map(p => ({ name: p.name, subdomain: p.subdomain, deployed: Boolean(p.canonical_deployment), created_on: p.created_on })) }, null, 2));
  if (!process.argv.includes('--reserve')) return;
  const result = await reserveName(api, target, projects);
  console.log(JSON.stringify(result));
  if (process.env.GITHUB_OUTPUT) {
    const output = Object.entries(result).filter(([, value]) => typeof value === 'string').map(([key, value]) => `${key}=${value}\n`).join('');
    await appendFile(process.env.GITHUB_OUTPUT, output);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
