# Tugas Claude Cloud Code: validasi 55 entri dan perkaya 1.968 entri Mythics

Kamu agen utama. Kamu bekerja di repositori ini lewat Claude Code di cloud, jadi satu-satunya jalan agar pekerjaanmu tidak hilang adalah **commit dan push ke GitHub**. Penelitiannya dikerjakan oleh beberapa subagent sekaligus. Tugasmu membagi pekerjaan, memeriksa hasilnya, dan menyimpannya.

Pembagian kerja seluruh tim ada di `docs/BAGI-TUGAS-2026-10-06.md`. Gemini membuat ilustrasi di PC lokal. Claude Code lokal memeriksa semua hasil di akhir. Kamu tidak menyentuh ilustrasi.

## Persiapan (sekali per sesi)

```bash
git pull --rebase
npm ci
curl -s -o /dev/null -w '%{http_code}\n' 'https://en.wikipedia.org/w/api.php?action=query&titles=Garuda&format=json'
```

Kalau perintah terakhir tidak menghasilkan `200`, berhenti dan beri tahu pengguna: akses jaringan environment cloud harus diubah ke **Full** (atau izinkan semua domain), karena riset dan verifier mengunduh halaman dari banyak situs.

Baca sendiri, sekali saja: `.claude/agents/peneliti-mythics.md` (aturan untuk subagent) dan §1, §4, §11, §12 di `docs/gemini/00-instruksi-utama.md`, supaya kamu bisa menilai hasil subagent.

## Subagent

- Pakai subagent bertipe **`peneliti-mythics`**. Definisinya mengunci model `claude-sonnet-5-5` dengan effort `high`, dan pengaturan *thinking* ikut sesimu. Saat memanggil Agent, isi juga `model: "sonnet"`.
- Kalau tipe `peneliti-mythics` tidak tersedia, pakai `general-purpose` dengan `model: "sonnet"`. Tempelkan seluruh isi `.claude/agents/peneliti-mythics.md` (tanpa frontmatter) di awal prompt-nya. Jangan pernah memakai `haiku`.
- Jalankan **5 subagent sekaligus** di latar belakang. Masing-masing memegang **satu batch** dengan **paling banyak 10 entri**. Dua subagent tidak boleh memegang batch yang sama pada waktu yang sama.
- Prompt tiap subagent memuat: jenis tugas (`validasi` atau `perkaya`), batch, nomor berkas fix `<n>`, dan untuk setiap slug: `nama`, `tier`, `berkas`, dan `kurang` dari antrean (atau daftar error dari laporan verifier untuk tugas validasi).
- Cara menentukan `<n>`: ambil angka `-fix-N` terbesar yang sudah ada untuk batch itu di `data/gemini/inbox/`, lalu tambah 1. Kalau belum ada, `n = 1`.

## Tahap 1: validasi batch 140 dan 141 (55 entri lengkap-tidak-valid)

Kedua batch ini sudah diriset ulang dan memenuhi target, tetapi belum pernah diterima. Saat dicek pada 6 Oktober, tiga entri batch-140 gagal karena artikel Wikipedia-nya sudah berubah: mokele-mbembe, oshunmare, dan mbielu-mbielu-mbielu.

1. Jalankan verifikasi penuh (tanpa `--changed`) supaya semua kutipan dicek ke halaman hari ini:
   ```bash
   NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" node scripts/gemini/verify.mjs batch-140
   NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection" node scripts/gemini/verify.mjs batch-141
   ```
   Kalau ada `fetch failed` untuk sebuah situs, hapus berkas cache yang berisi `"error":"fetch failed"` di `data/cache/gemini-verify/pages/` lalu ulangi sekali.
2. Entri yang `perlu-perbaikan` diberikan ke subagent dengan tugas `validasi`.
3. Setelah semuanya lulus (atau sudah 3 putaran), tutup batchnya:
   ```bash
   npm run -s gemini:done -- batch-140 --agent claude-cloud --catatan "divalidasi ulang 6 Okt terhadap halaman terbaru"
   npm run -s gemini:done -- batch-141 --agent claude-cloud --catatan "divalidasi ulang; 10 slug belum ada entri, bukan cakupan tugas ini"
   ```
   Batch-141 akan berstatus `sebagian` karena 10 makhluknya memang belum diriset. Itu benar; jangan meriset ke-10 makhluk itu.
