# SIKEL Admin – Dashboard penyuluh (portofolio)

Project khusus admin/petugas. Data masih dummy dan tersimpan di memori browser (hilang saat refresh).
Login masih contoh; akan diganti Supabase Auth.

## Halaman
Alur: Masuk, lalu Beranda (about), Dashboard, Hak Cipta di sidebar. Menu: Per Wilayah, Per Wilayah, Profil Keluarga,
Kelompok Kegiatan, Input Layanan KB, Instrumen Monitoring (target vs realisasi), Monitoring & Evaluasi.

## Menjalankan
```
npm install
npm run dev
```
Deploy: push ke GitHub, import di Vercel (Vite, build `npm run build`, output `dist`).

## Catatan
- Daftar 23 kecamatan dan desa ada di `src/wilayah.js`. Periksa ulang daftar desa Hulu Gurung dan Seberuang (saat ini identik).
- Foto ada di `public/irlianta.jpg`.

## Supabase
Folder `supabase/` berisi `schema.sql` (tabel + RLS) dan `seed.sql` (data contoh fiktif). Jalankan keduanya berurutan di SQL Editor.
Isi `.env` (lihat `.env.example`) dengan Project URL dan anon key. Jangan pernah memakai service_role key di frontend.
