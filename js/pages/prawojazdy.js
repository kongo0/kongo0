// =====================
// FORMAT DATY
// =====================
function formatDateDots(val) {
  if (!val) return val;
  const s = String(val).trim();

  let m = s.match(/^(\d{4})[-./](\d{2})[-./](\d{2})$/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;

  m = s.match(/^(\d{2})[-./](\d{2})[-./](\d{4})$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;

  return s;
}

// =====================
// UPPERCASE
// =====================
function up(v) {
  return v ? String(v).toUpperCase() : v;
}

// =====================
// SET TEXT SAFE
// =====================
function setText(id, value, formatter) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value == null || value === "") return;

  el.textContent = formatter ? formatter(value) : value;
}

// =====================
// LOAD DATA (JAK W INNYCH DOKUMENTACH)
// =====================
function loadData() {
  let data = {};

  try {
    data = JSON.parse(localStorage.getItem("userProfileData")) || {};
  } catch (_) {}

  console.log("[PrawoJazdy] data:", data);

  // =====================
  // IMIĘ
  // =====================
  setText("display-name", data.name, up);

  // =====================
  // NAZWISKO
  // =====================
  setText("display-surname", data.surname, up);

  // =====================
  // PESEL
  // =====================
  setText("display-pesel", data.pesel, up);

  // =====================
  // DATA URODZENIA
  // =====================
  setText("display-birthDate", data.birthDate, formatDateDots);

  // =====================
  // MIEJSCE URODZENIA
  // =====================
  setText("display-birthPlace", data.placeOfBirth, up);

  // =====================
  // 🔥 KATEGORIA ZAWSZE B
  // =====================
  const categoryEl = document.getElementById("category");
  if (categoryEl) categoryEl.textContent = "B";

  // =====================
  // ZDJĘCIE
  // =====================
  const img = document.getElementById("profileImage");
  if (img && data.photo) {
    img.src = data.photo;
    img.style.opacity = "1";
  }
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", loadData);
