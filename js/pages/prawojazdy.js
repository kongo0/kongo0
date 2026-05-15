/* =========================
   GENERATOR DANYCH PRAWOJAZDY (FAKE / SZKOLNY)
   ========================= */

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --- NUMERY --- */

function generateDocumentNumber() {
  // styl: ABC1234567
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let l = "";
  for (let i = 0; i < 3; i++) l += letters[Math.floor(Math.random() * letters.length)];
  let n = "";
  for (let i = 0; i < 7; i++) n += Math.floor(Math.random() * 10);
  return `${l}${n}`;
}

function generateBlanketNumber() {
  // styl blankietu: 2 litery + 8 cyfr
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let l = "";
  for (let i = 0; i < 2; i++) l += letters[Math.floor(Math.random() * letters.length)];
  let n = "";
  for (let i = 0; i < 8; i++) n += Math.floor(Math.random() * 10);
  return `${l}${n}`;
}

function generateIssuingAuthority() {
  const offices = [
    "Prezydent m.st. Warszawy",
    "Starosta Krakowski",
    "Prezydent Wrocławia",
    "Starosta Poznański",
    "Prezydent Gdańska",
    "Starosta Łódzki Wschodni",
    "Prezydent Szczecina",
    "Starosta Katowicki"
  ];
  return randomFrom(offices);
}

/* --- DATA WYDANIA: 18 LAT + 7 DNI --- */

function generateIssueDate(birthDateStr) {
  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;

  const issue = new Date(birth);
  issue.setFullYear(issue.getFullYear() + 18);
  issue.setDate(issue.getDate() + 7);

  return `${pad(issue.getDate())}.${pad(issue.getMonth() + 1)}.${issue.getFullYear()}`;
}

/* =========================
   RESZTA ORYGINALNEGO KODU
   ========================= */

setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   PROFILE IMAGE
   ========================= */

async function applyProfileImage() {
  try {
    var profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    var stored =
      localStorage.getItem("profileImage") || localStorage.getItem("photo");

    if (stored) {
      profileImage.src = stored;
      profileImage.style.opacity = "1";
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
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
}

async function openCamera() {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  if (!cameraContainerEl || !cameraVideoEl) {
    window.location.href = "qr.html?scan=1";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    cameraVideoEl.srcObject = stream;
    cameraStream = stream;
    cameraVideoEl.play().catch(() => {});
  } catch (e) {
    alert("Brak dostępu do kamery");
    closeCamera();
  }
}

/* =========================
   MAIN LOGIKA WSTRZYKIWANIA DANYCH
   ========================= */

window.addEventListener("load", function () {
  applyProfileImage();
});

/* =========================
   DOM READY
   ========================= */

document.addEventListener("DOMContentLoaded", function () {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  /* ====== DOM FILL ====== */

  const birthDateRaw = localStorage.getItem("display-birthDate_prawojazdy");

  const issueDate = generateIssueDate(birthDateRaw);
  const documentNumber = generateDocumentNumber();
  const blanketNumber = generateBlanketNumber();
  const issuingAuthority = generateIssuingAuthority();

  /* Data wydania */
  if (issueDate) {
    localStorage.setItem("display-issueDate_prawojazdy", issueDate);
  }

  /* Numer dokumentu */
  localStorage.setItem("display-documentNumber_prawojazdy", documentNumber);

  /* Blankiet */
  localStorage.setItem("display-blanketNumber_prawojazdy", blanketNumber);

  /* Organ */
  localStorage.setItem("display-issuingAuthority_prawojazdy", issuingAuthority);

  /* ====== render do HTML ====== */

  function set(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  }

  set("display-issueDate", issueDate);
  set("display-documentNumber", documentNumber);
  set("display-blanketNumber", blanketNumber);
  set("display-issuingAuthority", issuingAuthority);

  /* ====== kopiowanie (z twojego systemu) ====== */

  const btn = document.getElementById("aktualizuj");
  if (btn) {
    btn.addEventListener("click", () => {
      const d = new Date();
      const now = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
      const el = document.getElementById("sukadziwkakurwa");

      if (el) el.textContent = now;
      localStorage.setItem("lastUpdateDate", now);
    });
  }
});
