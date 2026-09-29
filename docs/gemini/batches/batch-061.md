# Batch batch-061

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-061`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `moirae` — Moirae (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q180287 — deskripsi Wikidata: "personifications of fate in Greek mythology"; kelas Wikidata: triple deity, group of siblings.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Moirai
  - id: https://id.wikipedia.org/wiki/Moirai
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A2%E3%82%A4%E3%83%A9_(%E3%82%AE%E3%83%AA%E3%82%B7%E3%82%A2%E7%A5%9E%E8%A9%B1)
  - zh: https://zh.wikipedia.org/wiki/%E6%91%A9%E4%BC%8A%E8%B5%96

### 2. `radha` — Rādhā (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q113904 — deskripsi Wikidata: "Hindu goddess of love, chief consort of god Krishna"; kelas Wikidata: Devi.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Radha
  - id: https://id.wikipedia.org/wiki/Radha
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%BC%E3%83%80%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%90%9D%E9%99%80

### 3. `thanatos` — Thanatos (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q199647 — deskripsi Wikidata: "personification of death in Greek mythology"; kelas Wikidata: Greek deity, death deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Thanatos
  - id: https://id.wikipedia.org/wiki/Thanatos
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BF%E3%83%8A%E3%83%88%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%A1%91%E7%B4%8D%E6%89%98%E6%96%AF

### 4. `beelzebub` — Beelzebub (task `new`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q202492 — deskripsi Wikidata: "Philistine god, formerly worshipped in Ekron, later adopted in Judaism and Christianity as a demon"; kelas Wikidata: deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Beelzebub
  - id: https://id.wikipedia.org/wiki/Beelzebub
  - ja: https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%AB%E3%82%BC%E3%83%96%E3%83%96
  - zh: https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%8A%9B%E8%A5%BF%E5%8D%9C

### 5. `chiron` — Chiron (task `new`, tier `rich`)
- **Jenis: makhluk campuran** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q183417 — deskripsi Wikidata: "centaur, figure from Greek mythology"; kelas Wikidata: centaur.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Chiron
  - id: https://id.wikipedia.org/wiki/Kheiron
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B1%E3%82%A4%E3%83%AD%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E5%96%80%E6%88%8E

## Cara menjawab

Kerjakan berurutan mulai dari `moirae`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-061.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
