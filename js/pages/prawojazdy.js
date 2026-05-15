/* =========================
   PRAWOJAZDY - GENERATOR (FIXED / DZIAŁA Z TWOIM SYSTEMEM)
   ========================= */

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDocumentNumber() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 3; i++) s += L[Math.floor(Math.random() * L.length)];
  for (let i = 0; i < 7; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function generateBlanketNumber() {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 2; i++) s += L[Math.floor(Math.random() * L.length)];
  for (let i = 0; i < 8; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function generateAuthority() {
  const list = [
    "Prezydent m.st. Warszawy",
    "Starosta Krakowski",
    "Prezydent Wrocławia",
    "Starosta Poznański",
    "Prezydent Gdańska",
    "Starosta Katowicki",
    "Prezydent Łodzi"
  ];
  return rand(list);
}

function issueDateFromBirth(birth) {
  if (!birth) return null;

  const d = new Date(birth);
  if (isNaN(d.getTime())) return null;

  d.setFullYear(d.getFullYear() + 18);
  d.setDate(d.getDate() + 7);

  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/* =========================
   START
   ========================= */

setTimeout(() => {
  try {
    window.scrollTo(0, 1);
  } catch (_) {}
}, 0);

/* =========================
   PROFILE IMAGE
   ========================= */

function applyProfileImage() {
  const img = document.getElementById("profileImage");
  if (!img) return;

  const stored =
    localStorage.getItem("profileImage") ||
    localStorage.getItem("photo");

  if (stored) {
    img.src = stored;
    img.style.opacity = "1";
  }
}

/* =========================
   CAMERA (zostawione jak było)
   ========================= */

let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

function closeCamera() {
  document.body.classList.remove("camera-open");

  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
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

window.addEventListener("load", applyProfileImage);

document.addEventListener("DOMContentLoaded", function () {

  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  /* =========================
     🔥 GENERATOR DANYCH
     ========================= */

  try {
    const birth = localStorage.getItem("display-birthDate_prawojazdy");

    const issueDate = issueDateFromBirth(birth);
    const docNumber = generateDocumentNumber();
    const blankNumber = generateBlanketNumber();
    const authority = generateAuthority();

    // WAŻNE: KLUCZE MUSZĄ PASOWAĆ DO TWOJEGO setText()
    localStorage.setItem(
      "display-issueDate_prawojazdy",
      issueDate || "BEZTERMINOWO"
    );

    localStorage.setItem(
      "display-documentNumber_prawojazdy",
      docNumber
    );

    localStorage.setItem(
      "display-blanketNumber_prawojazdy",
      blankNumber
    );

    localStorage.setItem(
      "display-issuingAuthority_prawojazdy",
      authority
    );

  } catch (e) {
    console.log("generator error", e);
  }

  /* =========================
     🔥 WYMUSZENIE RENDERU (KLUCZ)
     ========================= */

  try {
    function set(id, val) {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    }

    set("display-issueDate", localStorage.getItem("display-issueDate_prawojazdy"));
    set("display-documentNumber", localStorage.getItem("display-documentNumber_prawojazdy"));
    set("display-blanketNumber", localStorage.getItem("display-blanketNumber_prawojazdy"));
    set("display-issuingAuthority", localStorage.getItem("display-issuingAuthority_prawojazdy"));

  } catch (e) {}

  /* =========================
     AKTUALIZACJA DATY
     ========================= */

  const btn = document.getElementById("aktualizuj");
  const el = document.getElementById("sukadziwkakurwa");

  if (btn && el) {
    btn.addEventListener("click", () => {
      const d = new Date();
      const now =
        pad(d.getDate()) +
        "." +
        pad(d.getMonth() + 1) +
        "." +
        d.getFullYear();

      el.textContent = now;
      localStorage.setItem("lastUpdateDate", now);
    });
  }
});
