# Ragil & Dinar — Cinematic Wedding Invitation

Template undangan digital responsif. File utama dipublikasikan melalui GitHub Pages dari branch `main`, folder `/ (root)`.

## Struktur repository yang sesuai dengan aset aktual

```text
Wedding-DinarRagil/
├── index.html
├── style.css
├── config.js
├── script.js
├── Code.gs
├── README.md
└── assets/
    ├── dinar.png
    ├── hero.jpg
    ├── ragil.png
    ├── ASSETS-README.txt
    ├── fonts/
    │   ├── Amsterdam.ttf
    │   ├── Priestacy.otf
    │   ├── Saudagar.ttf
    │   ├── Signature United.ttf
    │   ├── SignaturePhotograph.ttf
    │   └── adelia.ttf
    └── images/
        ├── Background.jpg
        ├── cover-background.jpg
        ├── logo-bca.png
        ├── logo-bsi.png
        ├── ornament-bottom-left.png
        ├── ornament-bottom-right.png
        ├── ornament-top-left.png
        └── ornament-top-right.png
```

## Penting: path aset di GitHub Pages

Website ini adalah *project site*, sehingga URL-nya berada di bawah subfolder repository:

`https://ragiladin.github.io/Wedding-DinarRagil/`

Karena itu, path lokal ditulis relatif terhadap root repository, misalnya:
- `./assets/images/Background.jpg`
- `./assets/images/cover-background.jpg`
- `./assets/hero.jpg`
- `./assets/ragil.png`
- `./assets/dinar.png`
- `./assets/fonts/Priestacy.otf`

Jangan mengawali path dengan `/assets/...`, karena itu akan mengarah ke root domain, bukan folder repository.

## Musik

Di screenshot struktur aset yang diberikan, file musik belum terlihat. Jika ingin mengaktifkan musik:
1. Upload file audio bernama `music.mp3` ke folder `assets/`.
2. Pastikan `index.html` menunjuk ke `./assets/music.mp3`.
3. Atur `musicEnabled: true` di `config.js` (saat ini diset `false` karena file musik belum terlihat pada struktur aset yang dikirim).

## Foto galeri

Konfigurasi awal masih memiliki referensi `moment-1.jpg`, `moment-2.jpg`, dan `moment-3.jpg`, tetapi file tersebut tidak terlihat pada struktur folder yang dikirim. Tambahkan file tersebut ke `assets/images/` jika fitur galeri digunakan, atau ubah/hapus referensinya di `config.js`.

## RSVP Google Sheets

`Code.gs` adalah backend Google Apps Script dan tidak dijalankan oleh GitHub Pages. Deploy sebagai Web App secara terpisah, lalu isi `appsScriptUrl` di `config.js` dengan URL `/exec`. Uji pengiriman dan pemuatan ucapan langsung di Google Sheets.

## Publish GitHub Pages

1. Pastikan `index.html`, `style.css`, `config.js`, dan `script.js` ada di root repository.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**, branch `main`, folder `/(root)`.
4. Tunggu workflow **pages build and deployment** selesai.
5. Buka `https://ragiladin.github.io/Wedding-DinarRagil/`.

Jangan menghapus folder `assets` yang sudah ada ketika mengganti file source. File aset perlu tetap berada di lokasi dan menggunakan nama yang persis sama, termasuk huruf besar-kecil.
