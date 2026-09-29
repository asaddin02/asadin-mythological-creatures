# Batch batch-060

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-060`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `erebos` — Erebos (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131122 — deskripsi Wikidata: "primordial deity in Greek mythology"; kelas Wikidata: Greek primordial deity, mythical location.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Erebus
  - id: https://id.wikipedia.org/wiki/Erebos
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%AC%E3%83%9C%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%8E%84%E7%91%9E%E7%8E%BB%E6%96%AF

### 2. `fenrir-q182560` — Fenrir (task `new`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q182560 — deskripsi Wikidata: "monstrous wolf in Norse mythology"; kelas Wikidata: warg, Norse mythical animal, eschatological figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Fenrir
  - id: https://id.wikipedia.org/wiki/Fenrir
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A7%E3%83%B3%E3%83%AA%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E8%8A%AC%E9%87%8C%E5%B0%94

### 3. `io` — Io (task `new`, tier `rich`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q179014 — deskripsi Wikidata: "nymph seduced by Zeus in Greek mythology"; kelas Wikidata: Greek nymph.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Io_(mythology)
  - id: https://id.wikipedia.org/wiki/Io_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%BC%E3%82%AA%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%8A%E4%BF%84

### 4. `khnum` — Khnum (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q183097 — deskripsi Wikidata: "god of creation and the waters in Egyptian mythology"; kelas Wikidata: water deity, Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Khnum
  - id: https://id.wikipedia.org/wiki/Khnum
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%8C%E3%83%A0
  - zh: https://zh.wikipedia.org/wiki/%E5%BA%AB%E5%8A%AA%E7%89%A1

### 5. `kreios` — Kreios (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q192136 — deskripsi Wikidata: "Titan in Greek mythology, name that means ram"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Crius
  - id: https://id.wikipedia.org/wiki/Krios
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AC%E3%82%A4%E3%82%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%85%8B%E5%88%A9%E4%BF%84%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `erebos`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-060.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
