# Batch batch-065

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-065`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `aurora` — Aurora (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q178831 — deskripsi Wikidata: "goddess of dawn in Roman mythology"; kelas Wikidata: Roman deity, solar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aurora_(mythology)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%A6%E3%83%AD%E3%83%BC%E3%83%A9
  - zh: https://zh.wikipedia.org/wiki/%E5%A5%A5%E7%BD%97%E6%8B%89
  - de: https://de.wikipedia.org/wiki/Aurora_(Mythologie)

### 2. `azrael` — Azrael (task `new`, tier `rich`)
- **Jenis: malaikat** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q490838 — deskripsi Wikidata: "angel in some Abrahamic religions; often identified with the angel of death"; kelas Wikidata: angel in Islam, mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Azrael
  - id: https://id.wikipedia.org/wiki/Azrael
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%BA%E3%83%A9%E3%83%BC%E3%82%A4%E3%83%BC%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E4%BA%9A%E5%85%B9%E6%8B%89%E5%B0%94

### 3. `bes` — Bes (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q188931 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, fertility deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bes
  - id: https://id.wikipedia.org/wiki/Bes_(dewa)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%99%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%B4%9D%E6%96%AF_(%E5%9F%83%E5%8F%8A%E7%A5%9E%E7%A5%87)

### 4. `deva-hinduism` — Deva (Hinduism) (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q211258 — deskripsi Wikidata: "the male form of God"; kelas Wikidata: deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Deva_(Hinduism)
  - id: https://id.wikipedia.org/wiki/Dewa_(Hindu)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%83%B4%E3%82%A1
  - zh: https://zh.wikipedia.org/wiki/%E6%8F%90%E5%A9%86_(%E5%8D%B0%E5%BA%A6%E7%A5%9E%E8%A9%B1)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `deity`, budaya `tradition-hindu`, wilayah "South Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Deva_(Hinduism)
  - Wikipedia (id): https://id.wikipedia.org/wiki/Dewa_(Hindu)

### 5. `hemera` — Hemera (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q192107 — deskripsi Wikidata: "ancient Greek goddess of the day"; kelas Wikidata: Greek deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hemera
  - id: https://id.wikipedia.org/wiki/Hemera
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%BC%E3%83%A1%E3%83%A9%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E5%A2%A8%E6%8B%89

## Cara menjawab

Kerjakan berurutan mulai dari `aurora`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-065.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
