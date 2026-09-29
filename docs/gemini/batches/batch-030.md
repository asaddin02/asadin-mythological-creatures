# Batch batch-030

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-030`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `odin` — Odin (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q43610 — deskripsi Wikidata: "widely attested deity in Norse mythology"; kelas Wikidata: Norse deity, war deity, King of the Gods.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Odin
  - id: https://id.wikipedia.org/wiki/Odin
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E5%A5%A5%E4%B8%81

### 2. `ra-q1252904` — Ra (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1252904 — deskripsi Wikidata: "ancient Egyptian solar deity"; kelas Wikidata: Ancient Egyptian deity, solar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Ra
  - id: https://id.wikipedia.org/wiki/Ra_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E6%8B%89

### 3. `hestia` — Hestia (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q41419 — deskripsi Wikidata: "Greek goddess of the hearth and the home"; kelas Wikidata: Greek deity, household deity, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hestia
  - id: https://id.wikipedia.org/wiki/Hestia
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%82%B9%E3%83%86%E3%82%A3%E3%82%A2%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E6%96%AF%E6%8F%90%E4%BA%9E

### 4. `isis` — Isis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q79876 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Isis
  - id: https://id.wikipedia.org/wiki/Isis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%82%B7%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%8A%E8%A5%BF%E6%96%AF

### 5. `kali` — Kali (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q132127 — deskripsi Wikidata: "Hindu goddess associated with death and destruction, in the 21st century adopted as symbol of feminine empowerment"; kelas Wikidata: goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Kali
  - id: https://id.wikipedia.org/wiki/Kali_(dewi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%BC%E3%83%AA%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E6%97%B6%E6%AF%8D

## Cara menjawab

Kerjakan berurutan mulai dari `odin`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-030.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
