> **Arsip.** Prompt ini dipakai pada putaran 6–7 Oktober 2026. Sejak 8 Oktober 2026 prompt yang berlaku untuk semua sesi gambar Codex adalah [docs/codex/GAMBAR.md](codex/GAMBAR.md), dengan status antar-sesi dari `node scripts/artwork-status.mjs` dan jurnal di [docs/codex/JURNAL-GAMBAR.md](codex/JURNAL-GAMBAR.md).

# Tugas Codex: ilustrasi nama besar dengan sub-agent paralel

Kamu agen utama ilustrator Mythics di repositori ini. Agen utama memakai model `gpt-6.1-sol` dengan reasoning effort high (sudah default di `~/.codex/config.toml`). Pemilik proyek akan menyebut di pesannya **berapa makhluk** yang dikerjakan sesi ini. Kerjakan sebanyak itu, tidak lebih.

Claude Code lokal adalah peninjau kedua. Ia memeriksa setiap gambar, lalu memasang yang lolos. Kamu tidak memasang, tidak commit, dan tidak push.

## 1. Model gambar: wajib `gpt-image-2.5 subburst`

- Setiap gambar dibuat dengan model **`gpt-image-2.5 subburst`**. Ini juga berlaku untuk setiap sub-agent.
- Sebelum gambar pertama, periksa apakah model itu benar-benar tersedia: di alat `image_gen`, atau di CLI `scripts/image_gen.py` lewat `--model`.
  - Kalau tidak tersedia, **berhenti sebelum membuat gambar apa pun**. Laporkan model apa saja yang tersedia dan pesan galatnya, lalu tunggu keputusan pemilik.
  - Jangan beralih diam-diam ke `gpt-image-2`, `gpt-image-1.5`, atau model lain.
- Catat nama model persis yang dipakai di setiap receipt: field `image_model`, ditambah alatnya di `tool`. Kalau alat tidak menyebut nama modelnya, tulis `"image_model": "tidak dilaporkan alat"`. Jangan menebak, dan laporkan hal itu di chat.

## 2. Sub-agent paralel

- Pakai `spawn_agent` untuk menjalankan beberapa sub-agent sekaligus, paling banyak 4 berjalan bersamaan. Setiap sub-agent memakai model `gpt-6.1-sol`. Tulis model itu secara eksplisit di panggilan `spawn_agent`.
- Pembagiannya:
  - **Satu makhluk, beberapa varian:** untuk pilot Sun Wukong, setiap sub-agent membuat satu varian komposisi yang berbeda. Agen utama memilih yang terbaik.
  - **Banyak makhluk:** setiap sub-agent memegang makhluk yang berbeda. Jangan ada dua sub-agent yang menulis receipt atau berkas yang sama.
- Sub-agent hanya menulis PNG dan receipt untuk makhluk miliknya. Ledger (`data/artwork-*.json`) dan laporan akhir hanya ditulis agen utama.
- Agen utama melihat sendiri setiap gambar hasil sub-agent sebelum menerimanya ke status `awaiting-independent-review`.

## 3. Pilot: ganti gambar Sun Wukong agar lebih sangar

Gambar sekarang (`assets/art/sun-wukong-verified.webp`, batch 1080) menampilkan monyet lucu di atas awan. Pemilik ingin Sun Wukong terasa **sangar, garang, dan berbahaya**: suasana gelap dan realistis, setingkat nuansa game *Black Myth: Wukong*.

- **Ambil suasananya, jangan desainnya.** Yang boleh diambil: bulu realistis yang kusut dan bernoda pertempuran, tatapan mengancam, cahaya sinematik yang gelap, debu dan serpihan, serta skala pertempuran.
  - Jangan meniru tokoh Destined One: zirah, wajah, desain tongkat, kostum, atau poster resmi game itu. Juga jangan memuat logo, teks, atau komposisi yang mengingatkan pada karya berhak cipta.
  - Desainnya harus orisinal dan bersumber dari novel.
- **Dasar riset.** Baca semua klaimnya dengan `node scripts/gemini/show-entry.mjs sun-wukong`.
  - Wujud: kera/makaka hidup lahir dari batu, satu kepala, dua lengan, dua kaki (c04, c33, c38).
  - Ikat kepala emas dari Buddha (c10, c32).
  - Senjata: Ruyi Jingu Bang, batang besi hitam dengan dua pita emas di ujungnya (c41). Inskripsinya jangan digambar, karena gambar tidak boleh memuat teks.
  - Efek yang boleh dipakai, masing-masing sesuai klaimnya:
    - mengamuk di istana langit dan mengalahkan 100.000 prajurit langit serta Empat Raja Langit (c23);
    - berubah menjadi sosok mengerikan saat bertarung dengan Erlang Shen (c22);
    - awan jungkir balik (c40);
    - 72 perubahan wujud (c07, c39).
  - Spanduk "齊天大聖" (c43) jangan digambar sebagai tulisan.
- **Komposisi** (pilih satu per varian):
  - (a) Sun Wukong mendarat di reruntuhan gerbang istana langit, prajurit langit kecil berjatuhan di latar.
  - (b) Potret setengah badan yang menatap tajam, tongkat diputar dengan percikan api dan debu.
  - (c) Melompat dari awan gelap bergelora dengan tongkat terangkat.

  Tetap persegi, tanpa teks, tanpa watermark, tanpa bingkai.
- **Alur penggantian**: pakai revisi bernama nama-besar yang sudah ada:

  ```bash
  node scripts/nama-besar.mjs
  node scripts/prepare-artwork-presentation.mjs --revision nama-besar --slugs sun-wukong
  ```

  Receipt masuk ke `data/artwork-generated/presentation-revision-nama-besar/`. WebP dan PNG lama tidak dihapus, dan hash lama serta baru dicatat. Status receipt adalah `awaiting-independent-review`, dengan `visual_review` dari reviewer `codex`.
  - Kalau PNG asli batch 1080 tidak ada di PC ini, catat `original_available_at_start: false`, pakai cadangan WebP, dan sebutkan di laporan.
- Simpan semua varian yang ditolak, lalu tulis alasan pemilihan di `artistic_choices`.

Setelah pilot selesai, **berhenti dan laporkan** sebelum lanjut ke makhluk lain: varian yang dibuat, varian yang dipilih, model gambar yang tercatat, dan klaim dasar setiap efek.

## 4. Setelah pilot disetujui pemilik

Lanjutkan ke makhluk berikutnya sesuai jumlah dari pemilik, diambil dari `data/artwork-nama-besar.json` → `siap`, urut dari atas. Ikuti `policy` di berkas itu dan aturan di `docs/PROMPT-CODEX-NAMA-BESAR.md`:
- Gambar baru (`lengkap-informasi`) memakai `scripts/prepare-artwork-batch.mjs ... --policy nama-besar`.
- Penggantian (`lengkap-bergambar`) memakai `prepare-artwork-presentation.mjs --revision nama-besar`.

## Larangan

- Jangan menggambar makhluk di daftar `menunggu`. Aturan pemilik: hanya entri lengkap dan valid yang boleh bergambar.
- Jangan mengubah riset (`data/gemini/`), `data/creatures.json`, atau penilaian kekuatan (`data/power/`, `js/scaling.js`).
- Jangan menulis `root_visual_review` dan jangan menjalankan integrasi. Itu tugas Claude Code lokal.
- Jangan commit atau push.

## Laporan akhir

- Daftar receipt yang menunggu tinjauan kedua.
- Model gambar per receipt.
- Sub-agent yang dipakai dan pembagian kerjanya.
- Semua kegagalan atau penolakan dari alat gambar.