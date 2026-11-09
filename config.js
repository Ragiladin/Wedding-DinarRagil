/*
 * KONFIGURASI TEMPLATE
 * Ubah data di file ini untuk setiap pasangan. Jangan taruh password/API secret di sini.
 */
window.WEDDING_CONFIG = {
  partnerOne: "Ragil",
  partnerTwo: "Dinar",
  partnerOneFull: "Ragil Adi Nugroho",
  partnerTwoFull: "Dinar Mahardhika Pratiwi",
  groomParents: "Putra ketiga dari Bapak Hadi Sutjipto (Allahuyarham) & Ibu Djapariyah",
  brideParents: "Putri kedua dari Bapak Windu Laksono (Allahuyarham) & Ibu Sri Sarwini",
  dateLabel: "Kamis, 10 Desember 2026",
  // Format tanggal untuk JavaScript: YYYY-MM-DDTHH:mm:ss+07:00
  eventDateISO: "2026-12-10T09:00:00+07:00",
  calendarDurationHours: 5,
  calendarLocation: "[Lokasi acara]",
  calendarDetails: "Undangan pernikahan Ragil & Dinar",
  // URL Google Apps Script Web App. Kosongkan saat belum dikonfigurasi.
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbyKUw614_Xvbo-I08RFn5B82NEAkpH-LHcvIynIXLUf1vuTlfNuJjP8guNMFCY5ln01/exec",
  wishesPerPage: 5,
  musicEnabled: true,
  // Letakkan file musik di assets/music.mp3. Putar hanya setelah tamu menekan tombol buka.
  story: [
    { year: "July 2026", title: "The Beginning", text: "Jalan takdir menuntun langkah kami untuk saling mengenal pada Juli 2026, berkat perantara seorang sahabat. Bukan pertemuan yang riuh, melainkan perkenalan yang hening dan khusyuk. Teriring do'a-do'a panjang, istikharah yang mengetuk pintu langit, serta ruang-ruang diskusi yang menyatukan pemikiran." },
    { year: "September 2026", title: "A Promise", text: "Atas seizin dan ridho-Nya, kami memilih untuk tidak berjalan di tempat, melainkan melangkah ke jenjang yang lebih serius. Kemudahan yang membentang di setiap prosesnya seolah menjadi isyarat halus bahwa Allah meridhoi. Hingga pada September 2026, ikrar khitbah terucap, mengantarkan kami pada satu titik sepakat." },
    { year: "December 2026 ", title: "Our Forever", text: "Dalam khazanah sastra klasik Arab, cinta sejati seringkali dimaknai bukan sekadar bertemunya dua rupa, melainkan menyatunya dua do'a. Kami meyakini bahwa waktu bukanlah ukuran mutlak bagi sebuah ketulusan. Walau perjalanan ini bermula dari alur yang sederhana, langkah kami kini berpijak pada satu niat yang besar; 10 Desember 2026 sebagai awal lembaran baru hidup kami. "},
    
  ],
  // Ganti path dengan foto asli di assets/images/ (contoh: assets/images/moment-1.jpg).
  gallery: [
    { src: "./assets/images/moment-1.jpg", alt: "Kenangan pertama", caption: "A little moment" },
    { src: "./assets/images/moment-2.jpg", alt: "Kenangan bersama", caption: "The way we grow" },
    { src: "./assets/images/moment-3.jpg", alt: "Kenangan bahagia", caption: "Our favorite days" }
  ],
  groomSocialUrl: "",
  brideSocialUrl: "",
  events: [
    {
      title: "Akad Nikah",
      date: "Kamis, 10 Desember 2026",
      time: "09.00 WIB",
      location: "Masjid Al-Barokah, Gayamsari RT 04/11 Kel. Banyuanyar, Kec. Banjarsari, Surakarta, Jawa Tengah",
    },
    {
      title: "Resepsi",
      date: "Kamis, 10 Desember 2026",
      time: "10.00 WIB – 12.00 WIB",
      location: "Kediaman mempelai perempuan, Gayamsari RT 04/11 Kel. Banyuanyar, Kec. Banjarsari, Surakarta, Jawa Tengah",
      //mapsUrl: "https://maps.app.goo.gl/nmDvyz2MZJPSHr7k6"
    }
    
  ],
/* URL tombol Google Maps di tengah */
  eventMapsUrl: "https://maps.app.goo.gl/nmDvyz2MZJPSHr7k6",

  gifts: [
    { bank: "Bank BCA", accountNumber: "8030576960", accountName: "Ragil Adi Nugroho" },
    { bank: "Bank BSI", accountNumber: "7166028064", accountName: "Dinar Mahardhika Pratiwi" }
  ],
  giftAddress: {
  recipient: "Dinar Mahardhika Pratiwi",
  address: "Jl. Pleret Dalem IV RT 04/11 Gayam Sari, Banyunyar, Surakarta (Samping Ndalem Pleret Guest House)"
},
};
