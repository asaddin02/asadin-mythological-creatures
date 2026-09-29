# Batch batch-053

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-053`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `vesta` — Vesta (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q178710 — deskripsi Wikidata: "goddess of the hearth, home, and family in Roman religion"; kelas Wikidata: Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Vesta_(mythology)
  - id: https://id.wikipedia.org/wiki/Vesta_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A7%E3%82%B9%E3%82%BF
  - zh: https://zh.wikipedia.org/wiki/%E7%B6%AD%E6%96%AF%E5%A1%94

### 2. `anu` — Anu (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q188536 — deskripsi Wikidata: "Sumerian deity, Sky Father, King of the Gods"; kelas Wikidata: god, sky father.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Anu
  - id: https://id.wikipedia.org/wiki/Anu_(dewa)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%8C_(%E3%83%A1%E3%82%BD%E3%83%9D%E3%82%BF%E3%83%9F%E3%82%A2%E7%A5%9E%E8%A9%B1)
  - zh: https://zh.wikipedia.org/wiki/%E5%AE%89%E5%8A%AA

### 3. `basilisk` — Basilisk (task `enrich`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q152519 — deskripsi Wikidata: "legendary reptile in European mythology".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Basilisk
  - id: https://id.wikipedia.org/wiki/Basilisk
  - ja: https://ja.wikipedia.org/wiki/%E3%83%90%E3%82%B8%E3%83%AA%E3%82%B9%E3%82%AF
  - zh: https://zh.wikipedia.org/wiki/%E5%B7%B4%E8%A5%BF%E5%88%A9%E6%96%AF%E5%85%8B
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Basilisk
  - Wikipedia (id): https://id.wikipedia.org/wiki/Basilisk

### 4. `hyperion` — Hyperion (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q179209 — deskripsi Wikidata: "Titan in Greek mythology"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hyperion_(Titan)
  - id: https://id.wikipedia.org/wiki/Hiperion
  - ja: https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%9A%E3%83%AA%E3%83%BC%E3%82%AA%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E8%AE%B8%E7%8F%80%E9%87%8C%E7%BF%81

### 5. `iapetos` — Iapetos (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q179543 — deskripsi Wikidata: "Titan in Greek mythology"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Iapetus
  - id: https://id.wikipedia.org/wiki/Iapetos_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%BC%E3%82%A2%E3%83%9A%E3%83%88%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%8A%E9%98%BF%E7%8F%80%E6%89%98%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `vesta`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-053.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
