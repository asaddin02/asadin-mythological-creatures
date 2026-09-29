# Batch batch-021

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-021`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `seri-pahang` — Seri Pahang (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q85800425.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Seri_Pahang
  - ms: https://ms.wikipedia.org/wiki/Seri_Pahang
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-malaysian`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Seri_Pahang

### 2. `thaye` — Thayé (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7711578 — deskripsi Wikidata: "Burmese mythological evil spirit".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Thay%C3%A9
  - fr: https://fr.wikipedia.org/wiki/Thay%C3%A9
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-burmese`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Thay%C3%A9

### 3. `women-in-black-of-wat-samian-nari` — Women in Black of Wat Samian Nari (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q136105254 — deskripsi Wikidata: "urban legend from Bangkok, Thailand".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Women_in_Black_of_Wat_Samian_Nari
  - th: https://th.wikipedia.org/wiki/%E0%B8%9C%E0%B8%B5%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%94%E0%B9%8D%E0%B8%B2%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%AA%E0%B8%A1%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%99%E0%B8%B2%E0%B8%A3%E0%B8%B5
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Women_in_Black_of_Wat_Samian_Nari

### 4. `agta` — Agta (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q16826180 — deskripsi Wikidata: "Creature in Philippine mythology"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Agta_(mythical_creature)

### 5. `busaw` — Busaw (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5001280 — deskripsi Wikidata: "legendary creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Busaw
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Busaw

## Cara menjawab

Kerjakan berurutan mulai dari `seri-pahang`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-021.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
