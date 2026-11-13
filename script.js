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
  const events = Array.isArray(config.events)
    ? config.events
    : [];

  grid.innerHTML = events.map((event) => {
    // Ambil tanggal dari data acara
    const rawDate = event.dateISO || config.eventDateISO;
    const date = new Date(rawDate);
    const validDate = !Number.isNaN(date.getTime());

    const day = validDate
      ? new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          timeZone: "UTC"
        }).format(date)
      : "";

    const weekday = validDate
      ? new Intl.DateTimeFormat("id-ID", {
          weekday: "long",
          timeZone: "UTC"
        }).format(date)
      : "";

    const month = validDate
      ? new Intl.DateTimeFormat("id-ID", {
          month: "long",
          timeZone: "UTC"
        }).format(date)
      : "";

    const year = validDate
      ? new Intl.DateTimeFormat("id-ID", {
          year: "numeric",
          timeZone: "UTC"
        }).format(date)
      : "";

    return `
      <article class="event-card">

        <h3 class="event-card__title">
          ${escapeHTML(event.title || "Acara")}
        </h3>

        <div class="event-card__date">
          <span class="event-card__day">${day}</span>

          <div class="event-card__month">
            <span>${weekday}</span>
            <span>${month}</span>
            <span>${year}</span>
          </div>
        </div>

        <div class="event-card__time">
          <span aria-hidden="true">◷</span>
          <span>${escapeHTML(event.time || "")}</span>
        </div>

        <div class="event-card__location">
          <h4>LOKASI ACARA</h4>
          <p>${escapeHTML(event.location || "")}</p>
        </div>

        ${
          event.mapsUrl
            ? `<a class="event-card__map"
                  href="${escapeHTML(event.mapsUrl)}"
                  target="_blank"
                  rel="noopener noreferrer">
                  ⌖ Google Maps
               </a>`
            : ""
        }

      </article>
    `;
  }).join("");
}



