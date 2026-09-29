# Batch batch-022

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-022`
- Jumlah makhluk: 5
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `hemaraja` — Hemaraja (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q18357776 — deskripsi Wikidata: "Creature in Thai mythology".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hemaraja
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Hemaraja

### 2. `khwai-phueak-khao-kaeo` — Khwai Phueak Khao Kaeo (task `enrich`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q141591898.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Khwai_Phueak_Khao_Kaeo
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-thai`, wilayah "Southeast Asia".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Khwai_Phueak_Khao_Kaeo

### 3. `mom` — Mom (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q13018858 — deskripsi Wikidata: "mythical creature of Northern Thai folklore"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - th: https://th.wikipedia.org/wiki/%E0%B8%A1%E0%B8%AD%E0%B8%A1_(%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C)

### 4. `nenek-kebayan` — Nenek kebayan (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q137392506 — deskripsi Wikidata: "Malay mythical creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ms: https://ms.wikipedia.org/wiki/Nenek_kebayan

### 5. `pane-nabolon` — Pane Nabolon (task `new`, tier `rich`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q19730154 — deskripsi Wikidata: "Batak mythical being"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - id: https://id.wikipedia.org/wiki/Pane_Nabolon

## Cara menjawab

Kerjakan berurutan mulai dari `hemaraja`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-022.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
