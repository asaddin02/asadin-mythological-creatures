# ✦ MYTHICS — Global Mythological Creatures & Legendary Beings Encyclopedia

> **Mythics** adalah ensiklopedia digital modern, kuratorial, dan interaktif untuk menjelajahi makhluk mitologi, arwah cerita rakyat, naga purba, dan entitas supernatural dari berbagai peradaban dunia dengan catatan sumber, panduan belajar, dan konteks budaya.

**Lanjut dari PC lain:** baca [serah terima 2 Oktober 2026](docs/HANDOFF-2026-10-02.md) untuk aksi hari ini, posisi terakhir Claude, target, jumlah entri tersisa, dan perintah melanjutkan.

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
- **Tipografi**: `Cinzel` (judul bergaya prasasti), `Cormorant Garamond` (aksen kaligrafis), dan `Manrope` (antarmuka), seluruhnya WOFF2 lokal.
- **Tema Tetap**: hitam hangat dan cokelat tua, tujuh pigura hasil generate dengan material dan batu permata sesuai tier Power, tanpa efek aura.

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
Aplikasi akan aktif di `http://127.0.0.1:8095`. `npm run dev` mengaktifkan Pusat Kontrol Redaksi (`#/admin`, `MYTHICS_ADMIN=1`), yang hanya menerima permintaan dari komputer itu sendiri dan dari origin yang sama. `npm start` (server produksi) mematikannya: rute `/api/admin/*` menjawab 404 dan tautan Admin tidak tampil. Server hanya menyajikan `index.html`, `manifest.webmanifest`, `css/`, `js/`, dan `assets/`; `data/`, `server/`, `scripts/`, `tests/`, dan berkas paket selalu 404.

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

### 5. Deploy ke Cloudflare Pages

Situs publik adalah **situs statis**: `npm run build:site` menyusun `dist/` berisi aplikasi dan seluruh API baca sebagai berkas JSON (`dist/api/…`) yang dihasilkan oleh mesin query yang sama dengan server (`js/query-engine.js`). Di browser, pencarian, filter, pengurutan, halaman, dan pertemuan acak dijalankan atas `dist/api/catalog.json`, dengan hasil yang sama dengan server (`npm run test:static` membuktikannya, lalu menjalankan tes browser yang sama pada situs statis). Konsol redaksi tidak ikut terbit; tambahkan atau setujui entri secara lokal, commit `data/`, lalu push.

1. Buat API token Cloudflare dengan izin **Account · Cloudflare Pages · Edit** dan **Account · Workers R2 Storage · Edit**, lalu salin **Account ID** dari **Workers & Pages**.
2. Di GitHub, buka **Settings → Secrets and variables → Actions**. Isi secret `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`, serta variable `CLOUDFLARE_PAGES_PROJECT` (misalnya `asadin-mythics`). Opsional: variable `SITE_URL` untuk domain sendiri; tanpa itu dipakai `https://<proyek>.pages.dev`.
3. Workflow [Deploy](.github/workflows/deploy.yml) berjalan setiap [CI](.github/workflows/ci.yml) lulus di `main`, atau jalankan manual dari tab **Actions**. Sebelum variable diisi, workflow ini dilewati.

Workflow membangun katalog dengan `MYTHICS_PUBLISH=complete MEDIA_BASE=/media`, sehingga hanya entri dengan riset lengkap yang disetujui dan gambar tersedia yang tampil publik. Seluruh ilustrasi aktif yang telah diperiksa tetap diunggah ke R2 `mythics-media`, termasuk gambar untuk entri yang belum memenuhi syarat publik. Unggahan membandingkan hash, memakai empat pekerja, dan menyimpan kemajuan yang berhasil jika terjadi kegagalan. Setelah deploy, setiap ilustrasi R2 diperiksa melalui alamat publik dan dicocokkan dengan hash aset yang disetujui.

Jalankan `npm run test:public` untuk menguji katalog publik dan rute media R2 pada desktop serta ponsel sebelum deploy. Berkas WebP dan catatan JSON pemeriksaan disimpan di Git; PNG native dan contact sheet tetap berada di workspace lokal. Audit native dan galeri yang memakai PNG asli membutuhkan berkas lokal tersebut.

