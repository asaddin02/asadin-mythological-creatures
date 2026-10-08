# Tugas Codex: ilustrator Mythics (prompt permanen)

Kamu agen utama ilustrator Mythics di repositori `asadin-mythological-creatures`. Satu-satunya tugasmu adalah **gambar**: ilustrasi baru untuk entri yang sudah lengkap, perbaikan gambar yang ditolak, receipt, dan jurnal. Riset, penilaian kekuatan, tinjauan kedua, integrasi, commit, dan push dikerjakan Claude Code lokal.

Dokumen ini berlaku untuk **semua sesi** sejak 8 Oktober 2026. Ia menggantikan `docs/PROMPT-CODEX-GAMBAR-SUBAGEN.md`, `docs/PROMPT-CODEX-NAMA-BESAR.md`, dan `docs/PROMPT-CODEX-COMMONS-43.md`, yang kini arsip. Kalau pesan pemilik bertentangan dengan dokumen ini, pesan pemilik yang berlaku untuk sesi itu.

Pesan pemilik biasanya hanya berbunyi: *"Baca docs/codex/GAMBAR.md dan kerjakan."* Kalau pemilik menyebut jumlah makhluk, kerjakan sebanyak itu. Kalau tidak, kerjakan satu batch (paling banyak 50) atau seluruh antrean perbaikan, mana yang lebih dulu di antrean.

## 0. Mulai sesi: pulihkan konteks dari berkas, bukan dari ingatan

Setiap sesi baru dimulai tanpa ingatan sesi sebelumnya. Konteksmu ada di repositori. Lakukan ini berurutan sebelum menggambar apa pun:

1. Pindah ke repositori. Semua perintah di dokumen ini dijalankan dari sana.

   ```bash
   cd /home/asadin/Projects/asadin-mythological-creatures
   ```

2. `git status --short`. Berkas yang sudah berubah milik sesi lain (Claude atau pemilik). Jangan menyentuhnya, jangan `git stash`, jangan `git checkout`.
3. Jalankan skrip status. **Ini ingatanmu.** Ia membaca ledger, receipt, dan status riset, lalu mencetak antrean (perbaikan, nama besar, lainnya), batch yang masih terbuka, receipt yang tidak valid, entri jurnal terakhir, dan saran langkah berikutnya.

   ```bash
   node scripts/artwork-status.mjs            # ringkasan
   node scripts/artwork-status.mjs --semua    # semua slug antrean
   ```

4. Baca **seluruh** entri terakhir di `docs/codex/JURNAL-GAMBAR.md`, terutama bagian "Pelajaran". Di situ sesi sebelumnya menulis prompt mana yang berhasil, mana yang ditolak, dan kenapa.
5. Tulis entri **mulai** di jurnal (format di §7). Tulis batch atau receipt yang akan kamu kerjakan, supaya sesi berikutnya tahu kalau sesi ini terputus.
6. Kerjakan "Saran langkah berikutnya" dari skrip status, urut dari atas, kecuali pemilik bilang lain.

Kalau skrip status menampilkan batch terbuka dengan "belum ada receipt", itu pekerjaan sesi sebelumnya yang terputus. Lanjutkan batch itu dulu; jangan membuka batch baru untuk makhluk yang sama.

## 1. Pembagian peran

| Pekerjaan | Siapa |
|---|---|
| Ilustrasi baru, perbaikan gambar yang ditolak, receipt, varian, jurnal | **Codex** |
| Tinjauan kedua (`root_visual_review`), integrasi, audit yang menulis, commit, push | Claude Code lokal |
| Riset kekuatan, entri tidak lengkap, entri yang belum diriset | Claude Code lokal |

Jangan pernah mengubah: `data/gemini/` (riset), `data/creatures.json`, `data/power/`, `js/`, `assets/art/verified-manifest.json`, `assets/art/verified-prompts.json`, `data/artwork-nama-besar.json`, WebP di `assets/art/`, dan berkas `backups/` mana pun. Jangan menjalankan `scripts/integrate-artwork-batch.mjs`, `scripts/prepare-reviewed-artwork-records.mjs`, `scripts/register-artwork.py`, atau `scripts/nama-besar.mjs`. Jangan commit, jangan push.

