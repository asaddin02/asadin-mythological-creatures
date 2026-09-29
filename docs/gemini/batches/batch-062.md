# Batch batch-062

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-062`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `cybele` — Cybele (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q188236 — deskripsi Wikidata: "Anatolian mother goddess"; kelas Wikidata: Greek deity, goddess, Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Cybele
  - id: https://id.wikipedia.org/wiki/Kibele
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%A5%E3%83%99%E3%83%AC%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%BA%93%E6%9F%8F%E5%8B%92

### 2. `dwarf-folklore` — Dwarf (folklore) (task `enrich`, tier `rich`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q214045 — deskripsi Wikidata: "supernatural being in Germanic folklore"; kelas Wikidata: mythical humanoid race, mythical people.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Dwarf_(folklore)
  - id: https://id.wikipedia.org/wiki/Kurcaci
  - ja: https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%AF%E3%83%BC%E3%83%95
  - zh: https://zh.wikipedia.org/wiki/%E7%9F%AE%E4%BA%BA
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-english`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Dwarf_(folklore)
  - Wikipedia (id): https://id.wikipedia.org/wiki/Kurcaci

### 3. `hercules` — Hercules (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q240679 — deskripsi Wikidata: "Roman adaptation of the Greek divine hero Heracles"; kelas Wikidata: Roman deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hercules
  - id: https://id.wikipedia.org/wiki/Herkules
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E4%B8%98%E5%88%A9
  - es: https://es.wikipedia.org/wiki/H%C3%A9rcules

### 4. `nemean-lion` — Nemean lion (task `enrich`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q199438 — deskripsi Wikidata: "the lion killed by Hercules"; kelas Wikidata: mythological Greek character, artistic theme, mythical animal, fictional lion.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nemean_lion
  - id: https://id.wikipedia.org/wiki/Singa_Nemea
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%A1%E3%82%A2%E3%83%BC%E3%81%AE%E7%8D%85%E5%AD%90
  - zh: https://zh.wikipedia.org/wiki/%E6%B6%85%E5%A2%A8%E4%BA%9A%E7%8B%AE%E5%AD%90
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `monster`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Nemean_lion
  - Wikipedia (id): https://id.wikipedia.org/wiki/Singa_Nemea

### 5. `calypso` — Calypso (task `new`, tier `rich`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q48961 — deskripsi Wikidata: "Oceanid of Greek mythology"; kelas Wikidata: Oceanids, Greek nymph.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Calypso_(mythology)
  - id: https://id.wikipedia.org/wiki/Kalipso
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%AA%E3%83%A5%E3%83%97%E3%82%BD%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%8D%A1%E5%90%95%E6%99%AE%E7%B4%A2

## Cara menjawab

Kerjakan berurutan mulai dari `cybele`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-062.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
