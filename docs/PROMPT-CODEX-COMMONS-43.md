# Tugas Codex: ilustrasi AI untuk 42 makhluk yang hanya bergambar Commons, ditambah Lucifer

Kamu ilustrator Mythics, bekerja di repositori ini di PC lokal dengan **OpenAI built-in `image_gen`**, alat yang sama dengan yang kamu pakai untuk 1.000 ilustrasi sebelumnya dan untuk putaran nama besar. Claude Code lokal adalah peninjau kedua: ia memeriksa setiap gambarmu lalu memasang yang lolos. Kamu tidak memasang, tidak commit, dan tidak push.

## Latar

Per 7 Oktober 2026 ada 1.086 makhluk yang tampil di situs. 1.044 di antaranya punya ilustrasi AI. **42 makhluk hanya punya foto atau lukisan Wikimedia Commons** (arca, relief, lukisan lama), sehingga tampil tanpa ilustrasi editorial. Riset ke-42 makhluk itu sudah lengkap dan valid. Pemilik proyek ingin semuanya punya ilustrasi AI dengan gaya koleksi yang sama.

Gambar Commons **tidak dihapus**. Ilustrasi AI ditambahkan di sampingnya.

## Kelompok A: 14 nama besar, gaya `nama-besar`

Gaya dramatis dengan efek kekuatan yang terdokumentasi. Aturannya ada di `data/artwork-nama-besar.json` → `policy`, sama dengan putaran nama besar sebelumnya.

`shiva`, `zeus`, `dragon`, `vishnu`, `krishna`, `apollo-q37340`, `athena`, `brahma-q11389`, `aphrodite`, `sun-wukong`, `zhu-bajie`, `sha-wujing`, `erlang-shen`, `nezha`

Di daftar nama besar lama, mereka masih berstatus `menunggu` karena saat itu risetnya belum lengkap. Sekarang risetnya sudah lengkap. **Jangan jalankan ulang `node scripts/nama-besar.mjs`**, karena `scripts/audit-artwork-nama-besar.mjs` masih memakai potret putaran pertama di `data/artwork-nama-besar.json`. Ambil `policy` dari berkas itu apa adanya.

## Kelompok B: 28 makhluk lain, gaya rumah batch-1000

Gaya naturalis koleksi utama: kehadiran lewat pose, ekspresi, komposisi, skala, dan cahaya alami; efek gaib hanya bila terdokumentasi dan tetap ditahan. Makhluk menakutkan mendapat suasana horor yang sesuai. Contoh prompt ada di receipt `data/artwork-generated/batch-1000/*.json`.

`krasue`, `rangda`, `nat-deity`, `nang-tani`, `au-co`, `suvannamaccha`, `duende`, `mae-nak-phra-khanong`, `vietnamese-dragon`, `sarimanok`, `singa-mythology`, `warak-ngendog`, `nang-ta-khian`, `apsonsi`, `bedawang`, `nawarupa`, `pyinsarupa`, `oyamatsumi`, `shachihoko`, `tenjin`, `abumi-guchi`, `abura-akago`, `akabeko`, `red-boy`, `princess-iron-fan`, `baigujing`, `six-eared-macaque`, `frankensteins-monster`

## Kelompok C: Lucifer, penggantian dengan gaya `nama-besar`

`data/artwork-generated/presentation-revision-nama-besar/lucifer.json` berstatus `needs-correction` dan sudah ditolak dua kali. Gambar lama (`assets/art/lucifer-verified.webp`) tetap tampil sampai penggantinya lolos.

Arahan pemilik proyek: **Lucifer harus lebih dekat ke Iblis daripada manusia.** Jangan lagi menggambar lelaki biasa berjubah di tebing, sosok yang duduk merenung, atau pose tenang.

Yang didukung riset (`node scripts/gemini/show-entry.mjs lucifer`):
- Iblis dan malaikat yang jatuh (c01); Setan sebelum kejatuhannya (c04, c10).
- Bintang fajar, Venus sebelum matahari terbit (c02, c15); "pembawa cahaya" (c06, c13); pembawa fajar (c14).

