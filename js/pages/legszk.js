setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   🔥 SYNC DANYCH Z GENERATORA
   ========================= */
(function syncFromGenerator() {
  try {
    const raw =
      localStorage.getItem("mobywatel_data") ||
      localStorage.getItem("mobyvatel_data");

    if (!raw) return;

    const data = JSON.parse(raw);

    const set = (id, value, formatter) => {
      const el = document.getElementById(id);
      if (!el || value == null || value === "") return;

      el.textContent = formatter ? formatter(value) : value;
    };

    const up = (s) => (s ? String(s).toUpperCase() : s);

    const formatDate = (val) => {
      if (!val) return val;
      // YYYY-MM-DD → DD.MM.YYYY
      if (val.includes("-")) {
        const p = val.split("-");
        if (p.length === 3) return `${p[2]}.${p[1]}.${p[0]}`;
      }
      return val;
    };

    // MAIN FIELDS (HTML legszk)
    set("display-name", data.name, up);
    set("display-surname", data.surname, up);
    set("display-birthDate", data.birthday, formatDate);
    set("display-pesel", data.pesel, up);
    set("display-cardNumber", data.mdow_series, up);
    set("display-issueDate", data.issue_date);
    set("display-expiryDate", data.expiry_date);

    // EXTRA SCHOOL DATA
    set("display-schoolName_legszk", data.schoolName, up);
    set("display-schoolAddress_legszk", data.schoolAddress, up);
    set("display-schoolPhone_legszk", data.schoolPhone);
    set("display-schoolDirector_legszk", data.schoolDirector, up);

    // IMAGE
    const img = document.getElementById("profileImage");
    if (img && data.image) {
      img.src = data.image;
      img.style.opacity = "1";
    }
  } catch (e) {
    console.log("SYNC ERROR:", e);
  }
})();

/* =========================
   PRELOAD TŁA
   ========================= */
(async function preloadBackgroundImage() {
  try {
    const bgUrl = "/assets/dowod/mid_background_main.webp";
    const cache = await caches.open("mobywatel-v3");

    const cached = await cache.match(bgUrl);
    if (cached) return;

    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "high";

    img.onload = async function () {
      try {
        const response = await fetch(bgUrl);
        if (response.ok) await cache.put(bgUrl, response);
      } catch (_) {}
    };

    img.src = bgUrl;
  } catch (err) {
    console.log("Background preload skipped:", err);
  }
})();

/* =========================
   ZDJĘCIE PROFILOWE
   ========================= */
async function applyProfileImage() {
  try {
    const profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    const stored = localStorage.getItem("profileImage");

    if (stored) {
      profileImage.src = stored;
      profileImage.style.opacity = "1";
    }
  } catch (_) {}
}

/* =========================
   KAMERA
   ========================= */
let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  if (cameraVideoEl) {
    cameraVideoEl.srcObject = null;
  }
  if (cameraContainerEl) {
    cameraContainerEl.style.display = "none";
  }
}

async function openCamera() {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  if (!cameraContainerEl || !cameraVideoEl) {
    window.location.href = "qr.html?scan=1";
    return;
  }

  cameraContainerEl.style.display = "block";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    cameraStream = stream;
    cameraVideoEl.srcObject = stream;
    cameraVideoEl.play().catch(() => {});
  } catch (e) {
    alert("Brak dostępu do kamery");
    closeCamera();
  }
}

/* =========================
   INIT
   ========================= */
window.addEventListener("load", () => {
  applyProfileImage();
});

document.addEventListener("DOMContentLoaded", () => {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  window.openCamera = openCamera;
  window.closeCamera = closeCamera;

  /* ===== EXTRA TOGGLE ===== */
  const lo = document.getElementById("extra-toggle");
  const content = document.getElementById("extra-content");
  const arrow = document.getElementById("extra-arrow");

  let open = false;

  if (content) content.style.display = "none";

  if (lo) {
    lo.addEventListener("click", () => {
      open = !open;
      content.style.display = open ? "block" : "none";
      if (arrow) {
        arrow.src = open
          ? "assets/icons/ab007_chevron_up.svg"
          : "assets/icons/ab008_chevron_down.svg";
      }
    });
  }

  /* ===== CLOCK ===== */
  const czasEl = document.querySelector(".czas");

  function updateClock() {
    const now = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);
    if (czasEl) {
      czasEl.textContent = `Czas: ${pad(now.getHours())}:${pad(
        now.getMinutes()
      )}:${pad(now.getSeconds())}`;
    }
  }

  if (czasEl) {
    updateClock();
    setInterval(updateClock, 1000);
  }
});
