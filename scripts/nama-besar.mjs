#!/usr/bin/env node
/**
 * The "nama besar" (big names) of Mythics and the dramatic illustration policy the owner asked for on
 * 6 October 2026: famous gods, demons and monsters get imposing artwork with visible power effects,
 * as long as every effect comes from a documented power, domain or attribute.
 *
 * A big name has at least --min Wikipedia language editions (sitelinks in data/gemini/worklist.json), or
 * is named by the owner (EXTRA). Only complete and valid entries may be illustrated:
 *   siap      lengkap-bergambar (artwork to replace) or lengkap-informasi (new artwork)
 *   menunggu  not complete yet; re-run this script after the enrichment reaches them
 *
 *   node scripts/nama-besar.mjs [--min 40]
 * Writes data/artwork-nama-besar.json.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { computeFillStatus } from './gemini/fill-lib.mjs';

const ROOT = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, ROOT), 'utf8'));
const { values: args } = parseArgs({ options: { min: { type: 'string', default: '40' } } });
const MIN = Number(args.min);

// Named by the owner on 6 October 2026, whatever their sitelinks. Egyptian Ra is ra-q1252904; the slug "ra" is the Scandinavian Rå.
const EXTRA = ['lucifer', 'ra-q1252904', 'anubis', 'medusa', 'stheno-and-euryale', 'sun-wukong', 'zhu-bajie', 'sha-wujing',
  'erlang-shen', 'nezha', 'bull-demon-king', 'count-dracula', 'cthulhu', 'satan', 'mammon', 'asmodeus', 'leviathan', 'beelzebub', 'belphegor'];

const policy = {
  instruction_date: '2026-10-06',
  name: 'nama-besar',
  intent: 'Big names (major gods, archangels, demon princes, primordial monsters, famous literary beings) must look imposing and powerful: an epic, awe-inspiring or terrifying presence that matches their standing in the tradition.',
  effects: 'Visible power effects are wanted and may be strong: blazing solar fire, lightning, storms, floods, underworld flame and smoke, divine radiance, petrifying gaze, cosmic scale. Every effect must come from a power, domain, attribute or deed documented in the research claims of that being (for example Ra and the sun, Medusa and her petrifying gaze). Do not add an effect that the research does not support.',
  fidelity: 'Anatomy, attributes, number of heads, limbs and eyes, and iconography follow the research claims exactly. Effects add atmosphere and power; they never replace or invent anatomy.',
  composition: 'Low camera angle, monumental scale with small environmental references, dramatic cinematic lighting, strong silhouette, rich detail; the being dominates the frame. Benevolent deities are majestic and radiant rather than monstrous; malevolent beings are menacing.',
  style: 'Square premium painterly illustration in the house style of the existing artwork, more dramatic and higher contrast. No text, labels, logo, border or watermark. No gore or nudity.',
  sources: 'Never copy designs from films, games, anime or comics (modern_depictions). Living religions (Hindu deities, angels, Egyptian revival worship) are depicted with respect.',
};

const { status } = await computeFillStatus(await read('data/creatures.json'));
const sitelinks = new Map((await read('data/gemini/worklist.json')).items.map(i => [i.slug, i.sitelinks || 0]));
const manifest = (await read('assets/art/verified-manifest.json')).artworks;
const names = new Map((await read('data/gemini/worklist.json')).items.map(i => [i.slug, i.canonical_name]));

const slugs = Object.keys(status).filter(s => status[s].status !== 'bukan-makhluk' && ((sitelinks.get(s) || 0) >= MIN || EXTRA.includes(s)));
const row = s => ({ slug: s, nama: names.get(s), sitelinks: sitelinks.get(s) || 0, status: status[s].status, batch: status[s].batch,
  ...(manifest[s] ? { gambar_sekarang: manifest[s].url } : {}), ...(EXTRA.includes(s) ? { disebut_pemilik: true } : {}) });
const order = (a, b) => b.sitelinks - a.sitelinks || a.slug.localeCompare(b.slug);
const siap = slugs.filter(s => ['lengkap-bergambar', 'lengkap-informasi'].includes(status[s].status)).map(row).sort(order);
const menunggu = slugs.filter(s => !['lengkap-bergambar', 'lengkap-informasi'].includes(status[s].status)).map(row).sort(order);

await writeFile(new URL('data/artwork-nama-besar.json', ROOT), JSON.stringify({ computed_at: new Date().toISOString(), min_sitelinks: MIN, policy, siap, menunggu }, null, 2) + '\n');
const replace = siap.filter(r => r.status === 'lengkap-bergambar').length;
console.log(`Nama besar (sitelinks >= ${MIN} atau disebut pemilik): ${slugs.length}. Siap digambar: ${siap.length} (${replace} ganti gambar lama, ${siap.length - replace} gambar baru). Menunggu riset lengkap: ${menunggu.length}.`);
console.log(`Siap, terbesar: ${siap.slice(0, 15).map(r => `${r.slug} (${r.sitelinks})`).join(', ')}`);
