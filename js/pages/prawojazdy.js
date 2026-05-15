// =====================
// SAFE JSON
// =====================
function safeJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (_) {
    return null;
  }
}

// =====================
// FORMATTER
// =====================
const up = (v) => (v ? String(v).toUpperCase() : v);

function formatDate(v) {
  if (!v) return v;
  const s = String(v);

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;

  m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;

  return s;
}

// =====================
// SET TEXT SAFE
// =====================
function set(id, value, formatter) {
  const el = document.getElementById(id);
  if (!el || value == null || value === "") return;

  const text = formatter ? formatter(value) : value;
  if (!text) return;

  el.textContent = text;
}

// =====================
// PROFILE IMAGE
// =====================
function setProfileImage(data) {
  const img = document.getElementById("profileImage");
  if (!img) return;

  const photo =
    (data && data.photo) ||
    localStorage.getItem("profileImage") ||
    localStorage.getItem("photo");

  if (photo) {
    img.src = photo;
    img.style.opacity = "1";
  }
}

// =====================
// MAIN LOAD
// =====================
function loadDriverData() {
  const data = safeJSON("userProfileData") || {};

  console.log("[Prawojazdy] userProfileData:", data);

  // =====================
  // IMIĘ
  // =====================
  set("display-name", data.name, up);

  // =====================
  // NAZWISKO
  // =====================
  set("display-surname", data.surname, up);

  // =====================
  // PESEL
  // =====================
  set("display-pesel", data.pesel, up);

  // =====================
  // DATA URODZENIA
  // =====================
  set("display-birthDate", data.birthDate, formatDate);

  // =====================
  // MIEJSCE URODZENIA
  // =====================
  set("display-birthPlace", data.placeOfBirth, up);

  // =====================
  // KATEGORIA (fallback B)
  // =====================
  set("category", data.category || "B", up);

  // =====================
  // ZDJĘCIE
  // =====================
  setProfileImage(data);
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", () => {
  loadDriverData();

  // zegar (opcjonalnie)
  const czasEl = document.querySelector(".czas");
  if (czasEl) {
    setInterval(() => {
      const d = new Date();
      czasEl.textContent =
        `Czas: ${String(d.getHours()).padStart(2, "0")}:` +
        `${String(d.getMinutes()).padStart(2, "0")}:` +
        `${String(d.getSeconds()).padStart(2, "0")} ` +
        `${String(d.getDate()).padStart(2, "0")}.${String(
          d.getMonth() + 1
        ).padStart(2, "0")}.${d.getFullYear()}`;
    }, 1000);
  }
});
