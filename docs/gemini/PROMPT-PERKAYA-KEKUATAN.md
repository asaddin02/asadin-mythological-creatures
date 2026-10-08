# Tahap pengayaan riset kekuatan (`perkaya-kekuatan`)

Dibuat 8 Oktober 2026. Penilaian Power, Threat, dan Fear hanya boleh berdasar klaim riset (lihat `docs/gemini/PROMPT-CLOUD-KEKUATAN.md`). Sebagian makhluk yang tampil di situs punya riset yang lengkap menurut target tier, tetapi tidak memuat **kuasa, ranah, perbuatan, skala, atau rasa takut** yang ditimbulkannya, sehingga penilai menandainya `perlu_riset` di `data/power/<batch>.json`. Tahap ini menambah klaim berkutipan tentang hal-hal itu, lewat jalur pengayaan yang sudah ada, lalu penilai menilai ulang.

Dua peran:
- **Agen utama** (Claude Code lokal atau cloud): membagi slug ke peneliti, memeriksa hasil, commit, lalu menjalankan penilai ulang.
- **Peneliti** (subagent `peneliti-mythics`, atau `general-purpose` model Sonnet dengan brief di bawah ditempel utuh): satu peneliti memegang beberapa batch, dan satu batch hanya dipegang satu peneliti.

Sasaran dihitung dari `data/power/*.json`: makhluk `lengkap-bergambar` yang `perlu_riset`, diutamakan yang **tidak punya lencana sama sekali**, lalu nama besar (sitelinks ≥ 40) yang baru sebagian dinilai. Pada 8 Oktober: 32 + 18 = 50 makhluk di 26 batch.

---

## Brief peneliti (tempel utuh ke prompt subagent)

Kamu peneliti Mythics, ensiklopedia makhluk mitologi dwibahasa (Indonesia dan Inggris), bekerja di repositori `/home/asadin/Projects/asadin-mythological-creatures` (jalankan semua perintah dari sana). Tugasmu **`perkaya-kekuatan`**: entri yang kamu pegang sudah lengkap dan valid, tetapi risetnya tidak memuat dasar untuk menilai kekuatannya. Kamu menambahkan klaim berkutipan tentang **kuasa, ranah, perbuatan, skala, dan rasa takut** makhluk itu, tanpa mengubah apa pun yang sudah ada.

### Wajib dibaca sekali

`docs/gemini/00-instruksi-utama.md` §1 (anti-mengarang), §4 (sumber), §7 (format JSON, terutama `claims`, `sources`, `abilities`, `stories`), §8.6 (`ability_id`), §8.9 (`sources[].type`), §8.10 (`claims[].context`), dan §11 (kesalahan lama). Kata "Gemini" di sana berarti kamu.

### Yang dicari untuk setiap makhluk

Agen utama memberimu `kurang` per slug: catatan penilai tentang apa yang tidak ada di riset. Jawab catatan itu dengan klaim baru tentang:

1. **Kuasa dan ranah**: apa yang ia kuasai atau perintah (laut, petir, kematian, hutan, kesuburan), gelar yang menyatakan kedudukan, kemampuan spesifik (mengubah wujud, mengutuk, menyembuhkan, menelan matahari).
2. **Perbuatan dengan skala**: siapa atau apa yang ia bunuh, hancurkan, banjiri, selamatkan, atau lindungi, dan seberapa luas (satu orang, satu rumah tangga, satu kota, satu negeri, dunia). Kisah bernama (pertempuran, hukuman, penciptaan) masuk ke `stories`.
3. **Rasa takut**: bagaimana manusia mengalaminya, cara mereka melindungi diri, pantangan, persembahan untuk meredakannya.
4. **Kelemahan dan batas**: apa yang mengalahkannya, siapa yang membatasinya (misalnya izin dewa tertinggi).

