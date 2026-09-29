# Batch batch-028

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-028`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `jupiter` — Jupiter (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4649 — deskripsi Wikidata: "chief deity of Roman state religion"; kelas Wikidata: Roman deity, King of the Gods, god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Jupiter_(god)
  - id: https://id.wikipedia.org/wiki/Jupiter_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A6%E3%83%BC%E3%83%94%E3%83%86%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E6%9C%B1%E5%BA%87%E7%89%B9

### 2. `ganesha` — Ganesha (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1579 — deskripsi Wikidata: "God of good luck, prosperity and well being in Hinduism; First worshipped God; Son of Shiva and Parvati"; kelas Wikidata: Hindu deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ganesha
  - id: https://id.wikipedia.org/wiki/Ganesa
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AC%E3%83%8D%E3%83%BC%E3%82%B7%E3%83%A3
  - zh: https://zh.wikipedia.org/wiki/%E8%B1%A1%E5%A4%B4%E7%A5%9E

### 3. `michael` — Michael (task `new`, tier `rich`)
- **Jenis: malaikat** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q45581 — deskripsi Wikidata: "archangel in Jewish, Christian, and Islamic teachings"; kelas Wikidata: archangel, angel in Judaism, angels in Christianity, Mukarrabun.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Michael_(archangel)
  - id: https://id.wikipedia.org/wiki/Mikhael
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9F%E3%82%AB%E3%82%A8%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E7%B1%B3%E8%BF%A6%E5%8B%92

### 4. `vampire` — Vampire (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q46721 — deskripsi Wikidata: "mythological or folkloric creature".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Vampire
  - id: https://id.wikipedia.org/wiki/Vampir
  - ja: https://ja.wikipedia.org/wiki/%E5%90%B8%E8%A1%80%E9%AC%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%90%B8%E8%A1%80%E9%AC%BC
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `tradition-medieval-european`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Vampire
  - Wikipedia (id): https://id.wikipedia.org/wiki/Vampir

### 5. `ares` — Ares (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q40901 — deskripsi Wikidata: "Greek god of war and combat"; kelas Wikidata: Greek deity, war deity, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ares
  - id: https://id.wikipedia.org/wiki/Ares
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%AC%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E7%91%9E%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `jupiter`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-028.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
