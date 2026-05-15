setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   PROFILE IMAGE (MOBILE FIX + B/W)
========================= */
async function applyProfileImage() {
  try {
    const img = document.getElementById("profileImage");
    if (!img) return;

    // CZARNO-BIAŁY FILTR
    img.style.filter = "grayscale(100%) contrast(1.05)";
    img.style.webkitFilter = "grayscale(100%) contrast(1.05)";

    img.removeAttribute("src");

    let loaded = false;

    // =========================
    // CACHE API
    // =========================
    try {
      const cache = await caches.open("profile-images-v1");
      const cached = await cache.match("profile-image");

      if (cached) {
        const blob = await cached.blob();

        // FIX MOBILE: FileReader zamiast ObjectURL
        const reader = new FileReader();
        reader.onloadend = function () {
          img.src = reader.result;
          img.style.opacity = "1";
        };
        reader.readAsDataURL(blob);

        loaded = true;
      }
    } catch (_) {}

    if (loaded) return;

    // =========================
    // LOCALSTORAGE FALLBACK
    // =========================
    let data = {};

    try {
      data = JSON.parse(localStorage.getItem("mobywatel_data")) || {};
    } catch (_) {}

    const stored =
      data.image ||
      localStorage.getItem("profileImage") ||
      localStorage.getItem("photo");

    if (stored) {
      img.src = stored;
      img.onload = () => {
        img.style.opacity = "1";
      };
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
      name: "Wyższa Szkoła Biznesu w Radomiu",
      address: "ul. Chrobrego 31, Radom",
      phone: "+48 48 362 11 22",
      director: "mgr Jan Kowalski",
    },
    {
      name: "Akademia Zawodowa w Płocku",
      address: "ul. Kościuszki 14, Płock",
      phone: "+48 24 366 88 99",
      director: "dr Anna Mazur",
    },
    {
      name: "Niepubliczna Szkoła Wyższa w Siedlcach",
      address: "ul. Sokołowska 45, Siedlce",
      phone: "+48 25 633 10 10",
      director: "mgr Piotr Nowicki",
    },
    {
      name: "Wyższa Szkoła Administracji w Łomży",
      address: "ul. Akademicka 7, Łomża",
      phone: "+48 86 215 44 33",
      director: "dr Ewa Wróbel",
    },
  ];

  return schools[Math.floor(Math.random() * schools.length)];
}

/* =========================
   OSTATNIA AKTUALIZACJA (FIX)
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
   INIT
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

  // uczelnia
  const school = generateSchoolData();
  setText("display-uczelnia", data.schoolName || school.name);

  // zdjęcie
  applyProfileImage();

  // toggle extra
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

  // zegar
  updateClock();
  setInterval(updateClock, 1000);

  // ostatnia aktualizacja
  loadUpdateDate();

  const btn = document.getElementById("aktualizuj");
  if (btn) {
    btn.addEventListener("click", updateToToday);
  }
});
