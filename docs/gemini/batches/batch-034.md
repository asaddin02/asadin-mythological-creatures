# Batch batch-034

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-034`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `neptune` — Neptune (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q3954 — deskripsi Wikidata: "Roman god of water, particularly the sea, considered equivalent to the Greek Poseidon"; kelas Wikidata: water deity, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Neptune_(mythology)
  - id: https://id.wikipedia.org/wiki/Neptunus_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%97%E3%83%88%E3%82%A5%E3%83%BC%E3%83%8C%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%B0%BC%E6%99%AE%E9%A1%BF

### 2. `phoenix` — phoenix (task `new`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q48444 — deskripsi Wikidata: "mythological bird that cyclically regenerates or is reborn from its own ashes in Greek, Roman, Arabian, Persian, and East Asian mythologies"; kelas Wikidata: mythology, mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Phoenix_(mythology)
  - id: https://id.wikipedia.org/wiki/Feniks
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A7%E3%83%8B%E3%83%83%E3%82%AF%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%B8%8D%E6%AD%BB%E9%B3%A5

### 3. `uranus` — Uranus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q79999 — deskripsi Wikidata: "primordial Greek deity, god of the Sky; one of the Greek primordial deities"; kelas Wikidata: Greek primordial deity, sky deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Uranus_(mythology)
  - id: https://id.wikipedia.org/wiki/Uranus_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A6%E3%83%BC%E3%83%A9%E3%83%8E%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%B9%8C%E6%8B%89%E8%AF%BA%E6%96%AF

### 4. `hanuman` — Hanuman (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q188618 — deskripsi Wikidata: "11th incarnation of God, Great devotee of Rama, Hindu God of strength, learning, and devotion"; kelas Wikidata: Hindu deity, Characters in the Ramayana, mythological or legendary ape.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hanuman
  - id: https://id.wikipedia.org/wiki/Hanoman
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%8C%E3%83%9E%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E5%93%88%E5%A5%B4%E6%9B%BC

### 5. `mars` — Mars (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q112 — deskripsi Wikidata: "Roman god of war, guardian of agriculture"; kelas Wikidata: Roman deity, war deity, Sabine deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mars_(mythology)
  - id: https://id.wikipedia.org/wiki/Mars_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%BC%E3%83%AB%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E7%8E%9B%E5%B0%94%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `neptune`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-034.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
