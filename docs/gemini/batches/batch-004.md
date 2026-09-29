# Batch batch-004

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-004`
- Jumlah makhluk: 5
- `task` `rewrite`: Entri lama berisi teks template dan sumber yang belum terverifikasi. Tulis ulang dari nol berdasarkan riset baru; isi entri lama hanya petunjuk pencarian.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `minotaur` — Minotaur (task `rewrite`, tier `rich`)
- **Jenis: monster** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `monster`, budaya `greek-mythology`, wilayah "Europe".
- Nama lain di entri lama (belum terverifikasi): Asterion, Bull of Minos.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Castleden, R., 1990 — "The Minoan Labyrinth and the Minotaur in Greek Myth" (https://www.cambridge.org)
- Gambar lama `File:Tondo Minotaur London E4 MAN.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 2. `oni` — Oni (task `rewrite`, tier `rich`)
- **Jenis: monster** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `monster`, budaya `japanese-folklore`, wilayah "East Asia".
- Nama lain di entri lama (belum terverifikasi): Kishin, Raksasa Jepang.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Reider, N.T., 2010 — "Oni: The History and Iconography of Japanese Demons" (https://upcolorado.com)
- Gambar lama `File:Kobo Daishi Practicing the Tantra, with Demon and Wolf, by Hokusai.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 3. `quetzalcoatl` — Quetzalcoatl (task `rewrite`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `deity`, budaya `mesoamerican-traditions`, wilayah "Central America".
- Nama lain di entri lama (belum terverifikasi): Kukulkan, Feathered Serpent.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Florescano, E., 1999 — "The Myth of Quetzalcoatl: Religion, Rulership, and History in Mesoamerica" (https://www.oupress.com)

### 4. `barong-q204753` — Barong (task `new`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q204753 — deskripsi Wikidata: "Indonesian lion-like creature and character in the mythology of Java and Bali"; kelas Wikidata: mythical creature, mythical character.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Barong_(mythology)
  - id: https://id.wikipedia.org/wiki/Barongan_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%AD%E3%83%B3_(%E8%81%96%E7%8D%A3)
  - zh: https://zh.wikipedia.org/wiki/%E5%B7%B4%E9%9A%86_(%E7%A5%9E%E8%A9%B1)

### 5. `krasue` — Krasue (task `enrich`, tier `rich`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q2684311 — deskripsi Wikidata: "a class/type of restless spirit in Southeast Asian mythology"; kelas Wikidata: ghost, class of fictional entities.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Krasue
  - id: https://id.wikipedia.org/wiki/Kuyang
  - ja: https://ja.wikipedia.org/wiki/%E3%83%94%E3%83%BC%E3%83%BB%E3%82%AC%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%A3%9B%E9%A0%AD%E5%A5%B3%E9%AC%BC
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `tradition-southeast-asian`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Krasue
  - Wikipedia (id): https://id.wikipedia.org/wiki/Kuyang

## Cara menjawab

Kerjakan berurutan mulai dari `minotaur`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-004.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
