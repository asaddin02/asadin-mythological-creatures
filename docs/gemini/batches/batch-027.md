# Batch batch-027

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-027`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `artemis` — Artemis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q39503 — deskripsi Wikidata: "goddess of the hunt and the wild in ancient Greek religion and mythology"; kelas Wikidata: Olympian god, Greek deity, lunar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Artemis
  - id: https://id.wikipedia.org/wiki/Artemis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%AB%E3%83%86%E3%83%9F%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E8%80%B3%E5%BF%92%E5%BC%A5%E6%96%AF

### 2. `venus` — Venus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q47652 — deskripsi Wikidata: "Roman goddess of love, sexuality, procreation and pleasure"; kelas Wikidata: Roman deity, fertility deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Venus_(mythology)
  - id: https://id.wikipedia.org/wiki/Venus_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A7%E3%83%8C%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E7%BB%B4%E7%BA%B3%E6%96%AF

### 3. `hermes` — Hermes (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q41484 — deskripsi Wikidata: "Olympian god in Greek religion and mythology; the emissary and messenger of the gods; the god of trade, heraldry, merchants, commerce, roads, thieves, trickery, sports, travelers, and athletes; the son of Zeus and the Pleiad Maia"; kelas Wikidata: Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hermes
  - id: https://id.wikipedia.org/wiki/Hermes
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%AB%E3%83%A1%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E8%80%B3%E5%A2%A8%E6%96%AF

### 4. `thor` — Thor (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q42952 — deskripsi Wikidata: "hammer-wielding Norse god associated with thunder, lightning, storms, oaks, strength, and fertility"; kelas Wikidata: Norse deity, thunder deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Thor
  - id: https://id.wikipedia.org/wiki/Thor
  - ja: https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%BC%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E7%B4%A2%E5%B0%94

### 5. `hades` — Hades (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q41410 — deskripsi Wikidata: "god of the underworld in Greek mythology"; kelas Wikidata: Greek deity, death deity, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hades
  - id: https://id.wikipedia.org/wiki/Hades
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%BC%E3%83%87%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%93%88%E5%BE%97%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `artemis`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-027.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
