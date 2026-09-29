# Batch batch-033

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-033`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `horus` — Horus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q84122 — deskripsi Wikidata: "Egyptian sky deity"; kelas Wikidata: war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Horus
  - id: https://id.wikipedia.org/wiki/Horus
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9B%E3%83%AB%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%8D%B7%E9%B2%81%E6%96%AF

### 2. `parvati` — Parvati (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q170485 — deskripsi Wikidata: "Hindu goddess of fertility, motherly love and devotion"; kelas Wikidata: Devi, Hindu deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Parvati
  - id: https://id.wikipedia.org/wiki/Parwati
  - ja: https://ja.wikipedia.org/wiki/%E3%83%91%E3%83%BC%E3%83%AB%E3%83%B4%E3%82%A1%E3%83%86%E3%82%A3%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%9B%AA%E5%B1%B1%E7%A5%9E%E5%A5%B3

### 3. `amun` — Amun (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q58373 — deskripsi Wikidata: "Egyptian and Berber deity"; kelas Wikidata: Ancient Egyptian deity, sky deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Amun
  - id: https://id.wikipedia.org/wiki/Amun
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%A1%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E8%92%99

### 4. `demon` — Demon (task `enrich`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q177413 — deskripsi Wikidata: "mythological and malevolent being prevalent in religion, occultism, mythology, and folklore"; kelas Wikidata: religious concept.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Demon
  - id: https://id.wikipedia.org/wiki/Demon
  - ja: https://ja.wikipedia.org/wiki/%E6%82%AA%E9%9C%8A
  - zh: https://zh.wikipedia.org/wiki/%E9%82%AA%E9%9D%88
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `cross-cultural`, wilayah "Transregional".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Demon
  - Wikipedia (id): https://id.wikipedia.org/wiki/Demon

### 5. `eros` — Eros (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q121973 — deskripsi Wikidata: "Greek god of love and sex"; kelas Wikidata: Greek primordial deity, fertility deity, Greek deity, personification.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Eros
  - id: https://id.wikipedia.org/wiki/Eros
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%AD%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%8E%84%E6%B4%9B%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `horus`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-033.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
