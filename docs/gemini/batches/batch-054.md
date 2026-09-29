# Batch batch-054

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-054`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `iblis` — Iblis (task `enrich`, tier `rich`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q273101 — deskripsi Wikidata: "devil-like figure in Quran and Islamic tradition"; kelas Wikidata: jinn.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Iblis
  - id: https://id.wikipedia.org/wiki/Iblis_dalam_Islam
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%96%E3%83%AA%E3%83%BC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E4%BC%8A%E5%B8%83%E5%8A%9B%E6%96%AF
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `tradition-arabian`, wilayah "Middle East".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Iblis
  - Wikipedia (id): https://id.wikipedia.org/wiki/Iblis_dalam_Islam

### 2. `mut` — Mut (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q29409 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Mut
  - id: https://id.wikipedia.org/wiki/Mut
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A0%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E5%A7%86%E7%89%B9

### 3. `phoebe` — Phoebe (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q183281 — deskripsi Wikidata: "titaness in Greek mythology"; kelas Wikidata: titan.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Phoebe_(Titaness)
  - id: https://id.wikipedia.org/wiki/Foibe
  - ja: https://ja.wikipedia.org/wiki/%E3%83%9D%E3%82%A4%E3%83%99%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E7%A6%8F%E6%9F%8F

### 4. `sekhmet` — Sekhmet (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q146104 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Sekhmet
  - id: https://id.wikipedia.org/wiki/Sekhmet
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%82%AF%E3%83%A1%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E5%A1%9E%E8%B5%AB%E9%BA%A6%E7%89%B9

### 5. `flying-spaghetti-monster` — Flying Spaghetti Monster (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q12044 — deskripsi Wikidata: "chief deity of Pastafarianism"; kelas Wikidata: God.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Flying_Spaghetti_Monster
  - id: https://id.wikipedia.org/wiki/Monster_Spageti_Terbang
  - ja: https://ja.wikipedia.org/wiki/%E7%A9%BA%E9%A3%9B%E3%81%B6%E3%82%B9%E3%83%91%E3%82%B2%E3%83%83%E3%83%86%E3%82%A3%E3%83%BB%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E9%A3%9E%E8%A1%8C%E9%9D%A2%E6%9D%A1%E6%80%AA%E7%89%A9

## Cara menjawab

Kerjakan berurutan mulai dari `iblis`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-054.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
