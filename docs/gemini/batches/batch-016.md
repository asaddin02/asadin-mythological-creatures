# Batch batch-016

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-016`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `batibat` — Batibat (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4869255 — deskripsi Wikidata: "Philippine mythical creature".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Batibat
  - bcl: https://bcl.wikipedia.org/wiki/Batibat
  - war: https://war.wikipedia.org/wiki/Batibat
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Batibat

### 2. `bungisngis` — Bungisngis (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4997649 — deskripsi Wikidata: "Philippine mythical creature".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bungisngis
  - tl: https://tl.wikipedia.org/wiki/Bungisngis_(kwentong-bayan)
  - bcl: https://bcl.wikipedia.org/wiki/Bungisngis
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Bungisngis

### 3. `cha-kla` — Cha kla (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13014045 — deskripsi Wikidata: "Thai ghost".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Cha_kla
  - th: https://th.wikipedia.org/wiki/%E0%B8%88%E0%B8%B0%E0%B8%81%E0%B8%A5%E0%B8%B0
  - ig: https://ig.wikipedia.org/wiki/Cha_kla
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Cha_kla

### 4. `khamot` — Khamot (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13026572.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Khamot
  - ko: https://ko.wikipedia.org/wiki/%EC%B9%B4%EB%AA%BB
  - th: https://th.wikipedia.org/wiki/%E0%B9%82%E0%B8%82%E0%B8%A1%E0%B8%94
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Khamot

### 5. `mandurugo` — Mandurugo (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q6748256 — deskripsi Wikidata: "mythical being from Philippine folklore".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mandurugo
  - ar: https://ar.wikipedia.org/wiki/%D9%85%D8%A7%D9%86%D8%AF%D9%88%D8%B1%D9%88%D8%BA%D9%88_(%D9%83%D8%A7%D8%A6%D9%86_%D8%A3%D8%B3%D8%B7%D9%88%D8%B1%D9%8A)
  - bcl: https://bcl.wikipedia.org/wiki/Mandurugo
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Mandurugo

## Cara menjawab

Kerjakan berurutan mulai dari `batibat`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-016.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
