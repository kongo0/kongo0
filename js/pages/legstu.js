setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   PROFILE IMAGE (FIX)
========================= */
async function applyProfileImage() {
  try {
    const img = document.getElementById("profileImage");
    if (!img) return;

    // Cache API
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

    // localStorage fallback
    const stored =
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
   GENERATORS (FIX)
========================= */
function generateSchoolId() {
  const year = new Date().getFullYear();
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(10000 + Math.random() * 90000);
  return year + "/" + a + "/" + b;
}

function generateSchoolData() {
  const schools = [
    {
      name: "Uniwersytet Warszawski",
      address: "ul. Krakowskie Przedmieście 26/28, Warszawa",
      phone: "+48 22 55 20 000",
      director: "prof. dr hab. Anna Nowak",
    },
    {
      name: "Politechnika Warszawska",
      address: "pl. Politechniki 1, Warszawa",
      phone: "+48 22 234 50 00",
      director: "prof. dr hab. inż. Marek Kowalski",
    },
    {
      name: "SGGW w Warszawie",
      address: "ul. Nowoursynowska 166, Warszawa",
      phone: "+48 22 59 310 00",
      director: "prof. dr hab. Ewa Wiśniewska",
    },
  ];

  return schools[Math.floor(Math.random() * schools.length)];
}

/* =========================
   MAIN LOAD
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

  // =========================
  // PODSTAWOWE DANE
  // =========================
  setText("display-name", data.name);
  setText("display-surname", data.surname);
  setText("display-birthDate", data.birthday);
  setText("display-pesel", data.pesel);
  setText("display-dataWydania", data.issue_date);

  // =========================
  // NUMER LEGITYMACJI
  // =========================
  const cardNumber = data.schoolId || generateSchoolId();
  setText("display-albumNumber", cardNumber);

  // =========================
  // UCZELNIA (FIX)
  // =========================
  const school = generateSchoolData();
  setText("display-uczelnia", data.schoolName || school.name);

  // =========================
  // ZDJĘCIE (FIX)
  // =========================
  applyProfileImage();

  // =========================
  // EXTRA TOGGLE (bez zmian UX)
  // =========================
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

  // =========================
  // START CLOCK
  // =========================
  updateClock();
  setInterval(updateClock, 1000);
});
