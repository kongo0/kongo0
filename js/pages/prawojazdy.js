/* =========================
   HELPERY / GENERATOR
   ========================= */

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDocumentNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let l = "";
  for (let i = 0; i < 3; i++) l += letters[Math.floor(Math.random() * letters.length)];

  let n = "";
  for (let i = 0; i < 7; i++) n += Math.floor(Math.random() * 10);

  return l + n;
}

function generateBlanketNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let l = "";
  for (let i = 0; i < 2; i++) l += letters[Math.floor(Math.random() * letters.length)];

  let n = "";
  for (let i = 0; i < 8; i++) n += Math.floor(Math.random() * 10);

  return l + n;
}

function generateIssuingAuthority() {
  const list = [
    "Prezydent m.st. Warszawy",
    "Starosta Krakowski",
    "Prezydent Wrocławia",
    "Starosta Poznański",
    "Prezydent Gdańska",
    "Starosta Katowicki",
    "Prezydent Łodzi",
    "Starosta Szczeciński"
  ];
  return randomFrom(list);
}

function generateIssueDateFromBirth(birthStr) {
  if (!birthStr) return null;

  const b = new Date(birthStr);
  if (isNaN(b.getTime())) return null;

  const d = new Date(b);
  d.setFullYear(d.getFullYear() + 18);
  d.setDate(d.getDate() + 7);

  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/* =========================
   TWÓJ ORYGINALNY KOD (NIE ZMIENIAMY LOGIKI)
   ========================= */

setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   APPLY PROFILE IMAGE
   ========================= */

async function applyProfileImage() {
  try {
    var profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    var stored =
      localStorage.getItem("profileImage") ||
      localStorage.getItem("photo");

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
   INIT
   ========================= */

window.addEventListener("load", function () {
  applyProfileImage();
});

document.addEventListener("DOMContentLoaded", function () {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  /* =========================
     GENERATOR DANYCH PRAWOJAZDY
     ========================= */

  try {
    const birth = localStorage.getItem("display-birthDate_prawojazdy");

    const issueDate = generateIssueDateFromBirth(birth);
    const docNumber = generateDocumentNumber();
    const blankNumber = generateBlanketNumber();
    const authority = generateIssuingAuthority();

    if (issueDate) {
      localStorage.setItem("display-issueDate_prawojazdy", issueDate);
    }

    localStorage.setItem("display-documentNumber_prawojazdy", docNumber);
    localStorage.setItem("display-blanketNumber_prawojazdy", blankNumber);
    localStorage.setItem("display-issuingAuthority_prawojazdy", authority);
  } catch (e) {}

  /* =========================
     RENDER DO HTML (setText działa z Twojego kodu)
     ========================= */

  function set(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  }

  set("display-issueDate", localStorage.getItem("display-issueDate_prawojazdy"));
  set("display-documentNumber", localStorage.getItem("display-documentNumber_prawojazdy"));
  set("display-blanketNumber", localStorage.getItem("display-blanketNumber_prawojazdy"));
  set("display-issuingAuthority", localStorage.getItem("display-issuingAuthority_prawojazdy"));

  /* =========================
     AKTUALIZUJ DATĘ
     ========================= */

  const btn = document.getElementById("aktualizuj");
  const el = document.getElementById("sukadziwkakurwa");

  if (btn && el) {
    btn.addEventListener("click", () => {
      const d = new Date();
      const now = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
      el.textContent = now;
      localStorage.setItem("lastUpdateDate", now);
    });
  }
});
