# Batch batch-003

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-003`
- Jumlah makhluk: 5
- `task` `rewrite`: Entri lama berisi teks template dan sumber yang belum terverifikasi. Tulis ulang dari nol berdasarkan riset baru; isi entri lama hanya petunjuk pencarian.

## Daftar makhluk

### 1. `genderuwo` — Genderuwo (task `rewrite`, tier `rich`)
- **Jenis: roh** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Nama lain di entri lama (belum terverifikasi): Gandharwa, Gandarwa.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Kemendikbud RI, 2016 — "Kamus Besar Bahasa Indonesia — Genderuwo" (https://kbbi.kemdikbud.go.id/entri/genderuwo)

### 2. `jormungandr` — Jörmungandr (task `rewrite`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `norse-mythology`, wilayah "Europe".
- Nama lain di entri lama (belum terverifikasi): Midgardsormen, World Serpent.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Larrington, C., 2014 — "The Poetic Edda: Stories of the Norse Gods and Heroes" (https://global.oup.com)
- Gambar lama `File:Ragnarok - Louis Moe (17006) - cropped (cropped).png`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 3. `kuntilanak` — Kuntilanak (task `rewrite`, tier `rich`)
- **Jenis: roh** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Nama lain di entri lama (belum terverifikasi): Pontianak, Matianak.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Winstedt, R., 1951 — "Spirits and Sorcery in Malay Archipelago" (https://www.jstor.org/stable/2786847)

### 4. `leak` — Leak (task `rewrite`, tier `rich`)
- **Jenis: pengubah wujud** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `shapeshifter`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Nama lain di entri lama (belum terverifikasi): Leyak, Pengiwa practitioner.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Putra, I.G.A., 2018 — "Aji Pengiwa: Kajian Teologis dan Folkloris Fenomena Leak di Bali" (https://ojs.unud.ac.id)
- Gambar lama `File:Rangda statue.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 5. `long-dragon` — Long (Chinese Dragon) (task `rewrite`, tier `rich`)
- **Jenis: naga/ular mitos** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `dragon`, budaya `chinese-mythology`, wilayah "East Asia".
- Nama lain di entri lama (belum terverifikasi): Qinglong, Eastern Dragon.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - de Visser, M.W., 1913 — "The Dragon in China and Japan" (https://brill.com)
  - American Museum of Natural History — "Dragon · OLogy" (https://www.amnh.org/explore/ology/ology-cards/277-dragon)
- Gambar lama `File:Azure Dragon.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

## Cara menjawab

Kerjakan berurutan mulai dari `genderuwo`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-003.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
