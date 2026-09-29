# Batch batch-045

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-045`
- Jumlah makhluk: 5
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `nike` — Nike (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q165023 — deskripsi Wikidata: "goddess of victory in Greek mythology"; kelas Wikidata: goddess, Greek deity, allegorical Greek deity, winged deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nike_(mythology)
  - id: https://id.wikipedia.org/wiki/Nike_(mitologi)
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%BC%E3%82%B1%E3%83%BC
  - zh: https://zh.wikipedia.org/wiki/%E5%B0%BC%E5%88%BB

### 2. `valkyrie` — valkyrie (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131087 — deskripsi Wikidata: "one of a host of female figures who decide which soldiers die in battle and which live"; kelas Wikidata: war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Valkyrie
  - id: https://id.wikipedia.org/wiki/Valkyrie
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AF%E3%83%AB%E3%82%AD%E3%83%A5%E3%83%BC%E3%83%AC
  - zh: https://zh.wikipedia.org/wiki/%E5%A5%B3%E6%AD%A6%E7%A5%9E

### 3. `frigg` — Frigg (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q131654 — deskripsi Wikidata: "Norse deity"; kelas Wikidata: Norse deity, goddess.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Frigg
  - id: https://id.wikipedia.org/wiki/Frigg
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AA%E3%83%83%E3%82%B0
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%97%E4%B8%BD%E5%98%89

### 4. `adonis` — Adonis (task `new`, tier `rich`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q163920 — deskripsi Wikidata: "Greek god of beauty and desire"; kelas Wikidata: Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Adonis
  - id: https://id.wikipedia.org/wiki/Adonis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%89%E3%83%BC%E3%83%8B%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E5%A4%9A%E5%B0%BC%E6%96%AF

### 5. `baba-yaga-q187002` — Baba Yaga (task `new`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q187002 — deskripsi Wikidata: "mythological figure, fantasy character, witch"; kelas Wikidata: mythic humanoid.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Baba_Yaga
  - id: https://id.wikipedia.org/wiki/Baba_Yaga
  - ja: https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%BC%E3%83%90%E3%83%BB%E3%83%A4%E3%83%BC%E3%82%AC
  - zh: https://zh.wikipedia.org/wiki/%E8%8A%AD%E8%8A%AD%E9%9B%85%E5%98%8E

## Cara menjawab

Kerjakan berurutan mulai dari `nike`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-045.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
