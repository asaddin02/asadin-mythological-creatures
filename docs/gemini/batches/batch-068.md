# Batch batch-068

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-068`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `freyr` — Freyr (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131474 — deskripsi Wikidata: "Norse god associated with kingship, fertility, peace, prosperity, fair weather, and good harvest"; kelas Wikidata: Norse deity, nature deity, fertility deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Freyr
  - id: https://id.wikipedia.org/wiki/Freyr
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AC%E3%82%A4
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%97%E9%9B%B7

### 2. `heimdall` — Heimdall (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131196 — deskripsi Wikidata: "Watchman of the gods, and the guardian of the gods' stronghold in Norse mythology"; kelas Wikidata: Norse deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Heimdall
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%82%A4%E3%83%A0%E3%83%80%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E6%B5%B7%E5%A7%86%E8%BE%BE%E5%B0%94
  - de: https://de.wikipedia.org/wiki/Heimdall

### 3. `hel` — Hel (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q191589 — deskripsi Wikidata: "goddess of the underworld in Norse mythology"; kelas Wikidata: death deity, Norse deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hel_(mythological_being)
  - id: https://id.wikipedia.org/wiki/Hel
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E5%B0%94_(%E5%8C%97%E6%AC%A7%E7%A5%9E%E8%AF%9D)

### 4. `kraken` — Kraken (task `enrich`, tier `rich`)
- **Jenis: monster** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q193165 — deskripsi Wikidata: "legendary sea monster of large proportions"; kelas Wikidata: sea monster.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Kraken
  - id: https://id.wikipedia.org/wiki/Kraken
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%A9%E3%83%BC%E3%82%B1%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E6%8C%AA%E5%A8%81%E6%B5%B7%E6%80%AA
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `aquatic`, budaya `tradition-scandinavian`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Kraken
  - Wikipedia (id): https://id.wikipedia.org/wiki/Kraken

### 5. `lamia` — Lamia (task `enrich`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q200073 — deskripsi Wikidata: "a female daemon who devoured children, usually described as having the upper body of a woman and lower half of a serpent"; kelas Wikidata: mythological serpent, mythological Greek character, class of fictional entities, folklore character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Lamia
  - id: https://id.wikipedia.org/wiki/Lamia
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%9F%E3%82%A2%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E6%8B%89%E7%B1%B3%E4%BA%9E
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `greek-mythology`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Lamia
  - Wikipedia (id): https://id.wikipedia.org/wiki/Lamia

## Cara menjawab

Kerjakan berurutan mulai dari `freyr`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-068.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
