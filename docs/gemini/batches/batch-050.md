# Batch batch-050

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-050`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `nephthys` — Nephthys (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q169040 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: water deity, death deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nephthys
  - id: https://id.wikipedia.org/wiki/Nephthys
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%95%E3%83%86%E3%82%A3%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%A5%88%E8%8A%99%E8%92%82%E6%96%AF

### 2. `nut` — Nut (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q165496 — deskripsi Wikidata: "goddess of the sky in the Ennead of Egyptian mythology"; kelas Wikidata: goddess, Ancient Egyptian deity, sky deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nut_(goddess)
  - id: https://id.wikipedia.org/wiki/Nut
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8C%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E5%8A%AA%E7%89%B9_(%E5%9F%83%E5%8F%8A%E7%A5%9E%E7%A5%87)

### 3. `quetzalcoatl-q179818` — Quetzalcoatl (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q179818 — deskripsi Wikidata: "deity in Mesoamerican culture and literature"; kelas Wikidata: dragon, Aztec deity, mythological serpent, feathered serpent.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Quetzalc%C5%8D%C4%81tl
  - id: https://id.wikipedia.org/wiki/Quetzalc%C5%8D%C4%81tl
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%84%E3%82%A1%E3%83%AB%E3%82%B3%E3%82%A2%E3%83%88%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E5%85%8B%E5%AF%9F%E7%88%BE%E7%A7%91%E4%BA%9E%E7%89%B9%E7%88%BE

### 4. `varuna` — Varuna (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1001037 — deskripsi Wikidata: "deity associated with waters in Hinduism, Buddhism"; kelas Wikidata: water deity, Hindu deity, Buddhist deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Varuna
  - id: https://id.wikipedia.org/wiki/Baruna
  - ja: https://ja.wikipedia.org/wiki/%E3%83%B4%E3%82%A1%E3%83%AB%E3%83%8A_(%E7%A5%9E)
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%90%E6%A5%BC%E6%8B%BF

### 5. `amphitrite` — Amphitrite (task `new`, tier `rich`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q180222 — deskripsi Wikidata: "Oceanid or Nereid of Greek mythology"; kelas Wikidata: Greek deity, sea deity, Oceanids.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Amphitrite
  - id: https://id.wikipedia.org/wiki/Amfitrit
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%A0%E3%83%94%E3%83%88%E3%83%AA%E3%83%BC%E3%83%86%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%AE%89%E8%8F%B2%E7%89%B9%E9%87%8C%E5%BF%92

## Cara menjawab

Kerjakan berurutan mulai dari `nephthys`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-050.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
