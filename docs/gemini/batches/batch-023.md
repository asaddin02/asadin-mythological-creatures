# Batch batch-023

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-023`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `puaka` — Puaka (task `new`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q12701322 — deskripsi Wikidata: "Ghost in Malaysia"; kelas Wikidata: sprite.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ms: https://ms.wikipedia.org/wiki/Puaka

### 2. `ratchasi` — Ratchasi (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13019535 — deskripsi Wikidata: "Himavanta mythical creature and the symbol of the department or faculty of political science and many administrative agencies in Thailand"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - th: https://th.wikipedia.org/wiki/%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AA%E0%B8%B5%E0%B8%AB%E0%B9%8C

### 3. `santelmo` — Santelmo (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7420120 — deskripsi Wikidata: "creature of Philippine mythology"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Santelmo

### 4. `wd-q13021218` — วิรุณจำบัง (task `new`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13021218 — deskripsi Wikidata: "Thai mythological character from the Ramayana epos"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - th: https://th.wikipedia.org/wiki/%E0%B8%A7%E0%B8%B4%E0%B8%A3%E0%B8%B8%E0%B8%93%E0%B8%88%E0%B8%B3%E0%B8%9A%E0%B8%B1%E0%B8%87

### 5. `white-blood-queen` — White Blood Queen (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q141192216 — deskripsi Wikidata: "mythical creature of Southern Thai folklore"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - th: https://th.wikipedia.org/wiki/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%94%E0%B8%82%E0%B8%B2%E0%B8%A7

## Cara menjawab

Kerjakan berurutan mulai dari `puaka`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-023.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
