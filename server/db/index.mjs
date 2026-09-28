/**
 * SQLite connection (node:sqlite, no native dependency), schema bootstrap and
 * taxonomy seeding. The database file is rebuilt from data/seed/*.json when missing.
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGIONS, CLASSIFICATIONS, ABILITIES, HABITATS, cultureRecords } from '../ingest/taxonomy.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..', '..');
export const DEFAULT_DB_PATH = process.env.MYTHICS_DB || join(ROOT, 'data', 'mythics.db');

let instance = null;

export const now = () => new Date().toISOString();

export function openDb(path = DEFAULT_DB_PATH) {
  if (instance && instance.path === path) return instance.db;
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  db.exec(readFileSync(join(HERE, 'schema.sql'), 'utf8'));
  seedTaxonomy(db);
  instance = { db, path };
  return db;
}

export function getDb() {
  return instance?.db || openDb();
}

export function closeDb() {
  if (instance) {
    instance.db.close();
    instance = null;
  }
}

export function dbFileExists(path = DEFAULT_DB_PATH) {
  return path === ':memory:' || existsSync(path);
}

/** Run fn inside a transaction (nested calls reuse the outer one). */
let depth = 0;
export function tx(fn) {
  const db = getDb();
  if (depth > 0) return fn(db);
  depth++;
  db.exec('BEGIN');
  try {
    const result = fn(db);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  } finally {
    depth--;
  }
}

function seedTaxonomy(db) {
  const upRegion = db.prepare(`INSERT INTO regions (id, name_en, name_id, description_en, description_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name_en=excluded.name_en, name_id=excluded.name_id,
      description_en=excluded.description_en, description_id=excluded.description_id, sort_order=excluded.sort_order`);
  const upCategory = db.prepare(`INSERT INTO categories (id, name_en, name_id, description_en, description_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name_en=excluded.name_en, name_id=excluded.name_id,
      description_en=excluded.description_en, description_id=excluded.description_id, sort_order=excluded.sort_order`);
  const upAbility = db.prepare(`INSERT INTO abilities (id, name_en, name_id, sort_order) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name_en=excluded.name_en, name_id=excluded.name_id, sort_order=excluded.sort_order`);
  const upTrait = db.prepare(`INSERT INTO traits (id, kind, name_en, name_id) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET kind=excluded.kind, name_en=excluded.name_en, name_id=excluded.name_id`);
  const upCulture = db.prepare(`INSERT INTO cultures (id, name_en, name_id, kind, region_id, parent_id, wikipedia_category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name_en=excluded.name_en, name_id=excluded.name_id, kind=excluded.kind,
      region_id=excluded.region_id, parent_id=excluded.parent_id, wikipedia_category=excluded.wikipedia_category`);

  db.exec('BEGIN');
  try {
    for (const r of REGIONS) upRegion.run(r.id, r.en, r.id_, r.desc_en, r.desc_id, r.sort);
    CLASSIFICATIONS.forEach((c, i) => upCategory.run(c.id, c.en, c.id_, c.desc_en, c.desc_id, i));
    ABILITIES.forEach((a, i) => upAbility.run(a.id, a.en, a.id_, i));
    for (const h of HABITATS) upTrait.run(`habitat-${h.id}`, 'habitat', h.en, h.id_);
    upTrait.run('disposition-malevolent', 'disposition', 'Malevolent / dangerous', 'Jahat / berbahaya');
    upTrait.run('disposition-benevolent', 'disposition', 'Benevolent / protective', 'Baik / pelindung');
    upTrait.run('disposition-ambivalent', 'disposition', 'Ambivalent (both described)', 'Ambivalen (keduanya disebutkan)');
    const cultures = cultureRecords();
    // parents first so the self-reference is satisfied
    const ordered = [...cultures.filter(c => !c.parent_id), ...cultures.filter(c => c.parent_id)];
    const pending = new Set(ordered.map(c => c.id));
    for (let pass = 0; pass < 5 && pending.size; pass++) {
      for (const c of ordered) {
        if (!pending.has(c.id)) continue;
        if (c.parent_id && pending.has(c.parent_id)) continue;
        upCulture.run(c.id, c.name_en, c.name_id, c.kind, c.region_id, c.parent_id, `${c.category_key} legendary creatures`);
        pending.delete(c.id);
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