Arah visual yang disarankan: malaikat jatuh yang menjulang dan mengerikan, terjun miring dari langit fajar yang robek. Sayapnya hangus hitam dan berasap. Cahaya putih keemasan bintang fajar masih menyala di tubuhnya, tetapi retak dan padam di kulit yang menghitam, seperti bintang yang mati. Matanya menyala dingin, wajahnya indah tetapi buas, penuh kesombongan dan amarah. Jejak cahayanya seperti komet yang membusuk menjadi asap hitam. Satu bintang fajar masih bersinar rendah di cakrawala. Ada dunia gelap jauh di bawah sebagai pembanding skala.

Batas: **tanpa** tanduk, ekor, kaki kambing, kulit merah, garpu, api neraka atau lava, obor Romawi (c07 tidak dipakai agar ikonografi Romawi tidak bercampur), baju zirah, atau mahkota. Riset tidak memuat dasar untuk semua itu. Sayap boleh sebagai ikonografi malaikat yang jatuh; catat pilihan ini di `artistic_choices` bersama klaim c01.

Pakai alur revisi yang kamu buat: `--revision nama-besar`, ledger `data/artwork-presentation-revision-nama-besar.json`, receipt di `data/artwork-generated/presentation-revision-nama-besar/lucifer.json`. Simpan percobaan yang ditolak sebagai riwayat (`keep_rejected_attempts`). Status akhir receipt: `awaiting-independent-review`.

## Langkah 1: izinkan makhluk yang hanya bergambar Commons

`scripts/prepare-artwork-batch.mjs` sekarang hanya menerima status `lengkap-informasi`. Ke-42 makhluk ini berstatus `lengkap-bergambar` karena gambar Commons di risetnya.

Tambahkan opsi **`--allow-commons`**:
- Dengan opsi ini, makhluk `lengkap-bergambar` juga boleh dipilih, **asalkan** ia belum punya entri di `assets/art/verified-manifest.json` (belum punya ilustrasi AI) dan tidak ada di `data/artwork-exclusions.json`.
- Tanpa opsi ini, perilaku skrip tidak berubah sama sekali.
- Catat di ledger bahwa batch ini menambah ilustrasi AI pada makhluk yang sudah bergambar Commons, misalnya `selection_criteria.commons_only: true`.
- `scripts/integrate-artwork-batch.mjs` dan `scripts/prepare-reviewed-artwork-records.mjs` sudah menerima `lengkap-bergambar`. `scripts/audit-artwork-batch.mjs` mewajibkan `lengkap-bergambar`, yang sudah terpenuhi. Pastikan gambar Commons di riset tetap utuh setelah integrasi.

Pastikan semua tes tetap lulus:

```bash
npm test && npm run check
```

## Langkah 2: siapkan dua batch

```bash
node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --allow-commons --policy nama-besar \
  --slugs shiva,zeus,dragon,vishnu,krishna,apollo-q37340,athena,brahma-q11389,aphrodite,sun-wukong,zhu-bajie,sha-wujing,erlang-shen,nezha

node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --allow-commons \
  --slugs krasue,rangda,nat-deity,nang-tani,au-co,suvannamaccha,duende,mae-nak-phra-khanong,vietnamese-dragon,sarimanok,singa-mythology,warak-ngendog,nang-ta-khian,apsonsi,bedawang,nawarupa,pyinsarupa,oyamatsumi,shachihoko,tenjin,abumi-guchi,abura-akago,akabeko,red-boy,princess-iron-fan,baigujing,six-eared-macaque,frankensteins-monster
```

Nomor batch dihitung skrip dari jumlah ilustrasi aktif. Pastikan keduanya terbentuk dan tidak menimpa batch yang sudah ada.

