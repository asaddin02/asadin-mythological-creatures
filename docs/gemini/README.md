# Alur riset Mythics dengan agen AI

Agen AI (Gemini, Codex, atau lainnya) mencari sumber dan menulis entri. Claude memeriksa hasilnya dan membuat prompt perbaikan sampai entri lulus. Setelah itu, Claude menggabungkan entri ke data aplikasi.

## Berkas

| Berkas | Isi |
|---|---|
| `docs/gemini/00-instruksi-utama.md` | Aturan riset dan format JSON. Dikirim sekali di awal setiap chat Gemini. |
| `docs/gemini/batches/batch-NNN.md` | Daftar makhluk satu batch. |
| `docs/gemini/batches/batch-NNN-fix-K.md` | Prompt perbaikan putaran ke-K. |
| `data/gemini/inbox/batch-NNN*.md` | Jawaban Gemini, disalin apa adanya. |
| `data/gemini/reviews/` | Laporan pemeriksaan. |

## Mode agen (disarankan)

`npm run gemini:worklist` menyusun daftar kerja awal dari entri yang ada ditambah makhluk dari Wikidata, lengkap dengan **jenis**-nya. Sejak 2026-09-30, `npm run gemini:regroup` menyusun ulang batch yang belum dimulai menjadi batch berisi paling banyak 50 makhluk dari satu kelompok budaya (`batch-048` sampai `batch-152`), dan membuang duplikat serta item yang bukan makhluk (tercatat di `worklist.json` → `dropped`).

Beberapa agen bisa bekerja bersamaan, di komputer yang sama (dengan clone terpisah) atau berbeda. Semuanya memakai satu prompt, `docs/gemini/PROMPT-AGEN.md`:

```bash
cd ~/Projects/asadin-mythological-creatures
agy -i "$(cat docs/gemini/PROMPT-AGEN.md)"      # Gemini / Antigravity: --agent gemini --arah mundur
codex "$(cat docs/gemini/PROMPT-AGEN.md)"        # Codex: --agent codex --arah maju
```

Siklusnya per batch:
1. `npm run gemini:next -- --agent <nama> --arah <maju|mundur>` mengambil batch berikutnya dan menulis `data/gemini/progress/<batch>.json` berstatus `dikerjakan`. Agen commit dan push klaim itu.
2. Agen meneliti, menulis ke `data/gemini/inbox/`, menjalankan `npm run gemini:verify -- <batch>`, dan memperbaiki sampai 3 putaran.
3. `npm run gemini:done -- <batch> --agent <nama>` mencatat hasil dari laporan pemeriksa dan mencetak pesan commit `... (sisa N batch)`. Agen commit dan push.

Satu berkas progres per batch mencegah konflik git antaragen. `data/gemini/progress.json` hanya berisi batch 001–047 dan tidak ditulis lagi. `npm run gemini:status` menampilkan ringkasan kemajuan, termasuk batch yang sedang dikerjakan.

## Mode chat: satu batch (cadangan)

1. Buka **chat Gemini baru**. Pakai model terkuat yang bisa membuka halaman web.
2. Kirim seluruh isi `00-instruksi-utama.md`. Gemini akan menjawab "Siap, kirim batch."
3. Kirim seluruh isi `batches/batch-NNN.md`.
4. Kalau Gemini berhenti dengan `LANJUT: <slug>`, balas `lanjut`. Ulangi sampai muncul `Selesai: N/N entri`.
5. Salin **semua** jawaban Gemini (tombol salin di tiap jawaban) ke satu berkas, `data/gemini/inbox/batch-NNN.md`, termasuk tanda ```json.
6. Beri tahu Claude bahwa batch sudah selesai.
7. Claude menjalankan `npm run gemini:verify -- batch-NNN`, memeriksa isi klaim dan gambar satu per satu, lalu menulis `batches/batch-NNN-fix-1.md` bila perlu.
8. Kirim prompt perbaikan itu ke **chat Gemini yang sama**. Simpan jawabannya sebagai `data/gemini/inbox/batch-NNN-fix-1.md`, tanpa menimpa berkas pertama, lalu beri tahu Claude lagi.
9. Ulangi langkah 7–8 sampai semua entri lulus.

Untuk membuat batch baru:

```bash
npm run gemini:batch -- --id batch-002 --task rewrite --tier rich --slugs a,b,c
```

## Yang diperiksa

**Otomatis:**
- struktur JSON dan nilai kategori;
- keterkaitan klaim dan sumber;
- URL (tidak boleh halaman depan situs atau situs terlarang);
- setiap kutipan dicari di halaman sumbernya;
- teks yang disalin dari sumber;
- gambar: berkasnya ada di Commons, lisensinya bebas dan sama dengan yang ditulis, serta keterkaitannya dengan nama makhluk.

**Manual oleh Claude:**
- apakah setiap pernyataan benar-benar didukung kutipannya;
- apakah deskripsi tidak melebihi klaim-klaimnya;
- kutipan dari halaman yang tidak bisa dibuka otomatis;
- isi visual setiap gambar.
