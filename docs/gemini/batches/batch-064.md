# Batch batch-064

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-064`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `mitra` — Mitra (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q6497135 — deskripsi Wikidata: "Indo-Iranian divinity, later worshipped as the Zoroastrian Mithra and the Roman mystery god Mithras"; kelas Wikidata: god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mitra
  - id: https://id.wikipedia.org/wiki/Mithra
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9F%E3%82%B9%E3%83%A9
  - zh: https://zh.wikipedia.org/wiki/%E5%AF%86%E7%89%B9%E6%8B%89

### 2. `naga` — Nāga (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q271990 — deskripsi Wikidata: "deity or class of entity or being, taking the form of a very great snake"; kelas Wikidata: class of fictional entities.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/N%C4%81ga
  - id: https://id.wikipedia.org/wiki/Naga_(mitologi_India)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8A%E3%83%BC%E3%82%AC
  - zh: https://zh.wikipedia.org/wiki/%E9%82%A3%E4%BC%BD
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `tradition-hindu`, wilayah "South Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/N%C4%81ga
  - Wikipedia (id): https://id.wikipedia.org/wiki/Naga_(mitologi_India)

### 3. `sin` — Sin (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q217420 — deskripsi Wikidata: "Mesopotamian lunar god"; kelas Wikidata: lunar deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Sin_(mythology)
  - id: https://id.wikipedia.org/wiki/Sin_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%B3_(%E3%83%A1%E3%82%BD%E3%83%9D%E3%82%BF%E3%83%9F%E3%82%A2%E7%A5%9E%E8%A9%B1)
  - zh: https://zh.wikipedia.org/wiki/%E8%BE%9B_(%E7%A5%9E%E8%AF%9D)

### 4. `tefnut` — Tefnut (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q116273 — deskripsi Wikidata: "deity of moisture, moist air, dew and rain in Ancient Egyptian religion"; kelas Wikidata: water deity, Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Tefnut
  - id: https://id.wikipedia.org/wiki/Tefnut
  - ja: https://ja.wikipedia.org/wiki/%E3%83%86%E3%83%95%E3%83%8C%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E6%B3%B0%E8%8A%99%E5%8A%AA%E7%89%B9

### 5. `apis` — Apis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q208150 — deskripsi Wikidata: "sacred bull in Egyptian mythology"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Apis_(deity)
  - id: https://id.wikipedia.org/wiki/Apis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%94%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E5%8C%B9%E6%96%AF

## Cara menjawab

Kerjakan berurutan mulai dari `mitra`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-064.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
