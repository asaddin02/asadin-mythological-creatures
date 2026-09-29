# Perbaikan batch-001 (putaran 1)

Terima kasih. Hasil pemeriksaan batch-001 ada di bawah. **Kirim ulang kelima entri secara lengkap**, bukan hanya bagian yang berubah, dengan `batch_id` `batch-001` dan satu blok ```json per makhluk, seperti sebelumnya.

Bagian A berisi aturan tambahan yang berlaku mulai sekarang. Bagian B berisi temuan spesifik per makhluk. Temuan di B hanya contoh yang ditemukan pemeriksa, jadi periksa ulang **semua** bagian teks dengan aturan A.1, bukan hanya butir yang disebut.

Kalau suatu detail tidak bisa kamu temukan di sumber yang bisa dibuka, hapus detail itu. Entri yang lebih pendek tetapi seluruhnya bersumber lebih baik daripada entri panjang yang sebagian dikarang.

## A. Aturan tambahan (berlaku mulai sekarang, juga untuk batch berikutnya)

Semua 84 kutipanmu ditemukan di halaman sumbernya. Itu bagus. Tetapi kelima entri belum bisa diterima karena kesalahan di bawah ini. Pemeriksa sekarang menandai sebagian besar kesalahan ini secara otomatis.

### A.1 `claim_ids` bukan label hiasan
- **Setiap detail** di teks harus ada di kutipan klaim yang dirujuk: nama orang, nama tempat, nama karya, angka, tahun, bahan, warna, sebab-akibat, dan urutan kejadian.
- **Detail yang ada di halaman tapi belum dikutip**: buat klaim baru dengan kutipannya.
- **Detail yang tidak ada di sumber mana pun**: hapus dari teks.
- **Pemeriksa otomatis** menandai setiap nama atau angka di teks yang tidak muncul di kutipan mana pun.
- Contoh kesalahan:
  - "Ulan Bator" ditulis sebagai pengguna lambang Garuda, padahal kutipannya hanya menyebut India, Indonesia, dan Thailand.
  - Garuda Pancasila disebut "diadopsi tahun 1945", padahal kutipannya hanya tentang jumlah bulu.
  - Nama sutradara ditulis tanpa ada di kutipan.

### A.2 Sumber
- **Wikipedia semua bahasa dihitung satu penerbit.** Artikel Wikipedia bahasa Indonesia sering berupa terjemahan artikel bahasa Inggris, jadi keduanya bukan sumber independen.
- **Tingkat `rich` wajib punya minimal 2 penerbit selain Wikipedia.** Satu di antaranya sebaiknya karya akademik, teks primer, atau museum/lembaga, kalau tersedia. Untuk mitologi klasik, teks primernya hampir selalu tersedia (misalnya theoi.com, perseus.tufts.edu, sacred-texts.com).
- **Berita dan artikel daftar** (misalnya "5 hantu …") hanya boleh dipakai untuk budaya populer modern, bukan untuk kepercayaan tradisional.
- **Bagian Wikipedia bertanda "This section does not cite any sources", "tidak memiliki referensi", "citation needed", atau "butuh rujukan"** tidak boleh menjadi satu-satunya pendukung klaim. Dukung dengan sumber independen, atau hapus klaimnya.

### A.3 Baca konteks sebelum mengutip
- Jangan memotong kutipan sampai maknanya berubah.
- Contoh kesalahan: sumber Pocong menulis bahwa dalam fiksi Indonesia, pocong yang *melompat* adalah manusia yang menyamar, sedangkan pocong "asli" dikatakan *melayang*. Kalimat itu tidak boleh diubah menjadi "film modern menggambarkannya melompat, tradisi lama menyebutnya melayang".

### A.4 Arti tiap bagian
- **`variants`**: versi daerah atau tradisi dari makhluk yang **sama**. Saudara, orang tua, dan anak masuk ke `relations`. Contoh kesalahan: Stheno dan Euryale dimasukkan sebagai varian Medusa.
- **`modern_depictions`**: karya abad ke-20–21, yaitu film, serial, novel, komik, game, dan musik. Arca kuno atau cetakan abad ke-19 bukan penggambaran modern.
- **`timeline`**: peristiwa tentang makhluk itu sendiri, dengan tahun atau periode yang tertulis di kutipan.
- **`traits`, `habitats`, `disposition`, `abilities`**: hanya kalau kutipan menyatakannya langsung.
  - Jangan menurunkannya dari etimologi. Nama Medusa berarti "menjaga", tapi itu bukan trait `guardian`.
  - Jangan menurunkannya dari wujud. Punya sayap bukan bukti bisa terbang, kecuali kutipan menyebut terbang.
  - Jangan menurunkannya dari satu kisah. Satu cerita tengah malam bukan bukti makhluk itu `nocturnal`.
  - Jangan tertukar antara pelaku dan sasaran. Medusa *dikutuk*; itu bukan trait `curses`.
- **`ability_id`**: pilih hanya kalau maknanya sama persis. Kalau tidak ada yang cocok, isi `null`. Contoh: menembus benda padat, atau menyembunyikan anak dari pandangan, bukan `invisibility`.
- **`etymology`**: hanya asal-usul **nama**, dari kutipan yang membahas asal kata. Asal-usul makhluk bukan etimologi.
- **`cultural_context` dan `tradition_vs_modern`**: harus berasal dari sumber yang menyatakan makna, fungsi, atau perbandingan itu secara eksplisit. Tafsiran sendiri dilarang. Kalau tidak ada sumbernya, isi `null`.
- **`conflicts`**: wajib diisi kalau sumber memuat versi yang berbeda, misalnya asal-usul, orang tua, sebab perubahan wujud, atau sifat baik/jahat.
- **`alternate_names`**: hanya nama lain untuk makhluk yang sama. Bentuk tertentu seperti "rubah berekor sembilan" bukan nama lain kitsune.

### A.5 Gambar
- **`shows` dan `caption`** hanya boleh memuat informasi dari halaman berkas Commons. Jangan menebak bahan, tahun, atau jenis karya. Contoh kesalahan: arca kayu ditulis "dari batu", dan cetakan cukil kayu yang di Commons bertanggal "before 1892" ditulis "lukisan tahun 1892".

### A.6 Petunjuk batch
- **Tindak lanjuti setiap petunjuk di prompt batch**, misalnya Garudeya dan relief Candi Kidal untuk Garuda. Kalau tidak menemukan sumber, jelaskan di `gaps`. Jangan dilewati diam-diam.

## B. Temuan per makhluk

**Untuk kelima makhluk:** tambahkan bagian `jenis` (instruksi versi 3, §8.11) beserta klaim pendukungnya.


### pocong
1. **Sumber.**
   - Dua dari tiga sumber adalah Wikipedia, dan artikel bahasa Indonesianya terjemahan dari artikel bahasa Inggris.
   - Bagian "Physical appearance" dan "Behavior" di en.wikipedia ditandai *"This section does not cite any sources"*.
   - Tambahkan minimal 2 penerbit selain Wikipedia yang membahas kepercayaan tentang pocong, misalnya artikel jurnal tentang hantu dalam budaya Jawa atau Indonesia.
   - CNN Indonesia hanya boleh dipakai untuk bagian film.
2. **Salah baca konteks (c17, c18).** Lihat A.3. Perbaiki `long_description[1]` dan `story_mode.famous_for`. Hapus `tradition_vs_modern` kecuali ada sumber yang benar-benar membandingkan tradisi dan media modern. Pertanyaan di `learning_questions[1]` juga bergantung pada anggapan yang salah ini.
3. **`long_description[0]`**: "tata cara pemakaman Islam", "diikat di kepala, leher, dan kaki", dan "urusan duniawi belum tuntas" tidak ada di kutipan.
4. **`long_description[1]`**: rincian wajah pucat dan tengkorak memang ada di halaman, tetapi belum dikutip. Tambahkan klaimnya, dengan memperhatikan A.2 soal bagian tanpa sumber.
5. **`long_description[2]`**: "paling sering diangkat sejak awal 2000-an" dan "komedi horor" tidak ada di kutipan.
6. **`cultural_context`**: pengingat ajal (memento mori) dan fardu kifayah adalah tafsiran tanpa sumber. Cari sumbernya atau isi `null`.
7. **`story_mode.role`**: "meminta pertolongan agar ikatannya dilepas" tidak ada di kutipan.
8. **`etymology.literal_meaning`**: kutipan c08 menulis "terbungkus-kain-kain", bukan "terbungkus kain kafan".
9. **`traits` dan `abilities`.**
   - `nocturnal` hanya didukung kisah andong pocong (c07), jadi bukan sifat pocong secara umum.
   - `abilities[1]`: menembus benda padat bukan `invisibility`, jadi `ability_id` diisi `null`. Frasa "tidak terikat jasad kasar" tidak ada di kutipan.
10. **`weaknesses[0]`**: c04 hanya menyebut ikatan harus dilepas saat jenazah dimakamkan. Kutipan itu tidak menyebut bahwa melepas ikatan membebaskan pocong yang sudah bangkit.
11. **`variants`**: rincian ketiga varian ada di halaman, tetapi tidak ada di kutipan yang dirujuk. Tambahkan klaim atau hapus rincian ini:
    - pocong plastik: pendarahan;
    - andong pocong: "pembawa malapetaka";
    - pocong merah: berasal dari dendam, dan label "cerita rakyat Jawa".
12. **`stories[0]`**: kisah pengantin, truk, dan penagih utang tidak ada di kutipan c07 dan c11. Baca ulang alurnya di sumber, karena ringkasanmu tidak sama dengan urutan di halaman, lalu kutip.
13. **`places[0]`**: "dikendalikan arwah dukun" tidak ada di kutipan c13.
14. **Film.**
    - `timeline[0]`: sumber menulis film *Pocong* (2006) dilarang dan disensor di versi DVD Prancis dan Jermannya. "Lembaga Sensor Film" dan alasannya tidak ada di kutipan.
    - `timeline[1]` dan `modern_depictions[0]`: tahun 2019, Monty Tiwa, "24 jam", dan "jenazah ayahnya" tidak ada di kutipan. Pernyataan c16 juga melebihi kutipannya.
    - `modern_depictions[1]`: "approved continuation" tidak ada di sumber. Sumber hanya menyebutnya sekuel yang "kurang mengerikan tetapi dengan cerita yang sama".
15. **Gambar kosong sudah benar.**

### wewe-gombel
1. **Sumber.**
   - c15–c17 memakai artikel daftar CNN untuk kepercayaan tradisional. Ini melanggar A.2.
   - Bagian "Latar belakang mitos" di id.wikipedia ditandai tanpa sumber, dan c10 serta c11 bertanda *butuh rujukan*.
   - Tambahkan minimal 2 penerbit selain Wikipedia, misalnya artikel jurnal atau skripsi tentang Wewe Gombel.
2. **`conflicts` wajib diisi.**
   - Ada dua versi asal-usul: bukit Gombel, tempat pembantaian pada masa Belanda (c11), dan arwah perempuan yang membunuh suaminya lalu bunuh diri (c15, c16).
   - Ada juga perbedaan sifat: "tidak mencelakai anak" (c01) dan "vengeful ghost" (c13).
3. **`etymology` dan `places[0]`**: c11 menyebut makhluk itu *berasal dari* bukit Gombel, bukan bahwa *namanya* berasal dari sana. Hapus, atau cari kutipan tentang asal kata "Wewe" dan "Gombel".
4. **`tradition_vs_modern`**: "taring mirip vampir" dan "monster pemburu" tidak ada di kutipan mana pun. Isi `null`, kecuali ada sumber yang membandingkan.
5. **`long_description[1]` dan `weaknesses[0]`**: c07 (irama musik membuatnya menari) dan c17 (bunyi perabot dapur membuat anak dikembalikan) adalah dua versi berbeda. Jangan digabung menjadi "perabot dapur membuatnya menari".
6. **`abilities[1]`**: menyembunyikan anak dari pandangan bukan `invisibility`. Isi `ability_id` dengan `null` dan tulis deskripsi sesuai kutipan.
7. **`habitats` dan `traits`.**
   - `dwelling` tidak didukung kutipan.
   - Untuk `nocturnal`, kutipan hanya menyebut mitos ini dipakai agar anak tidak keluar malam, bukan bahwa makhluknya aktif di malam hari.
8. **`stories[0]`**: "adopting abandoned children" dan "penunggu bukit" tidak ada di kutipan.
9. **`story_mode.role`**: "penyelamat" tidak ada di kutipan.
10. **`modern_depictions` dan `timeline`**: "Joko Anwar" dan "HBO Asia" tidak ada di kutipan.

### garuda
1. **Sumber.**
   - Baru ada 1 penerbit selain Wikipedia.
   - Tambahkan teks primer, misalnya terjemahan Mahabharata Adi Parwa tentang Garuda di sacred-texts.com.
   - Tambahkan juga sumber tentang Garuda di Indonesia.
2. **Dimensi Nusantara terlewat.** Prompt batch menyebut Garudeya dan relief Candi Kidal, tetapi tidak ada di entri maupun di `gaps`. Telusuri kisah Garudeya, relief candi, dan Garuda sebagai lambang negara. Kalau sumbernya tidak ada, jelaskan di `gaps`.
3. **c09**: pernyataannya tidak sesuai dengan kutipan. Kutipannya tentang izin memangsa manusia kecuali brahmana. `era` yang menyebut Purana juga tidak ada di kutipan c09.
4. **`timeline[0]`**: "1945, Indonesia mengadopsi Garuda Pancasila" tidak didukung, karena c13 hanya membahas jumlah bulu. Tahun penetapan lambang harus berasal dari kutipan.
5. **`did_you_know`**: Ulan Bator dan Mongolia tidak ada di kutipan. c08 menyebut India, Indonesia, dan Thailand.
6. **`etymology.literal_meaning`**: "burung pemangsa bersayap agung" tidak ada sumbernya. Isi `null`, atau kutip sumber tentang asal kata Garuda.
7. **`variants[0]`**: Karura dan Jepang tidak ada di kutipan c02.
8. **`long_description`.**
   - Paragraf 1 mengubah "Kamboja" (c10) menjadi "Asia Tenggara", dan "evolusi penggambaran di India" tidak ada di kutipan.
   - Paragraf 2: "dipilih Wisnu sebagai wahana setelah merebut amerta" tidak ada di kutipan.
   - Paragraf 3: "melambangkan kedaulatan dan keberanian" tidak ada di kutipan.
9. **`weaknesses[0]`**: "Sungai Kalindi" dan "tanpa binasa" tidak ada di c16.
10. **`stories[0]`**: persembahan bulanan, kepakan sayap, dan Kaliya bersembunyi tidak ada di c15 maupun c16.
11. **Klasifikasi.**
    - `disposition: protective` dan trait `guardian` tidak didukung kutipan, karena menjadi wahana Wisnu dan membenci ular tidak sama dengan pelindung.
    - `abilities[0]` dan trait `flight` membutuhkan kutipan yang menyebut terbang.
12. **`modern_depictions[0]`**: tahun 1949 tidak ada di kutipan.
13. **`images[0].shows`**: "dari batu" tidak ada di halaman Commons, dan fotonya tampak seperti arca kayu berlapis cat. Tulis hanya informasi dari halaman berkas.
14. **c02**: pernyataan menyebut "Pali Garula". Pastikan bagian itu memang ada di kutipan, bukan di bagian yang dilompati "...".

### kitsune
1. **Sumber.** worldhistory.org/Inari membahas Inari, bukan kitsune. Tambahkan minimal satu penerbit lagi selain Wikipedia yang membahas kitsune, misalnya karya akademik atau museum.
2. **`variants` dan `stories`**: Myōbu, Nogitsune, dan "Pangeran Hanzoku" tidak ada di kutipan yang dirujuk.
3. **`tradition_vs_modern.modern`**: "anime, game, karakter pembantu yang ceria" tidak ada di kutipan.
4. **`modern_depictions[0]` dan `timeline[0]`**: cetakan Yoshitoshi abad ke-19 bukan penggambaran modern. Tahun 1892 juga tidak ada di kutipan; Commons hanya mencatat "before 1892".
5. **`era` dan c03**: kutipan hanya menyebut pemujaan Inari sejak abad ke-8, dan pernyataanmu menambahkan "dan rubahnya". Kaitkan kitsune dengan abad ke-8 hanya kalau kutipannya menyatakan begitu.
6. **`long_description`**:
   - "bulu keemasan atau putih" tidak ada di kutipan;
   - "bakeru", "menguji ketulusan", dan "pelindung rumah tangga" tidak ada di kutipan;
   - "Inari dewa padi dan kemakmuran" dan "Shinto" belum dikutip.
7. **`cultural_context`**: "kesuburan agraris" adalah tafsiran tanpa kutipan.
8. **`alternate_names`**: "rubah berekor sembilan" bukan nama lain kitsune (lihat A.4). "きつね" tidak ada di kutipan.
9. **`habitats`**: `dwelling` dan `fields` tidak didukung kutipan.
10. **c08 dan c14**: kutipannya sama. Gabungkan.
11. **`abilities`**: "atau objek lain", "melayang di udara saat malam", dan "memengaruhi perilaku dan tutur kata" tidak ada di kutipan.
12. **`places[0]`**: "kuil utama" tidak ada di kutipan c15.
13. **`images[0]`**: gambarnya boleh dipakai. Ubah caption "Lukisan … (1892)", karena ini cetakan cukil kayu dan Commons hanya mencatat "before 1892". Kategori Commons berkas ini "Tsuki hyakushi 91 (wolf)", sedangkan en.wikipedia menyebutnya rubah. Tulis hanya yang ada di sumber.

### medusa
1. **Sumber.** Tambahkan teks primer, misalnya Hesiodos *Theogonia*, Ovidius *Metamorphoses* buku 4, atau Apollodorus 2.4, dari theoi.com atau perseus.tufts.edu.
2. **`conflicts` wajib diisi.** Ada dua versi: monster sejak lahir menurut penyair awal (c03), dan gadis cantik yang diubah menjadi monster (c07, c10, c11). Siapa yang mengubahnya juga berbeda antarsumber: Athena atau Minerva.
3. **`variants`**: Stheno dan Euryale adalah saudari Medusa, jadi pindahkan ke `relations` dengan `sibling`. "Bertaring buas" dan "raungan dahsyat" tidak ada di kutipan.
4. **`tradition_vs_modern.modern`**: "simbol feminis" tidak ada di kutipan.
5. **`abilities[1]` (`venom`)**: "ular berbisa, menyemburkan bisa" tidak ada di kutipan. Kata "berbisa" di deskripsi singkat dan panjang juga tidak ada.
6. **Cermin dan pedang.** `weaknesses[1]` (pantulan cermin, perisai perunggu) dan `long_description[2]` ("tameng cermin Athena dan pedang Hermes") tidak ada di kutipan.
7. **`stories[0]`**: Polydectes dan "saat terlelap" tidak ada di kutipan.
8. **`modern_depictions[0]`**: antefiks abad ke-4 SM bukan penggambaran modern. Hapus, karena sudah dipakai sebagai gambar.
9. **`era` dan `timeline[0]`**: "abad ke-8 SM" tidak ada di kutipan.
10. **`long_description[1]`**:
    - c03 menyebut "penyair awal", bukan khusus Hesiodos.
    - "pendeta kuil Minerva" menggabungkan dua sumber berbeda: c11 dari Wikipedia (pendeta di kuil Athena) dan c07 dari Ovidius (dinodai di kuil Minerva). Pisahkan atribusinya.
11. **Klasifikasi.**
    - `habitats`: c05 menyebut "di seberang Oceanus, di tepi dunia", bukan gua atau dunia bawah.
    - Trait `curses` salah: Medusa *dikutuk*, bukan mengutuk.
    - Trait `guardian` hanya diturunkan dari etimologi.
    - `disposition: malevolent` tidak dinyatakan di kutipan.
12. **`cultural_context`**: "dipasang di kuil dan perisai untuk mengusir roh jahat" melebihi kutipan.

## C. Sebelum mengirim

Untuk setiap entri, baca setiap kalimat dan tanyakan: "Kutipan mana yang memuat hal ini?" Kalau jawabannya tidak ada, tambahkan klaim atau hapus kalimat itu. Setelah itu jalankan cek mandiri di §9.
