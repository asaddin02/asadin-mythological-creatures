# Batch batch-029

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-029`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `demeter` — Demeter (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q40730 — deskripsi Wikidata: "Greek goddess of the harvest, grains, and agriculture"; kelas Wikidata: Greek deity, agricultural deity, goddess, mythological Greek character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Demeter
  - id: https://id.wikipedia.org/wiki/Demeter
  - ja: https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%83%A1%E3%83%BC%E3%83%86%E3%83%BC%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E5%BE%97%E5%A2%A8%E5%BF%92%E8%80%B3

### 2. `dionysus` — Dionysus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q41680 — deskripsi Wikidata: "ancient Greek god of winemaking and wine"; kelas Wikidata: nature deity, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Dionysus
  - id: https://id.wikipedia.org/wiki/Dionisos
  - ja: https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%A3%E3%82%AA%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%BD%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E7%8B%84%E4%BF%84%E5%80%AA%E7%B4%A2%E6%96%AF

### 3. `mermaid` — Mermaid (task `enrich`, tier `rich`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q182559 — deskripsi Wikidata: "legendary aquatic creature with the upper body of a female human and the fin of a fish".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mermaid
  - id: https://id.wikipedia.org/wiki/Putri_duyung
  - ja: https://ja.wikipedia.org/wiki/%E4%BA%BA%E9%AD%9A
  - zh: https://zh.wikipedia.org/wiki/%E4%BA%BA%E9%AD%9A
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `cross-cultural`, wilayah "Transregional".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Mermaid
  - Wikipedia (id): https://id.wikipedia.org/wiki/Putri_duyung

### 4. `hephaestus` — Hephaestus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q44384 — deskripsi Wikidata: "Greek god of blacksmiths"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hephaestus
  - id: https://id.wikipedia.org/wiki/Hefaistos
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%BC%E3%83%91%E3%82%A4%E3%82%B9%E3%83%88%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E6%B7%AE%E6%96%AF%E6%89%98%E6%96%AF

### 5. `indra` — Indra (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q128335 — deskripsi Wikidata: "Vedic god of rain, weather, storms, and thunder in Hinduism, Buddhism, Jainism, and Eastern religions"; kelas Wikidata: water deity, thunder deity, war deity, Hindu deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Indra
  - id: https://id.wikipedia.org/wiki/Indra
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%83%89%E3%83%A9
  - zh: https://zh.wikipedia.org/wiki/%E5%9B%A0%E9%99%80%E7%BE%85

## Cara menjawab

Kerjakan berurutan mulai dari `demeter`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-029.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