function renderEventMapsButton() {
  const button = $("#eventMapsButton");
  if (!button) return;

  const url = config.eventMapsUrl;

  if (url) {
    button.href = url;
    button.hidden = false;
  } else {
    button.hidden = true;
  }
}

  function renderStory() {
    const container = $("#storyTimeline");
    if (!container) return;
    const items = Array.isArray(config.story) ? config.story : [];
    container.innerHTML = items.map((item) => `
      <article class="story-item reveal">
        <span class="story-item__year">${escapeHTML(item.year || "")}</span>
        <h3>${escapeHTML(item.title || "")}</h3>
        <p>${escapeHTML(item.text || "").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>
      </article>`).join("");
  }

  function renderGallery() {
    const container = $("#galleryGrid");
    if (!container) return;
    const items = Array.isArray(config.gallery) ? config.gallery : [];
    container.innerHTML = items.map((item) => `
      <figure class="gallery-item reveal">
        <div class="gallery-item__placeholder" aria-hidden="true">✧</div>
        <img src="${escapeHTML(item.src || "")}" alt="${escapeHTML(item.alt || "Foto kenangan")}" loading="lazy">
        <figcaption class="gallery-item__caption">${escapeHTML(item.caption || "")}</figcaption>
      </figure>`).join("");
    container.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => img.classList.add("is-broken"));
      img.addEventListener("load", () => {
        const placeholder = img.parentElement.querySelector(".gallery-item__placeholder");
        if (placeholder) placeholder.hidden = true;
      });
    });
  }

  function initMotion() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = $$(".reveal");
    if ("IntersectionObserver" in window && !reducedMotion) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
        observer.observe(item);
      });
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
    const progress = $("#readingProgress");
    const updateProgress = () => {
      if (!progress) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  function initMusicControl() {
    const audio = $("#bgMusic");
    const button = $("#musicToggle");
    if (!audio || !button || !config.musicEnabled) return;
    button.hidden = false;
    const sync = () => {
      const playing = !audio.paused;
      button.classList.toggle("is-playing", playing);
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
      const label = button.querySelector(".music-toggle__label");
      if (label) label.textContent = playing ? "Musik aktif" : "Putar musik";
    };
    button.addEventListener("click", async () => {
      try {
        if (audio.paused) { await audio.play(); } else { audio.pause(); }
      } catch (error) {
        console.warn("Musik belum dapat diputar:", error);
      }
      sync();
    });
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    sync();
  }

  function renderGifts() {
    const grid = $("#giftGrid");
    const gifts = Array.isArray(config.gifts) ? config.gifts : [];
    grid.innerHTML = gifts.map((gift, index) => `
      <article class="gift-card">
        <span class="gift-card__bank">
  <img
    src="${gift.bank?.toUpperCase().includes('BCA') ? './assets/images/logo-bca.webp' : gift.bank?.toUpperCase().includes('BSI') ? './assets/images/logo-bsi.webp' : ''}"
    alt="${escapeHTML(gift.bank || 'Bank')}"
    loading="lazy"
  >
</span>
        <strong>${escapeHTML(gift.accountNumber || "Informasi rekening belum tersedia")}</strong>
        <p>a.n. ${escapeHTML(gift.accountName || "")}</p>
        ${gift.accountNumber ? `<button class="button button--outline button--small" type="button" data-copy="${escapeHTML(gift.accountNumber)}">Salin nomor</button>` : ""}
      </article>`).join("");
  }

function renderGiftAddress() {
  const container = document.getElementById("giftAddressContainer");
  const gift = config.giftAddress;

  if (!container || !gift) return;

  const title = document.createElement("h3");
  title.textContent = "Kirim Hadiah";

  const recipient = document.createElement("p");
  recipient.textContent = gift.recipient || "";

  const address = document.createElement("p");
  address.textContent = gift.address || "";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button--outline button--small";
  button.textContent = "Salin alamat";

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(gift.address);
      button.textContent = "Alamat tersalin ✓";

      setTimeout(() => {
        button.textContent = "Salin alamat";
      }, 2000);
    } catch {
      window.prompt("Salin alamat berikut:", gift.address);
    }
  });

  container.replaceChildren(title, recipient, address, button);
}

  
function makeCalendarLink() {
  const start = new Date(config.eventDateISO);

  if (Number.isNaN(start.getTime())) return;

  const end = new Date(
    start.getTime() +
    (Number(config.calendarDurationHours) || 5) * 3600000
  );

  const format = (date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${config.partnerOne || "Ragil"} & ${config.partnerTwo || "Dinar"}`,
    dates: `${format(start)}/${format(end)}`,
    details: config.calendarDetails || "Undangan pernikahan",
    location: config.calendarLocation || ""
  });

  $("#calendarLink").href =
    `https://calendar.google.com/calendar/render?${params.toString()}`;

  $("#calendarLink").removeAttribute("download");
  $("#calendarLink").target = "_blank";
  $("#calendarLink").rel = "noopener";
}
function animateCountdownValue(element, target, duration = 800) {
  const startTime = performance.now();

  function animate(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(target * eased);

    element.textContent = String(currentValue).padStart(2, "0");

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = String(target).padStart(2, "0");
    }
  }

  requestAnimationFrame(animate);
}
function updateCountdown(animate = false) {
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

    if (!element) return;

    if (animate) {
      animateCountdownValue(element, value, 800);
    } else {
      element.textContent = String(value).padStart(2, "0");
    }
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
    $("#wishList").innerHTML =
      '<p class="muted">Integrasi ucapan belum dikonfigurasi.</p>';
    $("#wishCount").textContent = "";
    return;
  }

  $("#wishList").innerHTML =
    '<p class="muted">Memuat ucapan…</p>';

  const callbackName = "receiveWeddingWishes";
  const script = document.createElement("script");
  const separator = config.appsScriptUrl.includes("?") ? "&" : "?";

  let finished = false;

  function cleanup() {
    if (finished) return;
    finished = true;

    delete window[callbackName];
    script.remove();
    clearTimeout(timeout);
  }

  window[callbackName] = function(data) {
    cleanup();

    if (!Array.isArray(data)) {
      $("#wishList").innerHTML =
        '<p class="muted">Format data ucapan tidak valid.</p>';
      return;
    }

    wishes = data.reverse();
    currentPage = 1;
    renderWishes();
  };

  script.onerror = function() {
    cleanup();
    $("#wishList").innerHTML =
      '<p class="muted">Ucapan belum dapat dimuat. Periksa URL Web App.</p>';
    console.error("Gagal memuat Google Apps Script.");
  };

  const timeout = setTimeout(() => {
    cleanup();
    $("#wishList").innerHTML =
      '<p class="muted">Waktu pemuatan ucapan habis. Periksa deployment Apps Script.</p>';
  }, 15000);

  script.src =
    config.appsScriptUrl +
    separator +
    "callback=" + callbackName +
    "&_=" + Date.now();

  document.body.appendChild(script);
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
    if (!data.name || !data.attendance) {
      showStatus("Lengkapi nama dan konfirmasi kehadiran.", true);
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
      showStatus("Terima kasih! Konfirmasi kehadiran dan ucapan Anda telah dikirim.");
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


  function initSectionNavigation() {
    const nav = $("#sectionNav");
    if (!nav) return;

    const links = $$(".section-nav__link");
    const sections = links
      .map((link) => document.getElementById(link.dataset.navTarget))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.dataset.navTarget === id;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.getElementById(link.dataset.navTarget);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
        setActive(link.dataset.navTarget);
      });
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      }, {
        root: null,
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      });

      sections.forEach((section) => observer.observe(section));
    }

    if (sections.length) setActive(sections[0].id);
  }

function openInvitation() {
  const cover = $("#cover");

  if (!cover || cover.classList.contains("is-opening")) return;

  // Aktifkan kembali scroll halaman
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");

  // Jalankan animasi uncover
  cover.classList.add("is-opening");

  // Sembunyikan cover setelah animasi selesai
  cover.addEventListener("animationend", () => {
    cover.classList.add("is-hidden");
    cover.classList.remove("is-opening");
  }, { once: true });

  // Tampilkan navigasi undangan
  const sectionNav = $("#sectionNav");
  if (sectionNav) sectionNav.hidden = false;

  // Jalankan musik
  const audio = $("#bgMusic");

  if (config.musicEnabled && audio) {
    audio.volume = 0.35;
    audio.play().catch(() => {});
  }

  const musicButton = $("#musicToggle");
  if (musicButton) musicButton.hidden = !config.musicEnabled;
}

  function init() {
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    setConfigText();
    getGuestName();
    renderEvents();
    renderEventMapsButton();
    renderStory();
    renderGallery();
    renderGifts();
    renderGiftAddress();
    makeCalendarLink();
    initMotion();
    initMusicControl();
    initSectionNavigation();
    updateCountdown(true);
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


/* ===== SCROLL REVEAL ===== */

document.documentElement.classList.add("js-enabled");

const animatedElements = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window) {
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });
} else {
  animatedElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}


const bankToggle = document.getElementById("toggleBankInfo");
const bankInfo = document.getElementById("bankInfo");

if (bankToggle && bankInfo) {
  bankToggle.addEventListener("click", () => {
    const isHidden = bankInfo.hidden;

    bankInfo.hidden = !isHidden;
    bankToggle.setAttribute("aria-expanded", String(isHidden));

    bankToggle.textContent = isHidden
      ? "Tutup Informasi"
      : "Lihat Informasi";
  });
}
