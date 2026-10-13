(() => {
  "use strict";

  const config = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const WISHES_PER_PAGE = Math.max(1, Number(config.wishesPerPage) || 5);
  let wishes = [];
  let currentPage = 1;
  let countdownTimer = null;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  function setConfigText() {
    $$("[data-config]").forEach((element) => {
      const key = element.dataset.config;
      if (config[key] !== undefined && config[key] !== null) element.textContent = config[key];
    });
    const socialLinks = [
      ["#groomSocial", config.groomSocialUrl],
      ["#brideSocial", config.brideSocialUrl]
    ];
    socialLinks.forEach(([selector, url]) => {
      const link = $(selector);
      if (link && url) { link.href = url; link.hidden = false; }
    });
  }

  function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guest = (params.get("to") || "Bapak/Ibu/Saudara/i").replace(/\+/g, " ").trim();
    $("#guestNameCover").textContent = guest || "Bapak/Ibu/Saudara/i";
    const input = $("#guestName");
    if (params.get("to") && input) input.value = guest;
  }

  function renderEvents() {
    const grid = $("#eventGrid");
    const events = Array.isArray(config.events) ? config.events : [];
    grid.innerHTML = events.map((event, index) => `
      <article class="event-card">
        <span class="event-card__number">0${index + 1}</span>
        <h3>${escapeHTML(event.title || "Acara")}</h3>
        <p><strong>${escapeHTML(event.date || "")}</strong></p>
        <p>${escapeHTML(event.time || "")}</p>
        <p>${escapeHTML(event.location || "")}</p>
        ${event.mapsUrl ? `<a class="button button--outline button--small" href="${escapeHTML(event.mapsUrl)}" target="_blank" rel="noopener noreferrer">Buka Google Maps ↗</a>` : ""}
      </article>`).join("");
  }

  function renderGifts() {
    const grid = $("#giftGrid");
    const gifts = Array.isArray(config.gifts) ? config.gifts : [];
    grid.innerHTML = gifts.map((gift, index) => `
      <article class="gift-card">
        <span class="gift-card__bank">${escapeHTML(gift.bank || "Wedding Gift")}</span>
        <strong>${escapeHTML(gift.accountNumber || "Informasi rekening belum tersedia")}</strong>
        <p>a.n. ${escapeHTML(gift.accountName || "")}</p>
        ${gift.accountNumber ? `<button class="button button--outline button--small" type="button" data-copy="${escapeHTML(gift.accountNumber)}">Salin nomor</button>` : ""}
      </article>`).join("");
    $("#giftAddress").textContent = config.giftAddress || "";
  }

  function makeCalendarLink() {
    const start = new Date(config.eventDateISO);
    if (Number.isNaN(start.getTime())) return;
    const end = new Date(start.getTime() + (Number(config.calendarDurationHours) || 5) * 3600000);
    const format = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Pernikahan ${config.partnerOne || "Ragil"} & ${config.partnerTwo || "Dinar"}`,
      dates: `${format(start)}/${format(end)}`,
      details: config.calendarDetails || "Undangan pernikahan",
      location: config.calendarLocation || ""
    });
    $("#calendarLink").href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function updateCountdown() {
    const target = new Date(config.eventDateISO).getTime();
    if (!Number.isFinite(target)) return;
    let distance = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value).padStart(2, "0");
    });
    if (distance <= 0 && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function showStatus(message, isError = false) {
    const status = $("#formStatus");
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      const previous = button.textContent;
      button.textContent = "Tersalin ✓";
      setTimeout(() => { button.textContent = previous; }, 1600);
    } catch {
      window.prompt("Salin nomor rekening berikut:", text);
    }
  }

  function renderWishes() {
    const container = $("#wishList");
    const pagination = $("#wishPagination");
    $("#wishCount").textContent = `${wishes.length} ucapan`;
    if (!wishes.length) {
      container.innerHTML = '<p class="muted">Belum ada ucapan. Jadilah yang pertama mengirim doa.</p>';
      pagination.hidden = true;
      return;
    }

    const totalPages = Math.ceil(wishes.length / WISHES_PER_PAGE);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const start = (currentPage - 1) * WISHES_PER_PAGE;
    container.innerHTML = wishes.slice(start, start + WISHES_PER_PAGE).map((wish) => `
      <article class="wish-item">
        <div class="wish-item__top">
          <strong>${escapeHTML(wish.name || "Tamu")}</strong>
          <span class="wish-item__status">${escapeHTML(wish.attendance || "")}</span>
        </div>
        <p>${escapeHTML(wish.message || "")}</p>
      </article>`).join("");

    pagination.hidden = totalPages <= 1;
    $("#pageInfo").textContent = `Halaman ${currentPage} dari ${totalPages}`;
    $("#prevWishes").disabled = currentPage <= 1;
    $("#nextWishes").disabled = currentPage >= totalPages;
  }

  async function loadWishes() {
    if (!config.appsScriptUrl) {
      $("#wishList").innerHTML = '<p class="muted">Integrasi ucapan belum dikonfigurasi. Isi appsScriptUrl pada config.js setelah menyiapkan Google Apps Script.</p>';
      $("#wishCount").textContent = "";
      return;
    }
    $("#wishList").innerHTML = '<p class="muted">Memuat ucapan…</p>';
    try {
      const response = await fetch(config.appsScriptUrl, { method: "GET", redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      wishes = Array.isArray(data) ? data.slice().reverse() : [];
      currentPage = 1;
      renderWishes();
    } catch (error) {
      $("#wishList").innerHTML = '<p class="muted">Ucapan belum dapat dimuat. Periksa URL dan akses Web App Google Apps Script.</p>';
      console.error("Gagal memuat ucapan:", error);
    }
  }

  async function submitRsvp(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!config.appsScriptUrl) {
      showStatus("RSVP belum aktif. Isi appsScriptUrl pada config.js dan deploy Google Apps Script terlebih dahulu.", true);
      return;
    }

    const submitButton = $("#submitRsvp");
    const data = {
      name: $("#guestName").value.trim(),
      attendance: form.elements.attendance.value,
      guestCount: Number($("#guestCount").value) || 1,
      message: $("#wishMessage").value.trim(),
      submittedAt: new Date().toISOString()
    };
    if (!data.name || !data.message || !data.attendance) {
      showStatus("Lengkapi nama, konfirmasi kehadiran, dan ucapan.", true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Mengirim…";
    showStatus("Mengirim konfirmasi…");
    try {
      /*
       * Apps Script web apps commonly require a simple cross-origin request.
       * text/plain avoids a CORS preflight. With no-cors, the browser cannot
       * read the response, so a resolved fetch is not proof of server-side save.
       * Verify submissions in the linked Google Sheet during setup/testing.
       */
      await fetch(config.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });
      showStatus("Permintaan terkirim dari browser. Karena pembatasan CORS Google Apps Script, penyimpanan belum dapat dikonfirmasi di halaman ini. Periksa Google Sheets saat pengujian.");
      form.reset();
      await loadWishes();
    } catch (error) {
      showStatus("Pengiriman gagal. Periksa koneksi dan URL Google Apps Script.", true);
      console.error("Gagal mengirim RSVP:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Kirim Konfirmasi";
    }
  }

  function openInvitation() {
    $("#cover").classList.add("is-hidden");
    const audio = $("#bgMusic");
    if (config.musicEnabled && audio) {
      audio.volume = 0.45;
      audio.play().catch(() => {
        // Autoplay may be blocked by the browser; invitation still opens normally.
      });
    }
  }

  function init() {
    setConfigText();
    getGuestName();
    renderEvents();
    renderGifts();
    makeCalendarLink();
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
    loadWishes();

    $("#openInvitation").addEventListener("click", openInvitation);
    $("#rsvpForm").addEventListener("submit", submitRsvp);
    $("#prevWishes").addEventListener("click", () => { currentPage--; renderWishes(); });
    $("#nextWishes").addEventListener("click", () => { currentPage++; renderWishes(); });
    $("#giftGrid").addEventListener("click", (event) => {
      const button = event.target.closest("[data-copy]");
      if (button) copyText(button.dataset.copy, button);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
