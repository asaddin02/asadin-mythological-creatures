# Batch batch-078 — Mesir kuno (2/2)

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-078`
- Jumlah makhluk: 36
- `task` `new`: Makhluk ini belum ada di Mythics. Identitasnya diambil dari Wikidata dan punya minimal satu artikel Wikipedia. Pastikan dulu bahwa ini memang makhluk mitologi, cerita rakyat, atau agama tradisional (§12); kalau bukan, kirim entri skip.
- `task` `enrich`: Entri sekarang hanya berisi ringkasan pengantar dari Wikipedia. Tulis entri lengkap berdasarkan riset baru; sumber Wikipedia yang ditandai "terverifikasi" boleh dipakai, dengan kutipan dari halamannya.

## Daftar makhluk

### 1. `meretseger` — Meretseger (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q846288 — deskripsi Wikidata: "cobra-goddess in ancient Egyptian religion"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Meretseger
  - id: https://id.wikipedia.org/wiki/Meretseger
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%AB%E3%82%BB%E3%82%B2%E3%83%AB
  - zh: https://zh.wikipedia.org/wiki/%E9%BA%A6%E9%87%8C%E7%89%B9%E5%A1%9E%E7%9B%96%E5%B0%94

### 2. `aker-q417407` — Aker (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q417407 — deskripsi Wikidata: "Egyptian deity of the eastern and western horizons and an earth and underworld god"; kelas Wikidata: Ancient Egyptian deity, earth deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aker_(deity)
  - zh: https://zh.wikipedia.org/wiki/%E9%98%BF%E5%85%8B%E5%B0%94
  - de: https://de.wikipedia.org/wiki/Aker_(%C3%A4gyptische_Mythologie)
  - fr: https://fr.wikipedia.org/wiki/Aker
- Catatan: Ada makhluk lain bernama sama di daftar kerja: `aker`. Teliti hanya makhluk yang sesuai Wikidata Q417407, dan tulis `canonical_name` dengan pembeda singkat dalam kurung yang didukung sumber, misalnya "Aker (…)".

### 3. `bennu` — Bennu (task `enrich`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q818378 — deskripsi Wikidata: "heron-like deity of Ancient Egyptian mythology"; kelas Wikidata: deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bennu
  - ja: https://ja.wikipedia.org/wiki/%E3%83%99%E3%83%B3%E3%83%8C
  - zh: https://zh.wikipedia.org/wiki/%E8%B2%9D%E5%8A%AA%E9%B3%A5
  - de: https://de.wikipedia.org/wiki/Benu
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `deity`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Bennu

### 4. `uraeus` — Uraeus (task `enrich`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q756990 — deskripsi Wikidata: "stylized, upright form of an Egyptian cobra used as a symbol of sovereignty, royalty, deity and divine authority in Ancient Egypt"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Uraeus
  - id: https://id.wikipedia.org/wiki/Uraeus
  - ja: https://ja.wikipedia.org/wiki/%E8%9B%87%E5%BD%A2%E8%A8%98%E7%AB%A0
  - de: https://de.wikipedia.org/wiki/Ur%C3%A4usschlange_(Symbol)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Uraeus
  - Wikipedia (id): https://id.wikipedia.org/wiki/Uraeus

### 5. `satis` — Satis (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q843206 — deskripsi Wikidata: "ancient Egyptian goddess"; kelas Wikidata: water deity, Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Satis_(goddess)
  - id: https://id.wikipedia.org/wiki/Satis
  - ja: https://ja.wikipedia.org/wiki/%E3%82%B5%E3%83%86%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E8%90%A8%E6%8F%90%E7%89%B9

### 6. `bat-q810687` — Bat (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q810687 — deskripsi Wikidata: "cow goddess in Egyptian mythology depicted as a human face with cow ears and horns"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Bat_(goddess)
  - id: https://id.wikipedia.org/wiki/Bat_(dewi)
  - zh: https://zh.wikipedia.org/wiki/%E5%B7%B4%E7%89%B9_(%E5%9F%83%E5%8F%8A%E7%A5%9E%E8%AF%9D)
  - de: https://de.wikipedia.org/wiki/Bat_(%C3%A4gyptische_Mythologie)
- Catatan: Ada makhluk lain bernama sama di daftar kerja: `bat`. Teliti hanya makhluk yang sesuai Wikidata Q810687, dan tulis `canonical_name` dengan pembeda singkat dalam kurung yang didukung sumber, misalnya "Bat (…)".

### 7. `harpocrates` — Harpocrates (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q787492 — deskripsi Wikidata: "God-child in Egyptian mythology"; kelas Wikidata: Ancient Egyptian deity, Greek deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Harpocrates
  - id: https://id.wikipedia.org/wiki/Harpokrates
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%AB%E3%83%9D%E3%82%AF%E3%83%A9%E3%83%86%E3%82%B9
  - zh: https://zh.wikipedia.org/wiki/%E5%93%88%E5%B0%94%E6%B3%A2%E5%85%8B%E6%8B%89%E7%89%B9%E6%96%AF

### 8. `kek` — Kek (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q864020 — deskripsi Wikidata: "ancient Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Kek_(mythology)
  - de: https://de.wikipedia.org/wiki/Kek
  - fr: https://fr.wikipedia.org/wiki/Kekou
  - es: https://es.wikipedia.org/wiki/Kuk_(mitolog%C3%ADa)

### 9. `maahes` — Maahes (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q845614 — deskripsi Wikidata: "ancient Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Maahes
  - de: https://de.wikipedia.org/wiki/Mahes
  - fr: https://fr.wikipedia.org/wiki/Miysis
  - es: https://es.wikipedia.org/wiki/Maahes

### 10. `onuris` — Onuris (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q858754 — deskripsi Wikidata: "Egyptian deity of war who was worshipped in the Egyptian area of Abydos, and particularly in Thinis"; kelas Wikidata: Ancient Egyptian deity, war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Onuris
  - zh: https://zh.wikipedia.org/wiki/%E5%AE%89%E8%83%A1%E7%88%BE
  - de: https://de.wikipedia.org/wiki/Anhor
  - fr: https://fr.wikipedia.org/wiki/Anhour

### 11. `heh` — Heh (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1126848 — deskripsi Wikidata: "ancient Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Heh_(god)
  - de: https://de.wikipedia.org/wiki/Heh
  - fr: https://fr.wikipedia.org/wiki/Heh
  - es: https://es.wikipedia.org/wiki/Heh

### 12. `meskhenet` — Meskhenet (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q753286 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Meskhenet
  - ja: https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%B9%E3%82%B1%E3%83%8D%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E6%A2%85%E6%96%AF%E8%B5%AB%E5%A5%88%E7%89%B9
  - de: https://de.wikipedia.org/wiki/Mesechenet

### 13. `sopdu` — Sopdu (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1195229 — deskripsi Wikidata: "god of the sky and of eastern border regions in ancient Egyptian religion"; kelas Wikidata: Ancient Egyptian deity, war deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Sopdu
  - id: https://id.wikipedia.org/wiki/Sopdu
  - ja: https://ja.wikipedia.org/wiki/%E3%82%BD%E3%83%9A%E3%83%89
  - de: https://de.wikipedia.org/wiki/Sopdu

### 14. `heka` — Heka (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q846113 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Heka_(god)
  - zh: https://zh.wikipedia.org/wiki/%E8%B5%AB%E5%8D%A1
  - de: https://de.wikipedia.org/wiki/Heka_(%C3%A4gyptische_Mythologie)
  - fr: https://fr.wikipedia.org/wiki/Heka

### 15. `imsety` — Imsety (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1128502 — deskripsi Wikidata: "Egyptian deity"; kelas Wikidata: Ancient Egyptian deity, death deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Imset
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%A0%E3%82%BB%E3%83%86%E3%82%A3
  - zh: https://zh.wikipedia.org/wiki/%E8%89%BE%E5%A7%86%E8%B0%A2%E7%89%B9
  - de: https://de.wikipedia.org/wiki/Amset

### 16. `renenutet` — Renenutet (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q922680 — deskripsi Wikidata: "ancient Egyptian goddess"; kelas Wikidata: Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Renenutet
  - id: https://id.wikipedia.org/wiki/Renenutet
  - ja: https://ja.wikipedia.org/wiki/%E3%83%AC%E3%83%8D%E3%83%8D%E3%83%88
  - zh: https://zh.wikipedia.org/wiki/%E5%88%97%E6%B6%85%E5%8A%AA%E5%BF%92

### 17. `hatmehit` — Hatmehit (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q947409 — deskripsi Wikidata: "water deity"; kelas Wikidata: water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Hatmehit
  - ja: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%88%E3%83%A1%E3%83%92%E3%83%88
  - de: https://de.wikipedia.org/wiki/Hatmehit
  - fr: https://fr.wikipedia.org/wiki/Hatm%C3%A9hyt

### 18. `serpopard` — Serpopard (task `enrich`, tier `core`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q499356 — deskripsi Wikidata: "mythical animal known from ancient Egyptian and Mesopotamian art"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Serpopard
  - id: https://id.wikipedia.org/wiki/Serpopard
  - de: https://de.wikipedia.org/wiki/Schlangenhalspanther
  - fr: https://fr.wikipedia.org/wiki/Serpopard
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Serpopard
  - Wikipedia (id): https://id.wikipedia.org/wiki/Serpopard

### 19. `wadj-wer` — Wadj-wer (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q648798 — deskripsi Wikidata: "water deity"; kelas Wikidata: water deity, nature deity, Ancient Egyptian deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Wadj-wer
  - id: https://id.wikipedia.org/wiki/Wadj-wer
  - ja: https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A1%E3%82%B8%E3%83%BB%E3%82%A6%E3%82%A7%E3%83%AB
  - de: https://de.wikipedia.org/wiki/Wadj-wer_(%C3%A4gyptische_Mythologie)

### 20. `buchis` — Buchis (task `new`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q667670 — deskripsi Wikidata: "mythical bull in Egyptian mythology, incarnation of Montou's ka"; kelas Wikidata: mythological bull.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Buchis
  - id: https://id.wikipedia.org/wiki/Bakis
  - de: https://de.wikipedia.org/wiki/Buchis
  - fr: https://fr.wikipedia.org/wiki/Boukhis

### 21. `nemty` — Nemty (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q772202 — deskripsi Wikidata: "ancient Egyptian god"; kelas Wikidata: water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Nemty
  - de: https://de.wikipedia.org/wiki/Nemti_(%C3%A4gyptische_Mythologie)
  - fr: https://fr.wikipedia.org/wiki/Nemty
  - es: https://es.wikipedia.org/wiki/Nemty

### 22. `naunet` — Naunet (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q2205112 — deskripsi Wikidata: "Water deity of Egyptian mythology"; kelas Wikidata: water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Naunet
  - de: https://de.wikipedia.org/wiki/Naunet
  - fr: https://fr.wikipedia.org/wiki/Nounet
  - es: https://es.wikipedia.org/wiki/Nunet

### 23. `abyzou` — Abyzou (task `new`, tier `core`)
- **Jenis: iblis/setan** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4748 — deskripsi Wikidata: "name of a female demon"; kelas Wikidata: demon.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Abyzou
  - es: https://es.wikipedia.org/wiki/Abyzou
  - it: https://it.wikipedia.org/wiki/Abyzou
  - ar: https://ar.wikipedia.org/wiki/%D8%A3%D8%A8%D8%A7%D9%8A%D8%B2%D9%88

### 24. `caliadne` — Caliadne (task `new`, tier `core`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q2559167 — deskripsi Wikidata: "naiad, wife of Aegyptus"; kelas Wikidata: naiad.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Caliadne
  - de: https://de.wikipedia.org/wiki/Kaliadne
  - fr: https://fr.wikipedia.org/wiki/Caliadne
  - es: https://es.wikipedia.org/wiki/Caliadne

### 25. `set-animal` — Set animal (task `enrich`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q3945272 — deskripsi Wikidata: "Egyptian hieroglyph"; kelas Wikidata: Egyptian hieroglyph, mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Set_animal
  - id: https://id.wikipedia.org/wiki/Hewan_Set
  - fr: https://fr.wikipedia.org/wiki/Hi%C3%A9roglyphe_%C3%A9gyptien_E20
  - es: https://es.wikipedia.org/wiki/Set-animal_(jerogl%C3%ADfico)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `hybrid`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Set_animal
  - Wikipedia (id): https://id.wikipedia.org/wiki/Hewan_Set

### 26. `aani` — Aani (task `new`, tier `core`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q4661578 — deskripsi Wikidata: "Egyptian dog-headed ape"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Aani
  - ar: https://ar.wikipedia.org/wiki/%D8%B9%D8%A7%D9%86%D9%8A
  - as: https://as.wikipedia.org/wiki/%E0%A6%86%E0%A6%A8%E0%A6%BF
  - bn: https://bn.wikipedia.org/wiki/%E0%A6%86%E0%A6%A8%E0%A6%BF_(%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A6%A4%E0%A6%BE)

### 27. `medjed-fish` — Medjed (fish) (task `enrich`, tier `core`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q25203205 — deskripsi Wikidata: "species of elephantfish worshipped in Ancient Egypt"; kelas Wikidata: mythical animal.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Medjed_(fish)
  - pt: https://pt.wikipedia.org/wiki/Medjed_(peixe)
  - ar: https://ar.wikipedia.org/wiki/%D9%85%D8%AC%D8%AF_(%D8%B3%D9%85%D9%83%D8%A9)
  - cs: https://cs.wikipedia.org/wiki/Med%C5%BEed_(ryba)
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-creature`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Medjed_(fish)

