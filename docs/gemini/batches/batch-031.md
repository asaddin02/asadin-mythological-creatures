# Batch batch-031

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-031`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `lakshmi` — Lakshmi (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131443 — deskripsi Wikidata: "Hindu goddess of wealth, love, prosperity"; kelas Wikidata: Devi, wealth deity, love deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Lakshmi
  - id: https://id.wikipedia.org/wiki/Laksmi
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%AF%E3%82%B7%E3%83%A5%E3%83%9F%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%90%89%E7%A5%A5%E5%A4%A9%E5%A5%B3

### 2. `saraswati` — Saraswati (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q58838 — deskripsi Wikidata: "principal Hindu goddess, goddess of knowledge, music and speech"; kelas Wikidata: river god, Devi.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Saraswati
  - id: https://id.wikipedia.org/wiki/Saraswati
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B5%E3%83%A9%E3%82%B9%E3%83%B4%E3%82%A1%E3%83%86%E3%82%A3%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%BE%AF%E6%89%8D%E5%A4%A9%E5%A5%B3

### 3. `osiris` — Osiris (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q46491 — deskripsi Wikidata: "god of the afterlife in Egyptian mythology"; kelas Wikidata: Ancient Egyptian deity, nature deity, dying-and-rising deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Osiris
  - id: https://id.wikipedia.org/wiki/Osiris
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AA%E3%82%B7%E3%83%AA%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%AC%A7%E8%A5%BF%E9%87%8C%E6%96%AF

### 4. `anubis` — Anubis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q47534 — deskripsi Wikidata: "Egyptian deity of mummification and the afterlife, usually depicted as a man with a canine head"; kelas Wikidata: Ancient Egyptian deity, mythical hybrid, death deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Anubis
  - id: https://id.wikipedia.org/wiki/Anubis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%8C%E3%83%93%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E5%8A%AA%E6%AF%94%E6%96%AF

### 5. `deism` — deism (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q620629 — deskripsi Wikidata: "belief in God without revelation"; kelas Wikidata: philosophical movement, cultural movement, religious belief, attributes of God in Christianity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Deism
  - id: https://id.wikipedia.org/wiki/Deisme
  - ja: https://ja.wikipedia.org/wiki/%E7%90%86%E7%A5%9E%E8%AB%96
  - zh: https://zh.wikipedia.org/wiki/%E8%87%AA%E7%84%B6%E7%A5%9E%E8%AE%BA

## Cara menjawab

Kerjakan berurutan mulai dari `lakshmi`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-031.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
