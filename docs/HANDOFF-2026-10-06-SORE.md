# Serah terima — 6 Oktober 2026 (sore)

Untuk PC lain: **jalankan `git pull` dulu.** Semua yang tercantum sebagai selesai di bawah sudah di-commit dan di-push ke `main`. Dokumen ini menggantikan [HANDOFF-STATUS-2026-10-06.md](HANDOFF-STATUS-2026-10-06.md) (pagi). Pembagian kerja dan keputusan pemilik proyek yang lebih rinci ada di [BAGI-TUGAS-2026-10-06.md](BAGI-TUGAS-2026-10-06.md).

## Angka sekarang

Hitungan dari `node scripts/gemini/fill-status.mjs`, dengan 4.856 makhluk dalam rencana:

| Kategori | Pagi | Sekarang |
|---|---:|---:|
| Lengkap, valid, bergambar (tampil di situs) | 904 | **1.015** |
| Lengkap, valid, tanpa gambar | 598 | 717 |
| Lengkap, tidak valid | 55 | 0 |
| Tidak lengkap | 1.968 | 1.793 |
| Belum ada entri | 1.317 | 1.331 (+14 tokoh sastra di batch-154) |

Penilaian kekuatan (Power, Threat, Fear) yang tampil di situs: **868 makhluk** (pagi: 18).

## Keputusan pemilik proyek hari ini (berlaku ke depan)

1. **Lima kategori status** (`fill-status.mjs`): `lengkap-bergambar`, `lengkap-informasi`, `lengkap-tidak-valid`, `tidak-lengkap`, dan `belum-ada-entri`.
2. **Gambar hanya untuk entri yang lengkap dan valid.** Gambar di entri lain tidak dihapus, tetapi ditandai `gambar_ditahan` dan tidak tampil. Sekarang ada 87 gambar yang ditahan.
3. **Makhluk dari karya sastra boleh masuk**, klasik maupun modern. Film, anime, komik, dan game tetap tidak. Manusia tetap dilewati, jadi Tang Sanzang dan Rulai (Buddha) tidak dibuat entri. Aturannya di §12 `docs/gemini/00-instruksi-utama.md`.
4. **Nama besar** (makhluk dengan edisi Wikipedia terbanyak):
   - Mereka didahulukan di antrean pengayaan.
   - Gambarnya harus sangar, dengan efek kekuatan yang terdokumentasi. Aturannya ada di `scripts/nama-besar.mjs` → `policy`.
5. **Pekerjaan Gemini dihentikan.** Dari 14 gambarnya, 5 lolos (batch 1005). Prompt Gemini sudah dihapus; jangan dipakai lagi kecuali pemilik meminta.
6. **Penilaian kekuatan wajib merujuk klaim riset.** Datanya di `data/power/<batch>.json`, lalu `node scripts/build-power.mjs` membuat `js/power-assessments.js`. Makhluk yang risetnya belum membahas kekuatannya ditandai `perlu_riset`.

## Yang selesai hari ini

| Commit | Isi |
|---|---|
| `67f76c9` | Lima kategori status dan penanda `gambar_ditahan` |
| `ab9cd02` | Mode `verify.mjs --changed`, `gemini:enrich-queue`, subagent `peneliti-mythics` |
| `b264e0e` | 5 gambar Gemini lolos (batch 1005); Gemini dihentikan |
| `db1e3b9` | Tokoh sastra (batch-154); antrean dari nama terbesar; jalur penilaian kekuatan; aturan gambar nama besar |
| `b0214a1` | Gabungan sesi Claude Cloud pengayaan pertama: batch 140–141 diterima, 175 entri diperkaya |
| `0ca1a78` | 107 gambar nama besar dari Codex lolos tinjauan Claude dan terpasang (46 pengganti, 61 baru); 42 ditolak |
| `3f384e5`, `301e337` | Gabungan sesi Claude Cloud kekuatan (sebagian); 868 penilaian tampil |

## Belum selesai — lanjutkan dari sini

### 1. Claude Cloud pengayaan: BELUM berjalan

Sesi pengayaan pertama dimatikan setelah 175 entri, dan hasilnya sudah digabung ke `main`. **Sesi baru belum dimulai.** Prompt-nya sudah siap, dan Tahap 1 sudah ditandai selesai.

