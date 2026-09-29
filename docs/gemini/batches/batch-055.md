# Batch batch-055

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-055`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `geb` — Geb (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q168444 — deskripsi Wikidata: "Egyptian deity of the Earth"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Geb
  - id: https://id.wikipedia.org/wiki/Geb
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B2%E3%83%96
  - zh: https://zh.wikipedia.org/wiki/%E7%9B%96%E5%B8%83

### 2. `goliath` — Goliath (task `enrich`, tier `rich`)
- **Jenis: raksasa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q192785 — deskripsi Wikidata: "giant Philistine warrior"; kelas Wikidata: giant, human biblical figure, human.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Goliath
  - id: https://id.wikipedia.org/wiki/Goliat
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B4%E3%83%AA%E3%82%A2%E3%83%86
  - zh: https://zh.wikipedia.org/wiki/%E6%AD%8C%E5%88%A9%E4%BA%9A
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `giant`, budaya `tradition-islamic`, wilayah "Transregional".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Goliath
  - Wikipedia (id): https://id.wikipedia.org/wiki/Goliat

### 3. `nemesis` — Nemesis (task `new`, tier `rich`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q185747 — deskripsi Wikidata: "goddess of Greek mythology"; kelas Wikidata: Oceanids, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nemesis
  - id: https://id.wikipedia.org/wiki/Nemesis
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%A1%E3%82%B7%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%B6%85%E5%A2%A8%E8%A5%BF%E6%96%AF

### 4. `pontus` — Pontus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q190563 — deskripsi Wikidata: "sea god of Greek mythology"; kelas Wikidata: Greek water deities, Greek primordial deity, water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pontus_(mythology)
  - id: https://id.wikipedia.org/wiki/Pontos
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9D%E3%83%B3%E3%83%88%E3%82%B9_(%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1)
  - zh: https://zh.wikipedia.org/wiki/%E8%93%AC%E6%89%98%E6%96%AF

### 5. `ravana` — Ravana (task `enrich`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q235102 — deskripsi Wikidata: "King of Lankā in the Hindu epic Ramayana"; kelas Wikidata: Rakshasa, mythical character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ravana
  - id: https://id.wikipedia.org/wiki/Rahwana
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%BC%E3%83%B4%E3%82%A1%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E7%BD%97%E6%B3%A2%E9%82%A3
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `tradition-hindu`, wilayah "South Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Ravana
  - Wikipedia (id): https://id.wikipedia.org/wiki/Rahwana

## Cara menjawab

Kerjakan berurutan mulai dari `geb`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-055.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