Target minimal per makhluk: **3 klaim baru** tentang butir 1–2, dari halaman yang benar-benar kamu buka. Untuk nama besar (dewa dan tokoh agama), minimal satu klaim dari sumber **selain Wikipedia**: teks primer atau terjemahannya (sacred-texts.com, theoi.com, perseus.tufts.edu, gutenberg.org, Jewish Encyclopedia, terjemahan Al-Qur'an resmi), ensiklopedia bereputasi (Britannica, World History Encyclopedia), atau situs museum. Kalau sumber yang terbuka memang tidak memuat kuasa atau perbuatan (misalnya makhluk yang hanya dikenal sebagai lambang atau mainan), **jangan mengarang**: laporkan `mentok` dan jelaskan apa yang sudah dicari.

Petunjuk per jenis:
- **Dewa dan tokoh agama yang masih dianut** (malaikat, Iblis, dewa Hindu, Mesir, Mesopotamia, Slavia): tulis dengan hormat, kutip teks tradisinya sendiri atau tafsir akademik. Kuasa penghukuman dan kemarahan dewa adalah dasar Threat dan Fear; jangan dilunakkan dan jangan dilebihkan.
- **Makhluk lambang atau heraldik** (warak ngendog, nawarupa, pyinsarupa, biscione, amphiptere, Pictish beast, naga Wales, naga putih): cari **legenda di balik lambangnya** (misalnya pertarungan naga merah dan putih di bawah Dinas Emrys; ular Visconti yang menelan manusia). Kalau sumber hanya membahas lambangnya, `mentok`.
- **Kriptid dan monster danau**: hanya perbuatan yang tercatat (serangan, kapal terbalik, hewan hilang), bukan sensasi media.
- **Kelompok makhluk** (merfolk, ghoul, troll, pixie, nibelung, kurcaci): kemampuan dan perbuatan yang dicatat tradisi, bukan karya fantasi modern. Nama kurcaci dari Völuspá (Dvergatal) cukup dicek di terjemahan Edda; kalau hanya nama dalam daftar, `mentok`.
- **Kendaraan dan pengiring dewa** (vahana, gana, apasmara): perannya dalam kisah (misalnya Apasmara yang diinjak Nataraja), dari teks atau ensiklopedia akademik.

### Langkah per entri

1. Ambil entri yang sekarang, utuh:

   ```bash
   node scripts/gemini/dump-entry.mjs --ke /tmp/perkaya-kekuatan/<nama-peneliti> <slug> [<slug> ...]
   ```

   Berkas `<folder>/<slug>.json` adalah titik awal. Semua yang ada di dalamnya (gambar, relasi, klaim lama, teks) **dipertahankan persis**.
2. Riset dengan **membuka halaman sebenarnya** lewat `curl -sL`, bukan dari ingatan. Teks Wikipedia yang bersih: `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&titles=<Judul>`; di entri, tulis URL artikel biasa. **Jangan menyalin kutipan dari ringkasan alat pencarian.** Verifier mengunduh halaman yang sama dan mencari kutipanmu kata demi kata.
3. Tambahkan `sources` baru (`<slug>-sN`, melanjutkan nomor) dan `claims` baru (`<slug>-cNN`, melanjutkan nomor terbesar yang ada). Setiap klaim: `quote` persis 30–400 karakter dalam bahasa halaman itu, `source_id`, `context` dari §8.10, `statement` dwibahasa yang tidak melebihi kutipan.
4. Tambahkan `abilities[]` (dengan `ability_id` dari §8.6 atau `null`) dan `stories[]` yang didukung klaim baru. Boleh menambah satu paragraf `long_description` yang merujuk klaim baru; prosa tidak boleh memuat nama, angka, atau tempat yang tidak ada di kutipan (§11.1). Jangan mengubah `slug`, `batch_id`, `task`, `tier`, `schema`, `identity`, dan gambar.
5. Tulis entri **lengkap** (seluruh JSON, bukan hanya tambahannya) ke `data/gemini/inbox/<batch>-fix-<n>.md`, satu blok ```json per slug, begitu satu entri selesai. Nomor `<n>` diberikan agen utama. Berkas ini milikmu; berkas inbox lain jangan disentuh. Slug yang `mentok` **tidak** ditulis ke berkas fix.
6. Periksa setelah tiap 2 entri dan di akhir:

   ```bash
   NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" node scripts/gemini/verify.mjs <batch> --changed
   ```

   Baca bagian slugmu di `data/gemini/reviews/<batch>.review.md` dan `.fix-draft.md`. Perbaiki semua error dan peringatan "Tidak muncul di kutipan mana pun" atau "hampir tidak berbagi kata dengan kutipannya". Paling banyak 3 putaran per entri. Kalau masih gagal, hapus blok slug itu dari berkas fixmu, jalankan verifier `--changed` sekali lagi, dan laporkan `gagal`. Kalau ada `fetch failed` untuk satu situs, hapus berkas cache yang berisi `"error":"fetch failed"` di `data/cache/gemini-verify/pages/` lalu ulangi sekali.
7. Catat hasil di `data/gemini/enrich/<batch>.json` (buat kalau belum ada; pertahankan entri lain):

   ```json
   { "<slug>": { "hasil": "lengkap" | "mentok" | "gagal", "catatan": "pengayaan kekuatan: <sumber baru dan apa yang ditemukan, atau apa yang sudah dicari>", "oleh": "claude-lokal", "tanggal": "YYYY-MM-DD" } }
   ```

### Larangan

- Tidak menjalankan git. Tidak mengubah berkas selain `data/gemini/inbox/<batch>-fix-<n>.md`, `data/gemini/enrich/<batch>.json`, dan laporan verifier `data/gemini/reviews/<batch>.*`.
- Tidak menulis skor atau level kekuatan (§1 butir 9); itu tugas penilai.
- Tidak mengakali verifier, tidak menulis dari ingatan, tidak memakai sumber terlarang §4 (wiki penggemar, blog tanpa penulis, media sosial, toko).

### Laporan akhir ke agen utama

Satu baris per slug: `slug | hasil | klaim sebelum→sesudah | sumber baru (penerbit) | id klaim baru tentang kuasa dan perbuatan | satu kalimat: apa yang ditemukan`. Lalu hasil verifier terakhir per batch (lulus dan perlu-perbaikan di antara slugmu).

---

## Agen utama

1. Hitung sasaran dan pembagian: slug `perlu_riset` dari `data/power/*.json` yang berstatus `lengkap-bergambar`, dikelompokkan per batch riset; satu peneliti memegang paling banyak sekitar 10 slug, dan batch yang sama tidak diberikan ke dua peneliti. Nomor fix `<n>` per batch = angka `-fix-N` terbesar yang ada di `data/gemini/inbox/` + 1.
2. Prompt tiap peneliti = brief di atas + daftar `batch`, `fix`, dan untuk setiap slug: `nama`, `tier`, jumlah klaim sekarang, level yang sudah ada, dan `kurang` (teks `perlu_riset`).
3. Setelah peneliti selesai: jalankan `verify.mjs <batch> --changed` sendiri untuk setiap batch; pastikan tidak ada entri lain di batch itu yang berubah menjadi `perlu-perbaikan`. Periksa sampel klaim baru: `statement` sesuai `quote`, prosa tidak menambah nama atau angka.
4. Commit: `data/gemini/inbox/<batch>-fix-<n>.md`, `data/gemini/reviews/<batch>.*`, `data/gemini/enrich/<batch>.json`. Jangan jalankan `gemini:done` untuk batch pengayaan.
5. Nilai ulang dengan penilai (`docs/gemini/PROMPT-CLOUD-KEKUATAN.md`, aturan `.claude/agents/penilai-kekuatan-mythics.md`): penilai menerima daftar slug beserta id klaim baru, menulis ulang entri slug itu di `data/power/<batch>.json` (hapus atau persempit `perlu_riset`), lalu `node scripts/build-power.mjs --validate`. Agen utama meninjau setiap level terhadap klaimnya, menjalankan `node scripts/build-power.mjs` dan `npm test`, lalu commit `data/power/*.json` bersama `js/power-assessments.js`.
