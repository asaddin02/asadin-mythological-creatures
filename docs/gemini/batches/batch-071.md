# Batch batch-071

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-071`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `bellona` — Bellona (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q207234 — deskripsi Wikidata: "ancient Roman goddess of war, similar to the ancient Greek Enyo"; kelas Wikidata: Roman deity, war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bellona_(goddess)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%AD%E3%83%BC%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E8%B2%9D%E7%BE%85%E9%82%A3_(%E7%A5%9E%E7%A5%87)
  - de: https://de.wikipedia.org/wiki/Bellona

### 2. `hygieia` — Hygieia (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q202257 — deskripsi Wikidata: "goddess in Greek mythology, personification of health"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hygieia
  - ja: https://ja.wikipedia.org/wiki/%E3%83%92%E3%83%A5%E3%82%AE%E3%82%A8%E3%82%A4%E3%82%A2
  - zh: https://zh.wikipedia.org/wiki/%E8%AE%B8%E7%99%B8%E5%8E%84%E4%BA%9A
  - de: https://de.wikipedia.org/wiki/Hygieia

### 3. `kurma` — Kurma (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q476808 — deskripsi Wikidata: "tortoise incarnation of Vishnu"; kelas Wikidata: avatar, mythological turtle.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Kurma
  - id: https://id.wikipedia.org/wiki/Kurma_(awatara)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%BC%E3%83%AB%E3%83%9E
  - zh: https://zh.wikipedia.org/wiki/%E4%BF%B1%E5%88%A9%E6%91%A9

### 4. `morpheus` — Morpheus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q194012 — deskripsi Wikidata: "Greek deity associated with sleep and dreams"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Morpheus
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A2%E3%83%AB%E3%83%9A%E3%82%A6%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%91%A9%E8%80%B3%E7%94%AB%E6%96%AF
  - de: https://de.wikipedia.org/wiki/Morpheus

### 5. `perun` — Perun (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q206561 — deskripsi Wikidata: "Slavic supreme god of the sky and war"; kelas Wikidata: thunder deity, nature deity, Slavic deity, King of the Gods.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Perun
  - id: https://id.wikipedia.org/wiki/Perun
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9A%E3%83%AB%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E9%9C%B9%E9%BE%8D

## Cara menjawab

Kerjakan berurutan mulai dari `bellona`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-071.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
