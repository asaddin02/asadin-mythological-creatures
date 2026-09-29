# Batch batch-315

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-315`
- Jumlah makhluk: 10
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.

## Daftar makhluk

### 1. `fetch-folklore` — Fetch (folklore) (task `enrich`, tier `core`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5445927 — deskripsi Wikidata: "a supernatural double or an apparition of a living person in Irish folklore".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Fetch_(folklore)
  - es: https://es.wikipedia.org/wiki/Fetch_(folclore)
  - fy: https://fy.wikipedia.org/wiki/Fetch_(mytysk_w%C3%AAzen)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `tradition-irish`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Fetch_(folklore)

### 2. `fext` — Fext (task `enrich`, tier `core`)
- **Jenis: hantu** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5446118 — deskripsi Wikidata: "mythical undead creature in Slavic mythology".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Fext
  - cs: https://cs.wikipedia.org/wiki/Fext
  - uk: https://uk.wikipedia.org/wiki/%D0%A4%D0%B5%D0%BA%D1%81%D1%82
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `undead`, budaya `slavic-folklore`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Fext

### 3. `finnbhennach` — Finnbhennach (task `new`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q3525267 — deskripsi Wikidata: "stud bull owned by king Ailill of Connacht in Irish mythology"; kelas Wikidata: mythological bull.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Finnbhennach
  - cy: https://cy.wikipedia.org/wiki/Finnbhennach
  - ga: https://ga.wikipedia.org/wiki/Fionnbheannach

### 4. `firefox-mythology` — Firefox (mythology) (task `enrich`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q25451374 — deskripsi Wikidata: "Finnish mythical creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Firefox_(mythology)
  - fi: https://fi.wikipedia.org/wiki/Tulikettu
  - lt: https://lt.wikipedia.org/wiki/Ugnin%C4%97_lap%C4%97
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-finnish`, wilayah "Europe".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Firefox_(mythology)

### 5. `flathead-lake-monster` — Flathead Lake Monster (task `enrich`, tier `core`)
- **Jenis: kriptid** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4300415 — deskripsi Wikidata: "mythical lake monster within Montana folklore"; kelas Wikidata: lake monster.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Flathead_Lake_Monster
  - ja: https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%A9%E3%83%83%E3%83%88%E3%83%98%E3%83%83%E3%83%89%E6%B9%96%E3%81%AE%E6%80%AA%E7%89%A9
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%97%E6%8B%89%E7%89%B9%E9%BB%91%E5%BE%B7%E6%B9%96%E6%B0%B4%E6%80%AA
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `aquatic`, budaya `tradition-american`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Flathead_Lake_Monster

### 6. `flying-head` — Flying Head (task `enrich`, tier `core`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5463434 — deskripsi Wikidata: "Mythological spirit".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Flying_Head
  - it: https://it.wikipedia.org/wiki/Testa_Volante
  - hr: https://hr.wikipedia.org/wiki/Kunenhrayenhnenh
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `demon`, budaya `tradition-iroquois`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Flying_Head

### 7. `fresno-nightcrawler` — Fresno nightcrawler (task `enrich`, tier `core`)
- **Jenis: kriptid** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q56276195 — deskripsi Wikidata: "cryptid from Fresno, California".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Fresno_nightcrawler
  - zh: https://zh.wikipedia.org/wiki/%E5%BC%97%E9%9B%B7%E6%96%AF%E8%AF%BA%E5%A4%9C%E8%A1%8C%E8%80%85
  - vi: https://vi.wikipedia.org/wiki/Ng%C6%B0%E1%BB%9Di_ngo%C3%A0i_h%C3%A0nh_tinh_Fresno
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `cryptid`, budaya `tradition-american`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Fresno_nightcrawler

### 8. `gabuthelon` — Gabuthelon (task `new`, tier `core`)
- **Jenis: malaikat** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5516142 — deskripsi Wikidata: "angel mentioned in the Greek Apocalypse of Ezra"; kelas Wikidata: angels in Christianity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Gabuthelon
  - zh: https://zh.wikipedia.org/wiki/%E5%8A%A0%E5%B8%83%E6%BE%A4%E9%9A%86
  - pt: https://pt.wikipedia.org/wiki/Gabutel%C3%A3o

### 9. `gallinipper-mythology` — Gallinipper (mythology) (task `enrich`, tier `core`)
- **Jenis: kriptid** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q98834378 — deskripsi Wikidata: "a cryptid in the African American folk tradition".
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Gallinipper_(mythology)
  - es: https://es.wikipedia.org/wiki/Gallinipper_(mitolog%C3%ADa)
  - bn: https://bn.wikipedia.org/wiki/%E0%A6%97%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%A8%E0%A6%BF%E0%A6%AA%E0%A6%BE%E0%A6%B0_(%E0%A6%AA%E0%A7%81%E0%A6%B0%E0%A6%BE%E0%A6%A3)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `tradition-american`, wilayah "North America".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Gallinipper_(mythology)

### 10. `gangi-kozo` — Gangi-kozō (task `new`, tier `core`)
- **Jenis: yokai** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q11475953 — kelas Wikidata: yōkai.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ja: https://ja.wikipedia.org/wiki/%E5%B2%B8%E6%B6%AF%E5%B0%8F%E5%83%A7
  - de: https://de.wikipedia.org/wiki/Gangi-koz%C5%8D
  - fr: https://fr.wikipedia.org/wiki/Gangi_kozo

## Cara menjawab

Kerjakan berurutan mulai dari `fetch-folklore`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-315.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
