setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

/* =========================
   🔥 SYNC Z GENERATORA (NOWE)
   ========================= */
(function syncFromGenerator() {
  try {
    const raw = localStorage.getItem("mobywatel_data");
    if (!raw) return;

    const data = JSON.parse(raw);

    const map = {
      "display-name_legszk": data.name,
      "display-surname_legszk": data.surname,
      "display-birthDate_legszk": data.birthday,
      "display-pesel_legszk": data.pesel,
      "display-cardNumber_legszk": data.mdow_series,
      "display-issueDate_legszk": data.issue_date,
      "display-expiryDate_legszk": data.expiry_date,
      "display-schoolName_legszk": data.schoolName,
      "display-schoolAddress_legszk": data.schoolAddress,
      "display-schoolPhone_legszk": data.schoolPhone,
      "display-schoolDirector_legszk": data.schoolDirector,
      "display-nationality_legszk": data.nationality,
      "display-city_legszk": data.city,
      "display-birthPlace_legszk": data.birthPlace,
      "display-birth_country_legszk": data.birth_country,
      "display-address_legszk": data.adress1,
      "display-postal_code_legszk": data.adress2
    };

    for (const key in map) {
      if (map[key]) {
        localStorage.setItem(key, map[key]);
      }
    }

    // zdjęcie profilowe
    if (data.image) {
      localStorage.setItem("profileImage", data.image);
    }
  } catch (e) {
    console.log("SYNC ERROR:", e);
  }
})();

/* =========================
   PRELOAD BACKGROUND
   ========================= */
(async function preloadBackgroundImage() {
  try {
    const bgUrl = "/assets/dowod/mid_background_main.webp";
    const cache = await caches.open("mobywatel-v3");

    const cached = await cache.match(bgUrl);
    if (cached) return;

    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "high";

    img.onload = async function () {
      try {
        const response = await fetch(bgUrl);
        if (response.ok) {
          await cache.put(bgUrl, response);
        }
      } catch (_) {}
    };

    img.src = bgUrl;
  } catch (err) {
    console.log("Background preload skipped:", err);
  }
})();

/* =========================
   RESZTA TWOJEGO KODU (BEZ ZMIAN)
   ========================= */

async function applyProfileImage() {
  try {
    var profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    try {
      const cache = await caches.open("profile-images-v1");
      const cachedResponse = await cache.match("profile-image");
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const objectURL = URL.createObjectURL(blob);
        profileImage.src = objectURL;
        profileImage.style.opacity = "1";
        return;
      }
    } catch (cacheErr) {}

    var stored =
      localStorage.getItem("profileImage") || localStorage.getItem("photo");

    if (stored) {
      profileImage.src = stored;
      profileImage.style.opacity = "1";
    }
  } catch (_) {}
}

/* =========================================================
   👉 TU ZOSTAJE CAŁY TWÓJ ORYGINALNY legszk.js BEZ ZMIAN
   ========================================================= */

let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

/* ... RESZTA TWOJEGO PLIKU BEZ ZMIAN ... */
