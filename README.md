# Ragil & Dinar — Cinematic Wedding Invitation

Template undangan digital responsif dengan gaya cinematic luxury: forest green, ivory, sage, dan antique gold.

## Fitur
- Cover opening dan transisi cinematic saat tombol "Buka Undangan" ditekan
- Personalisasi nama tamu melalui URL `?to=Nama+Tamu`
- Animasi reveal saat scroll, progress bar, parallax-ready visual styling, dan penghormatan pada `prefers-reduced-motion`
- Countdown dan tautan Google Calendar
- Data mempelai, acara, timeline cerita, galeri, wedding gift diatur melalui `config.js`
- Tombol musik yang muncul setelah undangan dibuka
- Form RSVP, ucapan, dan integrasi Google Apps Script (perlu konfigurasi dan pengujian)
- Responsif untuk ponsel dan desktop

## Struktur
```
index.html
style.css
config.js
script.js
Code.gs
assets/
  music.mp3
  images/
    ragil.jpg
    dinar.jpg
    moment-1.jpg
    moment-2.jpg
    moment-3.jpg
  fonts/
```

Folder `assets/images/` dan `assets/music/` disediakan sebagai lokasi aset. Agar sesuai dengan `config.js`, letakkan musik sebagai `assets/music.mp3` dan foto galeri di `assets/images/`. Foto pasangan yang digunakan pada halaman mempelai adalah `assets/ragil.jpg` dan `assets/dinar.jpg`. File aset foto dan musik tidak disertakan karena harus diganti dengan aset milik pasangan.

## 1. Ubah detail pernikahan
Edit `config.js`: nama lengkap, orang tua, tanggal, jam, alamat, URL Maps, rekening, story, galeri, dan tautan sosial. Ganti semua teks placeholder `[ ... ]` sebelum dipublikasikan.

`eventDateISO` harus memakai zona waktu yang benar, misalnya `2026-12-20T09:00:00+07:00`. Pastikan tanggal dan jam ini benar sebelum dipakai.

## 2. Tambahkan foto, musik, dan font
- `assets/ragil.jpg` dan `assets/dinar.jpg`: foto pasangan.
- `assets/images/moment-1.jpg` hingga `moment-3.jpg`: foto galeri. Ubah `src` di `config.js` bila nama berbeda.
- `assets/music.mp3`: musik latar yang memang boleh digunakan. Audio baru dimulai setelah klik pengguna, sesuai kebijakan browser.
- Untuk font lokal, letakkan font berlisensi di `assets/fonts/` dan tambahkan deklarasi `@font-face` di `style.css`. Pastikan lisensi mengizinkan penggunaan web dan distribusi template.

## 3. Aktifkan RSVP Google Sheets
1. Buat Google Sheet.
2. Buka **Extensions → Apps Script**, lalu salin isi `Code.gs`.
3. Simpan proyek dan jalankan fungsi `setupSheet()` satu kali dari editor. Selesaikan izin akses.
4. Pilih **Deploy → New deployment → Web app**.
5. Set **Execute as: Me** dan akses sesuai kebutuhan publik RSVP. Pertimbangkan privasi data tamu.
6. Salin URL Web App berakhiran `/exec` ke `appsScriptUrl` di `config.js`.
7. Uji kirim RSVP dan pastikan baris masuk ke Google Sheets. Uji juga pemuatan ucapan. Browser dengan `no-cors` tidak bisa memastikan penyimpanan dari respons frontend; verifikasi spreadsheet secara langsung.

Jangan memasukkan password atau rahasia akun ke file frontend. `config.js` bersifat publik.

## 4. Publikasikan di GitHub Pages
1. Upload isi folder proyek ke root repository.
2. Pastikan `index.html`, `style.css`, `config.js`, dan `script.js` berada di root.
3. Di **Settings → Pages**, pilih **Deploy from a branch**, branch `main`, folder `/(root)`.
4. Tunggu workflow Pages selesai lalu buka URL yang diberikan GitHub.
5. Contoh personalisasi: `https://USERNAME.github.io/REPOSITORY/?to=Wahyu+Pratama`

## Catatan
- Tanggal, detail keluarga, lokasi, nomor rekening, foto, dan URL Apps Script di dalam konfigurasi adalah placeholder yang harus diperiksa.
- Form RSVP belum dapat dianggap aktif sebelum URL Apps Script diisi dan submission diverifikasi di Google Sheets.
- Gunakan foto, audio, dan font yang hak penggunaannya jelas.
