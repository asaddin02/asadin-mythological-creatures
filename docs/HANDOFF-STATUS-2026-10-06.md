# Serah terima status — 6 Oktober 2026

Untuk PC lain: jalankan `git pull` sebelum bekerja. Semua pekerjaan di bawah sudah di-commit, di-push, dan dideploy. Tidak ada perubahan lokal yang tertinggal.

## Yang sudah dilakukan

- **Alamat situs berubah** menjadi **https://mythologies.pages.dev** (sebelumnya mythics-99o.pages.dev). Variable repo kini `CLOUDFLARE_PAGES_PROJECT=mythologies` dan `SITE_URL=https://mythologies.pages.dev`. Proyek lama `mythics` sudah dihapus lewat workflow manual `Delete retired Pages project`. Bucket R2 `mythics-media` dipertahankan.
- **Ilustrasi: target 1.000 tercapai.** Batch 1000 selesai 203/203 dan 141 ilustrasi diganti lewat revisi tampilan. Katalog memuat 1.936 entri dengan 1.000 ilustrasi aktif. Rincian ada di [HANDOFF-ARTWORK-1000-2026-10-05.md](HANDOFF-ARTWORK-1000-2026-10-05.md) dan [HANDOFF-ARTWORK-REVISION-2026-10-06.md](HANDOFF-ARTWORK-REVISION-2026-10-06.md).
- **Riset:** pembersihan batch 120 dan 138–141 dicatat di commit `7b0ed3d`.
- **Banner beranda dirombak oleh Codex** (commit `f649f1a` dan `4872b0a`): foto tajam memenuhi banner, slide lebih pelan, kartu legenda tidak menutupi wajah. Diuji pada tujuh ukuran layar.
- **Deploy:** run Deploy untuk `4872b0a` sukses, dan `scripts/check-public-media.mjs` terhadap situs live melaporkan 1.000/1.000 ilustrasi terbaca, tanpa kegagalan.
- Codex berhenti tepat setelah mendorong `4872b0a`; tidak ada pekerjaan setengah jadi darinya.

## Sisa target (4.842 makhluk dalam rencana, 127 entri bukan makhluk dikecualikan)

Hitungan dari `node scripts/gemini/fill-status.mjs` (`data/gemini/fill-status.json`).

| Tingkat | Jumlah | Arti |
|---|---|---|
| lengkap-bergambar | 904 | Riset memenuhi target dan sudah bergambar. Hanya ini yang tampil di situs publik. |
| lengkap-informasi | 598 | Riset memenuhi target, tetapi belum punya gambar yang disetujui. |
| valid | 1.968 | Lulus verifikasi otomatis, tetapi masih di bawah target tier (core 6 klaim/2 sumber, rich 15 klaim/3 sumber). |
| tidak-valid | 1.372 | Belum diriset, sedang dikerjakan, ditolak, atau gagal. |

**Yang belum selesai: 3.340 entri** (1.372 tidak-valid + 1.968 valid yang perlu diperkaya) dari 4.842. Entri yang sudah memenuhi target: 1.502 (31%).

Rincian 1.372 entri tidak-valid:

- **1.298** di batch kosong 081–109 (kecuali 095). Ambil dengan `npm run gemini:next -- --agent <nama>`.
- **72** di batch 138–141 (rencana perbaikan dari nol). 138 dan 139 berstatus `sebagian`, sedangkan **140 dan 141 masih tercatat `dikerjakan` oleh claude tetapi tidak ada yang mengerjakan**, jadi boleh diambil ulang.
- **2** tambahan manual di batch 153 (ryomen-sukuna, istervo).

Urutan yang disarankan: 138–141, lalu batch 153, lalu 081–109, lalu pengayaan 1.968 entri `valid`. Setelah itu, entri `lengkap-informasi` (598) butuh ilustrasi supaya naik ke `lengkap-bergambar` dan tampil publik. Batch dengan status `ditolak` atau `perlu-perbaikan` tidak dibagikan otomatis oleh `gemini:next`; ambil dengan menulis progres `dikerjakan` secara manual.

## Catatan kerja

- Aturan: hanya makhluk mitologis. Manusia, rasul, nabi, santo, raja dan pahlawan dilewati (instruksi §12).
- Alur satu batch: tulis spesifikasi → `gabung` → `node scripts/gemini/verify.mjs <batch>` → cek manual → salin ke inbox → `gemini:done --agent <nama>` → commit hanya berkas batch itu. Alat bantu sesi lama ada di /tmp dan bersifat sementara, jadi bangun ulang bila hilang (lihat catatan memori).
- Pengambilan fetch: untuk gutenberg.org gunakan `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"`. Hapus JSON `"error":"fetch failed"` di `data/cache/gemini-verify/pages` sebelum verifikasi ulang. sacred-texts.com dan beberapa situs lain memberi 403 ke verifier. API Wikipedia dan Wikidata membatasi laju bila banyak agent berjalan bersamaan.
- Ilustrasi hanya dapat dibuat dengan OpenAI built-in `image_gen` (Codex) dan wajib diperiksa dua reviewer berbeda. Jangan memalsukan reviewer kedua.
- Jangan menjalankan ulang `scripts/prepare-artwork-batch-1000.mjs` pada batch yang sudah selesai.
- Berkas PNG asli (±3,4 GB di `data/artwork-generated/`) tidak ada di Git dan hanya ada di PC ini.
