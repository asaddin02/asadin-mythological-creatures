# Tugas Codex: ilustrasi "nama besar" yang sangar

Kamu ilustrator Mythics, bekerja di repositori ini di PC lokal dengan **OpenAI built-in `image_gen`**, alat yang sama dengan yang kamu pakai untuk 1.000 ilustrasi sebelumnya. Pemilik proyek menilai nama-nama besar (Lucifer, Ra, Medusa, dan seterusnya) masih kurang sangar. Ia ingin mereka tampil megah atau mengerikan, dengan **efek kekuatan yang terlihat**.

Claude Code lokal adalah peninjau kedua. Ia memeriksa setiap gambarmu, lalu memasang yang lolos. Kamu tidak memasang, tidak commit, dan tidak push.

## Bahan

- `data/artwork-nama-besar.json`, dibuat dengan `node scripts/nama-besar.mjs`. Jalankan ulang perintah itu di awal setiap sesi, karena riset terus bertambah.
  - `policy`: aturan gaya nama besar. **Wajib diikuti.** Aturan ini menggantikan aturan aura lama yang melarang efek cahaya.
  - `siap`: makhluk yang boleh digambar sekarang, urut dari yang terbesar. Yang berstatus `lengkap-bergambar` sudah punya gambar yang harus **diganti**; yang berstatus `lengkap-informasi` belum bergambar.
  - `menunggu`: risetnya belum lengkap. **Jangan digambar**, karena aturan pemilik proyek menyatakan hanya entri yang lengkap dan valid yang boleh bergambar.
- Riset setiap makhluk, termasuk semua klaimnya: `node scripts/gemini/show-entry.mjs <slug>`.

## Inti gaya (lengkapnya di `policy`)

- **Efek boleh kuat, asal terdokumentasi.** Contohnya api matahari untuk Ra, petir untuk dewa petir, tatapan membatu dan rambut ular untuk Medusa, nyala dunia bawah, badai, banjir, cahaya ilahi, dan skala kosmis. Setiap efek harus bisa ditunjuk ke klaim tentang kuasa, ranah, atribut, atau perbuatan makhluk itu. Efek yang tidak didukung riset tidak boleh ditambahkan.
- **Anatomi tetap setia pada klaim**: jumlah kepala, mata, dan anggota tubuh, atribut, serta ikonografi. Efek menambah suasana dan kekuatan, bukan mengganti atau mengarang tubuh.
- **Komposisi monumental**: sudut kamera rendah, skala besar dengan pembanding kecil, cahaya sinematik, siluet kuat. Dewa yang baik tampil agung dan bercahaya. Makhluk jahat tampil mengancam.
- **Jangan meniru film, game, anime, atau komik.** Agama yang masih dianut digambarkan dengan hormat.

## Dua jenis pekerjaan

### A. Gambar baru (status `lengkap-informasi`)

Pakai alur batch yang sudah ada:

```bash
node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --policy nama-besar --slugs <slug1,slug2,...> --limit 50
```

Perintah itu membuat `data/artwork-batch-<N>.json` dengan `user_policy` dari `policy` nama besar. Receipt ditulis ke `data/artwork-generated/batch-<N>/<slug>.json` dan PNG asli ke `.../originals/`. Isinya sama dengan receipt batch-1000: `prompt`, `depicted_variant`, `basis_claim_ids`, `visual_requirements`, `aura`, `artistic_choices`, `visual_review` (reviewer `codex`), dan `native_sha256`. Status receipt: `awaiting-independent-review`.

### B. Ganti gambar lama (status `lengkap-bergambar`)

Alur revisi `scripts/*artwork-presentation*` yang kamu buat untuk revisi 1.000 masih terikat ke `presentation-revision-1000`. **Buat versi umumnya** dengan parameter nama revisi (misalnya `--revision nama-besar`, ledger `data/artwork-presentation-revision-nama-besar.json`, receipt di `data/artwork-generated/presentation-revision-nama-besar/`). Pertahankan kontrak yang sama: WebP dan PNG lama tidak dihapus, hash lama dan baru dicatat, dua reviewer berbeda, dan klaim dasar dari riset yang diterima. Pastikan semua audit dan tes revisi 1000 tetap lulus:

```bash
node scripts/audit-artwork-presentation.mjs --require-complete
node tests/artwork-presentation.mjs
```

Receipt penggantian juga berhenti di status `awaiting-independent-review`.

## Langkah per makhluk

1. Baca risetnya. Catat klaim tentang **wujud** dan klaim tentang **kekuatan, ranah, atau perbuatan**, karena dari situlah efeknya diambil.
2. Tulis `visual_requirements`: ciri wujud dan efek, masing-masing dengan klaim dasarnya.
3. Buat gambar. Periksa sendiri dengan melihat gambarnya: anatomi, setiap efek ada dasarnya, tidak ada teks atau watermark, dan makhluknya benar-benar terasa besar dan berkuasa. Ulangi kalau belum sesuai, dan simpan percobaan yang ditolak.
4. Kalau riset tidak memuat dasar untuk efek apa pun, buat gambar yang megah lewat komposisi dan cahaya saja. Catat di `artistic_choices` bahwa riset belum membahas kekuatannya.

## Larangan

- Jangan menggambar makhluk di daftar `menunggu`.
- Jangan mengubah riset (`data/gemini/`), `data/creatures.json`, atau penilaian kekuatan (`data/power/`, `js/scaling.js`).
- Jangan menulis `root_visual_review` dan jangan menjalankan integrasi. Itu tugas Claude Code lokal.
- Jangan commit atau push.

## Laporan

Setiap 25 gambar, tulis ringkasan di chat: makhluk yang selesai, dan efek yang dipakai beserta klaim dasarnya. Setelah itu lanjutkan tanpa menunggu. Di akhir, laporkan daftar receipt yang menunggu tinjauan kedua.
