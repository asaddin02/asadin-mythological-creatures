# Batch batch-058

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-058`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `coeus` — Coeus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q182837 — deskripsi Wikidata: "Titan in Greek mythology, one of the twelve titans"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Coeus
  - id: https://id.wikipedia.org/wiki/Koios
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B3%E3%82%A4%E3%82%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E7%A7%91%E4%BF%84%E6%96%AF

### 2. `echidna-mythology` — Echidna (mythology) (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q185670 — deskripsi Wikidata: "ancient Greek mythological monster, the mother of monsters"; kelas Wikidata: Greek deity, mythological Greek character, drakaina.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Echidna_(mythology)
  - id: https://id.wikipedia.org/wiki/Ekhidna_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A8%E3%82%AD%E3%83%89%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E5%8E%84%E5%AE%A2%E5%BE%B7%E5%A8%9C
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Echidna_(mythology)
  - Wikipedia (id): https://id.wikipedia.org/wiki/Ekhidna_(mitologi)

### 3. `enlil` — Enlil (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q214672 — deskripsi Wikidata: "ancient Mesopotamian god"; kelas Wikidata: god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Enlil
  - id: https://id.wikipedia.org/wiki/Enlil
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%B3%E3%83%AA%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E6%81%A9%E5%88%A9%E7%88%BE

### 4. `iris` — Iris (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q184570 — deskripsi Wikidata: "the personification of the rainbow in ancient Greek religion and mythology"; kelas Wikidata: Greek deity, goddess, rainbow deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Iris_(mythology)
  - id: https://id.wikipedia.org/wiki/Iris_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%BC%E3%83%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%8A%E9%87%8C%E6%96%AF

### 5. `khonsu` — Khonsu (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q190521 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, lunar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Khonsu
  - id: https://id.wikipedia.org/wiki/Khonsu
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%AD%94%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `coeus`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-058.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
