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
    const img = document.getElementById("profileImage");
    if (!img) return;

    try {
      const cache = await caches.open("profile-images-v1");
      const cached = await cache.match("profile-image");

      if (cached) {
        const blob = await cached.blob();
        img.src = URL.createObjectURL(blob);
        img.style.opacity = "1";
        return;
      }
    } catch (_) {}

    const stored =
      localStorage.getItem("profileImage") ||
      localStorage.getItem("photo");

    if (stored) {
      img.src = stored;
      img.onload = () => (img.style.opacity = "1");
    } else {
      img.style.opacity = "0.3";
    }
  } catch (_) {}
}

/* =========================
   CLOCK
========================= */
function updateClock() {
  const el = document.querySelector(".czas");
  if (!el) return;

  const now = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);

  el.textContent =
    "Czas: " +
    pad(now.getHours()) +
    ":" +
    pad(now.getMinutes()) +
    ":" +
    pad(now.getSeconds()) +
    " " +
    pad(now.getDate()) +
    "." +
    pad(now.getMonth() + 1) +
    "." +
    now.getFullYear();
}

/* =========================
   GENERATORS (SŁABSZE UCZELNIE)
========================= */
function generateSchoolId() {
  const year = new Date().getFullYear();
  return `${year}/${Math.floor(1000 + Math.random() * 9000)}/${Math.floor(
    10000 + Math.random() * 90000
  )}`;
}

function generateSchoolData() {
  const schools = [
    {
      name: "Wyższa Szkoła Zarządzania w Radomiu",
      address: "ul. 25 Czerwca 39, Radom",
      phone: "+48 48 362 34 55",
      director: "mgr Jan Malinowski",
    },
    {
      name: "Akademia Nauk Stosowanych w Łomży",
      address: "ul. Akademicka 14, Łomża",
      phone: "+48 86 215 59 50",
      director: "dr Anna Zielińska",
    },
    {
      name: "Prywatna Szkoła Biznesu w Płocku",
      address: "ul. Tumskiego 8, Płock",
      phone: "+48 24 366 77 11",
      director: "mgr Piotr Kaczmarek",
    },
    {
      name: "Wyższa Szkoła Techniczno-Humanistyczna w Siedlcach",
      address: "ul. Sokołowska 161, Siedlce",
      phone: "+48 25 633 22 11",
      director: "dr Marek Dąbrowski",
    },
  ];

  return schools[Math.floor(Math.random() * schools.length)];
}

/* =========================
   OSTATNIA AKTUALIZACJA (FIX jak w dowodzie)
========================= */
const UPDATE_KEY = "last_update_date_legstu";

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function formatDate(d) {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function loadUpdateDate() {
  const el = document.getElementById("sukadziwkakurwa");
  const saved = localStorage.getItem(UPDATE_KEY);

  if (saved && el) {
    el.textContent = saved;
  }
}

function updateToToday() {
  const el = document.getElementById("sukadziwkakurwa");
  if (!el) return;

  const today = new Date();
  const formatted = formatDate(today);

  el.textContent = formatted;
  localStorage.setItem(UPDATE_KEY, formatted);
}

/* =========================
   MAIN
========================= */
document.addEventListener("DOMContentLoaded", () => {
  let data = {};

  try {
    data = JSON.parse(localStorage.getItem("mobywatel_data")) || {};
  } catch (e) {}

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value && value !== "" ? value : "Brak danych";
  };

  // dane
  setText("display-name", data.name);
  setText("display-surname", data.surname);
  setText("display-birthDate", data.birthday);
  setText("display-pesel", data.pesel);
  setText("display-dataWydania", data.issue_date);

  // numer
  const cardNumber = data.schoolId || generateSchoolId();
  setText("display-albumNumber", cardNumber);

  // uczelnia (słabsze szkoły)
  const school = generateSchoolData();
  setText("display-uczelnia", data.schoolName || school.name);

  // zdjęcie
  applyProfileImage();

  // toggle extra (bez zmian)
  const lo = document.querySelector("#extra-toggle");
  const content = document.querySelector("#extra-content");
  const arrow = document.querySelector("#extra-arrow");

  let isOpen = false;
  let contentinner = content ? content.innerHTML : "";

  if (content) content.innerHTML = "";
  if (arrow) arrow.src = "assets/icons/ab008_chevron_down.svg";
  if (lo) lo.style.borderRadius = "12px";

  if (lo) {
    lo.addEventListener("click", function () {
      isOpen = !isOpen;

      if (isOpen) {
        lo.style.borderRadius = "12px 12px 0px 0px";
        if (content) content.innerHTML = contentinner;
        if (arrow) arrow.src = "assets/icons/ab007_chevron_up.svg";
      } else {
        lo.style.borderRadius = "12px";
        if (content) content.innerHTML = "";
        if (arrow) arrow.src = "assets/icons/ab008_chevron_down.svg";
      }
    });
  }

  // CLOCK
  updateClock();
  setInterval(updateClock, 1000);

  // OSTATNIA AKTUALIZACJA
  loadUpdateDate();

  const btn = document.getElementById("aktualizuj");
  if (btn) {
    btn.addEventListener("click", updateToToday);
  }
});