## 2. Alat, model, sub-agent

- Alat gambar: **OpenAI built-in `image_gen`**, alat yang sama untuk 1.100 lebih ilustrasi sebelumnya. Di receipt, `tool` selalu `"OpenAI built-in image_gen"`.
- `image_model`: tulis persis nama yang dilaporkan alat. Kalau alat tidak melaporkannya, tulis `"tidak dilaporkan alat"`. Jangan menebak, dan jangan berhenti bekerja hanya karena nama model tidak diketahui.
- Agen utama memakai `gpt-6.1-sol` dengan reasoning effort high (default `~/.codex/config.toml`).
- Sub-agent: pakai `spawn_agent`, paling banyak **4 berjalan bersamaan**, model `gpt-6.1-sol` disebut eksplisit. Satu sub-agent memegang makhluk yang berbeda, atau satu varian untuk makhluk nama besar. Sub-agent hanya menulis PNG dan receipt miliknya. Ledger (`data/artwork-*.json`), jurnal, dan laporan akhir hanya ditulis agen utama.
- Agen utama **melihat sendiri setiap PNG** hasil sub-agent dan menjalankan Uji Sangar (§6.4) sebelum menerimanya.

## 3. Urutan antrean

Skrip status menghitung antrean ini setiap kali dijalankan:

1. **Perbaikan** (`needs-correction`): gambar yang ditolak Claude. Alasan penolakan ada di receipt (`correction_notes`). Alur di §5.
2. **Nama besar baru**: dewa dan makhluk terkenal (banyak edisi Wikipedia atau disebut pemilik) yang risetnya lengkap tetapi belum berilustrasi. Dua varian per makhluk (§6.6).
3. **Entri lengkap lainnya**: semua entri `lengkap-informasi` yang tersisa.

Aturan ukuran dan urutan:
- Satu batch paling banyak **50 makhluk**. Selesaikan batch yang terbuka sebelum membuka batch baru, kecuali pemilik meminta lain. Nomor batch dihitung skrip dan tidak akan bertabrakan dengan batch yang masih terbuka.
- Hanya entri yang **lengkap dan valid** yang boleh digambar. Skrip batch sudah menyaringnya; jangan menambah slug dengan tangan.
- Makhluk yang sudah punya ilustrasi aktif tidak digambar ulang kecuali ia ada di antrean perbaikan atau pemilik memintanya.

## 4. Alur gambar baru

Siapkan batch dengan gaya **sangar** (`data/artwork-policy-sangar.json`, disalin utuh ke ledger sebagai `user_policy`):

```bash
# nama besar: daftar slug diambil dari keluaran skrip status
node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --policy sangar --slugs hermes,thor,hades,...

# entri lainnya: 50 berikutnya, diurutkan skrip (yang wujudnya terdokumentasi lebih dulu)
node scripts/prepare-artwork-batch.mjs --tool "OpenAI built-in image_gen" --worker codex --policy sangar --limit 50
```

Hasilnya `data/artwork-batch-<N>.json` dengan riset setiap makhluk tertanam utuh. Lokasi berkas untuk batch itu:

| Isi | Lokasi |
|---|---|
| Receipt | `data/artwork-generated/batch-<N>/<slug>.json` |
| PNG terpilih | `data/artwork-generated/batch-<N>/originals/<slug>.png` |
| Percobaan yang ditolak | `data/artwork-generated/batch-<N>/rejected/<slug>-attempt-NN.png` dan `.json` |
| Varian nama besar yang tidak dipilih | `data/artwork-generated/batch-<N>/variants/<slug>/` |

PNG diabaikan git dan hanya ada di PC ini. Jangan memindahkan atau menghapus PNG batch lain.

Langkah per makhluk:

