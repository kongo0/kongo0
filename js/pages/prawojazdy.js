// =====================
// PROFILE IMAGE
// =====================
async function applyProfileImage() {
  try {
    const profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    const userDataRaw = localStorage.getItem("userProfileData");

    // 1. generator (NAJWAŻNIEJSZE)
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        if (userData.photo) {
          profileImage.src = userData.photo;
          profileImage.style.opacity = "1";
          return;
        }
      } catch (_) {}
    }

    // 2. fallback
    const stored =
      localStorage.getItem("profileImage") || localStorage.getItem("photo");

    if (stored) {
      profileImage.src = stored;
      profileImage.style.opacity = "1";
    }
  } catch (_) {}
}

// =====================
// HELPERS
// =====================
const up = (s) => (s ? String(s).toUpperCase() : s);

function formatDateDots(val) {
  if (!val) return val;
  const s = String(val).trim();

  let m = s.match(/^(\d{4})[-./](\d{2})[-./](\d{2})$/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;

  m = s.match(/^(\d{2})[-./](\d{2})[-./](\d{4})$/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;

  return s.replace(/-/g, ".");
}

function setText(id, value, formatter) {
  const el = document.getElementById(id);
  if (!el || value == null || value === "") return;

  const text = formatter ? formatter(value) : value;
  if (!text) return;

  el.textContent = text;
}

// =====================
// MAIN DATA LOADING (FIX)
// =====================
function loadDriverData() {
  let userData = null;

  try {
    userData = JSON.parse(localStorage.getItem("userProfileData") || "{}");
  } catch (_) {}

  // jeśli generator istnieje → PRIORYTET
  if (userData && Object.keys(userData).length > 0) {
    setText("display-name", userData.name, up);
    setText("display-surname", userData.surname, up);
    setText("display-pesel", userData.pesel, up);
    setText("display-birthDate", userData.birthDate, formatDateDots);
    setText("display-birthPlace", userData.placeOfBirth, up);
    setText("display-nationality", userData.nationality, up);

    // dodatkowe (jeśli są)
    setText("display-category", userData.category || "B", up);
    setText("display-documentNumber", userData.documentNumber, up);
    setText("display-issuingAuthority", userData.issuingAuthority, up);

    // WAŻNE: nie pokazuj "Brak danych"
    return;
  }

  // fallback (jeśli brak generatora)
  const map = [
    ["display-name", "display-name_prawojazdy", up],
    ["display-surname", "display-surname_prawojazdy", up],
    ["display-pesel", "display-pesel_prawojazdy", up],
    ["display-birthDate", "display-birthDate_prawojazdy", formatDateDots],
    ["display-birthPlace", "display-birthPlace_prawojazdy", up],
    ["display-category", "display-category_prawojazdy", up],
    ["display-documentNumber", "display-documentNumber_prawojazdy", up],
    ["display-issuingAuthority", "display-issuingAuthority_prawojazdy", up],
  ];

  map.forEach(([id, key, fmt]) => {
    setText(id, localStorage.getItem(key), fmt);
  });
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", async () => {
  await applyProfileImage();
  loadDriverData();

  // clock (jeśli masz)
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