Isi `SITE_URL` dengan alamat yang benar-benar diberikan Cloudflare. Sejak 6 Oktober 2026 proyek Pages bernama `mythologies` dan terbit di `https://mythologies.pages.dev`. [Cloudflare tidak dapat mengganti nama atau subdomain proyek Pages yang sudah ada](https://developers.cloudflare.com/pages/platform/known-issues/), jadi proyek baru dibuat oleh workflow Deploy dan proyek lama (`mythics`, `mythics-99o.pages.dev`) dihapus dengan workflow manual `Delete retired Pages project`, yang menolak menghapus proyek aktif dan tidak menyentuh bucket R2. API tidak memperlihatkan pemilik namespace di akun lain; jangan menyimpulkan kepemilikan hanya dari DNS atau akhiran subdomain. Workflow manual `Pages domain` menyediakan pemeriksaan akun dan percobaan reservasi nama.

Tanpa GitHub Actions: `SITE_URL=https://alamat-situs npm run build:site`, lalu `npx wrangler pages deploy dist --project-name <nama>`. `dist/` berisi sekitar 5.400 berkas; unggahan drag-and-drop di dashboard juga bisa, tetapi Wrangler lebih cepat. Pratinjau lokal: `npm run preview:static` (meniru Cloudflare Pages) atau `npm run preview:cloudflare`.

---

## ⚖️ Lisensi & Etika Budaya

- Seluruh kode sumber dirilis di bawah lisensi [MIT](LICENSE). Teks pengantar dari Wikipedia berlisensi CC BY-SA 4.0; lihat [data/CONTENT-LICENSE.md](data/CONTENT-LICENSE.md).
- Gambar yang disajikan diperoleh dari repositori berlisensi terbuka (Wikimedia Commons, Public Domain, CC BY, CC BY-SA) dengan mencantumkan nama kreator asli dan tautan lisensi.
- Mythics menghormati nilai-nilai sakral tradisi lisan masyarakat adat dan peradaban dunia. Informasi disajikan untuk tujuan edukasi kultural dan literatur penjelajahan.

## Editorial redesign · September 2026

The discovery homepage uses a permanent warm dark-and-gold design, locally hosted typefaces, seven generated museum frames with gemstones and no aura effects, hero artwork, selected stories, a Nusantara feature, and culture portals. Shared navigation, collections, forms, and reading surfaces support desktop and mobile layouts. See [DESIGN.md](DESIGN.md) for the visual system.

### Learning and source context

- 18 existing entries now include individual bilingual reading notes and reflection questions.
- Four bilingual learning modules cover foundational terms, Indonesian traditions, comparative symbols, and source literacy. Each includes references, a quiz with explanation, and local completion tracking.
- Institutional reading links include The Met, UNESCO, AMNH, and Britannica Education. Existing seed claims retain their original attribution; the new reading guides do not constitute an exhaustive scholarly verification of every legacy claim.
- Fourteen documentary images are stored locally with Commons attribution. There are 1,000 individually attached AI editorial illustrations, with creature-specific prompts and visual identity checks. All 1,000 have been screened for mythological presentation; see [asset notes and prompts](assets/art/README.md), the [1,000-image target handoff](docs/HANDOFF-ARTWORK-1000-2026-10-05.md), and the [before/after revision gallery](docs/artwork-presentation-revision-1000.html).
- Culture and region coverage is calculated from published records. Detailed entries and imported reference introductions are counted separately.

### Verify locally

```bash
npm install
npm run dev
# http://127.0.0.1:8095
npm test
npm run check
npx playwright install chromium
npm run test:ui
```

The browser suite starts its own server on port 8098 (`UI_TEST_PORT` overrides it), exercises search, pagination, regions, favorites, quizzes, persistence, language settings, permanent dark styling, local fonts, modal keyboard behavior, and navigation, then checks eleven routes at four viewport widths. No production build is required for the native ES module frontend.

## Bulk library expansion

The current library contains **1,736 entries** across **124 culture groups with published records**: 18 detailed editorial entries and 1,718 sourced introductions. Of the imported introductions, 379 have Indonesian and English source text; 1,339 currently have English source text only. Counts and exclusions are recorded in [the import report](data/import/report.json); text attribution is explained in [CONTENT-LICENSE.md](data/CONTENT-LICENSE.md).

`npm run import:library` imports the checked-in discovery manifest, then audits identities and removes non-being subjects. `npm run discover:library` refreshes the Wikipedia category crawl first. Wikimedia responses are cached in `data/cache/`; failures are recorded in `data/import/report.json`. Existing editorial records are preserved. No external accounts or paid translation services are needed.

Imported records are **sourced introductions**, not complete scholarly dossiers. They retain Wikipedia article URLs, revision IDs, contributor credit, and CC BY-SA 4.0 licensing. Indonesian text is included only when an Indonesian source article exists; English-only introductions are visibly labeled. Missing powers, dates, habitats, and images remain unfilled. Each source identity is deduplicated by Wikidata QID, and associated works, locations, rituals, historical people, and other out-of-scope topics are excluded by an additional identity audit. Category mappings are documented, not presented as definitive cultural attribution.

The encyclopedia supports content-depth filtering and compact pagination. Comparison uses the complete lightweight index, and journal favorites are fetched by slug, avoiding the former 100-record limit. Missing power assessments display a dash rather than zero. See the generated import report for the actual accepted count and exclusions.

Clicking a card or its image opens the creature detail. Only the detail page provides illustration preview with zoom, pinch, pan, and fit-to-screen, plus downloads from both the detail and viewer. The comparison page supports searchable creature selectors and separate Power, Threat, and Fear comparisons, with the chosen pair preserved in the URL.