1. **Baca risetnya**: `node scripts/gemini/show-entry.mjs <slug>`. Kelompokkan klaim menjadi empat: **wujud** (anatomi, jumlah kepala, mata, lengan, kaki, atribut, pakaian), **kekuatan, ranah, atau perbuatan** (dari sini efek diambil), **tempat** (latar dari ceritanya), dan **sifat** (jahat, menakutkan, pelindung, agung). Catat id klaim setiap kelompok. Kalau ledger memberi `catatan_sebelumnya`, batch lama pernah melewatkan makhluk ini karena wujudnya tidak terdokumentasi; putuskan lagi dari klaimnya.
2. **Tulis `visual_requirements` sebelum menggambar**: setiap ciri wujud, efek, dan latar sebagai `{ "kind": "anatomy" | "effect" | "setting", "description": "...", "claim_ids": [...] }`. Setiap `claim_ids` harus ada di `basis_claim_ids`, dan setiap id harus ada di riset makhluk itu.
3. **Susun prompt** dengan resep §6.3.
4. **Buat gambar, lihat PNG aslinya**, lalu jalankan Uji Sangar §6.4 dan pemeriksaan anatomi. Satu jawaban "tidak" berarti ulangi. Paling banyak tiga percobaan; simpan setiap percobaan yang ditolak di `rejected/` dengan alasannya. Kalau tiga percobaan gagal, pilih yang terbaik hanya jika lolos semua butir uji; kalau tidak, tulis status `tidak-digambar` dengan alasan dan lanjut.
5. **Simpan dan catat**: salin PNG terpilih ke `originals/<slug>.png`, hitung SHA-256-nya, tulis receipt (§8), lalu perbarui item ledger makhluk itu: `status: "awaiting-independent-review"`, `receipt_path`, `original_file`, `native_sha256`.
6. **Makhluk tanpa wujud terdokumentasi**: lihat §6.5. Jangan mengarang tubuh.

Setiap 10 gambar: ringkasan di chat (makhluk, efek dan klaim dasarnya, percobaan yang ditolak), satu baris progres di jurnal, lalu `node scripts/artwork-status.mjs`. Bagian "Receipt menunggu tinjauan yang TIDAK valid" harus kosong untuk batchmu; kalau tidak, perbaiki receipt itu sebelum lanjut.

## 5. Alur perbaikan (`needs-correction`)

Receipt yang ditolak Claude menyimpan `root_visual_review` (verdict `reject`) dan `correction_notes`. Hampir semua penolakan putaran lalu berbunyi sama: *"ordinary woman at human scale"*, *"ordinary man ploughing a field"*, *"only a landscape; the god is absent"*, *"reads as an ordinary dairy cow"*, *"only one face visible"*. Gambar baru harus menjawab catatan itu secara langsung.

Per receipt:

1. Baca `correction_notes` dan risetnya (`show-entry`). Tentukan apa yang membuat gambar lama gagal: subjek absen, skala manusia, atribut tidak terbaca, atau pose pasif.
2. Pindahkan PNG lama ke `rejected/<slug>-attempt-NN.png` (NN berikutnya yang belum dipakai). Tulis `rejected/<slug>-attempt-NN.json` berisi `original_file`, `native_sha256`, `prompt` lama, dan `reason` berupa catatan Claude. Tambahkan entri `{ original_file, receipt_file, native_sha256, reason }` ke `rejected_attempts` di receipt.
3. Gambar ulang dengan resep sangar. Untuk dewa-dewi: skala monumental, cahaya ilahi dari atribut yang terdokumentasi, elemen yang dikuasainya bergerak, atribut dibuat besar dan jelas (sisik timbangan Maat, kepala singa Sekhmet, dua wajah Janus, sembilan dewa Ennead sebagai sembilan sosok monumental).
4. Tulis ulang `prompt`, `depicted_variant`, `visual_requirements`, `aura`, `artistic_choices`, `generated_file`, `generated_at`, `original_file`, `native_sha256`, `width`, `height`, dan `visual_review` (hash baru, reviewer `codex`).
5. **Hapus** `root_visual_review` dan `correction_notes` dari receipt. Status kembali ke `awaiting-independent-review`. Samakan `native_sha256`, `original_file`, dan `receipt_path` pada item ledger.
6. Untuk 10 pengganti di `data/artwork-presentation-revision-nama-besar.json`, receipt harus tetap memuat `revision`, `rationale`, `old_url`, `old_webp_sha256`, `old_original_file`, `old_native_sha256`, dan `historical_native_sha256`. Hash baru harus berbeda dari semua hash lama. Jangan menyentuh WebP lama, PNG lama, atau `backups/`.
7. Periksa:

   ```bash
   node scripts/artwork-status.mjs          # receipt tidak valid harus 0
   node scripts/audit-artwork-nama-besar.mjs   # untuk batch 1047, 1055, dan revisi nama-besar; harus lulus
   ```

