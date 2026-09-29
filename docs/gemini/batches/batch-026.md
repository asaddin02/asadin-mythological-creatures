# Batch batch-026

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-026`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `trimurti` — Trimurti (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q9595 — deskripsi Wikidata: "trinity of supreme divinity in Hinduism, in which the cosmic functions of creation, preservation, and destruction are personified as a triad of deities"; kelas Wikidata: triple deity, monad, triad.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Trimurti
  - id: https://id.wikipedia.org/wiki/Trimurti
  - ja: https://ja.wikipedia.org/wiki/%E4%B8%89%E7%A5%9E%E4%B8%80%E4%BD%93
  - zh: https://zh.wikipedia.org/wiki/%E4%B8%89%E7%9B%B8%E7%A5%9E

### 2. `gabriel` — Gabriel (task `new`, tier `rich`)
- **Jenis: malaikat** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q81989 — deskripsi Wikidata: "angel in Abrahamic religions"; kelas Wikidata: angel in Islam, angel in Judaism, archangel, angels in Christianity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Gabriel
  - id: https://id.wikipedia.org/wiki/Gabriel
  - ja: https://ja.wikipedia.org/wiki/%E3%82%AC%E3%83%96%E3%83%AA%E3%82%A8%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E5%8A%A0%E7%99%BE%E5%88%97

### 3. `satan` — Satan (task `enrich`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q35230 — deskripsi Wikidata: "entity in the Abrahamic religions that tells others to do sinful actions"; kelas Wikidata: fallen angel, supernatural being, devil, jinn.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Satan
  - id: https://id.wikipedia.org/wiki/Setan
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B5%E3%82%BF%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E6%92%92%E4%BD%86
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `tradition-arabian`, wilayah "Middle East".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Satan
  - Wikipedia (id): https://id.wikipedia.org/wiki/Setan

### 4. `hera` — Hera (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q38012 — deskripsi Wikidata: "Greek goddess, wife and sister of Zeus"; kelas Wikidata: Greek deity, fertility deity, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hera
  - id: https://id.wikipedia.org/wiki/Hera
  - ja: https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%BC%E3%83%A9%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E6%8B%89

### 5. `poseidon` — Poseidon (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q41127 — deskripsi Wikidata: "one of the twelve Olympians presiding over the sea, storms, earthquakes and horses"; kelas Wikidata: water deity, Greek deity, Olympian god.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Poseidon
  - id: https://id.wikipedia.org/wiki/Poseidon
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9D%E3%82%BB%E3%82%A4%E3%83%89%E3%83%BC%E3%83%B3
  - zh: https://zh.wikipedia.org/wiki/%E6%B3%A2%E5%A1%9E%E5%86%AC

## Cara menjawab

Kerjakan berurutan mulai dari `trimurti`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-026.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
