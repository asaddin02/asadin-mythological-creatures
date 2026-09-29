# Batch batch-002

Ikuti seluruh "MYTHICS — Instruksi Riset untuk Gemini (versi 3)" di `docs/gemini/00-instruksi-utama.md`.

- `batch_id`: `batch-002`
- Jumlah makhluk: 5
- `task` `rewrite`: Entri lama berisi teks template dan sumber yang belum terverifikasi. Tulis ulang dari nol berdasarkan riset baru; isi entri lama hanya petunjuk pencarian.

## Daftar makhluk

### 1. `baba-yaga` — Baba Yaga (task `rewrite`, tier `rich`)
- **Jenis: tokoh legenda** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `legendary-figure`, budaya `slavic-folklore`, wilayah "Europe".
- Nama lain di entri lama (belum terverifikasi): Baba Roga, Ježibaba.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Johns, A., 2004 — "Baba Yaga: The Wild Witch of the East in Russian Fairy Tales" (https://www.upress.state.ms.us)
- Gambar lama `File:Сказка Баба-яга 3.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 2. `banaspati` — Banaspati (task `rewrite`, tier `rich`)
- **Jenis: roh** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Nama lain di entri lama (belum terverifikasi): Hantu Bola Api.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Kementerian Pendidikan dan Kebudayaan, 2017 — "Kearifan Ekologis dalam Mitos Makhluk Halus Jawa" (https://kebudayaan.kemdikbud.go.id/bpnyogyakarta/)

### 3. `banshee` — Banshee (task `rewrite`, tier `rich`)
- **Jenis: roh** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `spirit`, budaya `celtic-folklore`, wilayah "Europe".
- Nama lain di entri lama (belum terverifikasi): Bean Sídhe, Woman of the Fairy Mound.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Lysaght, P., 1986 — "The Banshee: The Irish Supernatural Death-Messenger" (https://www.ucdpress.ie)
- Gambar lama `File:Banshee.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 4. `barong` — Barong (task `rewrite`, tier `rich`)
- **Jenis: penjaga** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `guardian`, budaya `indonesian-folklore`, wilayah "Southeast Asia".
- Nama lain di entri lama (belum terverifikasi): Barong Ket, Banaspati Raja.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - de Zoete, B. & Spies, W., 1938 — "Dance and Drama in Bali" (https://global.oup.com)
  - UNESCO — "Three genres of traditional dance in Bali" (https://ich.unesco.org/en/RL/three-genres-of-traditional-dance-in-bali-00617)
- Gambar lama `File:Barong, Pura Taman Ayun 1501.jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

### 5. `fenrir` — Fenrir (task `rewrite`, tier `rich`)
- **Jenis: monster** (dugaan awal dari klasifikasi lama; pastikan dengan sumber, isi `jenis` dan `classification` sesuai temuanmu).
- Petunjuk identitas dari entri lama (boleh dikoreksi bila sumber berkata lain): klasifikasi `monster`, budaya `norse-mythology`, wilayah "Europe".
- Nama lain di entri lama (belum terverifikasi): Fenrisúlfr, Hróðvitnir.
- Sumber di entri lama, **belum terverifikasi**. Jangan dicantumkan kecuali kamu menemukan dan membuka halaman spesifik yang memuat kutipannya:
  - Lindow, J., 2001 — "Norse Mythology: A Guide to the Gods, Heroes, Rituals, and Beliefs" (https://boydellandbrewer.com)
- Gambar lama `File:Tullstorpstenen, DR 271,Tullstorp 1-1, Runristning (cropped).jpg`: berkasnya ada di Commons, tetapi relevansinya belum dibuktikan. Pakai hanya kalau memenuhi §5.

## Cara menjawab

Kerjakan berurutan mulai dari `baba-yaga`, sesuai §10: satu blok ```json per makhluk, ditulis ke `data/gemini/inbox/batch-002.md` (mode agen) atau dikirim sebagai jawaban (mode chat).