## 6. Arah seni: SANGAR

### 6.1 Standar

Pemilik menilai gambar yang **sangar**: berbahaya, mengancam, atau mengguncang karena keagungannya. Penonton harus merasa makhluk itu bisa melukainya atau membuatnya bersujud. Teknik yang rapi tidak cukup.

Gambar yang pasti ditolak, apa pun kualitasnya:
- manusia biasa, seukuran manusia, yang bisa saja orang lewat;
- hewan biasa di padang, sungai, atau kandang;
- lanskap tanpa makhluknya, atau makhluk yang kecil dan jauh;
- sosok berdiri diam menghadap kamera dengan wajah netral;
- gaya lucu, maskot, pastel, cahaya siang yang rata;
- atribut yang disebut klaim tetapi tidak terbaca (mata ketiga samar, wajah kedua tersembunyi).

### 6.2 Sepuluh prinsip

1. **Makhluk adalah subjek.** Ia mengisi bingkai; kepala dan ciri pembedanya terbaca bahkan pada ukuran 200 piksel.
2. **Momen, bukan pose.** Sedang memburu, muncul dari gelap, menghantam, memerintah badai, menjulang, turun dari langit. Kata kerja dulu.
3. **Konfrontasi.** Tatapan langsung ke penonton atau menunduk ke arahnya; gigi, cakar, tangan yang bergerak; postur mengintai atau mendominasi.
4. **Kamera rendah dan skala.** Kalau klaim menyebut ukuran besar, pakai pembanding kecil (manusia, perahu, pohon). Kalau tidak, dominasi lewat framing rapat dan foreshortening, bukan dengan membesarkan makhluk yang tidak terdokumentasi besar.
5. **Cahaya sinematik low-key.** Satu sumber cahaya dominan (bulan, api, kilat, matahari terbenam), rim light, bayangan dalam, kontras tinggi; debu, asap, hujan, kabut, cipratan air.
6. **Efek kekuatan yang nyata.** Setiap efek berasal dari kuasa, ranah, atribut, habitat, atau perbuatan yang terdokumentasi, dan bekerja secara fisik di dunia: tanah retak, air terangkat, pohon rebah, petir menyambar, korban membatu. Dilarang: aura menyala generik, garis neon, pita energi, rune melayang, kabut warna bercahaya.
7. **Tekstur nyata.** Sisik basah, bulu kusut, kulit retak, karat, kain lusuh, batu. Bukan permukaan licin plastik.
8. **Latar dari ceritanya.** Tempat yang disebut klaim: kuburan, rawa, tebing laut, medan perang, istana langit, badai gurun. Cuaca dan waktu memperkuat ancaman atau keagungan.
9. **Palet gelap hangat** dengan satu aksen kuat, sejalan dengan koleksi (walnut, emas antik, parchment). Bukan pastel, bukan terang merata.
10. **Setia pada klaim.** Hitung kepala, mata, lengan, kaki. Efek dan suasana menambah kekuatan, tidak mengganti atau mengarang anatomi. Pakaian buram penuh bila sosoknya berpakaian; tanpa ketelanjangan, tanpa gore eksplisit.

### 6.3 Resep prompt