Receipt ditulis ke `data/artwork-generated/batch-<N>/<slug>.json` dan PNG asli ke `.../originals/`, dengan isi yang sama seperti batch-1000: `prompt`, `depicted_variant`, `basis_claim_ids`, `visual_requirements`, `aura`, `artistic_choices`, `visual_review` (reviewer `codex`), dan `native_sha256`. Status receipt: `awaiting-independent-review`.

## Langkah per makhluk

1. Baca risetnya: `node scripts/gemini/show-entry.mjs <slug>`. Catat klaim tentang **wujud**, lalu, untuk kelompok A dan C, klaim tentang **kekuatan, ranah, atau perbuatan**, karena dari situlah efeknya diambil.
2. Lihat gambar Commons di riset makhluk itu sebagai rujukan ikonografi (atribut, pakaian, jumlah lengan atau kepala). **Jangan menyalin komposisinya.**
3. Tulis `visual_requirements`: setiap ciri wujud dan efek beserta klaim dasarnya.
4. Buat gambar. Periksa sendiri dengan melihatnya:
   - anatomi dan atribut sesuai klaim;
   - setiap efek punya dasar;
   - makhluknya jelas terlihat dan bukan manusia biasa berukuran normal (masalah paling sering di putaran lalu);
   - tanpa teks atau watermark.

   Ulangi kalau belum sesuai, dan simpan percobaan yang ditolak.
5. Kalau riset tidak memuat dasar untuk efek apa pun, buat gambar yang megah lewat komposisi dan cahaya saja, lalu catat di `artistic_choices`.

## Hal yang perlu diperhatikan

- **Agama yang masih dianut digambarkan dengan hormat:** Shiva, Vishnu, Krishna, Brahma, Tenjin, nat, dan Âu Cơ. Ikuti ikonografi di klaim, misalnya:
  - Brahma: empat kepala dan empat lengan tanpa senjata (c03, c19);
  - Shiva: mata ketiga, Vasuki di leher, bulan sabit, Gangga di rambut, trisula, dan tenggorokan biru (c05, c09);
  - Vishnu: Sudarsana, sangkakala, gada, dan teratai di empat tangan (c22).
- **Tokoh sastra** (Sun Wukong, Zhu Bajie, Sha Wujing, Erlang Shen, Nezha, Red Boy, Princess Iron Fan, Baigujing, Six-Eared Macaque, Frankenstein's monster) berasal dari teks novelnya. **Jangan meniru film, anime, game, atau komik**, termasuk Dragon Ball, *Black Myth: Wukong*, film *Ne Zha*, dan Frankenstein versi Boris Karloff dengan baut di leher. Untuk Frankenstein, ikuti deskripsi Shelley: tinggi sekitar delapan kaki, kulit kuning yang hampir tak menutupi otot, rambut hitam berkilau, gigi putih, dan mata berair (c03, c04).
- **Makhluk lambang** (warak ngendog, nawarupa, pyinsarupa, singa, shachihoko) digambar sebagai makhluk hidup sesuai susunan hewan di klaimnya, bukan sebagai patung, mainan, atau hiasan perahu.

## Larangan

- Jangan mengubah riset (`data/gemini/`), `data/creatures.json`, atau penilaian kekuatan (`data/power/`, `js/power-assessments.js`, `js/scaling.js`).
- Jangan menghapus gambar Commons dari riset, dan jangan menghapus WebP atau PNG lama Lucifer.
- Jangan menjalankan ulang `node scripts/nama-besar.mjs`.
- Jangan menulis `root_visual_review` dan jangan menjalankan integrasi. Itu tugas Claude Code lokal.
- Jangan commit atau push.

## Laporan

Setiap 10 gambar, tulis ringkasan di chat: makhluk yang selesai, ciri dan efek yang dipakai beserta klaim dasarnya, dan percobaan yang kamu tolak sendiri. Setelah itu lanjutkan tanpa menunggu.

Di akhir, laporkan:
- nomor kedua batch dan daftar receipt yang menunggu tinjauan kedua;
- receipt Lucifer;
- perubahan pada `scripts/prepare-artwork-batch.mjs`;
- hasil `npm test && npm run check`.
