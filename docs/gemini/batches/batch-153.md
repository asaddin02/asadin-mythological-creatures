# Batch batch-153 — Tambahan manual (makhluk yang terlewat worklist)

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-153`
- Jumlah makhluk: 2
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `ryomen-sukuna` — Ryōmen Sukuna (task `new`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11362694 — deskripsi Wikidata: "character described at Nihon Shoki"; kelas Wikidata: legendary figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ja: https://ja.wikipedia.org/wiki/%E4%B8%A1%E9%9D%A2%E5%AE%BF%E5%84%BA
  - zh: https://zh.wikipedia.org/wiki/%E5%85%A9%E9%9D%A2%E5%AE%BF%E5%84%BA
  - ro: https://ro.wikipedia.org/wiki/Ry%C5%8Dmen_Sukuna
  - hy: https://hy.wikipedia.org/wiki/%D5%8C%D5%B5%D5%B8%D5%B4%D5%A5%D5%B6_%D5%8D%D5%B8%D6%82%D5%AF%D5%B8%D6%82%D5%B6%D5%A1
- Catatan: Makhluk dari Nihon Shoki (両面宿儺), bukan tokoh Jujutsu Kaisen. Item Wikidata Q105037685 dan artikel tentang anime/manga Jujutsu Kaisen bukan sumber tradisi; Jujutsu Kaisen hanya boleh masuk ke modern_depictions dengan sumbernya sendiri. Ditambahkan manual 2026-10-03 (kelas Wikidata 'legendary figure' tidak tercakup worklist).

### 2. `istervo` — Istervo (task `new`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11865257 — deskripsi Wikidata: "Finnish legendary creature"; kelas Wikidata: legendary figure.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - fi: https://fi.wikipedia.org/wiki/Istervo
- Catatan: Ditambahkan manual 2026-10-03 (kelas Wikidata 'legendary figure' tidak tercakup worklist).

## Cara menjawab

Kerjakan berurutan mulai dari `ryomen-sukuna`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-153.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