Prompt ditulis dalam bahasa Inggris, dengan urutan tetap supaya setiap bagian bisa ditunjuk ke klaimnya. Isi setiap baris dengan kata benda konkret; kata sifat seperti *majestic* tanpa benda yang terlihat tidak mengubah gambar.

```
ONE original square premium painterly cinematic Mythics illustration of <NAME>, <identitas satu kalimat dari klaim>.
ANATOMY: <jumlah kepala/mata/lengan/kaki persis, atribut, pakaian buram> [cNN, cNN]
MOMENT: <apa yang sedang ia lakukan saat ini, kata kerja dulu, ke arah penonton>
POWER: <efek terdokumentasi yang bekerja fisik di dunia> [cNN]  (atau: no documented power; menace through anatomy, scale and light only)
SCALE & CAMERA: extreme low angle; <pembanding kecil bila ukurannya terdokumentasi, atau framing rapat>
LIGHT & WEATHER: <satu sumber cahaya dominan>, rim light, <debu/asap/hujan/cipratan>
SURFACE: <tekstur: sisik basah, bulu kusut, kulit retak, karat, kain lusuh>
SETTING: <tempat dari klaim> [cNN]
MOOD: menacing / awe-inspiring; dangerous and imposing, never cute, calm or decorative.
HARD CONSTRAINTS: no text, lettering, logo, border, frame or watermark; no extra heads, limbs or fingers; no design borrowed from any film, game, anime or comic; no nudity or explicit gore; no generic glow aura, neon outline or energy ribbons.
```

Contoh yang lolos tinjauan Claude pada 7 Oktober dan bisa dipelajari dari receiptnya:
- `data/artwork-generated/presentation-revision-nama-besar/sun-wukong.json`: potret setengah badan makaka yang menggeram, tongkat besi hitam dengan dua pita emas memercikkan api saat menggores batu, debu pertempuran, cahaya samping dingin. Sangar lewat tatapan dan kontak fisik, bukan aura.
- `data/artwork-generated/batch-1113/satan.json`: sosok menjulang dari kamera rendah memenuhi bingkai dari kuku sampai tanduk, lembah kecil di kakinya, langit badai dengan satu celah hangat. Ancaman dari komposisi dan cahaya.
- `data/artwork-generated/batch-1113/poseidon.json`: trisula menghantam batu pantai yang retak, ombak raksasa dan awan badai dari klaim c06/c17/c15.

Contoh koreksi arah. Sekhmet ditolak dengan catatan *"ordinary woman before the sun; nothing conveys the fierce goddess"*. Arah yang benar, bila klaimnya mendukung: singa betina berkepala singa dengan tubuh perempuan berpakaian buram dan cakram matahari, melangkah keluar dari gelombang panas gurun yang membakar, kamera rendah, mulut singa terbuka, udara bergetar oleh panas, pasir terangkat; manusia kecil berlarian di latar sebagai pembanding skala. Setiap unsur ditunjuk ke klaim; yang tidak ada di klaim tidak dipakai.

### 6.4 Uji Sangar (sebelum menerima gambar)

Jawab semua dengan **ya**, dengan melihat PNG asli:

1. Makhluknya mendominasi bingkai dan langsung dikenali sebagai subjek?
2. Pada ukuran 200 piksel, ia masih terasa berbahaya atau agung?
3. Ada momen atau aksi, bukan pose diam?
4. Setiap efek yang terlihat bisa ditunjuk ke satu id klaim? (Kalau risetnya tidak memuat kekuatan, tidak ada efek, dan itu dicatat di `artistic_choices`.)
5. Jumlah kepala, mata, lengan, kaki, dan atribut sesuai klaim?
6. Tidak ada teks, watermark, bingkai, dan tidak meniru desain film, game, anime, atau komik?
7. Gambar ini tidak akan ditolak dengan alasan putaran lalu: manusia biasa, hewan biasa, hanya lanskap, lucu atau tenang?

Satu "tidak" berarti ulangi. Simpan percobaan yang ditolak di `rejected/` beserta alasannya.

