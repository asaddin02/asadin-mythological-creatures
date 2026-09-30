# Tugas: lanjutkan riset makhluk Mythics (mode agen, untuk AI mana pun)

Kamu bekerja di repositori ini sebagai peneliti Mythics. Daftar kerjanya sekitar 5.000 makhluk. `batch-001` sampai `batch-047` sudah selesai. Sisanya ada di `batch-048` sampai `batch-152`: tiap batch berisi paling banyak 50 makhluk dari **satu kelompok budaya** (misalnya "Jepang (yokai & kami) (3/17)"), sehingga sumber yang kamu temukan untuk satu makhluk sering berguna juga untuk makhluk lain di batch yang sama.

Lebih dari satu AI mengerjakan daftar ini, kadang bersamaan dan di komputer berbeda. Koordinasinya lewat git dan skrip `gemini:next`. Ikuti langkahnya persis.

Instruksi riset ditulis untuk "Gemini". Anggap setiap kata "Gemini" di sana berarti kamu. Aturannya berlaku sama persis, siapa pun kamu.

## Identitasmu

Tentukan satu nama agen dan arah kerja, lalu pakai terus sepanjang sesi:

| Agen | `--agent` | `--arah` |
|---|---|---|
| Codex | `codex` | `maju` (dari batch-048 ke atas) |
| Gemini / Antigravity | `gemini` | `mundur` (dari batch-152 ke bawah) |
| AI lain | nama pendek, huruf kecil | tanyakan ke pengguna |

Kalau pengguna menulis nama dan arah lain di bawah prompt ini, ikuti itu.

## Sebelum mulai (sekali per sesi)

Baca seluruhnya, jangan dilewati:
1. `docs/gemini/00-instruksi-utama.md` (versi 3). Ini aturan riset, format JSON, dan daftar nilai yang diizinkan. **§1 (anti-mengarang), §8 (nilai yang diizinkan), §11 (kesalahan sebelumnya, termasuk §11.7–§11.9), dan §12 (makhluk baru) paling penting.**
2. `docs/gemini/batches/batch-001-fix-1.md`, contoh nyata kesalahan yang membuat entri ditolak.
3. Satu contoh jawaban yang lulus, untuk meniru format dan kedalamannya: `data/gemini/inbox/batch-047.md` beserta perbaikannya `batch-047-fix-1.md` dan `batch-047-fix-2.md`, serta laporannya `data/gemini/reviews/batch-047.review.md`.

## Siklus per batch

### 1. Sinkronkan dan ambil batch

```bash
git pull --rebase --autostash
npm run -s gemini:next -- --agent <nama> --arah <maju|mundur>
```

Perintah kedua mencetak ID batch, misalnya `batch-048`. Kalau kamu masih memegang batch yang belum selesai, kamu mendapat batch itu lagi; jalankan `npm run -s gemini:verify -- <batch>` dan lanjutkan dari makhluk di baris "Belum dikirim" pada laporannya. Kalau keluarannya `SEMUA BATCH SUDAH DIAMBIL`, berhenti dan laporkan.

Umumkan klaimmu supaya agen lain tidak mengambil batch yang sama:

```bash
git add data/gemini/progress/<batch>.json
git commit -m "claim(gemini): <batch> oleh <nama>"
git push
```

### 2. Riset

1. Baca `docs/gemini/batches/<batch>.md`.
2. Kerjakan makhluknya berurutan. **Buka halaman sumber yang sebenarnya** (web search atau `curl -sL` ke URL-nya), lalu salin kutipan kata demi kata dari teks halaman itu. Pemeriksa akan mengunduh halaman yang sama dan mencari setiap kutipan di sana.
   - Teks bersih Wikipedia paling mudah diambil lewat API, misalnya `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&titles=<Judul>`. URL yang ditulis di entri tetap URL artikel biasa (`https://en.wikipedia.org/wiki/<Judul>`).
   - Gambar: pastikan nama berkas dan lisensinya di Wikimedia Commons (`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:<nama>&format=json`) dan buktikan bahwa gambarnya memang menggambarkan makhluk itu (§5).
   - Situs yang memblokir robot (The Met, UCL, Smithsonian, dan lain-lain) sekarang dicek pemeriksa lewat arsip Wayback Machine. Kutipan dari situs seperti itu tetap harus disalin dari halaman aslinya.
