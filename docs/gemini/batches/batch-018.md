# Batch batch-018

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-018`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `pyinsarupa` — Pyinsarupa (task `new`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13068760 — deskripsi Wikidata: "chimeric animal from Burmese mythology"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pyinsarupa
  - es: https://es.wikipedia.org/wiki/Pyinsarupa
  - my: https://my.wikipedia.org/wiki/%E1%80%95%E1%80%89%E1%80%B9%E1%80%85%E1%80%9B%E1%80%B0%E1%80%95

### 2. `tigmamanukan` — Tigmamanukan (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7801675 — deskripsi Wikidata: "Philippine mythical creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Tigmamanukan
  - tl: https://tl.wikipedia.org/wiki/Tigmamanukan
  - bcl: https://bcl.wikipedia.org/wiki/Tigmamanukan

### 3. `begu-ganjang` — Begu ganjang (task `new`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q125292538 — kelas Wikidata: demon.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - id: https://id.wikipedia.org/wiki/Begu_ganjang
  - bew: https://bew.wikipedia.org/wiki/S%C3%A9tan_raksasa

### 4. `ekek` — Ekek (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5350385 — deskripsi Wikidata: "Philippine mythological creatures".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ekek
  - war: https://war.wikipedia.org/wiki/Ekek
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `philippine-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Ekek

### 5. `hantu-bongkok` — Hantu Bongkok (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q65934512.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hantu_Bongkok
  - id: https://id.wikipedia.org/wiki/Hantu_Bongkok
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Hantu_Bongkok
  - Wikipedia (id): https://id.wikipedia.org/wiki/Hantu_Bongkok

## Cara menjawab

Kerjakan berurutan mulai dari `pyinsarupa`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-018.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