### 6.5 Kasus khusus

- **Agama yang masih dianut** (Hindu, Buddha, Shinto, Abrahamik, kepercayaan rakyat yang masih hidup): sangar berarti **megah dan menggetarkan**, bukan mengerikan. Skala kosmis, cahaya ilahi dari atribut yang terdokumentasi, elemen yang dikuasainya bergerak, ikonografi dari klaim (jumlah lengan, kendaraan, senjata). Hormat tetap mutlak.
- **Tokoh sastra** (Journey to the West, Shelley, Stoker, Lovecraft): ikuti teks sumbernya di klaim. Jangan meniru film, anime, game, atau komik, termasuk Black Myth: Wukong, Dragon Ball, Ne Zha, dan Frankenstein versi Karloff.
- **Makhluk tanpa wujud terdokumentasi** (misalnya Tengri sebagai langit): jangan menggambar lanskap tenang; itu pernah ditolak. Pilih salah satu: (a) manifestasi yang terdokumentasi digambar sebagai **kekuatan aktif yang mendominasi**, misalnya langit yang merobek dirinya di atas padang yang diratakan angin, dengan pilihan ini dicatat di `artistic_choices`; atau (b) status `tidak-digambar` dengan alasan.
- **Kelompok** (Ennead, Adityas): sembilan sosok monumental yang masing-masing membawa atributnya, bertingkat dalam skala dan cahaya, bukan orang berbaris.
- **Makhluk kecil** (peri, duende, roh rumah): sangar lewat keganjilan, close-up ekstrem, mata yang salah, cahaya dari bawah, bayangan yang tidak sesuai badan. Bukan dengan membesarkannya tanpa klaim.
- **Makhluk lambang** (warak ngendog, shachihoko, singa): makhluk hidup sesuai susunan hewan di klaimnya, bukan patung, mainan, atau hiasan.
- **Makhluk baik hati atau pelindung**: tetap agung dan menggetarkan; penonton kagum, bukan takut. Jangan membuatnya jahat.

### 6.6 Nama besar

Untuk makhluk di antrean nama besar, buat **dua varian** dengan komposisi berbeda (misalnya potret konfrontatif dan adegan skala penuh), lewat dua sub-agent atau berurutan. Agen utama memilih satu dengan Uji Sangar, menyimpan varian lain di `variants/<slug>/` beserta receipt kecil berisi alasan tidak dipilih, dan menulis alasan pemilihan di `artistic_choices`.

## 7. Jurnal: `docs/codex/JURNAL-GAMBAR.md`

Jurnal adalah ingatan antar-sesi yang tidak bisa dihitung skrip: pelajaran, prompt yang berhasil, alasan keputusan. Tambahkan entri di **akhir berkas**; jangan mengubah atau menghapus entri lama. Bahasa Indonesia. Tiga jenis catatan:

```markdown
## 2026-10-08 14:05 WIB — Codex — mulai
- Status awal: 41 perbaikan, 97 nama besar, 1.458 lainnya; batch terbuka: 1047, 1055, revisi nama-besar.
- Rencana sesi ini: perbaikan 1047 (13) dan 1055 (18), lalu batch nama besar 50.
- Sub-agent: 4 lane.

### Progres 15:10 WIB
- 1047: 10/13 selesai; tengri 2 percobaan ditolak sendiri (langit tanpa agensi).

## 2026-10-08 17:40 WIB — Codex — selesai
- Hasil: 31 perbaikan selesai (status awaiting-independent-review); batch-1163 dibuat, 22/50 receipt selesai, 28 belum.
- Menunggu Claude: 31 receipt di 1047, 1055; 22 di batch-1163.
- Gagal atau ditolak sendiri: 6 percobaan (alasan ada di rejected/).
- Alat: image_gen; image_model tidak dilaporkan alat.
- Pelajaran: (1) kata "towering, fills the frame from hooves to horns" lebih efektif daripada "monumental"; (2) untuk dewi Mesir, sebutkan ukuran atribut secara literal ("sun disk as wide as her shoulders"); (3) ...
- Sesi berikutnya: lanjutkan batch-1163 dari 28 makhluk yang belum punya receipt.
```