3. Tulis setiap entri ke `data/gemini/inbox/<batch>.md` **begitu satu entri selesai**, satu blok ```json per makhluk. Dengan begitu tidak ada yang hilang kalau sesi terputus.
4. Setiap kira-kira 10 entri, jalankan `npm run -s gemini:verify -- <batch>` dan perbaiki kesalahan yang muncul sebelum melanjutkan, supaya kesalahan yang sama tidak terulang di 40 entri berikutnya.

### 3. Periksa dan perbaiki

1. Setelah semua makhluk di batch selesai, jalankan `npm run -s gemini:verify -- <batch>`.
2. Baca `data/gemini/reviews/<batch>.fix-draft.md` dan `data/gemini/reviews/<batch>.review.md`.
3. Perbaiki **semua error**, dan semua peringatan "Tidak muncul di kutipan mana pun". Peringatan lain diperbaiki kalau masuk akal. Tulis entri yang diperbaiki **secara lengkap** ke `data/gemini/inbox/<batch>-fix-<n>.md` (n = 1, 2, 3). Jangan menimpa berkas sebelumnya: berkas fix yang lebih tinggi menggantikan entri yang sama di berkas sebelumnya. Lalu jalankan pemeriksa lagi.
4. Berhenti memperbaiki setelah 3 putaran. Entri yang masih gagal otomatis tercatat sebagai `perlu_manusia` di langkah berikutnya.

### 4. Catat, commit, dan push

```bash
npm run -s gemini:done -- <batch> --agent <nama> --catatan "<catatan singkat, boleh kosong>"
```

Perintah ini menulis `data/gemini/progress/<batch>.json` dari laporan pemeriksa dan mencetak pesan commit, misalnya `data(gemini): batch-048 researched by codex (sisa 104 batch)`. Isi `--catatan` dengan hal yang perlu diketahui peninjau, misalnya "ekek: artikel Wikipedia ditandai tanpa sumber" atau "3 kutipan The Met tidak ada di arsip Wayback".

```bash
git add data/gemini/inbox/<batch>*.md data/gemini/reviews/<batch>.* data/gemini/progress/<batch>.json
git commit -m "<pesan commit dari gemini:done>"
git push
```

Kalau `git push` ditolak karena ada commit baru dari agen lain, jalankan `git pull --rebase` lalu `git push` lagi. Kalau rebase konflik, jalankan `git rebase --abort`, berhenti, dan laporkan ke pengguna.

Setelah itu langsung kembali ke langkah 1 untuk batch berikutnya, tanpa menunggu persetujuan.

## Larangan

- **Jangan mengubah file lain** selain `data/gemini/inbox/<batch>*`, `data/gemini/progress/<batch>.json` (lewat skrip), dan laporan di `data/gemini/reviews/` yang ditulis pemeriksa. Terutama jangan mengubah `scripts/`, `docs/`, `data/gemini/batches/`, `data/gemini/worklist.json`, `data/gemini/progress.json`, atau `data/creatures.json`.
- **Jangan menyentuh batch milik agen lain**, termasuk berkas inbox dan progresnya.
- **Jangan mengakali pemeriksa.** Contohnya: mengubah skrip, menulis ulang kutipan supaya cocok padahal teks aslinya berbeda, atau menambahkan nama ke kutipan.
- **Jangan menulis dari ingatan.** Pengetahuanmu sendiri bukan sumber. Detail yang tidak bisa kamu kutip dari halaman yang kamu buka harus dihapus. Entri pendek yang seluruhnya bersumber lebih baik daripada entri panjang yang sebagian dikarang.
- **Git:** jangan memakai `git add -A` atau `git add .`, `git push --force`, `git reset --hard`, `git checkout -- <file>`, atau `git stash drop`. Hanya tambahkan berkas batchmu sendiri.
- **Jangan berhenti untuk bertanya** kecuali ada masalah yang menghentikan semua pekerjaan (misalnya `npm` gagal, jaringan mati total, atau konflik git). Keputusan per makhluk kamu ambil sendiri sesuai instruksi, termasuk `skip` untuk item yang ternyata bukan makhluk mitologi (§12).

## Setiap 5 batch

Tulis ringkasan singkat di chat: batch yang sudah selesai, jumlah entri lulus, skip, dan perlu manusia, serta masalah yang sering muncul. Setelah itu langsung lanjutkan.

## Kalau kuota hampir habis

Selesaikan entri yang sedang ditulis dan simpan ke inbox. Jalankan pemeriksa untuk batch itu. Commit dan push berkas inbox dan laporannya dengan pesan `wip(gemini): <batch> sebagian oleh <nama>`, **tanpa** menjalankan `gemini:done`, supaya batch tetap tercatat `dikerjakan` atas namamu. Sesi berikutnya (di komputer mana pun) mendapat batch yang sama dari `gemini:next` dan melanjutkannya.
