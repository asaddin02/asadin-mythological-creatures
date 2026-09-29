# Batch batch-024

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-024`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `shiva` — Shiva (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11378 — deskripsi Wikidata: "Hindu deity"; kelas Wikidata: god, Hindu deity, legendary figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Shiva
  - id: https://id.wikipedia.org/wiki/Siwa
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%B4%E3%82%A1
  - zh: https://zh.wikipedia.org/wiki/%E6%B9%BF%E5%A9%86

### 2. `zeus` — Zeus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q34201 — deskripsi Wikidata: "Greek god of the sky and king of the gods"; kelas Wikidata: thunder deity, Greek deity, King of the Gods, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Zeus
  - id: https://id.wikipedia.org/wiki/Zeus
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BC%E3%82%A6%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%AE%99%E6%96%AF

### 3. `dragon` — dragon (task `new`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7559 — deskripsi Wikidata: "legendary winged, fire-breathing reptile"; kelas Wikidata: mythical animal.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Dragon
  - id: https://id.wikipedia.org/wiki/Naga
  - ja: https://ja.wikipedia.org/wiki/%E7%AB%9C
  - zh: https://zh.wikipedia.org/wiki/%E9%BE%8D%E5%BD%A2%E5%82%B3%E8%AA%AA%E7%94%9F%E7%89%A9

### 4. `vishnu` — Vishnu (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11380 — deskripsi Wikidata: "Hindu deity"; kelas Wikidata: Hindu deity, legendary figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Vishnu
  - id: https://id.wikipedia.org/wiki/Wisnu
  - ja: https://ja.wikipedia.org/wiki/%E3%83%B4%E3%82%A3%E3%82%B7%E3%83%A5%E3%83%8C
  - zh: https://zh.wikipedia.org/wiki/%E6%AF%97%E6%B9%BF%E5%A5%B4

### 5. `krishna` — Krishna (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q42891 — deskripsi Wikidata: "Hindu deity"; kelas Wikidata: Hindu deity, legendary figure, character in the Mahabharata, human whose existence is disputed.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Krishna
  - id: https://id.wikipedia.org/wiki/Kresna
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AA%E3%82%B7%E3%83%A5%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E9%BB%91%E5%A4%A9

## Cara menjawab

Kerjakan berurutan mulai dari `shiva`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-024.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
