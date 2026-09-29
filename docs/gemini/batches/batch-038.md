# Batch batch-038

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-038`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `aten` — Aten (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q130227 — deskripsi Wikidata: "ancient Egyptian god"; kelas Wikidata: Ancient Egyptian deity, King of the Gods, solar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aten
  - id: https://id.wikipedia.org/wiki/Aten
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%86%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E9%A0%93

### 2. `diana` — Diana (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q132543 — deskripsi Wikidata: "goddess of the hunt, the moon and birthing, equated with the Greek goddess Artemis"; kelas Wikidata: Roman deity, epithet.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Diana_(mythology)
  - id: https://id.wikipedia.org/wiki/Diana_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%A3%E3%82%A2%E3%83%BC%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E7%8B%84%E9%98%BF%E5%A8%9C

### 3. `gaia` — Gaia (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q93172 — deskripsi Wikidata: "Greek primordial deity, the personification of the Earth"; kelas Wikidata: Greek primordial deity, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Gaia
  - id: https://id.wikipedia.org/wiki/Gaia
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AC%E3%82%A4%E3%82%A2
  - zh: https://zh.wikipedia.org/wiki/%E7%9B%96%E4%BA%9A

### 4. `minerva` — Minerva (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q126916 — deskripsi Wikidata: "Roman goddess of wisdom and sponsor of arts, trade, and defense"; kelas Wikidata: goddess, war deity, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Minerva
  - id: https://id.wikipedia.org/wiki/Minerva_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%8D%E3%83%AB%E3%82%A6%E3%82%A1
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%A5%E6%B6%85%E8%80%B3%E7%93%A6

### 5. `freyja` — Freyja (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1647325 — deskripsi Wikidata: "goddess associated with love, beauty, fertility, sex, war, gold, and seiðr in Norse mythology"; kelas Wikidata: Norse deity, fertility deity, war deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Freyja
  - id: https://id.wikipedia.org/wiki/Freyja
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AC%E3%82%A4%E3%83%A4
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%97%E8%95%BE%E4%BA%9A

## Cara menjawab

Kerjakan berurutan mulai dari `aten`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-038.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
