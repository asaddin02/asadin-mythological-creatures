# Tugas Gemini: ilustrasi untuk 598 makhluk Mythics

Kamu ilustrator Mythics, ensiklopedia makhluk mitologi dwibahasa yang setiap faktanya bersumber. Tugasmu membuat **satu ilustrasi per makhluk** untuk 598 makhluk yang risetnya sudah lengkap dan valid tetapi belum bergambar. Kamu bekerja di repositori ini di PC lokal.

Pembagian kerja tim ada di `docs/BAGI-TUGAS-2026-10-06.md`. Claude Code lokal adalah **peninjau kedua**: ia memeriksa setiap gambarmu setelah kamu selesai, lalu memasang yang lolos. Kamu tidak memasang gambar sendiri.

## Bahan

- Daftar kerja: `data/artwork-batch-1598.json`, bagian `items` (598 item, urut `index`). Setiap item memuat `slug`, `canonical_name`, `review_path`, dan `research`: entri riset lengkap berisi `claims` (setiap klaim punya `statement` dan `quote` dari sumber), `short_description`, `long_description`, `stories`, `abilities`, dan `traits`.
- Aturan gaya dan aura dari pemilik proyek: `user_policy` di berkas yang sama.
- Contoh hasil yang sudah lolos dua peninjau, untuk ditiru bentuk dan kedalamannya:
  - `data/artwork-generated/batch-1000/the-dragon-of-the-north.json` (receipt lengkap, termasuk prompt);
  - `assets/art/verified-prompts.json`, bagian `specifications`, untuk melihat cara `depicted_variant`, `visual_requirements`, dan `aura` ditulis.

## Prinsip

1. **Jangan mengarang.** Setiap ciri tubuh, atribut, dan adegan harus berasal dari klaim riset makhluk itu: jumlah kepala, mata, dan kaki; sayap; warna; ukuran; senjata; tempat tinggal. Hal yang tidak disebut riset tidak boleh ditambahkan. Pengetahuanmu sendiri tentang makhluk itu bukan sumber.
2. **Harus terasa sebagai makhluk itu, bukan manusia atau hewan biasa.** Tonjolkan ciri pembeda yang terdokumentasi. Bangun auranya dari pose, ekspresi, tatapan, skala, latar dari kisahnya, dan cahaya alami, sehingga suasana tradisinya terasa: menakutkan untuk yang jahat, agung atau menenangkan untuk yang baik. Kalau riset menyebut wujudnya seperti manusia biasa, wujud itu boleh, tetapi kehadirannya harus jelas gaib lewat suasana dan kisahnya, **bukan** dengan menambahkan tanduk, taring, sayap, atau anggota tubuh hewan.
3. **Aura tanpa efek murahan.** Tidak boleh ada selubung cahaya generik, garis neon, pita energi, atau kabut berwarna yang menyala. Efek gaib hanya kalau terdokumentasi, dan tetap ditahan.
4. **Ukuran.** Makhluk yang disebut raksasa ditampilkan raksasa, dengan pohon, batu, atau rumah kecil sebagai pembanding. Ukuran yang tidak disebut jangan dibesar-besarkan.
5. **Gaya rumah** yang sama dengan 1.000 ilustrasi yang ada: persegi, lukisan naturalistik painterly premium, satu makhluk sebagai subjek utama, seluruh tubuh terlihat bila memungkinkan. Tanpa teks, label, logo, bingkai, atau watermark. Tanpa darah berlebihan dan tanpa ketelanjangan.
6. **Jangan meniru budaya populer.** Desain dari game, film, anime, atau komik (sering muncul di `modern_depictions`) tidak boleh dipakai sebagai acuan. Yang digambar adalah tradisi aslinya.
7. **Boleh menolak.** Kalau riset tidak mendokumentasikan wujud yang bisa digambar (misalnya makhluk yang tak terlihat, kategori umum, atau hanya disebut nama dan kekuatannya), jangan dipaksakan. Tulis receipt berstatus `tidak-digambar` dengan alasannya. Sebanyak 262 item tidak punya kata kunci wujud dalam klaimnya, dan 36 item pernah ditolak batch sebelumnya (`catatan_sebelumnya`), jadi baca klaimnya dengan teliti. Klaim yang menyatakan jenisnya (misalnya "roh rubah" atau "ular raksasa") sudah cukup sebagai dasar wujud.

## Langkah per makhluk

Kerjakan item berurutan menurut `index`. Lewati slug yang sudah punya receipt di `data/artwork-generated/batch-1598/<slug>.json`, supaya pekerjaan bisa dilanjutkan setelah terputus.

