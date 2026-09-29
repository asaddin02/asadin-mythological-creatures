# Batch batch-070

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-070`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `hypnos` — Hypnos (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q189347 — deskripsi Wikidata: "personification of sleep in Greek mythology"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hypnos
  - id: https://id.wikipedia.org/wiki/Hipnos
  - ja: https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%83%97%E3%83%8E%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%A8%B1%E6%99%AE%E8%AB%BE%E6%96%AF

### 2. `min` — Min (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q192322 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Min_(god)
  - id: https://id.wikipedia.org/wiki/Min_(dewa)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E6%95%8F

### 3. `nereus` — Nereus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q189527 — deskripsi Wikidata: "sea god of Greek mythology"; kelas Wikidata: Greek water deities.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nereus
  - id: https://id.wikipedia.org/wiki/Nereus
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%BC%E3%83%AC%E3%82%A6%E3%82%B9_(%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1%E3%81%AE%E7%A5%9E)
  - zh: https://zh.wikipedia.org/wiki/%E6%B6%85%E6%9F%94%E6%96%AF

### 4. `polyphemus` — Polyphemus (task `new`, tier `rich`)
- **Jenis: raksasa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q193567 — deskripsi Wikidata: "giant son of Poseidon and Thoosa in Greek mythology"; kelas Wikidata: cyclops.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Polyphemus
  - id: https://id.wikipedia.org/wiki/Polifemos
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9D%E3%83%AA%E3%83%A5%E3%83%9A%E3%83%BC%E3%83%A2%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%B3%A2%E5%90%95%E6%96%90%E6%91%A9%E6%96%AF

### 5. `amunet` — Amunet (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q208735 — deskripsi Wikidata: "Egyptian goddess, wife of Amun"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Amunet
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%9E%E3%82%A6%E3%83%8D%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E7%8E%9B%E4%B9%8C%E5%A5%88%E7%89%B9
  - de: https://de.wikipedia.org/wiki/Amaunet

## Cara menjawab

Kerjakan berurutan mulai dari `hypnos`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-070.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
