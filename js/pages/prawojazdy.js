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
// SAFE SET (NIE NADPISUJE “Brak danych”)
// =====================
function setText(id, value, formatter, onlyIfEmpty = true) {
  const el = document.getElementById(id);
  if (!el) return;

  if (value == null || value === "") return;

  if (onlyIfEmpty && el.textContent && el.textContent !== "Brak danych") return;

  el.textContent = formatter ? formatter(value) : value;
}

// =====================
// MAIN LOAD (NAPRAWIONE)
// =====================
function loadDriverData() {
  const data = safeJSON("userProfileData") || {};

  console.log("[PJ] userProfileData:", data);

  // ====== DANE Z GENERATORA (PRIORYTET) ======
  setText("display-name", data.name, up);
  setText("display-surname", data.surname, up);
  setText("display-pesel", data.pesel, up);
  setText("display-birthDate", data.birthDate, formatDateDots);
  setText("display-birthPlace", data.placeOfBirth, up);

  // ====== KATEGORIA ZAWSZE B ======
  const cat = document.getElementById("category");
  if (cat) cat.textContent = "B";

  // ====== ZDJĘCIE ======
  const img = document.getElementById("profileImage");
  if (img && data.photo) {
    img.src = data.photo;
    img.style.opacity = "1";
  }

  // =====================
  // RESZTA TWOJEGO SYSTEMU (BLANKIET ITD)
  // NIE DOTYKAMY — ALE DOŁADOWUJEMY TYLKO JEŚLI BRAK
  // =====================

  const extraMap = [
    ["display-documentNumber", "display-documentNumber_prawojazdy", up],
    ["display-blanketNumber", "display-blanketNumber_prawojazdy", up],
    ["display-issuingAuthority", "display-issuingAuthority_prawojazdy", up],
    ["display-issueDate", "display-issueDate_prawojazdy", formatDateDots],
    ["display-expiryDate", "display-expiryDate_prawojazdy", formatDateDots],
  ];

  extraMap.forEach(([id, key, fmt]) => {
    setText(id, localStorage.getItem(key), fmt, true);
  });

  // status blankietu fallback
  const status = document.getElementById("display-blanketStatus");
  if (status && status.textContent.trim() === "Brak danych") {
    status.textContent = "WYDANY";
  }
}

window.addEventListener("DOMContentLoaded", loadDriverData);