1. **Baca risetnya**: semua klaim (statement dan quote), deskripsi, kisah, dan `catatan_sebelumnya` bila ada.
2. **Pilih satu wujud** yang koheren dan terdokumentasi (`depicted_variant`). Kalau sumber menyebut beberapa wujud, pilih satu saja dan sebutkan.
3. **Tulis daftar ciri wajib** (`visual_requirements`, 3–7 butir). Setiap butir harus bisa ditunjuk ke klaim tertentu (`basis_claim_ids`). Tambahkan juga butir larangan, misalnya "tanpa sayap" kalau makhluk itu tidak bersayap.
4. **Tulis prompt dalam bahasa Inggris**, meniru susunan contoh:
   `Use case: stylized-concept. Asset: square premium painterly naturalistic illustration for Mythics folklore encyclopedia. Subject: <nama>, <identitas singkat dari riset>. Depict <wujud dan ciri wajib, termasuk jumlah yang tepat>. <adegan dan pose dari kisahnya; skala>. <aura: suasana, cahaya, tatapan>. <larangan: tanpa ciri yang tidak terdokumentasi; no generic glowing aura, neon outline, energy ribbons or luminous colored mist>. Beautifully resolved anatomy, cinematic painterly craft, no text, labels, logo, border, or watermark.`
5. **Buat gambarnya**: persegi, minimal 1024×1024. Simpan sebagai PNG di `data/artwork-generated/batch-1598/originals/<slug>.png`. Percobaan yang ditolak disimpan sebagai `<slug>-attempt-<k>.png`; jangan dihapus.
6. **Periksa gambarnya sendiri dengan membuka berkasnya.** Cek setiap ciri wajib, jumlah kepala, mata, dan anggota tubuh, larangan, aura, dan tidak adanya teks atau watermark. Cek juga bahwa makhluknya tidak terlihat seperti manusia atau hewan biasa. Kalau ada yang salah, perbaiki prompt-nya dan buat ulang, paling banyak 3 kali. Kalau tetap gagal, tulis receipt berstatus `perlu-koreksi` dengan catatannya.
7. **Tulis receipt** `data/artwork-generated/batch-1598/<slug>.json`:

```json
{
  "slug": "<slug>",
  "worker": "gemini",
  "status": "awaiting-independent-review",
  "tool": "Gemini image generation (Antigravity)",
  "model": "<nama model gambar yang persis kamu pakai>",
  "prompt": "<prompt persis yang menghasilkan gambar terpilih>",
  "original_file": "<path absolut ke originals/<slug>.png>",
  "review_path": "<salin dari item>",
  "depicted_variant": "<wujud yang dipilih, satu kalimat>",
  "basis_claim_ids": ["<id klaim>", "..."],
  "visual_requirements": ["<ciri wajib 1>", "..."],
  "aura": "<bagaimana aura dibangun, satu kalimat>",
  "artistic_choices": ["<pilihan artistik yang bukan fakta sumber, misalnya warna latar atau sudut kamera>"],
  "visual_review": { "verdict": "pass", "reviewer": "gemini", "notes": "<apa yang benar-benar terlihat di gambar, dicocokkan dengan setiap ciri wajib>" },
  "native_sha256": "<keluaran sha256sum untuk original_file>",
  "attempts": 1,
  "generated_at": "<waktu ISO>"
}
```

   - Nilai `tool` harus **persis** `Gemini image generation (Antigravity)`. Hitung `native_sha256` dengan `sha256sum <berkas>`.
   - Untuk makhluk yang ditolak, tulis hanya `slug`, `worker`, `tool`, `review_path`, `status: "tidak-digambar"`, dan `alasan` (dengan id klaim yang sudah diperiksa).
   - Untuk makhluk yang gagal 3 kali, tulis `status: "perlu-koreksi"` beserta `prompt`, `original_file` percobaan terakhir, dan `catatan`.

## Larangan

- **Jangan mengubah berkas lain**: `data/artwork-batch-1598.json`, `data/creatures.json`, `assets/art/`, `scripts/`, `docs/`, atau `data/gemini/`. Kamu hanya menulis ke `data/artwork-generated/batch-1598/`.
- Jangan menjalankan skrip integrasi atau register, dan jangan menulis `root_visual_review`. Itu tugas peninjau kedua.
- Jangan memalsukan pemeriksaan. `visual_review.notes` harus menjelaskan gambar yang benar-benar kamu lihat.
- Jangan menjalankan perintah git. Claude Code lokal yang menyimpan semuanya setelah meninjau.

## Laporan

Setiap 25 makhluk, tulis ringkasan di chat: jumlah `awaiting-independent-review`, `tidak-digambar`, dan `perlu-koreksi`, serta kesulitan yang sering muncul. Setelah itu lanjutkan tanpa menunggu.

Kalau kuota hampir habis, selesaikan makhluk yang sedang dikerjakan sampai receipt-nya tertulis, lalu berhenti. Sesi berikutnya melanjutkan dari slug pertama yang belum punya receipt.

Setelah 598 selesai, laporkan jumlah akhirnya. Claude Code lokal akan meninjau semuanya.
