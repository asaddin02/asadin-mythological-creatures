# Batch batch-041

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-041`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `loki` — Loki (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q133147 — deskripsi Wikidata: "Norse god of mischief, trickery, and deception"; kelas Wikidata: Norse deity, shapeshifter, eschatological figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Loki
  - id: https://id.wikipedia.org/wiki/Loki
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AD%E3%82%AD
  - zh: https://zh.wikipedia.org/wiki/%E6%B4%9B%E5%9F%BA

### 2. `pluto-q152262` — Pluto (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q152262 — deskripsi Wikidata: "god in Roman religion, Plouton in Greek"; kelas Wikidata: Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Pluto_(god)
  - id: https://id.wikipedia.org/wiki/Pluto_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AB%E3%83%BC%E3%83%88%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E6%99%AE%E8%B7%AF%E6%89%98

### 3. `set-deity` — Set (deity) (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131795 — deskripsi Wikidata: "God of the desert, storms, and foreigners in ancient Egyptian religion"; kelas Wikidata: thunder deity, war deity, Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Set_(deity)
  - id: https://id.wikipedia.org/wiki/Set_(dewa)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%9B%E7%89%B9
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Set_(deity)
  - Wikipedia (id): https://id.wikipedia.org/wiki/Set_(dewa)

### 4. `lilith` — Lilith (task `enrich`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q180627 — deskripsi Wikidata: "figure in Jewish mythology"; kelas Wikidata: mythical character, demon.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Lilith
  - id: https://id.wikipedia.org/wiki/Lilith
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%8E%89%E8%8E%89%E4%B8%9D
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `tradition-mesopotamian`, wilayah "Middle East".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Lilith
  - Wikipedia (id): https://id.wikipedia.org/wiki/Lilith

### 5. `ahura-mazda` — Ahura Mazda (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q179575 — deskripsi Wikidata: "highest deity and creator deity of Zoroastrianism"; kelas Wikidata: theonym, Ahura, deity, creator deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ahura_Mazda
  - id: https://id.wikipedia.org/wiki/Ahura_Mazda
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%95%E3%83%A9%E3%83%BB%E3%83%9E%E3%82%BA%E3%83%80%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E8%83%A1%E6%8B%89%C2%B7%E9%A6%AC%E8%8C%B2%E9%81%94

## Cara menjawab

Kerjakan berurutan mulai dari `loki`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-041.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