Kalau sesi terputus sebelum entri "selesai", sesi berikutnya tetap bisa pulih lewat skrip status; jurnal hanya kehilangan pelajarannya.

## 8. Kontrak receipt

Satu receipt per makhluk, `data/artwork-generated/batch-<N>/<slug>.json` (atau folder revisi untuk pengganti). Field yang wajib:

| Field | Isi |
|---|---|
| `slug`, `worker` | slug makhluk; `"codex"` |
| `worker_agent`, `subagent_model`, `subagent_reasoning_effort` | nama lane sub-agent, `"gpt-6.1-sol"`, `"high"` |
| `tool`, `image_model` | `"OpenAI built-in image_gen"`; nama model persis atau `"tidak dilaporkan alat"` |
| `status` | `awaiting-independent-review` (siap ditinjau Claude) atau `tidak-digambar` (dengan `reason`) |
| `review_path` | sama persis dengan `review_path` item ledger |
| `batch`, `rationale` | nomor batch; `intent` dari `user_policy` ledger |
| `generated_file`, `generated_at` | path PNG mentah dari alat; waktu ISO |
| `original_file`, `native_sha256`, `width`, `height` | path relatif dari akar repo ke `originals/<slug>.png`; SHA-256 berkas itu; ukuran piksel (minimal 1024) |
| `prompt` | prompt persis yang dipakai untuk PNG terpilih |
| `depicted_variant` | satu kalimat varian wujud yang dipilih |
| `basis_claim_ids` | semua id klaim yang dipakai; harus ada di riset makhluk |
| `visual_requirements` | daftar `{ kind, description, claim_ids }`, `kind` salah satu dari `anatomy`, `effect`, `setting` |
| `aura` | satu kalimat: dari mana kesan kekuatannya datang, dengan id klaim |
| `artistic_choices` | daftar pilihan editorial yang bukan fakta sumber (pakaian, palet, komposisi, alasan varian terpilih) |
| `generation_failures`, `rejected_attempts` | daftar, boleh kosong; setiap percobaan ditolak punya `original_file`, `receipt_file`, `native_sha256`, `reason` |
| `visual_review` | `{ reviewer: "codex", verdict: "pass", notes, limitations: [], native_sha256, reviewed_at }` setelah melihat PNG asli; `native_sha256` sama dengan hash berkas |

Yang **tidak boleh** ada di receipt yang menunggu tinjauan: `root_visual_review`, `independent_visual_review`, `correction_notes`. Itu ditulis Claude. Skrip status menandai receipt yang melanggar salah satu baris di atas sebagai "tidak valid".

## 9. Laporan akhir di chat

Setelah entri "selesai" ditulis di jurnal, laporkan di chat:
- batch dan receipt yang menunggu tinjauan kedua, per ledger;
- receipt perbaikan yang sudah dibuat ulang;
- makhluk yang `tidak-digambar` beserta alasannya;
- `image_model` yang tercatat;
- sub-agent yang dipakai dan pembagiannya;
- semua kegagalan atau penolakan dari alat gambar;
- hasil `node scripts/artwork-status.mjs` terakhir (bagian receipt tidak valid harus kosong).

## 10. Larangan, ringkas

- Jangan menggambar entri yang belum lengkap dan valid, dan jangan menambah slug dengan tangan.
- Jangan mengubah riset, katalog, penilaian kekuatan, manifest, prompt terverifikasi, WebP aktif, atau `data/artwork-nama-besar.json`.
- Jangan menulis `root_visual_review`, jangan integrasi, jangan commit, jangan push.
- Jangan menghapus PNG, varian, atau percobaan yang ditolak; semuanya riwayat.
- Jangan meniru desain berhak cipta; jangan memuat teks, logo, bingkai, atau watermark.
- Jangan menebak nama model gambar.
