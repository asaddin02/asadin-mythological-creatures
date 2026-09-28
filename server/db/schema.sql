-- Mythics relational schema (SQLite).
-- Claims carry their own evidence (claim_sources.evidence_quote), so provenance
-- lives at claim level rather than page level.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  description_en TEXT,
  description_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('PRIMARY','SCHOLARLY','INSTITUTIONAL','REFERENCE','COMMUNITY','MODERN_MEDIA')),
  source_type TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  publication_year TEXT,
  url TEXT,
  language TEXT,
  revision_id TEXT,
  license TEXT,
  license_url TEXT,
  retrieved_at TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS cultures (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  region_id TEXT REFERENCES regions(id),
  parent_id TEXT REFERENCES cultures(id),
  wikipedia_category TEXT,
  description_en TEXT,
  description_id TEXT,
  description_source_id INTEGER REFERENCES sources(id)
);
CREATE INDEX IF NOT EXISTS idx_cultures_region ON cultures(region_id);
CREATE INDEX IF NOT EXISTS idx_cultures_parent ON cultures(parent_id);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  description_en TEXT,
  description_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS traits (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('habitat','disposition')),
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS abilities (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS creatures (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  wikidata_qid TEXT UNIQUE,
  canonical_name TEXT NOT NULL,
  primary_category_id TEXT REFERENCES categories(id),
  primary_culture_id TEXT REFERENCES cultures(id),
  primary_region_id TEXT REFERENCES regions(id),
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN
    ('DISCOVERED','RESEARCHING','DRAFT','REVIEW','APPROVED','PUBLISHED','NEEDS_REVISION','DISPUTED','ARCHIVED')),
  editorial_state TEXT NOT NULL DEFAULT 'unreviewed' CHECK (editorial_state IN ('unreviewed','auto_qc_passed','editor_reviewed')),
  content_tier TEXT NOT NULL DEFAULT 'none' CHECK (content_tier IN ('none','core','rich','archive')),
  completeness INTEGER NOT NULL DEFAULT 0,
  confidence TEXT NOT NULL DEFAULT 'LOW' CHECK (confidence IN ('LOW','MEDIUM','HIGH')),
  popularity INTEGER NOT NULL DEFAULT 0,
  has_image INTEGER NOT NULL DEFAULT 0,
  qc_report TEXT,
  locked_fields TEXT NOT NULL DEFAULT '[]',
  enwiki_title TEXT,
  idwiki_title TEXT,
  different_from TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  last_ingested_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_creatures_status ON creatures(status);
CREATE INDEX IF NOT EXISTS idx_creatures_category ON creatures(status, primary_category_id);
CREATE INDEX IF NOT EXISTS idx_creatures_culture ON creatures(status, primary_culture_id);
CREATE INDEX IF NOT EXISTS idx_creatures_region ON creatures(status, primary_region_id);
CREATE INDEX IF NOT EXISTS idx_creatures_popularity ON creatures(status, popularity DESC);
CREATE INDEX IF NOT EXISTS idx_creatures_completeness ON creatures(status, completeness DESC);
CREATE INDEX IF NOT EXISTS idx_creatures_created ON creatures(status, created_at DESC);

-- Names: canonical, labels, aliases, native forms, transliterations.
CREATE TABLE IF NOT EXISTS creature_names (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  normalized TEXT NOT NULL,
  language TEXT,
  name_type TEXT NOT NULL CHECK (name_type IN ('canonical','label','alias','native','transliteration')),
  source_id INTEGER REFERENCES sources(id),
  UNIQUE (creature_id, name, language, name_type)
);
CREATE INDEX IF NOT EXISTS idx_names_normalized ON creature_names(normalized);
CREATE INDEX IF NOT EXISTS idx_names_creature ON creature_names(creature_id);

-- Short per-language strings (display name, one-line summary) with their origin.
CREATE TABLE IF NOT EXISTS creature_translations (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('en','id')),
  field TEXT NOT NULL CHECK (field IN ('name','summary')),
  value TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('source','editorial','derived')),
  source_id INTEGER REFERENCES sources(id),
  PRIMARY KEY (creature_id, lang, field)
);

