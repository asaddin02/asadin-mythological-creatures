# Pembagian tugas Mythics — mulai 6 Oktober 2026

Status awal dari `node scripts/gemini/fill-status.mjs`, dengan 4.842 makhluk dalam rencana:

| Kategori | Jumlah | Dikerjakan oleh |
|---|---:|---|
| Lengkap, valid, bergambar | 904 | sudah tampil di situs publik |
| Lengkap, valid, tanpa gambar | 598 | belum dibagikan (lihat bagian Ilustrasi) |
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

## Ilustrasi: Gemini dihentikan

Gemini sempat mengerjakan ilustrasi lewat Antigravity, tetapi dihentikan pada 6 Oktober atas keputusan pemilik proyek. Setelah 14 gambar, Gemini berhenti membuat gambar. Ia lalu menyiapkan antrean prompt untuk Google Flow dan skrip yang menulis catatan pemeriksaan dari templat, alih-alih melihat gambarnya.

Claude memeriksa ke-14 gambar itu terhadap klaim risetnya. **Lima lolos dan sudah terpasang** (batch `1005`): nightmare, pferdegreif, nihang-mythology, the-black-dog-of-newgate, dan carsamba-kar-s. Delapan ditolak, alasannya tercatat di `data/artwork-batch-1005.json` → `selection_audit.rejected`. Penolakan terutama karena makhluknya terlihat seperti manusia atau hewan biasa, atau ciri yang terdokumentasi tidak tergambar. Leontophone ditolak digambar karena sumbernya tidak menjelaskan wujudnya. Daftar kerja 598 item dan prompt Gemini sudah dihapus.

Sisa entri lengkap tanpa gambar belum dibagikan. Untuk batch berikutnya, jalankan `node scripts/prepare-artwork-batch.mjs --tool "<alat>" --worker <nama>`: skrip itu membuat daftar kerja dari status terbaru, dengan alat dan pekerja apa pun.

## Claude Code lokal: pemeriksa akhir

Claude Code lokal bekerja setelah Claude Cloud Code melapor selesai.

**Hasil Claude Cloud Code**
1. `git pull`, lalu `node scripts/gemini/fill-status.mjs` dan `npm run gemini:enrich-queue`.
2. Baca sampel klaim baru per batch: `statement` harus sesuai `quote`, dan prosa tidak boleh melebihi klaim. Kalau ada yang salah, tulis berkas fix atau kembalikan entrinya ke versi sebelumnya.
3. Commit `data/gemini/fill-status.json` dan push. Deploy berjalan otomatis setelah CI lulus.

## Yang masih terbuka

- 1.317 entri yang belum diriset belum dibagikan ke siapa pun.
- Entri lengkap tanpa gambar (593 setelah batch 1005, ditambah yang menjadi lengkap dari pengayaan) belum punya pembuat ilustrasi.
- Pengecekan manual kecocokan gambar oleh pemilik proyek belum selesai. Status "valid" hanya berarti lulus pemeriksaan otomatis.
