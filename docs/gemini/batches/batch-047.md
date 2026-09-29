# Batch batch-047

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-047`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `surya` — Surya (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q204418 — deskripsi Wikidata: "solar god in Hinduism"; kelas Wikidata: Hindu deity, solar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Surya
  - id: https://id.wikipedia.org/wiki/Surya_(dewa)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%BC%E3%83%AA%E3%83%A4
  - zh: https://zh.wikipedia.org/wiki/%E8%98%87%E5%88%A9%E8%80%B6

### 2. `troll` — Troll (task `enrich`, tier `rich`)
- **Jenis: raksasa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q12581 — deskripsi Wikidata: "supernatural being in Norse mythology and Scandinavian folklore"; kelas Wikidata: mythical people.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Troll
  - id: https://id.wikipedia.org/wiki/Troll
  - ja: https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E6%B4%9E%E7%A9%B4%E5%B7%A8%E4%BA%BA
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `giant`, budaya `norse-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Troll
  - Wikipedia (id): https://id.wikipedia.org/wiki/Troll

### 3. `baal` — Baal (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q590467 — deskripsi Wikidata: "Canaanite storm deity"; kelas Wikidata: deity, biblical character, thunder deity, storm deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Baal
  - id: https://id.wikipedia.org/wiki/Baal
  - ja: https://ja.wikipedia.org/wiki/%E3%83%90%E3%82%A2%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%8A%9B

### 4. `circe` — Circe (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q187602 — deskripsi Wikidata: "enchantress-goddess in Greek mythology"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Circe
  - id: https://id.wikipedia.org/wiki/Kirke
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%AB%E3%82%B1%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%96%80%E8%80%B3%E5%88%BB

### 5. `marduk` — Marduk (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q190123 — deskripsi Wikidata: "national god of the Babylonians"; kelas Wikidata: god, King of the Gods.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Marduk
  - id: https://id.wikipedia.org/wiki/Marduk
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB%E3%83%89%E3%82%A5%E3%82%AF
  - zh: https://zh.wikipedia.org/wiki/%E9%A9%AC%E5%B0%94%E6%9D%9C%E5%85%8B

## Cara menjawab

Kerjakan berurutan mulai dari `surya`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-047.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