-- Long-form excerpts from sources, per section, per language.
CREATE TABLE IF NOT EXISTS creature_texts (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('en','id')),
  kind TEXT NOT NULL CHECK (kind IN ('overview','etymology','appearance','behavior','lore','modern','analysis','other')),
  layer TEXT NOT NULL CHECK (layer IN ('DOCUMENTED_TRADITION','ATTRIBUTED','MODERN_INTERPRETATION','EDITORIAL')),
  heading TEXT,
  body TEXT NOT NULL,
  truncated INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  source_id INTEGER NOT NULL REFERENCES sources(id)
);
CREATE INDEX IF NOT EXISTS idx_texts_creature ON creature_texts(creature_id, lang, position);

CREATE TABLE IF NOT EXISTS creature_cultures (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  culture_id TEXT NOT NULL REFERENCES cultures(id),
  is_primary INTEGER NOT NULL DEFAULT 0,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  PRIMARY KEY (creature_id, culture_id)
);
CREATE INDEX IF NOT EXISTS idx_cc_culture ON creature_cultures(culture_id);

CREATE TABLE IF NOT EXISTS creature_categories (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id),
  is_primary INTEGER NOT NULL DEFAULT 0,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  PRIMARY KEY (creature_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_ccat_category ON creature_categories(category_id);

CREATE TABLE IF NOT EXISTS creature_traits (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  trait_id TEXT NOT NULL REFERENCES traits(id),
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  PRIMARY KEY (creature_id, trait_id)
);
CREATE INDEX IF NOT EXISTS idx_ct_trait ON creature_traits(trait_id);

-- Claims: one statement, its layer (tradition vs modern vs editorial), evidence level, confidence.
CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  claim_type TEXT NOT NULL,
  layer TEXT NOT NULL CHECK (layer IN ('DOCUMENTED_TRADITION','ATTRIBUTED','MODERN_INTERPRETATION','EDITORIAL')),
  statement_en TEXT NOT NULL,
  statement_id TEXT,
  evidence_level TEXT NOT NULL CHECK (evidence_level IN
    ('STRONGLY_DOCUMENTED','DOCUMENTED','ATTRIBUTED','OCCASIONALLY_REPORTED','MODERN_INTERPRETATION','UNCERTAIN','NOT_DOCUMENTED')),
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH')),
  method TEXT NOT NULL CHECK (method IN ('structured_data','category','text_extraction','editorial')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_claims_creature ON claims(creature_id, claim_type);

CREATE TABLE IF NOT EXISTS claim_sources (
  claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  evidence_quote TEXT,
  evidence_locator TEXT,
  PRIMARY KEY (claim_id, source_id)
);

CREATE TABLE IF NOT EXISTS creature_abilities (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  ability_id TEXT NOT NULL REFERENCES abilities(id),
  layer TEXT NOT NULL CHECK (layer IN ('ATTRIBUTED','DOCUMENTED_TRADITION','MODERN_INTERPRETATION','EDITORIAL')),
  evidence_level TEXT NOT NULL,
  claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  PRIMARY KEY (creature_id, ability_id, layer)
);
CREATE INDEX IF NOT EXISTS idx_cab_ability ON creature_abilities(ability_id, layer);

CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  commons_file TEXT NOT NULL,
  remote_url TEXT NOT NULL,
  url_330 TEXT,
  url_500 TEXT,
  url_960 TEXT,
  storage TEXT NOT NULL DEFAULT 'remote' CHECK (storage IN ('remote','cached','cdn')),
  cached_path TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL DEFAULT 'Wikimedia Commons',
  author TEXT,
  credit TEXT,
  license TEXT,
  license_url TEXT,
  usage_terms TEXT,
  rights_status TEXT NOT NULL CHECK (rights_status IN ('PUBLIC_DOMAIN','OPEN_LICENSE','UNKNOWN')),
  attribution_required INTEGER NOT NULL DEFAULT 0,
  attribution TEXT,
  restrictions TEXT,
  image_type TEXT NOT NULL DEFAULT 'UNKNOWN',
  image_type_basis TEXT,
  date_text TEXT,
  width INTEGER,
  height INTEGER,
  mime TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  selection_basis TEXT NOT NULL,
  relevance_note TEXT,
  caption_en TEXT,
  url_verified_at TEXT,
  url_status INTEGER,
  confidence TEXT NOT NULL DEFAULT 'MEDIUM',
  UNIQUE (creature_id, commons_file)
);
CREATE INDEX IF NOT EXISTS idx_images_creature ON images(creature_id, is_primary DESC);

CREATE TABLE IF NOT EXISTS image_sources (
  image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  PRIMARY KEY (image_id, source_id)
);

CREATE TABLE IF NOT EXISTS historical_events (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('earliest_attestation','attestation_statement','documented_development','modern_representation')),
  date_text TEXT,
  sort_year INTEGER,
  description_en TEXT NOT NULL,
  description_id TEXT,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_events_creature ON historical_events(creature_id, sort_year);

CREATE TABLE IF NOT EXISTS creature_variants (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  variant_creature_id INTEGER REFERENCES creatures(id) ON DELETE SET NULL,
  variant_qid TEXT,
  name TEXT NOT NULL,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('regional','historical','linguistic','visual','narrative','type_of','possible')),
  description_en TEXT,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS creature_relations (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN
    ('PARENT','CHILD','SIBLING','SPOUSE','RELATIVE','ALLY','ENEMY','COUNTERPART','VARIANT','POSSIBLE_VARIANT','TYPE_OF','ASSOCIATED')),
  target_creature_id INTEGER REFERENCES creatures(id) ON DELETE SET NULL,
  target_qid TEXT,
  target_label_en TEXT,
  target_label_id TEXT,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  UNIQUE (creature_id, relation_type, target_qid)
);
CREATE INDEX IF NOT EXISTS idx_rel_creature ON creature_relations(creature_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON creature_relations(target_creature_id);

CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY,
  wikidata_qid TEXT UNIQUE,
  kind TEXT NOT NULL DEFAULT 'traditional_text' CHECK (kind IN ('traditional_text','modern_media')),
  title_en TEXT NOT NULL,
  title_id TEXT,
  description_en TEXT,
  description_id TEXT,
  url TEXT
);

