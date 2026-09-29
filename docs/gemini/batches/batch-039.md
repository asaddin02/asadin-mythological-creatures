# Batch batch-039

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-039`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `minotaur-q129866` — Minotaur (task `new`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q129866 — deskripsi Wikidata: "creature of Greek mythology with the head and tail of a bull and the body of a man"; kelas Wikidata: mythical human-animal hybrid, mythological Greek character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Minotaur
  - id: https://id.wikipedia.org/wiki/Minotauros
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9F%E3%83%BC%E3%83%8E%E3%83%BC%E3%82%BF%E3%82%A6%E3%83%AD%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%A5%E8%AF%BA%E9%99%B6%E6%B4%9B%E6%96%AF

### 2. `nymph` — Nymph (task `enrich`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q373916 — deskripsi Wikidata: "minor female nature deity in Greek and Roman mythology; personifications of nature".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nymph
  - id: https://id.wikipedia.org/wiki/Nimfa
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%B3%E3%83%95
  - zh: https://zh.wikipedia.org/wiki/%E5%AE%81%E8%8A%99
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `fairy`, budaya `cross-cultural`, wilayah "Transregional".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Nymph
  - Wikipedia (id): https://id.wikipedia.org/wiki/Nimfa

### 3. `rhea` — Rhea (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q108419 — deskripsi Wikidata: "female Titan in Greek mythology, mother of Zeus and mother of Hera"; kelas Wikidata: titan, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Rhea_(mythology)
  - id: https://id.wikipedia.org/wiki/Rea_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AC%E3%82%A2%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E7%91%9E%E4%BA%9A

### 4. `vulcan` — Vulcan (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4640 — deskripsi Wikidata: "god of both beneficial and hindering fire"; kelas Wikidata: Roman deity, god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Vulcan_(mythology)
  - id: https://id.wikipedia.org/wiki/Vulkanus
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A5%E3%83%AB%E3%82%AB%E3%83%BC%E3%83%8C%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E6%AD%A6%E5%B0%94%E5%9D%8E%E5%8A%AA%E6%96%AF

### 5. `garuda-q188676` — Garuda (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q188676 — deskripsi Wikidata: "eagle-like divine bird in Hinduism, Buddhism and Jainism"; kelas Wikidata: legendary bird, Hindu deity, Characters in the Ramayana.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Garuda
  - id: https://id.wikipedia.org/wiki/Garuda
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AC%E3%83%AB%E3%83%80
  - zh: https://zh.wikipedia.org/wiki/%E8%BF%A6%E6%A5%BC%E7%BD%97

## Cara menjawab

Kerjakan berurutan mulai dari `minotaur-q129866`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-039.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
