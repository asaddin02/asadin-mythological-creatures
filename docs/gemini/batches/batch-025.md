# Batch batch-025

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-025`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `apollo-q37340` — Apollo (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q37340 — deskripsi Wikidata: "god in Greek and later Roman mythology"; kelas Wikidata: Greek deity, solar deity, Olympian god, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Apollo
  - id: https://id.wikipedia.org/wiki/Apollo_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%9D%E3%83%AD%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E6%B3%A2%E7%BD%97

### 2. `athena` — Athena (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q37122 — deskripsi Wikidata: "goddess of wisdom and war in ancient Greek religion and mythology"; kelas Wikidata: goddess, Greek deity, Olympian god, war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Athena
  - id: https://id.wikipedia.org/wiki/Athena_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%86%E3%83%BC%E3%83%8A%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%9B%85%E5%85%B8%E5%A8%9C

### 3. `brahma-q11389` — Brahma (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11389 — deskripsi Wikidata: "creator god in Hinduism"; kelas Wikidata: Hindu deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Brahma
  - id: https://id.wikipedia.org/wiki/Brahma
  - ja: https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%A9%E3%83%95%E3%83%9E%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E6%A2%B5%E5%A4%A9

### 4. `aphrodite` — Aphrodite (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q35500 — deskripsi Wikidata: "Greek goddess of love, beauty, pleasure, and procreation"; kelas Wikidata: Greek deity, fertility deity, goddess, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aphrodite
  - id: https://id.wikipedia.org/wiki/Afrodit
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%97%E3%83%AD%E3%83%87%E3%82%A3%E3%83%BC%E3%83%86%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E4%BD%9B%E6%B4%9B%E7%8B%84%E5%BF%92

### 5. `holy-trinity` — Holy Trinity (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q37090 — deskripsi Wikidata: "Christian conception of God as consisting of three persons (hypostases) — the Father, the Son, and the Holy Spirit — sharing the same substance (ousia)"; kelas Wikidata: Christian dogma, attributes of God in Christianity, monad, triad.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Trinity
  - id: https://id.wikipedia.org/wiki/Tritunggal
  - ja: https://ja.wikipedia.org/wiki/%E4%B8%89%E4%BD%8D%E4%B8%80%E4%BD%93
  - zh: https://zh.wikipedia.org/wiki/%E4%B8%89%E4%BD%8D%E4%B8%80%E9%AB%94

## Cara menjawab

Kerjakan berurutan mulai dari `apollo-q37340`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-025.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
