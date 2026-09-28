# ✦ MYTHICS — Global Mythological Creatures & Legendary Beings Encyclopedia

> **Mythics** adalah ensiklopedia digital modern, kuratorial, dan interaktif untuk menjelajahi makhluk mitologi, arwah cerita rakyat, naga purba, dan entitas supernatural dari berbagai peradaban dunia dengan sistem penyerapan data otonom berdasar rujukan sumber terverifikasi.

---

## 🏛️ Visi & Prinsip Kuratorial

Mythics dirancang sebagai perpaduan antara **arsip museum digital premium**, **indeks makhluk interaktif (bestiary)**, dan **platform eksplorasi budaya**:
1. **Diferensiasi Tradisi Autentik vs Budaya Populer**: Mythics membedakan secara tegas antara tradisi lisan/sejarah yang terdokumentasi dengan adaptasi media modern (video game, film, atau legenda urban internet).
2. **Tanpa Fabrikasi Data**: Tidak menciptakan kekuatan fiktif atau tanggal historis palsu. Jika bukti tradisi minim, sistem menandainya sebagai *Tidak Terdokumentasi* atau *Ambivalen*.
3. **Sistem Atribusi & Provenansi Sumber**: Setiap entitas menyertakan rujukan bibliografi primer/sekunder dan lisensi hak cipta gambar yang terverifikasi (Public Domain, Creative Commons BY/BY-SA).
4. **Dwibahasa Sejati (Bilingual)**: Tersedia dalam Bahasa Indonesia (primer 🇮🇩) dan Bahasa Inggris (sekunder 🇬🇧), baik pada label antarmuka pengguna maupun konten esai entitas.

---

## ⚡ Fitur Utama

- **Discovery Portal & Real-time Search**: Pencarian teks lengkap dengan normalisasi tanda aksen/diakritik (misal: `Jormungandr` otomatis menemukan `Jörmungandr`), serta filter multi-kriteria (Budaya, Klasifikasi, Elemen, Habitat, Sifat, dan Urutan).
- **Pertemuan Takdir (Random Encounter)**: Generator pertemuan acak interaktif dengan saringan budaya.
- **Arsip Detail Entitas**:
  - *Mode Cerita (TL;DR)*: Menjawab empat pilar esensial (Siapa dia? Dari mana asalnya? Apa peran/perilakunya? Mengapa terkenal?).
  - *Mode Arsip (Mendalam)*: Menampilkan analisis filologi, nama alternatif, tingkat bukti, dan rujukan naskah kuno.
  - *Tahukah Anda?*: Fakta historis unik terverifikasi.
  - *Kemampuan Terdokumentasi*: Dilengkapi lencana tingkat bukti (*Documented Tradition*).
  - *Mythics Power Profile*: Visualisasi dimensional deterministik (Fisik, Supernatural, Ketahanan, Mobilitas, Kecerdasan, Pengaruh) yang diturunkan secara algoritmik dari atribut terdokumentasi (disertai penafian metodologi etis).
- **Matriks Perbandingan Entitas (Comparison Mode)**: Analisis perbandingan berdampingan dua makhluk (contoh: Garuda vs Minotaur, atau Pocong vs Kitsune) lengkap dengan indikator perbedaan relatif.
- **Buku Petualang (Bestiary Journal)**: Pelacakan progres eksplorasi pengguna lokal dan lencana pencapaian (*First Encounter*, *Penjelajah Nusantara*, *Pemburu Naga*, dll).
- **Pusat Kontrol Redaksi & Riset (Admin Ingestion)**:
  - Eksekusi riset otonom terhubung ke Wikipedia REST API dan Wikimedia Commons.
  - Alur kurasi draf (Persetujuan Redaksi, Edit, atau Penolakan).
  - Log eksekusi pipeline terminal secara *real-time*.

---

## 🏗️ Arsitektur & Teknologi

- **Backend**: Node.js 20+ ES Modules native HTTP server (tanpa *framework overhead*, kompresi gzip/brotli terintegrasi, header keamanan CSP & HSTS).
- **Database**: Normalized In-Memory Datastore berbasis file JSON terindeks (`data/creatures.json`, `data/cultures.json`, `data/categories.json`, `data/reviews.json`, `data/ingestion-jobs.json`).
- **Frontend**: Vanilla ES Modules JavaScript modular & Semantic HTML5 dengan Sistem Desain CSS murni berstandar modern.
- **Tipografi**: `Cinzel` (tampilan judul megah & bernuansa mitik) + `Plus Jakarta Sans` (keterbacaan teks tubuh tinggi).
- **Tema Ganda**:
  - *Dark Theme*: Midnight Museum Archive (latar obsidian dengan aksen emas kuno).
  - *Light Theme*: Editorial Museum Catalog (latar gading dengan tipografi tinta tajam).

