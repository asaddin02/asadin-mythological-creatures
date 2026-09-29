# Batch batch-044

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-044`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `tartarus` — Tartarus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q101322 — deskripsi Wikidata: "deep abyss, place of punishment, in ancient Greek mythology"; kelas Wikidata: Greek primordial deity, mythical location.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Tartarus
  - id: https://id.wikipedia.org/wiki/Tartaros
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BF%E3%83%AB%E3%82%BF%E3%83%AD%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%A1%94%E8%80%B3%E5%A1%94%E7%BD%97%E6%96%AF

### 2. `themis` — Themis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q159168 — deskripsi Wikidata: "in ancient Greek mythology, a titaness, the personification of divine order, fairness, law, natural law, and custom, whose symbols are the scales of justice"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Themis
  - id: https://id.wikipedia.org/wiki/Themis
  - ja: https://ja.wikipedia.org/wiki/%E3%83%86%E3%83%9F%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%BF%92%E5%BC%A5%E6%96%AF

### 3. `cupid` — Cupid (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5011 — deskripsi Wikidata: "Roman deity, counterpart of Eros"; kelas Wikidata: Roman deity, fertility deity, mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Cupid
  - id: https://id.wikipedia.org/wiki/Kupido
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%94%E3%83%BC%E3%83%89%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%82%B1%E6%AF%94%E7%89%B9

### 4. `eos` — Eos (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q178417 — deskripsi Wikidata: "Greek goddess of the dawn"; kelas Wikidata: goddess, titan, personification, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Eos
  - id: https://id.wikipedia.org/wiki/Eos
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%BC%E3%82%AA%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%8E%84%E4%BF%84%E6%96%AF

### 5. `lernaean-hydra` — Lernaean Hydra (task `enrich`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q170379 — deskripsi Wikidata: "ancient serpent-like chthonic water monster, with reptilian traits, that possessed many heads, in Greek mythology"; kelas Wikidata: mythological serpent, mythological Greek character, dragon.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Lernaean_Hydra
  - id: https://id.wikipedia.org/wiki/Hidra
  - ja: https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%89%E3%83%A9%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%8B%92%E6%8B%BF%E4%B9%9D%E5%A4%B4%E8%9B%87
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Lernaean_Hydra
  - Wikipedia (id): https://id.wikipedia.org/wiki/Hidra

## Cara menjawab

Kerjakan berurutan mulai dari `tartarus`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-044.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
