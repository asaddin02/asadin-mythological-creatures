# Pembagian tugas Mythics — mulai 6 Oktober 2026

Status awal dari `node scripts/gemini/fill-status.mjs`, dengan 4.842 makhluk dalam rencana:

| Kategori | Jumlah | Dikerjakan oleh |
|---|---:|---|
| Lengkap, valid, bergambar | 904 | sudah tampil di situs publik |
| Lengkap, valid, tanpa gambar | 598 | **Gemini**: ilustrasi |
| Lengkap, tidak valid (batch 140–141) | 55 | **Claude Cloud Code**: validasi |
| Tidak lengkap | 1.968 | **Claude Cloud Code**: pengayaan |
| Belum ada entri (batch 081–109, sisa 139/141, batch-153) | 1.317 | belum dibagikan |

Aturan pemilik proyek: **hanya entri yang lengkap dan valid boleh bergambar.** Ada 132 gambar yang terpasang pada entri yang belum lengkap atau belum valid. Gambar itu tidak dihapus, tetapi ditandai `gambar_ditahan` di `data/gemini/fill-status.json` dan tidak dihitung atau ditampilkan. Gambarnya otomatis berlaku lagi kalau entrinya menjadi lengkap dan valid. Karena itu, antrean pengayaan mendahulukan 127 entri tidak lengkap yang gambarnya ditahan.

## Claude Cloud Code: validasi dan pengayaan

- Prompt: [`docs/gemini/PROMPT-CLOUD.md`](gemini/PROMPT-CLOUD.md). Subagent: [`.claude/agents/peneliti-mythics.md`](../.claude/agents/peneliti-mythics.md), dikunci ke `claude-sonnet-5-5` dengan effort `high`.
- Pilih model sesi **Sonnet 5.5** dengan effort **high**, dan atur akses jaringan environment ke **Full**, karena riset dan verifier mengunduh halaman dari banyak situs.
- Antrean: `npm run gemini:enrich-queue` → `data/gemini/enrich-queue.json` (tidak di-commit). Catatan hasil per batch ada di `data/gemini/enrich/<batch>.json`.
- Verifikasi pengayaan memakai `node scripts/gemini/verify.mjs <batch> --changed`, yang hanya memeriksa ulang entri yang berubah. Entri lain tetap memakai hasil pemeriksaan sebelumnya, sehingga tidak gugur karena artikel Wikipedia-nya sudah diedit sejak diriset.
- Commit dan push otomatis **setiap 50 entri selesai**, supaya pekerjaan tidak hilang kalau sesi cloud terputus.

## Gemini: ilustrasi

- Prompt: [`docs/PROMPT-GAMBAR-GEMINI.md`](PROMPT-GAMBAR-GEMINI.md). Daftar kerja: `data/artwork-batch-1598.json` (598 item, dibuat dengan `scripts/prepare-artwork-batch.mjs`).
- Gemini menulis receipt dan PNG asli ke `data/artwork-generated/batch-1598/`, dengan tinjauan pertama oleh dirinya sendiri. Gemini tidak memasang gambar dan tidak menjalankan git.
- Makhluk yang wujudnya tidak terdokumentasi boleh ditolak dengan status `tidak-digambar`, alih-alih dikarang.

## Claude Code lokal: pemeriksa akhir

Claude Code lokal bekerja setelah Gemini dan Claude Cloud Code melapor selesai.

**Hasil Claude Cloud Code**
1. `git pull`, lalu `node scripts/gemini/fill-status.mjs` dan `npm run gemini:enrich-queue`.
2. Baca sampel klaim baru per batch: `statement` harus sesuai `quote`, dan prosa tidak boleh melebihi klaim. Kalau ada yang salah, tulis berkas fix atau kembalikan entrinya ke versi sebelumnya.
3. Commit `data/gemini/fill-status.json` dan push. Deploy berjalan otomatis setelah CI lulus.

**Hasil Gemini**
1. Lihat setiap gambar di `data/artwork-generated/batch-1598/originals/` dan bandingkan dengan receipt dan klaimnya. Untuk yang lolos, tulis `root_visual_review` (`reviewer: "claude"`, `native_sha256` yang sama) dan ubah `status` menjadi `reviewed`. Yang tidak lolos diberi status `needs-correction` dengan catatan untuk Gemini.
2. `node scripts/prepare-reviewed-artwork-records.mjs data/artwork-batch-1598.json --apply`. Sebanyak 537 dari 598 makhluk belum punya catatan katalog di `data/creatures.json`.
3. `node scripts/integrate-artwork-batch.mjs 1598`, lalu `node scripts/audit-artwork-batch.mjs 1598`.
4. `npm run check`, `npm test`, dan `npm run build:site`. Lalu commit receipt, `assets/art/`, dan katalog, dan push.

## Yang masih terbuka

- 1.317 entri yang belum diriset belum dibagikan ke siapa pun.
- Pengecekan manual kecocokan gambar oleh pemilik proyek belum selesai. Status "valid" hanya berarti lulus pemeriksaan otomatis.
