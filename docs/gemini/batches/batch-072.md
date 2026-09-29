# Batch batch-072

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-072`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `priapus` — Priapus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q206878 — deskripsi Wikidata: "ancient Greek deity"; kelas Wikidata: mythological Greek character, fertility deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Priapus
  - id: https://id.wikipedia.org/wiki/Priapus
  - ja: https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AA%E3%82%A2%E3%83%BC%E3%83%9D%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%99%AE%E9%87%8C%E9%98%BF%E6%99%AE%E6%96%AF

### 2. `proserpina` — Proserpina (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q14515330 — deskripsi Wikidata: "ancient Roman goddess"; kelas Wikidata: Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Proserpina
  - id: https://id.wikipedia.org/wiki/Proserpine
  - ja: https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%BB%E3%83%AB%E3%83%94%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E6%99%AE%E6%B4%9B%E5%A1%9E%E5%BA%87%E5%A8%9C

### 3. `seraph` — Seraph (task `enrich`, tier `rich`)
- **Jenis: malaikat** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q194077 — deskripsi Wikidata: "type of angel in Judaism and Christianity".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Seraph
  - id: https://id.wikipedia.org/wiki/Serafim
  - ja: https://ja.wikipedia.org/wiki/%E7%86%BE%E5%A4%A9%E4%BD%BF
  - zh: https://zh.wikipedia.org/wiki/%E7%86%BE%E5%A4%A9%E4%BD%BF
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `tradition-biblical`, wilayah "Transregional".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Seraph
  - Wikipedia (id): https://id.wikipedia.org/wiki/Serafim

### 4. `serapis` — Serapis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q214554 — deskripsi Wikidata: "Graeco-Egyptian god"; kelas Wikidata: Ancient Egyptian deity, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Serapis
  - id: https://id.wikipedia.org/wiki/Serapis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%83%A9%E3%83%94%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%A1%9E%E6%8B%89%E6%AF%94%E6%96%AF

### 5. `sol-invictus` — Sol Invictus (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q214494 — deskripsi Wikidata: "Solar deity of the later Roman Empire"; kelas Wikidata: solar deity, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Sol_Invictus
  - id: https://id.wikipedia.org/wiki/Sol_Invictus
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BD%E3%83%BC%E3%83%AB%E3%83%BB%E3%82%A4%E3%83%B3%E3%82%A6%E3%82%A3%E3%82%AF%E3%83%88%E3%82%A5%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%97%A0%E6%95%8C%E8%80%85%E7%B4%A2%E5%B0%94

## Cara menjawab

Kerjakan berurutan mulai dari `priapus`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-072.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
