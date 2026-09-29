# Tugas: riset 5.000 makhluk Mythics (mode agen)

Kamu bekerja di repositori ini sebagai peneliti Mythics. Tugasmu mengerjakan **seluruh** daftar kerja: 5.000 makhluk dalam 537 batch (`batch-001` sampai `batch-537`). Kerjakan tanpa menunggu persetujuan di antara batch, sampai semuanya selesai atau kuotamu habis.

## Sebelum mulai

Baca seluruhnya, jangan dilewati:
1. `docs/gemini/00-instruksi-utama.md` (versi 3). Ini aturan riset, format JSON, dan daftar nilai yang diizinkan. **§1 (anti-mengarang), §11 (kesalahan batch sebelumnya), dan §12 (makhluk baru) paling penting.**
2. `docs/gemini/batches/batch-001-fix-1.md`. Ini contoh nyata kesalahan yang membuat entri ditolak.
3. `data/gemini/progress.json`, kalau ada. Lanjutkan dari batch pertama yang belum `lulus`.

## Urutan kerja

1. **Mulai dari `batch-001`.** Entri awalnya ada di `data/gemini/inbox/batch-001.md`. Perbaiki sesuai `batch-001-fix-1.md`, tambahkan bagian `jenis` (§8.11), lalu tulis hasilnya ke `data/gemini/inbox/batch-001-fix-1.md`.
2. **Kerjakan `batch-002` sampai `batch-537` berurutan.** Untuk setiap batch:
   1. Baca `docs/gemini/batches/<batch>.md`.
   2. Riset setiap makhluk dengan membuka halaman web yang sebenarnya. Tulis setiap entri ke `data/gemini/inbox/<batch>.md` **begitu satu entri selesai**, supaya tidak ada yang hilang kalau sesi terputus.
   3. Jalankan `npm run gemini:verify -- <batch>`.
   4. Baca `data/gemini/reviews/<batch>.fix-draft.md` dan `data/gemini/reviews/<batch>.review.md`.
   5. Perbaiki **semua error**, dan semua peringatan "Tidak muncul di kutipan mana pun". Peringatan lain juga diperbaiki kalau masuk akal. Tulis entri yang diperbaiki secara lengkap ke `data/gemini/inbox/<batch>-fix-<n>.md` (n = 1, 2, 3), lalu jalankan pemeriksa lagi.
   6. Berhenti memperbaiki setelah 3 putaran. Entri yang masih gagal dicatat di progress sebagai `perlu-manusia`, lalu lanjut ke batch berikutnya.
   7. Perbarui `data/gemini/progress.json`, lalu lanjut ke batch berikutnya.

Format `data/gemini/progress.json`:

```json
{
  "batch-002": {"status": "lulus", "putaran": 1, "entri": 5, "skip": 0, "perlu_manusia": [], "catatan": ""},
  "batch-003": {"status": "sebagian", "putaran": 3, "entri": 10, "skip": 1, "perlu_manusia": ["slug-x"], "catatan": "kutipan c04 dari halaman yang tidak bisa dibuka"}
}
```

Nilai `status` adalah salah satu dari: `lulus` (semua entri tanpa error), `sebagian` (ada entri `perlu-manusia`), atau `dikerjakan`.

## Larangan

- **Jangan mengubah file lain** di repositori selain `data/gemini/inbox/*` dan `data/gemini/progress.json`. Terutama jangan mengubah `scripts/`, `docs/`, `data/gemini/batches/`, `data/gemini/reviews/`, `data/cache/`, atau `data/creatures.json`.
- **Jangan mengakali pemeriksa.** Contohnya: mengubah skrip, menulis ulang kutipan supaya cocok padahal teks aslinya berbeda, atau menambahkan nama ke kutipan. Kutipan harus disalin dari halaman yang benar-benar kamu buka.
- **Jangan menulis dari ingatan.** Detail yang tidak bisa kamu kutip dihapus dari teks. Entri pendek yang seluruhnya bersumber lebih baik daripada entri panjang yang sebagian dikarang.
- **Jangan melakukan git commit atau push.**
- **Jangan berhenti untuk bertanya** kecuali ada masalah yang menghentikan semua pekerjaan (misalnya perintah `npm` gagal dijalankan). Keputusan per makhluk diambil sendiri sesuai instruksi, termasuk `skip` untuk item yang ternyata bukan makhluk mitologi (§12).

## Setiap 25 batch

Tulis ringkasan singkat di chat: batch terakhir yang selesai, jumlah entri `lulus`, `skip`, dan `perlu-manusia`, serta masalah yang sering muncul. Setelah itu langsung lanjutkan.
