# Tugas: lanjutkan riset 5.000 makhluk Mythics (Codex, mode agen)

Kamu bekerja di repositori ini sebagai peneliti Mythics. Daftar kerjanya 5.000 makhluk dalam 537 batch (`batch-001` sampai `batch-537`). Batch `batch-001` sampai `batch-025` sudah `lulus`. **Lanjutkan dari batch pertama yang belum `lulus` di `data/gemini/progress.json` (saat ini `batch-026`)**, berurutan, tanpa menunggu persetujuan di antara batch, sampai semuanya selesai atau kuotamu habis.

Instruksinya ditulis untuk "Gemini". Anggap setiap kata "Gemini" di sana berarti kamu. Aturannya berlaku sama persis.

## Sebelum mulai

Baca seluruhnya, jangan dilewati:
1. `docs/gemini/00-instruksi-utama.md` (versi 3). Ini aturan riset, format JSON, dan daftar nilai yang diizinkan. **§1 (anti-mengarang), §11 (kesalahan batch sebelumnya), dan §12 (makhluk baru) paling penting.**
2. `docs/gemini/batches/batch-001-fix-1.md`. Ini contoh nyata kesalahan yang membuat entri ditolak.
3. Dua contoh jawaban yang sudah lulus, untuk meniru format dan kedalaman: `data/gemini/inbox/batch-024.md` dan `data/gemini/inbox/batch-025.md`, beserta `data/gemini/reviews/batch-025.review.md`.
4. `data/gemini/progress.json`.

## Cara riset

- **Buka halaman sumber yang sebenarnya** (web search atau `curl -sL` ke URL-nya), lalu salin kutipan kata demi kata dari teks halaman itu. Pemeriksa akan mengunduh halaman yang sama dan mencari setiap kutipan di sana. Kutipan yang tidak ditemukan membuat entri ditolak.
- Untuk Wikipedia, teks bersih paling mudah diambil lewat API, misalnya `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&titles=<Judul>`. URL yang ditulis di entri tetap URL artikel biasa (`https://en.wikipedia.org/wiki/<Judul>`).
- Untuk gambar, pastikan nama berkas dan lisensinya di Wikimedia Commons (`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&titles=File:<nama>&format=json`).
- Pengetahuanmu sendiri **bukan sumber**. Detail yang tidak bisa kamu kutip dari halaman yang kamu buka harus dihapus.

## Urutan kerja per batch

1. Baca `docs/gemini/batches/<batch>.md`.
2. Riset setiap makhluk. Tulis setiap entri ke `data/gemini/inbox/<batch>.md` **begitu satu entri selesai**, supaya tidak ada yang hilang kalau sesi terputus. Formatnya satu blok ```json per makhluk, sama seperti contoh.
3. Jalankan `npm run gemini:verify -- <batch>`.
4. Baca `data/gemini/reviews/<batch>.fix-draft.md` dan `data/gemini/reviews/<batch>.review.md`.
5. Perbaiki **semua error**, dan semua peringatan "Tidak muncul di kutipan mana pun". Peringatan lain juga diperbaiki kalau masuk akal. Tulis entri yang diperbaiki secara lengkap ke `data/gemini/inbox/<batch>-fix-<n>.md` (n = 1, 2, 3), jangan menimpa berkas sebelumnya, lalu jalankan pemeriksa lagi.
6. Berhenti memperbaiki setelah 3 putaran. Entri yang masih gagal dicatat di `perlu_manusia`, lalu lanjut ke batch berikutnya.
7. Perbarui `data/gemini/progress.json`, lalu lanjut ke batch berikutnya.

Format entri `data/gemini/progress.json` (tambahkan, jangan hapus entri yang sudah ada):

```json
"batch-026": {"status": "lulus", "putaran": 1, "entri": 5, "skip": 0, "perlu_manusia": [], "catatan": "dikerjakan oleh Codex"}
```

`status` diisi salah satu dari: `lulus` (semua entri tanpa error), `sebagian` (ada entri `perlu-manusia`), atau `dikerjakan` (batch sedang berjalan). `catatan` selalu diawali "dikerjakan oleh Codex". Kalau sumbernya lemah, tambahkan keterangan singkat, misalnya "; ekek: artikel Wikipedia ditandai tanpa sumber".

## Larangan

- **Jangan mengubah file lain** di repositori selain `data/gemini/inbox/*` dan `data/gemini/progress.json`. Laporan di `data/gemini/reviews/` boleh berubah karena ditulis oleh pemeriksa. Terutama jangan mengubah `scripts/`, `docs/`, `data/gemini/batches/`, `data/gemini/worklist.json`, atau `data/creatures.json`.
- **Jangan mengakali pemeriksa.** Contohnya: mengubah skrip, menulis ulang kutipan supaya cocok padahal teks aslinya berbeda, atau menambahkan nama ke kutipan.
- **Jangan menulis dari ingatan.** Entri pendek yang seluruhnya bersumber lebih baik daripada entri panjang yang sebagian dikarang.
- **Jangan melakukan git commit, push, pull, atau reset.**
- **Jangan berhenti untuk bertanya** kecuali ada masalah yang menghentikan semua pekerjaan (misalnya `npm` gagal atau jaringan mati total). Keputusan per makhluk kamu ambil sendiri sesuai instruksi, termasuk `skip` untuk item yang ternyata bukan makhluk mitologi (§12).

## Setiap 25 batch

Tulis ringkasan singkat: batch terakhir yang selesai, jumlah entri `lulus`, `skip`, dan `perlu-manusia`, serta masalah yang sering muncul. Setelah itu langsung lanjutkan.

## Kalau kuota hampir habis

Selesaikan entri yang sedang dikerjakan, jalankan pemeriksa untuk batch itu, lalu perbarui `progress.json`. Batch yang belum selesai diberi status `dikerjakan`. Setelah itu tulis batch terakhir yang `lulus`.
