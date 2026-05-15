function safeJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (_) {
    return null;
  }
}

function up(v) {
  return v ? String(v).toUpperCase() : v;
}

function formatDateDots(v) {
  if (!v) return v;

  const s = String(v).trim();

  let m = s.match(/^(\d{4})[-./](\d{2})[-./](\d{2})$/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;

  m = s.match(/^(\d{2})[-./](\d{2})[-./](\d{4})$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;

  return s;
}

function setText(id, value, formatter) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value == null || value === "") return;

  el.textContent = formatter ? formatter(value) : value;
}

// ============================
// DATA WYDANIA (+18 + 7 dni)
// ============================
function calculateIssueDate(birthDate) {
  if (!birthDate) return null;

  const d = new Date(birthDate);
  if (isNaN(d)) return null;

  d.setFullYear(d.getFullYear() + 18);
  d.setDate(d.getDate() + 7);

  const pad = (n) => (n < 10 ? "0" + n : n);

  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

// ============================
// LOAD DATA (GENERATOR FIX)
// ============================
function loadDriverData() {
  const data = safeJSON("userProfileData") || {};

  console.log("[PrawoJazdy] data:", data);

  // =========================
  // MAPOWANIE GENERATORA
  // =========================
  const name = data.name || data.firstName || "";
  const surname = data.surname || data.lastName || "";
  const pesel = data.pesel || "";
  const birthDate = data.birthDate || data.dateOfBirth || "";
  const place = data.placeOfBirth || data.birthPlace || "";
  const photo = data.photo || data.image || "";

  // =========================
  // DANE OSOBOWE
  // =========================
  setText("display-name", name, up);
  setText("display-surname", surname, up);
  setText("display-pesel", pesel, up);
  setText("display-birthDate", birthDate, formatDateDots);
  setText("display-birthPlace", place, up);

  // =========================
  // ZDJĘCIE
  // =========================
  const img = document.getElementById("profileImage");
  if (img && photo) {
    img.src = photo;
    img.style.opacity = "1";
  }

  // =========================
  // KATEGORIA (ZAWSZE B)
  // =========================
  const cat = document.getElementById("category");
  if (cat) cat.textContent = "B";

  // =========================
  // DATA WYDANIA (NAPRAWIONE)
  // =========================
  const issueDate = calculateIssueDate(birthDate);
  if (issueDate) {
    setText("display-issueDate", issueDate, formatDateDots);
  }

  // =========================
  // DEBUG
  // =========================
  console.log("[PrawoJazdy] parsed:", {
    name,
    surname,
    pesel,
    birthDate,
    place,
    photo: !!photo,
    issueDate,
  });
}

// ============================
// INIT
// =========================
window.addEventListener("DOMContentLoaded", loadDriverData);
