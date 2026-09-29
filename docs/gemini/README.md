# Alur riset Mythics dengan Gemini

Gemini mencari sumber dan menulis entri. Claude memeriksa hasilnya dan membuat prompt perbaikan sampai entri lulus. Setelah itu, Claude menggabungkan entri ke data aplikasi. Pengguna menjadi penghubung antara keduanya.

## Berkas

| Berkas | Isi |
|---|---|
| `docs/gemini/00-instruksi-utama.md` | Aturan riset dan format JSON. Dikirim sekali di awal setiap chat Gemini. |
| `docs/gemini/batches/batch-NNN.md` | Daftar makhluk satu batch. |
| `docs/gemini/batches/batch-NNN-fix-K.md` | Prompt perbaikan putaran ke-K. |
| `data/gemini/inbox/batch-NNN*.md` | Jawaban Gemini, disalin apa adanya. |
| `data/gemini/reviews/` | Laporan pemeriksaan. |

## Mode agen: seluruh 5.000 makhluk sekaligus (disarankan)

`npm run gemini:worklist` menyusun daftar kerja 5.000 makhluk (`data/gemini/worklist.json`) dari entri yang ada ditambah makhluk dari Wikidata, lengkap dengan **jenis**-nya (hantu, peri, dewa, iblis/setan, malaikat, orang suci, dan lain-lain), lalu memecahnya menjadi batch `batch-002` sampai `batch-537`.

Jalankan Gemini sebagai agen di folder repo, lalu tempel seluruh isi `docs/gemini/PROMPT-5000.md`:

```bash
cd ~/Projects/asadin-mythological-creatures
agy -i "$(cat docs/gemini/PROMPT-5000.md)"
```

Atau buka folder ini di Antigravity dan tempel prompt yang sama di panel agen. Agen menulis ke `data/gemini/inbox/`, menjalankan pemeriksa sendiri, memperbaiki kesalahannya, dan mencatat kemajuan di `data/gemini/progress.json`. Kalau sesi terputus atau kuota habis, jalankan prompt yang sama lagi; agen melanjutkan dari `progress.json`. `npm run gemini:status` menampilkan ringkasan kemajuan.

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
