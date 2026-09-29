# Batch batch-040

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-040`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `agni` — Agni (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q394867 — deskripsi Wikidata: "fire deity of Hinduism"; kelas Wikidata: Hindu deity, Rigvedic deities, fire deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Agni
  - id: https://id.wikipedia.org/wiki/Agni
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B0%E3%83%8B
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E8%80%86%E5%B0%BC

### 2. `hathor` — Hathor (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q133343 — deskripsi Wikidata: "major goddess in ancient Egyptian religion"; kelas Wikidata: Ancient Egyptian deity, goddess, fertility deity, horned deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hathor
  - id: https://id.wikipedia.org/wiki/Hathor
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%88%E3%83%9B%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E5%93%88%E7%B4%A2%E5%B0%94

### 3. `helios` — Helios (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q134270 — deskripsi Wikidata: "Greek god and personification of the Sun"; kelas Wikidata: Greek deity, solar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Helios
  - id: https://id.wikipedia.org/wiki/Helios
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%BC%E3%83%AA%E3%82%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E5%88%A9%E4%BF%84%E6%96%AF

### 4. `oceanus` — Oceanus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q161419 — deskripsi Wikidata: "ancient Greek god of the earth-encircling river, Oceanos"; kelas Wikidata: titan, Greek water deities, personification.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Oceanus
  - id: https://id.wikipedia.org/wiki/Okeanos
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%82%B1%E3%82%A2%E3%83%8E%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%BF%84%E5%88%BB%E9%98%BF%E8%AF%BA%E6%96%AF

### 5. `selene` — Selene (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131585 — deskripsi Wikidata: "ancient Greek goddess and personification of the Moon, daughter of Hyperion and Theia"; kelas Wikidata: Greek deity, lunar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Selene
  - id: https://id.wikipedia.org/wiki/Selene
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%83%AC%E3%83%BC%E3%83%8D%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%A1%9E%E5%8B%92%E6%B6%85

## Cara menjawab

Kerjakan berurutan mulai dari `agni`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-040.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
