# Batch batch-046

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-046`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `bigfoot` — Bigfoot (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q44810 — deskripsi Wikidata: "large and hairy ape-like mythical creature purported to inhabit forests in North America".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bigfoot
  - id: https://id.wikipedia.org/wiki/Bigfoot
  - ja: https://ja.wikipedia.org/wiki/%E3%83%93%E3%83%83%E3%82%B0%E3%83%95%E3%83%83%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E5%A4%A7%E8%85%B3%E6%80%AA
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `cryptid`, budaya `tradition-american`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Bigfoot
  - Wikipedia (id): https://id.wikipedia.org/wiki/Bigfoot

### 2. `hecate` — Hecate (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131575 — deskripsi Wikidata: "Greek goddess"; kelas Wikidata: goddess, Greek deity, lunar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hecate
  - id: https://id.wikipedia.org/wiki/Hekate
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%82%AB%E3%83%86%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E5%8D%A1%E5%BF%92

### 3. `janus` — Janus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q167685 — deskripsi Wikidata: "Roman deity"; kelas Wikidata: Roman deity, liminal deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Janus
  - id: https://id.wikipedia.org/wiki/Yanus
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A4%E3%83%BC%E3%83%8C%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%9B%85%E5%8A%AA%E6%96%AF

### 4. `mnemosyne` — Mnemosyne (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q102884 — deskripsi Wikidata: "personification of memory in Greek mythology, mother of the nine muses"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mnemosyne
  - id: https://id.wikipedia.org/wiki/Mnemosine
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A0%E3%83%8D%E3%83%BC%E3%83%A2%E3%82%B7%E3%83%A5%E3%83%8D%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%B0%9F%E6%B6%85%E6%91%A9%E5%8F%99%E6%B6%85

### 5. `sobek` — Sobek (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q146313 — deskripsi Wikidata: "Egyptian crocodile deity"; kelas Wikidata: water deity, Ancient Egyptian deity, deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Sobek
  - id: https://id.wikipedia.org/wiki/Sobek
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%83%99%E3%82%AF
  - zh: https://zh.wikipedia.org/wiki/%E7%B4%A2%E8%B2%9D%E5%85%8B

## Cara menjawab

Kerjakan berurutan mulai dari `bigfoot`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-046.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
