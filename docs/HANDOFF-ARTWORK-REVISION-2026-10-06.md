# Serah terima revisi ilustrasi — 6 Oktober 2026

**Selesai: 141/141 revisi terpasang**, setelah pemeriksaan seluruh 1.000 ilustrasi oleh tiga sub-agent secara paralel. Sebanyak 859 ilustrasi dipertahankan. Katalog tetap 1.936 entri dengan 1.000 ilustrasi aktif; isi fakta, identitas, riset dan jumlah entri tidak berubah.

## Hasil dan artefak

- [Galeri sebelum/sesudah](artwork-presentation-revision-1000.html): 141 pasangan gambar, pencarian dan filter; klaim sumber, pilihan artistik serta prompt dapat dibuka per kartu.
- [Ledger](../data/artwork-presentation-revision-1000.json): seluruh 1.000 keputusan, 141 penggantian, riset sumber, prompt persis dan hash lama/baru.
- [Audit akhir](../data/artwork-presentation-revision-1000-audit.json): lulus, 282 berkas PNG/WebP hasil revisi didekode, dua reviewer dan hash diperiksa.
- `data/artwork-generated/presentation-revision-1000/{slug}.json`: receipt dengan prompt asli/edit dan dua review visual yang terikat ke hash PNG terpilih.
- `data/artwork-generated/presentation-revision-1000/originals/`: seluruh 141 PNG terpilih. Kandidat koreksi juga disimpan; beberapa batch mempunyai salinan native `*-mythic-presence.png` untuk kontrak audit historis.
- `assets/art/`: WebP baru bernama `*-mythic-presence.webp` atau `*-regeneration-139-mythic-presence.webp`, dipasang lewat manifest dan pemetaan kartu/dossier.

Gambar menggunakan OpenAI built-in `image_gen`. Peran, adegan, anatomi dan skala mengikuti klaim dalam riset yang telah diterima. Sumber diperiksa dari catatan riset lokal yang tersedia; sesi ini tidak mengklaim mengambil ulang seluruh URL. Pakaian, tata letak dan pilihan ilustrasi lain dibedakan dari fakta sumber. Contoh perubahan: Heqet menjadi perempuan berkepala katak, Otso muncul dari wol di pantai, Henwen bersama anak serigala dan elang, dan Akhlut memakai varian gabungan orca-serigala.

Koreksi mencakup skala Ihizi/Cressie, kuku Mahishi, adegan malam Boiuna, satu matahari Nongshaba, empat kaki Hrímfaxi, embun dari tanduk Duraþrór, rahang tulang tanpa gigi individual Crocotta, serta penghapusan tanda tangan Samca/Freybug. Percobaan sebelumnya dipertahankan.

## Pelestarian dan pemeriksaan

Seluruh 1.000 WebP sebelumnya dan 918 native yang ada saat baseline tetap cocok dengan hash awal. Sebanyak 82 path native lama sudah hilang sebelum pekerjaan ini, dan dicatat apa adanya. Seluruh 141 native baru tersedia di workspace. Audit regenerasi historis kini mengakui native lama yang pernah disetujui dan diarsipkan hanya jika path/hash baseline cocok; hash varian yang ditolak tetap harus berbeda atau berkasnya tidak ada.

Semua pemeriksaan berikut lulus:

- `node scripts/audit-artwork-presentation.mjs --require-complete`: 141/141, fakta katalog tetap, 282 berkas didekode.
- `node tests/artwork-presentation.mjs`: salah makhluk, klaim tidak dikenal/diubah, reviewer sama, hash hilang/berbeda, status belum direview, dan perubahan anggota baseline ditolak.
- `node tests/artwork-presentation-browser.mjs`: 141 kartu, 282 gambar, pencarian/filter, desktop 1440 px dan ponsel 390 px tanpa overflow atau error request/browser.
- `node scripts/audit-artwork-batch.mjs 1000 --require-complete`: 203/203, 406 berkas didekode.
- `node scripts/audit-artwork-regeneration.mjs --require-complete`: 139/139, 278 berkas didekode; 225 berkas lama tetap dihapus dan 10 varian penolakan tetap tidak digunakan.
- `npm run check`: nol error/warning; `npm test`: aplikasi, riset, scaling dan kebijakan server lulus.
- `npm run build:site`: 7.395 berkas, 5.962 berkas API, 460,4 MB; berkas terbesar 6,2 MB.
- `node tests/static-site.mjs`: 18 kasus kueri dan semua berkas API cocok dengan server.
- `UI_TEST_TARGET=static node tests/browser.mjs`: interaksi situs dan 66 pemeriksaan rute responsif lulus.
- Integrasi ulang menghasilkan `added: 0`; galeri batch1000 diperbarui.

Persiapan, integrasi dan audit yang berbagi state harus dijalankan serial. Skrip baru ada di `scripts/*artwork-presentation*`; galeri dapat dibangun ulang dengan `node scripts/build-artwork-presentation-gallery.mjs`. Bukti browser tersimpan di `tmp/presentation-revision-1000/browser/`.

Tidak ada commit, push atau deploy. Perubahan workspace dari sesi lain tetap dipertahankan.
