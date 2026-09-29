# Batch batch-017

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-017`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `minokawa` — Minokawa (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q9033423 — deskripsi Wikidata: "Philippine mythical creature".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Minokawa
  - es: https://es.wikipedia.org/wiki/Minokawa
  - bcl: https://bcl.wikipedia.org/wiki/Minokawa
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `bird`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Minokawa

### 2. `nang-mai` — Nang mai (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q124060949 — deskripsi Wikidata: "figure in Thai folklore".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nang_mai
  - as: https://as.wikipedia.org/wiki/%E0%A6%A8%E0%A6%BE%E0%A6%82_%E0%A6%AE%E0%A6%BE%E0%A6%87
  - bcl: https://bcl.wikipedia.org/wiki/Nang_mai
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Nang_mai

### 3. `nini-pelet` — Nini Pelet (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q137704062 — deskripsi Wikidata: "West Javanese Legend"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nini_Pelet
  - id: https://id.wikipedia.org/wiki/Nini_Pelet
  - mad: https://mad.wikipedia.org/wiki/Nini_Pelet

### 4. `pop-ghost` — Pop (ghost) (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q6580579 — deskripsi Wikidata: "Cannibalistic spirit of Thai folklore".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pop_(ghost)
  - hi: https://hi.wikipedia.org/wiki/%E0%A4%AA%E0%A5%89%E0%A4%AA_(%E0%A4%AD%E0%A5%82%E0%A4%A4)
  - th: https://th.wikipedia.org/wiki/%E0%B8%9B%E0%B8%AD%E0%B8%9A
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Pop_(ghost)

### 5. `pugot` — Pugot (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7258971 — deskripsi Wikidata: "Filipino mythical creature"; kelas Wikidata: deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pugot
  - pt: https://pt.wikipedia.org/wiki/Pugot
  - bcl: https://bcl.wikipedia.org/wiki/Pugot
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Pugot

## Cara menjawab

Kerjakan berurutan mulai dari `minokawa`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-017.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
