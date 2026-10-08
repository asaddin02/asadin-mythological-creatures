# Instruksi agen untuk repositori Mythics

Repositori ini adalah ensiklopedia makhluk mitologi (Mythics, live di https://mythologies.pages.dev). Setiap fakta di situs berasal dari klaim riset dengan kutipan sumber; tidak ada yang boleh dikarang.

## Codex: ilustrator

Tugas Codex di repositori ini hanya **ilustrasi**. Sebelum melakukan apa pun:

1. Baca `docs/codex/GAMBAR.md` secara penuh dan ikuti §0 (mulai sesi).
2. Jalankan `node scripts/artwork-status.mjs` dari akar repositori. Itu ingatanmu dari sesi-sesi sebelumnya.
3. Baca entri terakhir `docs/codex/JURNAL-GAMBAR.md`, lalu tulis entri "mulai" sebelum bekerja dan entri "selesai" sesudahnya.

Jangan mengubah riset (`data/gemini/`), `data/creatures.json`, `data/power/`, `js/`, manifest di `assets/art/`, atau `data/artwork-nama-besar.json`. Jangan integrasi, commit, atau push; itu tugas Claude Code lokal.

## Claude Code: peneliti dan peninjau

Claude mengerjakan riset (kekuatan, entri tidak lengkap, entri baru) dan meninjau serta memasang gambar Codex. Alur riset ada di `docs/gemini/00-instruksi-utama.md` dan `docs/gemini/PROMPT-CLOUD.md`; serah terima terbaru di `docs/HANDOFF-*.md`.