Cara memulai di claude.ai/code:
1. Pilih repo `asaddin02/asadin-mythological-creatures`.
2. Pilih model **Sonnet 5.5** dengan effort **high**.
3. Atur akses jaringan environment ke **Full**. Ini wajib, karena verifier mengunduh halaman sumber.
4. Kirim pesan ini:
   ```
   Baca dan jalankan docs/gemini/PROMPT-CLOUD.md sampai selesai. Tahap 1 sudah selesai; mulai dari Tahap 1b.
   ```

Isi pekerjaannya:
- **Tahap 1b:** 14 makhluk sastra di batch-154 (Sun Wukong, Zhu Bajie, Sha Wujing, White Dragon Horse, Bull Demon King, Red Boy, Princess Iron Fan, Baigujing, Six-Eared Macaque, Erlang Shen, Nezha, Count Dracula, Cthulhu, Frankenstein's monster).
- **Tahap 2:** **1.793 entri** tidak lengkap, dimulai dari nama terbesar (Shiva, Zeus, Athena, Gabriel, Satan, Odin, Ra Mesir, Anubis, …). Perkiraannya sekitar 14 jam kerja.

Sesi cloud push ke branch-nya sendiri (`claude/...`), bukan ke `main`. Setelah sesi melapor selesai, atau kalau sesi dimatikan:
```bash
git fetch && git merge --no-ff origin/<branch-sesi>
node scripts/gemini/fill-status.mjs && npm test && npm run check
git add data/gemini/fill-status.json && git commit && git push
```
Sebelum digabung, baca dulu sampel klaim baru: `statement` harus sesuai `quote`. Branch sesi pertama (`claude/gemini-prompt-cloud-docs-7afxk1`) sudah digabung.

### 2. Claude Cloud kekuatan: 18 berkas tertahan

Sesinya sudah menilai semua 936 makhluk, tetapi dua commit terakhir gagal di-push karena autentikasi GitHub di container cloud bermasalah. Batch yang tertahan: 059, 060, 061, 062, 064, 067, 068, 120 (bagian 2), dan 126. Branch-nya `claude/blissful-gates-wuif73`, dan bagian yang sudah di-push (sampai `cd3ef83`) sudah digabung.

- **Kalau container-nya masih hidup:** sambungkan ulang GitHub di pengaturan connector claude.ai, lalu minta sesi itu menjalankan `git push -u origin claude/blissful-gates-wuif73`. Setelah itu, di lokal:
  ```bash
  git fetch && git merge --no-ff origin/claude/blissful-gates-wuif73
  node scripts/build-power.mjs && npm test
  git add js/power-assessments.js && git commit && git push
  ```
- **Kalau container-nya sudah mati:** jalankan sesi kekuatan baru dengan `docs/gemini/PROMPT-CLOUD-KEKUATAN.md`. `npm run power:queue` sekarang mendaftar **79 makhluk**, yaitu yang ada di 18 berkas itu ditambah makhluk yang baru tampil hari ini.

Hasil sesi kekuatan:
- Sebaran Power: superhuman sekitar 62%, monstrous 13%, divine 10%, regional 5%, cosmic dan mortal masing-masing 2%.
- **231 makhluk ditandai `perlu_riset`.** 18 di antaranya nama besar: michael, hathor, bastet, lucifer, thoth, loch-ness-monster, sobek, troll, marduk, iblis, apophis, tefnut, enki, perun, simurgh, ghoul, nephilim, dan lamassu.
- Mereka butuh **pengayaan riset kekuatan** (klaim tentang kuasa, ranah, dan perbuatan) setelah sesi pengayaan selesai. Tahap ini belum punya prompt.

### 3. Codex: 42 gambar nama besar perlu dibuat ulang

Tinjauan kedua menolak 42 gambar. Statusnya `needs-correction`, dan alasan per gambar ada di `correction_notes` di receipt-nya:
- `data/artwork-generated/presentation-revision-nama-besar/*.json`, 11 pengganti (gambar lamanya tetap tampil);
- `data/artwork-generated/batch-1047/*.json` dan `batch-1055/*.json`, 31 gambar baru.

Masalah yang paling sering:
- dewa atau dewi tampil sebagai **manusia biasa berukuran normal**;
- **sosoknya tidak ada** di gambar: Ahura Mazda, Inari, Manat, Tammuz, Tengri, Set.

Kasus khusus:
- **Lucifer** ditolak dua kali. Riset mendukung kejatuhan bintang fajar dan pembawa cahaya dari surga (c02, c04, c06, c10).
- **Janus** kehilangan wajah keduanya.
- **`ra` adalah Rå dari Skandinavia, bukan Ra Mesir.** Ra Mesir adalah `ra-q1252904`, yang masih tidak lengkap. Daftar nama besar sudah diperbaiki.

Prompt Codex: `docs/PROMPT-CODEX-NAMA-BESAR.md`. Untuk putaran berikutnya:
- buat ulang ke-42 gambar itu sesuai `correction_notes`;
- gambar nama besar baru yang risetnya sudah lengkap setelah pengayaan (masih ada 229 yang menunggu).

`data/artwork-nama-besar.json` adalah potret putaran pertama yang dipakai `scripts/audit-artwork-nama-besar.mjs`. Simpan potret itu sebelum menjalankan ulang `node scripts/nama-besar.mjs` untuk putaran baru.

Setelah Codex selesai, Claude lokal yang menjadi peninjau kedua: lihat setiap gambar, lalu tulis `root_visual_review` (reviewer `claude`) dengan status `reviewed` atau `needs-correction`. Lalu jalankan:
- untuk gambar pengganti: `node scripts/integrate-artwork-presentation.mjs --revision nama-besar`;
- untuk gambar baru: `prepare-reviewed-artwork-records.mjs` (hanya untuk makhluk yang gambarnya lolos), lalu `integrate-artwork-batch.mjs <N>`.

### 4. Belum dibagikan

- **1.331 entri yang belum diriset sama sekali:** batch 081–109, sisa 139 dan 141, dan batch-153. Di dalamnya ada 5 iblis tujuh dosa (Mammon, Asmodeus, Leviathan, Beelzebub, Belphegor) di batch-084, Typhon, dan Surtr.
- **717 entri lengkap tanpa gambar** yang bukan nama besar.

## Catatan teknis

- **PNG asli batch-1000 dan revisi-1000 hanya ada di PC lain**, di `/home/asadin/Portfolio/asadin-edu/...`. Di PC ini, `audit-artwork-batch.mjs 1000` dan `audit-artwork-presentation.mjs` (revisi 1000) gagal karena berkas itu tidak ada. Jalankan kedua audit itu di PC lain.
- **Aturan audit dilonggarkan:** audit tidak lagi mewajibkan jumlah gambar atau katalog sama persis dengan saat batch dimulai, cukup tidak ada yang hilang. Batch nama besar (`keep_rejected_attempts`) juga menyimpan percobaan yang ditolak sebagai riwayat.
- **Tes yang dulu mengandalkan Jörmungandr** sebagai satu-satunya makhluk Cosmic/T6/F4 sudah disesuaikan (`tests/scaling.mjs` dan `tests/browser.mjs`), karena penilaian baru menambah makhluk berskala dunia.
- **Commit dari sesi cloud:** jangan commit `fill-status.json`, `enrich-queue.json`, `power-queue.json`, atau `js/power-assessments.js`. Semua itu dibuat ulang di lokal.

## Proyek lain yang dikerjakan hari ini

- **SEO kelima situs:** sitemap, halaman 404 yang benar, dan tag Google Search Console lewat variabel repo `GOOGLE_SITE_VERIFICATION`. Kodenya per akun, jadi satu kode berlaku untuk semua situs. BioTaxa, Alchemist, Phsyco, dan Mythics didaftarkan pemilik ke Search Console.
- **Portofolio sengaja tidak diindeks**, karena berisi CV: setiap halaman diberi `noindex`, header `X-Robots-Tag` dipasang, dan sitemap dihapus. Untuk mengaktifkan lagi, ubah `SEARCH_INDEXING` di `src/layouts/Base.astro`.
- **Alamat Mythics** sekarang https://mythologies.pages.dev.