### 28. `el-naddaha` — El Naddaha (task `enrich`, tier `core`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q5351676 — deskripsi Wikidata: "female spirit in Egyptian legend"; kelas Wikidata: spirit.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/El_Naddaha
  - ar: https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D9%86%D8%AF%D8%A7%D9%87%D8%A9
  - az: https://az.wikipedia.org/wiki/El-Naddaha
  - ig: https://ig.wikipedia.org/wiki/El_Naddaha
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/El_Naddaha

### 29. `eurryroe` — Eurryroe (task `new`, tier `core`)
- **Jenis: peri** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q106795677 — deskripsi Wikidata: "daughter of the Egyptian river-god Nilus"; kelas Wikidata: mythological Greek character, naiad, Potamides.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Eurryroe
  - fr: https://fr.wikipedia.org/wiki/Eurryro%C3%A9
  - el: https://el.wikipedia.org/wiki/%CE%95%CF%85%CF%81%CF%85%CF%81%CF%81%CF%8C%CE%B7

### 30. `abdu-fisch` — Abdu-Fisch (task `new`, tier `core`)
- **Jenis: hewan mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q308479 — kelas Wikidata: fish as food, animal worship, legendary fish.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - de: https://de.wikipedia.org/wiki/Abdu-Fisch
  - el: https://el.wikipedia.org/wiki/%CE%99%CF%87%CE%B8%CF%8D%CF%82_%CF%84%CE%B7%CF%82_%CE%91%CE%B2%CF%8D%CE%B4%CE%BF%CF%85