CREATE TABLE IF NOT EXISTS creature_stories (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  role TEXT,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  PRIMARY KEY (creature_id, story_id)
);

CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY,
  wikidata_qid TEXT UNIQUE,
  name_en TEXT NOT NULL,
  name_id TEXT,
  place_type TEXT,
  description_en TEXT
);

CREATE TABLE IF NOT EXISTS creature_places (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  claim_id INTEGER REFERENCES claims(id) ON DELETE SET NULL,
  PRIMARY KEY (creature_id, place_id, relation)
);

CREATE TABLE IF NOT EXISTS power_profiles (
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN ('physical','supernatural','durability','mobility','intelligence','influence')),
  score INTEGER,
  basis TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (creature_id, dimension)
);

CREATE TABLE IF NOT EXISTS duplicate_candidates (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  other_creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'POTENTIAL_DUPLICATE' CHECK (status IN ('POTENTIAL_DUPLICATE','CONFIRMED_DISTINCT','MERGED')),
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  UNIQUE (creature_id, other_creature_id)
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  entity_ref TEXT NOT NULL,
  creature_id INTEGER REFERENCES creatures(id) ON DELETE SET NULL,
  stage TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed','retrying')),
  source TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  log TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON ingestion_jobs(status, created_at);

CREATE TABLE IF NOT EXISTS editorial_reviews (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN
    ('approve','reject','needs_revision','dispute','auto_qc_pass','auto_qc_fail','edit','note','duplicate_resolution')),
  reviewer TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reviews_creature ON editorial_reviews(creature_id, created_at);

CREATE TABLE IF NOT EXISTS revisions (
  id INTEGER PRIMARY KEY,
  creature_id INTEGER NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  change_note TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (creature_id, version)
);

-- Full-text search (diacritic-insensitive) and trigram index for substring/fuzzy name search.
CREATE VIRTUAL TABLE IF NOT EXISTS creature_search USING fts5(
  names, body, creature_id UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);
CREATE VIRTUAL TABLE IF NOT EXISTS creature_name_trigram USING fts5(
  names, creature_id UNINDEXED,
  tokenize = 'trigram remove_diacritics 1'
);
