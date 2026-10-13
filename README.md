# Ragil & Dinar — Botanical Luxury Wedding Template

Template undangan digital statis berbasis HTML, CSS, dan JavaScript dengan aksen ivory, forest green, sage, dan antique gold.

## Struktur file
- `index.html` — struktur halaman
- `style.css` — tampilan desktop dan mobile
- `script.js` — interaksi, countdown, form RSVP, dan daftar ucapan
- `config.js` — konfigurasi nama, tanggal, detail acara, rekening, dan endpoint
- `Code.gs` — backend Google Apps Script untuk Google Sheets
- `assets/` — tempat foto dan musik

## Mulai cepat
1. Buka `config.js` dan ganti semua placeholder dengan data acara yang benar.
2. Letakkan aset gambar berikut ke folder `assets/`:
   - `hero.jpg` — foto utama/cover
   - `ragil.jpg` — foto mempelai pria
   - `dinar.jpg` — foto mempelai wanita
   - `music.mp3` — musik latar opsional
3. Siapkan Google Sheets dan Apps Script menggunakan instruksi di bagian berikut.
4. Masukkan URL Web App berakhiran `/exec` ke `appsScriptUrl` di `config.js`.
5. Tes di browser, termasuk dari ponsel, sebelum dipublikasikan.

## Menyiapkan Google Sheets + Apps Script
1. Buat Google Sheet.
2. Buka **Extensions > Apps Script**.
3. Tempel isi `Code.gs`, simpan.
4. Jalankan fungsi `setupSheet()` sekali dari editor Apps Script dan berikan izin.
5. Klik **Deploy > New deployment > Web app**.
6. Pilih **Execute as: Me** dan akses **Anyone** jika memang ingin tamu publik mengirim RSVP.
7. Deploy dan salin URL `/exec` ke `config.js`.
8. Uji kirim RSVP, lalu pastikan baris masuk ke sheet. Uji juga daftar ucapan (GET).

### Batasan teknis RSVP
Browser menggunakan `fetch` dengan `mode: no-cors` untuk POST sederhana ke Apps Script. Browser tidak mengizinkan JavaScript membaca respons dari request `no-cors`; karena itu UI hanya bisa menyatakan permintaan dikirim dari browser, bukan menjamin data tersimpan. Verifikasi penyimpanan melalui Google Sheets ketika pengujian. Untuk pengalaman produksi yang membutuhkan konfirmasi sukses yang akurat, gunakan backend/proxy dengan CORS yang dikonfigurasi benar.

## Personalisasi undangan
Edit objek `window.WEDDING_CONFIG` di `config.js`:
- `partnerOne`, `partnerTwo`, nama lengkap, dan orang tua
- `dateLabel`, `eventDateISO`, durasi kalender, dan lokasi
- `events` (bisa lebih dari satu acara)
- `gifts` (rekening yang ditampilkan)
- `giftAddress`
- `appsScriptUrl`
- `wishesPerPage`

Link tamu bisa memakai query string, contoh:
`https://domain-undangan.example/?to=Pak%20Budi`

## Publikasi
Website dapat di-host di layanan static hosting. Jika repository GitHub private, periksa ketentuan paket/hosting untuk deployment dari repository private. Repository private tidak membuat file frontend yang sudah dipublikasikan menjadi rahasia.

## Catatan keamanan & penjualan template
- Jangan pernah memasukkan password, private key, atau token rahasia ke `config.js`, HTML, atau JavaScript browser.
- Nomor rekening dan detail pribadi hanya tampil jika memang sengaja dikonfigurasi.
- URL Apps Script publik bukan password. Batasi data yang dikumpulkan dan cek spam.
- Ganti seluruh placeholder `[ ... ]` sebelum dipakai oleh pasangan sungguhan.
- Foto dan musik harus dimiliki atau berlisensi untuk digunakan.
- Ini starter template; uji seluruh fitur dan validasi data sebelum dijual sebagai produk siap pakai.


## Desain Botanical Editorial (versi revisi)
- Palet hijau hutan gelap, ivory, sage, dan antique gold; panel cover berbingkai tipis; nama pasangan memakai aksen script; kartu acara dan RSVP dibuat lebih elegan serta responsif.
- Font custom yang diminta: Adelia, Amsterdam, Saudagar, dan Signature United. Masukkan file font berlisensi ke `assets/fonts/` sesuai nama di `assets/fonts/README.txt`. Font belum disertakan, jadi tampilan font khusus baru aktif setelah file ditambahkan.
- Gambar yang dibutuhkan: `assets/hero.jpg`, `assets/ragil.jpg`, `assets/dinar.jpg`. Pakai foto/ilustrasi botanical milik sendiri atau yang lisensinya mengizinkan penggunaan.