### 31. `akhekh` — Akhekh (task `enrich`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q123772178 — deskripsi Wikidata: "ancient Egyptian Mythical creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Akhekh
  - sv: https://sv.wikipedia.org/wiki/Akhekh
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `egyptian-mythology`, wilayah "Africa".
- Sumber terverifikasi (halamannya benar-benar ada; boleh dipakai dengan kutipan dari halaman itu):
  - Wikipedia (en): https://en.wikipedia.org/wiki/Akhekh

### 32. `apshait` — Apshait (task `new`, tier `core`)
- **Jenis: monster** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q134376406 — deskripsi Wikidata: "A monster in Ancient Egyptian mythology, described as a large flesh-eating beetle that devour corpses."; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - en: https://en.wikipedia.org/wiki/Apshait

### 33. `dewa-nun` — Dewa Nun (task `new`, tier `core`)
- **Jenis: dewa** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7326748 — kelas Wikidata: Ancient Egyptian deity, water deity.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ms: https://ms.wikipedia.org/wiki/Dewa_Nun

### 34. `esprits-de-l-ouest` — Esprits de l'Ouest (task `new`, tier `core`)
- **Jenis: roh** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q130339705 — kelas Wikidata: mythical animal, spirit.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - fr: https://fr.wikipedia.org/wiki/Esprits_de_l'Ouest

### 35. `greif` — Greif (task `new`, tier `core`)
- **Jenis: makhluk legenda** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q1545450 — deskripsi Wikidata: "mythical creature"; kelas Wikidata: mythical creature.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - de: https://de.wikipedia.org/wiki/Greif_(%C3%A4gyptische_Mythologie)

### 36. `nehah-re` — Nehah-Ré (task `new`, tier `core`)
- **Jenis: naga/ular mitos** (dugaan awal dari kelas/deskripsi Wikidata; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Wikidata (hanya untuk identitas, bukan sumber klaim): https://www.wikidata.org/wiki/Q7395871 — deskripsi Wikidata: "mythical snake in ancient Egyptian religion"; kelas Wikidata: mythological serpent.
- Artikel Wikipedia tentang makhluk ini (titik awal; ingat §11.2):
  - ms: https://ms.wikipedia.org/wiki/Nehah-R%C3%A9

## Cara menjawab

Kerjakan berurutan mulai dari `meretseger`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-078.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
