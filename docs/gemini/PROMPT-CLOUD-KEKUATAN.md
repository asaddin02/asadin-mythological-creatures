# Tugas Claude Cloud Code: penilaian kekuatan makhluk yang sudah tampil

Kamu agen utama. Tugasmu memberi penilaian **Power, Threat, dan Fear** untuk sekitar 890 makhluk yang sudah tampil di situs publik tetapi belum dinilai, mulai dari nama-nama terbesar. Penilaiannya dikerjakan oleh beberapa subagent sekaligus. Kamu membagi pekerjaan, memeriksa hasilnya, dan menyimpannya.

Sesi Claude Cloud lain sedang memperkaya riset, dengan `docs/gemini/PROMPT-CLOUD.md`. Pekerjaan kalian tidak bersinggungan: kamu hanya menulis ke `data/power/`, dan tidak pernah mengubah riset.

## Persiapan (sekali per sesi)

```bash
git pull --rebase
npm ci
npm run -s power:queue
```

Baca sendiri, sekali saja: `.claude/agents/penilai-kekuatan-mythics.md` (aturan untuk subagent) dan `js/scaling.js` (definisi level dan contoh penilaian), supaya kamu bisa menilai hasil subagent.

## Subagent

- Pakai subagent bertipe **`penilai-kekuatan-mythics`**. Definisinya mengunci model `claude-sonnet-5-5` dengan effort `high`, dan pengaturan *thinking* ikut sesimu. Saat memanggil Agent, isi juga `model: "sonnet"`.
- Kalau tipe itu tidak tersedia, pakai `general-purpose` dengan `model: "sonnet"`. Tempelkan seluruh isi `.claude/agents/penilai-kekuatan-mythics.md` (tanpa frontmatter) di awal prompt-nya. Jangan memakai `haiku`.
- Jalankan **5 subagent sekaligus** di latar belakang. Masing-masing memegang **satu batch** dengan **paling banyak 20 makhluk**. Dua subagent tidak boleh memegang batch yang sama pada waktu yang sama.

## Alur

1. Ambil batch dari atas `data/gemini/power-queue.json`. Urutannya sudah dari nama terbesar, yaitu yang punya edisi Wikipedia terbanyak.
2. Setiap kali subagent selesai:
   - Jalankan `node scripts/build-power.mjs --validate`. Harus tanpa masalah.
   - **Periksa sampel.** Untuk 2 makhluk di potongan itu, buka risetnya dengan `node scripts/gemini/show-entry.mjs <slug>` dan cek bahwa klaim yang dirujuk memang mendukung levelnya. Level tinggi (`divine`, `cosmic`, `transcendent`, `t5`–`t7`, `f5`–`f6`) harus didukung klaim yang jelas. Bandingkan juga dengan contoh di `EDITORIAL_ASSESSMENTS` supaya level antarmakhluk konsisten. Kalau ada yang tidak tepat, kirim balik ke subagent yang sama (SendMessage) untuk diperbaiki.
   - Beri subagent itu potongan berikutnya.

### Simpan setiap 50 makhluk

Begitu jumlah makhluk yang sudah dinilai (termasuk yang hanya ditandai `perlu_riset`) sejak push terakhir mencapai **50 atau lebih**, langsung commit dan push:

```bash
git add data/power/<batch>.json   # ulangi untuk setiap batch yang potongannya sudah selesai
git commit -m "data(kekuatan): <N> makhluk dinilai oleh claude-cloud (<daftar batch>; sisa <M>)"
git push
```

- `<M>` diambil dari keluaran `npm run -s power:queue` setelah commit.
- Kalau push ditolak, jalankan `git pull --rebase` lalu `git push` lagi. Kalau rebase konflik, jalankan `git rebase --abort`, berhenti, dan laporkan.
- Push juga di akhir sesi dan sebelum kuota habis.

## Larangan

- Commit hanya `data/power/*.json`. Jangan commit `js/power-assessments.js`, karena berkas itu dibuat ulang di lokal saat pemeriksaan akhir. Jangan commit juga `data/gemini/power-queue.json`.
- Jangan mengubah riset (`data/gemini/`), `js/`, `scripts/`, atau `docs/`.
- Jangan memakai `git add -A`, `git add .`, `git push --force`, `git reset --hard`, atau `git checkout -- <berkas>`.

## Laporan

Setiap 200 makhluk, tulis ringkasan singkat di chat:
- sebaran level Power;
- jumlah yang ditandai `perlu_riset`, dan nama-nama besar di antaranya;
- masalah yang sering muncul.

Setelah itu lanjutkan tanpa menunggu. Kalau antrean habis, push dan laporkan selesai, termasuk daftar lengkap nama besar (sitelinks ≥ 40) yang ditandai `perlu_riset`. Daftar itu menjadi bahan pengayaan riset kekuatan setelah sesi pengayaan selesai. Claude Code lokal akan memeriksa semuanya.
