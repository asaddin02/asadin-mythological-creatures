# Jurnal ilustrasi Mythics

Ingatan antar-sesi untuk Codex (ilustrator) dan Claude (peninjau). Aturan: tambahkan entri di akhir berkas, jangan ubah atau hapus entri lama, bahasa Indonesia. Format entri ada di `docs/codex/GAMBAR.md` §7. Angka yang bisa dihitung ulang tidak perlu ditulis panjang; `node scripts/artwork-status.mjs` menghitungnya. Yang berharga di sini adalah **pelajaran**: prompt yang berhasil, alasan penolakan, keputusan yang diambil.

## 2026-10-08 10:50 WIB — Claude lokal — pembukaan jurnal

- Pembagian kerja sejak hari ini: **Codex hanya gambar**; Claude mengerjakan riset kekuatan, entri tidak lengkap, entri yang belum diriset, tinjauan kedua, integrasi, commit, dan push.
- Keadaan saat jurnal dibuka: 1.113 ilustrasi aktif; 1.555 entri lengkap tanpa ilustrasi (97 nama besar); 41 gambar `needs-correction` (13 di batch-1047, 18 di batch-1055, 10 pengganti di revisi nama-besar); 1 receipt (Frankenstein, batch-1094) sudah lolos tinjauan dan menunggu catatan katalog dari Claude.
- Berkas baru: `scripts/artwork-status.mjs` (status dari berkas nyata), `data/artwork-policy-sangar.json` (gaya sangar), `docs/codex/GAMBAR.md` (prompt permanen). `scripts/prepare-artwork-batch.mjs` kini menerima `--policy sangar` dan menomori batch dari nomor tertinggi yang ada, jadi dua batch terbuka tidak bertabrakan.
- Pelajaran dari putaran 6–7 Oktober, dari catatan penolakan Claude di receipt:
  1. Penolakan terbanyak: *ordinary woman/man at human scale*. Dewa yang digambar sebagai manusia seukuran manusia di latar biasa selalu ditolak, meskipun atributnya ada. Atribut harus besar dan terbaca, kamera rendah, skala monumental, elemen yang dikuasai bergerak.
  2. *Only a landscape; the god is absent* (Tengri, Ahura Mazda, Manat, Tammuz, Inari, Set). Makhluk harus hadir dan mendominasi bingkai. Untuk yang tanpa wujud, manifestasinya harus aktif, atau `tidak-digambar`.
  3. *Reads as an ordinary dairy cow* (Hathor). Wujud hewan dari klaim tetap harus terasa ilahi: skala, cahaya dari atribut (cakram matahari), bintang, pembanding kecil.
  4. Atribut terdokumentasi yang samar ditolak (mata ketiga yokai, dua wajah Janus). Sebutkan ukurannya secara literal di prompt.
  5. Yang lolos: Sun Wukong varian B (tatapan makaka menggeram, percikan kontak tongkat dengan batu), Satan (sosok memenuhi bingkai dari kuku sampai tanduk, lembah kecil di kaki), Poseidon (trisula meretakkan batu, ombak dan badai dari klaim), Lucifer (malaikat jatuh terjun dari langit fajar yang robek). Semuanya memakai momen, kamera rendah, satu sumber cahaya, dan efek fisik yang ditunjuk ke klaim.
- Sesi Codex berikutnya: mulai dari §0 `docs/codex/GAMBAR.md`; antrean pertama adalah 41 perbaikan.


## 2026-10-08 10:52 WIB — Codex — mulai

- Status awal terverifikasi: 41 perbaikan (1047: 13, 1055: 18, revisi nama-besar: 10); 97 nama besar baru.
- Rencana sesi: seluruh 41 perbaikan, berhenti pada receipt awaiting-independent-review atau tidak-digambar dengan alasan berbasis klaim. Tidak membuka batch baru.
- Pembagian: lane-1047 (13); lane-1055-a (9); lane-1055-b (9); agen utama revisi nama-besar (10), pemeriksaan semua PNG, ledger, dan jurnal.
- Alat: OpenAI built-in image_gen; nama model hanya dicatat bila alat melaporkannya.
