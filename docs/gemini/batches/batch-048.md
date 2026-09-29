# Batch batch-048

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-048`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `orion-mythology` — Orion (mythology) (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q201261 — deskripsi Wikidata: "giant huntsman in Greek mythology"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Orion_(mythology)
  - id: https://id.wikipedia.org/wiki/Orion_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%83%AA%E3%83%BC%E3%82%AA%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E4%BF%84%E9%87%8C%E7%BF%81
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `giant`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Orion_(mythology)
  - Wikipedia (id): https://id.wikipedia.org/wiki/Orion_(mitologi)

### 2. `satyr` — Satyr (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q163709 — deskripsi Wikidata: "goat-like male companions of Pan and Dionysus, in Greek mythology"; kelas Wikidata: mythical humanoid race.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Satyr
  - id: https://id.wikipedia.org/wiki/Satir
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B5%E3%83%86%E3%83%A5%E3%83%AD%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%96%A9%E5%A0%A4%E7%88%BE
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Satyr
  - Wikipedia (id): https://id.wikipedia.org/wiki/Satir

### 3. `leto` — Leto (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q103107 — deskripsi Wikidata: "Greek mythological figure and mother of Apollo and Artemis"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Leto
  - id: https://id.wikipedia.org/wiki/Leto
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AC%E3%83%BC%E3%83%88%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%8B%92%E6%89%98

### 4. `pan` — Pan (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q132582 — deskripsi Wikidata: "Greek god of the mountain wilds, shepherds, flocks, rustic music, fertility, spring, and theatrical criticism, with the hindquarters, legs, and horns of a goat"; kelas Wikidata: Greek deity, nature deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pan_(god)
  - id: https://id.wikipedia.org/wiki/Pan
  - ja: https://ja.wikipedia.org/wiki/%E3%83%91%E3%83%BC%E3%83%B3_(%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1)
  - zh: https://zh.wikipedia.org/wiki/%E6%BD%98%E7%A5%9E

### 5. `ptah` — Ptah (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q146321 — deskripsi Wikidata: "ancient Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, creator deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ptah
  - id: https://id.wikipedia.org/wiki/Ptah
  - ja: https://ja.wikipedia.org/wiki/%E3%83%97%E3%82%BF%E3%83%8F
  - zh: https://zh.wikipedia.org/wiki/%E5%8D%9C%E5%A1%94

## Cara menjawab

Kerjakan berurutan mulai dari `orion-mythology`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-048.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
