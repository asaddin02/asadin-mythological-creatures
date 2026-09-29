# Batch batch-063

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-063`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `chupacabra` — Chupacabra (task `enrich`, tier `rich`)
- **Jenis: kriptid** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q183571 — deskripsi Wikidata: "legendary creature; first purported sighting in Puerto Rico"; kelas Wikidata: cryptid, mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Chupacabra
  - id: https://id.wikipedia.org/wiki/Chupacabra
  - ja: https://ja.wikipedia.org/wiki/%E3%83%81%E3%83%A5%E3%83%91%E3%82%AB%E3%83%96%E3%83%A9
  - zh: https://zh.wikipedia.org/wiki/%E5%8D%93%E6%9F%8F%E5%8D%A1%E5%B8%83%E6%8B%89
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `tradition-american`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Chupacabra
  - Wikipedia (id): https://id.wikipedia.org/wiki/Chupacabra

### 2. `fortuna` — Fortuna (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4654 — deskripsi Wikidata: "Roman goddess of fortune"; kelas Wikidata: Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Fortuna
  - id: https://id.wikipedia.org/wiki/Fortuna
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A5%E3%83%BC%E3%83%8A
  - zh: https://zh.wikipedia.org/wiki/%E7%A6%8F%E5%B0%94%E5%9B%BE%E5%A8%9C

### 3. `jormungandr-q181227` — Jörmungandr (task `new`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q181227 — deskripsi Wikidata: "World Serpent in Norse mythology"; kelas Wikidata: mythological serpent, Norse mythical animal, eschatological figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/J%C3%B6rmungandr
  - id: https://id.wikipedia.org/wiki/J%C3%B6rmungandr
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A8%E3%83%AB%E3%83%A0%E3%83%B3%E3%82%AC%E3%83%B3%E3%83%89
  - zh: https://zh.wikipedia.org/wiki/%E8%80%B6%E5%A4%A2%E5%8A%A0%E5%BE%97

### 4. `khepri` — Khepri (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q215940 — deskripsi Wikidata: "Egyptian deity of the rising sun"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Khepri
  - id: https://id.wikipedia.org/wiki/Khepri
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B1%E3%83%97%E3%83%AA
  - zh: https://zh.wikipedia.org/wiki/%E5%87%B1%E5%B8%83%E5%88%A9

### 5. `metis` — Metis (task `new`, tier `rich`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q190565 — deskripsi Wikidata: "Oceanid of Greek mythology, goddess of wisdom, daughter of Oceanid and Tethys"; kelas Wikidata: Oceanids, water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Metis_(mythology)
  - id: https://id.wikipedia.org/wiki/Metis_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%BC%E3%83%86%E3%82%A3%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%A2%A8%E6%8F%90%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `chupacabra`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-063.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