---

## 📂 Struktur Repositori

```text
asadin-mythological-creatures/
├── assets/
│   └── placeholders/
│       └── creature-fallback.svg    # Placeholder elegan untuk aset tanpa lisensi
├── css/
│   ├── main.css                     # Token desain, variabel warna, tipografi & tema
│   ├── components.css               # Navbar, Hero, Kartu Makhluk, Modal, Filter
│   ├── creature-detail.css          # Layout arsip detail, Mode Cerita, Power Profile
│   └── admin.css                    # Konsol riset, antrean kurasi, jurnal, perbandingan
├── data/
│   ├── creatures.json               # Basis data ternormalisasi entitas mitologi
│   ├── cultures.json                # Taksonomi tradisi budaya peradaban dunia
│   ├── categories.json              # Klasifikasi taksonomi (Roh, Monster, Naga, dll)
│   ├── traits.json                  # Taksonomi sifat & afinitas gaib
│   ├── reviews.json                 # Antrean draf hasil riset otomatis
│   └── ingestion-jobs.json          # Riwayat eksekusi pekerjaan riset
├── js/
│   ├── app.js                       # Router klien & koordinator siklus hidup halaman
│   ├── i18n.js                      # Kamus dwibahasa (ID / EN) & penangan lokalisasi
│   ├── api-client.js                # Klien HTTP frontend dengan cache memori
│   └── components/
│       ├── navbar.js                # Komponen header & pengalih bahasa/tema
│       ├── hero.js                  # Banner sinematik berfitur pencarian instan
│       ├── creature-card.js         # Kartu makhluk dengan indikator visual
│       ├── creature-detail.js       # Halaman detail komprehensif
│       ├── explore.js               # Antarmuka saringan multi-kriteria
│       ├── comparison.js            # Matriks perbandingan entitas
│       ├── cultures-view.js         # Katalog peradaban dunia
│       ├── journal.js               # Jurnal koleksi & pencapaian pengguna
│       ├── random-encounter.js      # Modal pertemuan acak
│       └── admin-dashboard.js       # Dasbor redaksi & eksekusi riset otonom
├── scripts/
│   ├── seed.mjs                     # Generator benih data terverifikasi
│   ├── ingest-cli.mjs               # Alat CLI riset otonom entitas
│   └── check-data.mjs               # Script audit kontrol kualitas data (QC)
├── server/
│   ├── server.mjs                   # Server HTTP produksi & penyaji berkas statis
│   ├── api.mjs                      # Rute penanganan endpoint REST API
│   ├── db.mjs                       # Lapisan penyimpanan, indeks, & transaksi
│   ├── ingestion.mjs                # Pipeline riset Wikipedia & Wikimedia Commons
│   └── power-engine.mjs             # Algoritma penentuan profil kekuatan deterministik
├── tests/
│   └── test-all.mjs                 # Rangkaian pengujian otomatis
├── package.json
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Server Pengembangan

```bash
npm run dev
```
Aplikasi akan aktif di `http://127.0.0.1:8095`.

### 2. Menjalankan Audit Kualitas Data (QC Check)

Memverifikasi integritas skema, kelengkapan dwibahasa, keunikan *slug*, ketersediaan sumber, dan lisensi gambar:
```bash
npm run check
```

### 3. Menjalankan Rangkaian Pengujian Otomatis

Menguji mesin profil kekuatan, kalkulasi deterministik, rute API, dan logika pencarian:
```bash
npm test
```

### 4. Menjalankan Riset Entitas via CLI

Melakukan investigasi data otomatis terhadap entitas baru dari internet:
```bash
# Riset dan simpan ke antrean review:
node scripts/ingest-cli.mjs "Anubis"

# Riset dan langsung publikasikan ke ensiklopedia:
node scripts/ingest-cli.mjs "Valkyrie" --publish
```

---

## ⚖️ Lisensi & Etika Budaya

- Seluruh kode sumber dirilis di bawah lisensi [MIT](LICENSE).
- Gambar yang disajikan diperoleh dari repositori berlisensi terbuka (Wikimedia Commons, Public Domain, CC BY, CC BY-SA) dengan mencantumkan nama kreator asli dan tautan lisensi.
- Mythics menghormati nilai-nilai sakral tradisi lisan masyarakat adat dan peradaban dunia. Informasi disajikan untuk tujuan edukasi kultural dan literatur penjelajahan.
