# Batch batch-069

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-069`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `njord` — Njord (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q193879 — deskripsi Wikidata: "one of the Vanir, a group of gods within Norse mythology"; kelas Wikidata: Norse deity, water deity, fertility deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nj%C3%B6r%C3%B0r
  - id: https://id.wikipedia.org/wiki/Njord
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%A7%E3%83%AB%E3%82%BA
  - zh: https://zh.wikipedia.org/wiki/%E5%B0%BC%E5%A5%A5%E5%B0%94%E5%BE%B7

### 2. `aditi` — Aditi (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q31666 — deskripsi Wikidata: "Mother of the gods in the Vedas"; kelas Wikidata: Devi, Hindu deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aditi
  - id: https://id.wikipedia.org/wiki/Aditi
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%87%E3%82%A3%E3%83%86%E3%82%A3
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E5%BA%95%E6%8F%90

### 3. `argus-panoptes` — Argus Panoptes (task `enrich`, tier `rich`)
- **Jenis: raksasa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q189821 — deskripsi Wikidata: "giant with hundred eyes in Greek mythology"; kelas Wikidata: mythological Greek character, giant.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Argus_Panoptes
  - id: https://id.wikipedia.org/wiki/Argus_Panoptes
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%AB%E3%82%B4%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E8%80%B3%E6%88%88%E6%96%AF_(%E7%99%BE%E7%9C%BC%E5%B7%A8%E4%BA%BA)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `giant`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Argus_Panoptes
  - Wikipedia (id): https://id.wikipedia.org/wiki/Argus_Panoptes

### 4. `death` — Death (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q161936 — deskripsi Wikidata: "personification of death"; kelas Wikidata: mythical creature, stock character, personification.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Personifications_of_death
  - id: https://id.wikipedia.org/wiki/Kematian_(personifikasi)
  - ja: https://ja.wikipedia.org/wiki/%E6%AD%BB%E7%A5%9E
  - zh: https://zh.wikipedia.org/wiki/%E6%AD%BB%E7%A5%9E

### 5. `harmonia-q978079` — Harmonia (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q978079 — deskripsi Wikidata: "ancient Greek goddess of harmony and concord, spouse of Cadmus; her opposite is Eris"; kelas Wikidata: mythological Greek character, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Harmonia
  - id: https://id.wikipedia.org/wiki/Harmonia
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%AB%E3%83%A2%E3%83%8B%E3%82%A2%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%93%88%E8%80%B3%E6%91%A9%E5%B0%BC%E4%BA%9E_(%E5%B8%8C%E8%87%98%E7%A5%9E%E8%A9%B1)

## Cara menjawab

Kerjakan berurutan mulai dari `njord`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-069.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