4. Commit dan push:
   ```bash
   git add data/gemini/inbox/batch-140-fix-* data/gemini/inbox/batch-141-fix-* data/gemini/reviews/batch-140.* data/gemini/reviews/batch-141.* data/gemini/progress/batch-140.json data/gemini/progress/batch-141.json
   git commit -m "data(validasi): batch-140 dan batch-141 diterima oleh claude-cloud"
   git push
   ```
   Kalau batch itu tidak punya berkas fix baru, hapus pola `-fix-*` dari `git add` supaya perintahnya tidak gagal.

## Tahap 2: perkaya entri tidak lengkap (1.968 entri)

```bash
npm run -s gemini:enrich-queue
```

Perintah ini menulis `data/gemini/enrich-queue.json`, berisi batch berurutan dengan entri yang gambarnya ditahan di depan. Ambil batch dari atas. Bagi entri setiap batch menjadi potongan paling banyak 10. Batch dengan 45 entri dikerjakan oleh satu subagent dalam beberapa tugas berurutan (fix-n, fix-n+1, …), bukan oleh beberapa subagent sekaligus.

Setiap kali sebuah subagent selesai:

1. Jalankan `node scripts/gemini/verify.mjs <batch> --changed`. Pastikan semua slug yang dilaporkan `lengkap` atau `mentok` memang `lulus-otomatis`, dan tidak ada entri lain di batch itu yang berubah menjadi `perlu-perbaikan`.
2. **Periksa sampel.** Untuk satu slug acak di potongan itu, bandingkan 3 klaim baru: `statement` harus sesuai isi `quote`, dan prosa tidak boleh menambah nama, tahun, atau tempat yang tidak ada di klaim. Kalau ada yang salah, kirim balik ke subagent yang sama (SendMessage) untuk diperbaiki sebelum disimpan.
3. Langsung beri subagent itu potongan berikutnya, supaya selalu ada 5 yang bekerja.

### Simpan setiap 50 entri

Hitung entri yang **selesai** (hasil `lengkap`, `mentok`, `gagal`, atau `bukan-makhluk`) sejak push terakhir. Begitu jumlahnya mencapai **50 atau lebih**, langsung commit dan push semua potongan yang sudah selesai. Jangan menunggu batch atau seluruh pekerjaan selesai.

```bash
git add data/gemini/inbox/<batch>-fix-<n>.md data/gemini/reviews/<batch>.* data/gemini/enrich/<batch>.json   # ulangi untuk setiap batch yang potongannya sudah selesai
git commit -m "data(pengayaan): <N> entri oleh claude-cloud (<daftar batch>; sisa <M> entri)"
git push
```

- Hanya masukkan berkas batch yang subagentnya **sudah selesai**. Batch yang masih dikerjakan disimpan di push berikutnya.
- `<M>` diambil dari keluaran `npm run -s gemini:enrich-queue` setelah commit.
- Kalau push ditolak, jalankan `git pull --rebase` lalu `git push` lagi. Kalau rebase konflik, jalankan `git rebase --abort`, berhenti, dan laporkan.
- Push juga di akhir sesi dan sebelum kuota habis, berapa pun jumlah entrinya.

Jangan menjalankan `gemini:done` untuk batch pengayaan. Status batch itu sudah `lulus` atau `sebagian`, dan `gemini:done` akan menimpa catatan peneliti aslinya.

## Larangan

- Jangan commit `data/gemini/fill-status.json`, `data/gemini/enrich-queue.json`, `data/creatures.json`, `scripts/`, `docs/`, atau berkas ilustrasi. Berkas antrean dan status dihitung ulang di lokal.
- Jangan memakai `git add -A`, `git add .`, `git push --force`, `git reset --hard`, atau `git checkout -- <berkas>`.
- Jangan menyentuh batch 081–109 dan batch-153 (belum ada entrinya; bukan cakupan tugas ini), serta berkas `data/artwork-*`.
- Jangan menerima entri dari subagent yang tidak lulus verifier, dan jangan mengubah kutipan supaya terlihat cocok.

## Laporan

Setiap 200 entri, tulis ringkasan singkat di chat: jumlah `lengkap`, `mentok`, `gagal`, `bukan-makhluk`, batch yang sudah dikerjakan, sisa antrean, dan masalah yang sering muncul. Setelah itu lanjutkan tanpa menunggu.

Kalau antrean habis, jalankan `npm run -s gemini:enrich-queue` sekali lagi untuk memastikan, push, lalu laporkan selesai. Claude Code lokal yang akan memeriksa semuanya.
