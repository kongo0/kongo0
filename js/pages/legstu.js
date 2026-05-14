setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
});

/* =========================
   BACKGROUND PRELOAD
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
        if (response.ok) {
          await cache.put(bgUrl, response);
        }
      } catch (_) {}
    };

    img.src = bgUrl;
  } catch (_) {}
})();

/* =========================
   PROFILE IMAGE (BEZ ZMIAN UI)
========================= */

async function applyProfileImage() {
  try {
    const img = document.getElementById("profileImage");
    if (!img) return;

    const stored =
      localStorage.getItem("profileImage") ||
      localStorage.getItem("photo");

    if (stored) {
      img.src = stored;
      img.style.opacity = "1";
    }
  } catch (_) {}
}

/* =========================
   CAMERA (bez zmian)
========================= */

let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

function closeCamera() {
  try {
    document.body.classList.remove("camera-open");
  } catch (_) {}

  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach(t => t.stop());
    } catch (_) {}
    cameraStream = null;
  }

  if (cameraVideoEl) cameraVideoEl.srcObject = null;

  if (cameraContainerEl) cameraContainerEl.style.display = "none";
}

async function openCamera() {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  if (!cameraContainerEl || !cameraVideoEl) {
    window.location.href = "qr.html?scan=1";
    return;
  }

  try {
    cameraContainerEl.style.display = "block";
    document.body.classList.add("camera-open");

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    cameraVideoEl.srcObject = cameraStream;
    await cameraVideoEl.play();
  } catch (e) {
    alert("Brak dostępu do kamery");
    closeCamera();
  }
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  let data = {};

  try {
    data = JSON.parse(localStorage.getItem("mobywatel_data")) || {};
  } catch (_) {}

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value && value !== "" ? value : "Brak danych";
  };

  /* =========================
     DANE STUDENCKIE (UI BEZ ZMIAN)
  ========================= */

  setText("display-name", data.name);
  setText("display-surname", data.surname);
  setText("display-birthDate", data.birthday);
  setText("display-pesel", data.pesel);
  setText("display-dataWydania", data.issue_date);

  /* uczelnia */
  setText("display-uczelnia", data.schoolName);

  /* album / index */
  setText("display-albumNumber", generateStudentId(data.studentId));

  function generateStudentId(existing) {
    if (existing) return existing;

    const year = new Date().getFullYear();
    const a = Math.floor(1000 + Math.random() * 9000);
    const b = Math.floor(10000 + Math.random() * 90000);

    return `STU/${year}/${a}/${b}`;
  }

  /* =========================
     CLOCK
  ========================= */

  function updateClock() {
    const el = document.querySelector(".czas");
    if (!el) return;

    const now = new Date();
    const pad = n => (n < 10 ? "0" + n : n);

    el.textContent =
      `Czas: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ` +
      `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* =========================
     OSTATNIA AKTUALIZACJA (IDENTYCZNIE JAK W DOWODZIE)
  ========================= */

  const UPDATE_KEY = "legstu_last_update_date";
  const GENERATED_KEY = "legstu_generated_date";

  const pad = n => (n < 10 ? "0" + n : n);

  const formatDate = d =>
    `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

  function getGeneratedDate() {
    let stored = localStorage.getItem(GENERATED_KEY);

    if (!stored) {
      const now = new Date();
      localStorage.setItem(GENERATED_KEY, now.toISOString());
      return now;
    }

    return new Date(stored);
  }

  function getInitialUpdateDate() {
    const stored = localStorage.getItem(UPDATE_KEY);
    return stored ? new Date(stored) : getGeneratedDate();
  }

  function setUpdateDate(date) {
    localStorage.setItem(UPDATE_KEY, date.toISOString());

    const formatted = formatDate(date);

    const main = document.getElementById("sukadziwkakurwa");
    if (main) main.textContent = formatted;
  }

  function loadUpdateDate() {
    setUpdateDate(getInitialUpdateDate());
  }

  function updateToToday() {
    const today = new Date();
    setUpdateDate(today);

    const n = document.getElementById("notification");
    if (n) {
      n.style.display = "block";
      n.classList.add("show");

      setTimeout(() => {
        n.classList.remove("show");
        n.style.display = "none";
      }, 3000);
    }
  }

  loadUpdateDate();

  document
    .getElementById("aktualizuj")
    ?.addEventListener("click", updateToToday);

  /* expose camera */
  window.openCamera = openCamera;
  window.closeCamera = closeCamera;
});
