# Batch batch-019

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-019`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `hantu-tinggi` — Hantu Tinggi (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q17020766 — deskripsi Wikidata: "Malaysian spirit or ghost".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hantu_Tinggi
  - uk: https://uk.wikipedia.org/wiki/%D0%A5%D0%B0%D0%BD%D1%82%D1%83_%D0%A2%D1%96%D0%BD%D2%91%D2%91%D1%96
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-malaysian`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Hantu_Tinggi

### 2. `ho-ly-tinh` — Hồ ly tinh (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q110419379 — deskripsi Wikidata: "Vietnamese mythological creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/H%E1%BB%93_ly_tinh
  - fr: https://fr.wikipedia.org/wiki/Renard_dans_la_culture_vietnamienne
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-vietnamese`, wilayah "East Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/H%E1%BB%93_ly_tinh

### 3. `lembuswana` — Lembuswana (task `new`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q12494439 — deskripsi Wikidata: "mythological creature of Indonesia"; kelas Wikidata: mythology, mythical creature, mythical character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - id: https://id.wikipedia.org/wiki/Lembuswana
  - bjn: https://bjn.wikipedia.org/wiki/Lembuswana

### 4. `limokon` — Limokon (task `new`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q96387513 — deskripsi Wikidata: "omen bird in Philippine mythology"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Limokon
  - bcl: https://bcl.wikipedia.org/wiki/Limokon

### 5. `ma-bong` — Ma bong (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13019106.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ma_bong
  - th: https://th.wikipedia.org/wiki/%E0%B8%A1%E0%B9%89%E0%B8%B2%E0%B8%9A%E0%B9%89%E0%B8%AD%E0%B8%87
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Ma_bong

## Cara menjawab

Kerjakan berurutan mulai dari `hantu-tinggi`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-019.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
