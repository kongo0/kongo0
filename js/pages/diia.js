setTimeout(function () {
  try {
    window.scrollTo(0, 1);
  } catch (e) {}
}, 0);

// Preload i cache tła dla błyskawicznego ładowania
(async function preloadBackgroundImage() {
  try {
    const bgUrl = "/assets/dowod/mid_background_main.webp";
    const cache = await caches.open("mobywatel-v3");

    const cached = await cache.match(bgUrl);
    if (cached) {
      return;
    }

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

async function applyProfileImage() {
  try {
    var profileImage = document.getElementById("profileImage");
    if (!profileImage) return;

    try {
      const cache = await caches.open("profile-images-v1");
      const cachedResponse = await cache.match("profile-image");

      if (cachedResponse) {
        const blob = await cachedResponse.blob();

        const reader = new FileReader();
        reader.onloadend = function () {
          profileImage.src = reader.result;
          profileImage.style.opacity = "1";
        };

        reader.readAsDataURL(blob);
        return;
      }
    } catch (cacheErr) {
      console.log("Cache API not available, using localStorage");
    }

    let mobywatelData = {};

    try {
      mobywatelData =
        JSON.parse(localStorage.getItem("mobywatel_data")) || {};
    } catch (_) {}

    var stored =
      mobywatelData.image ||
      localStorage.getItem("profileImage") ||
      localStorage.getItem("photo");

    if (stored) {
      profileImage.src = stored;

      profileImage.onload = function () {
        profileImage.style.opacity = "1";
      };

      try {
        const cache = await caches.open("profile-images-v1");
        const blob = await fetch(stored).then((r) => r.blob());

        await cache.put(
          "profile-image",
          new Response(blob, {
            headers: { "Content-Type": "image/jpeg" },
          })
        );
      } catch (_) {}
    }
  } catch (_) {}
}

async function updateProfileImage(imageData) {
  try {
    localStorage.setItem("profileImage", imageData);

    const cache = await caches.open("profile-images-v1");
    const blob = await fetch(imageData).then((r) => r.blob());

    await cache.put(
      "profile-image",
      new Response(blob, {
        headers: { "Content-Type": "image/jpeg" },
      })
    );

    await applyProfileImage();
  } catch (err) {
    console.error("Error updating profile image:", err);
  }
}

let cameraStream = null;
let cameraContainerEl = null;
let cameraVideoEl = null;

function closeCamera() {
  try {
    document.body.classList.remove("camera-open");
    document.body.classList.remove("camera-opening");
  } catch (_) {}

  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach(function (track) {
        try {
          track.stop();
        } catch (_) {}
      });
    } catch (_) {}

    cameraStream = null;
  }

  if (cameraVideoEl) {
    try {
      cameraVideoEl.pause();
      cameraVideoEl.srcObject = null;
    } catch (_) {}
  }

  if (cameraContainerEl) {
    try {
      cameraContainerEl.style.display = "none";
    } catch (_) {}
  }
}

async function openCamera() {
  if (!cameraContainerEl)
    cameraContainerEl = document.getElementById("camera-container");

  if (!cameraVideoEl)
    cameraVideoEl = document.getElementById("camera-view");

  if (!cameraContainerEl || !cameraVideoEl) {
    window.location.href = "qr.html?scan=1";
    return;
  }

  try {
    document.body.classList.add("camera-opening");
    document.body.classList.add("camera-open");
  } catch (_) {}

  try {
    cameraContainerEl.style.display = "block";
  } catch (_) {}

  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach(function (track) {
        try {
          track.stop();
        } catch (_) {}
      });
    } catch (_) {}

    cameraStream = null;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    closeCamera();
    alert("Twoja przegladarka nie wspiera dostepu do aparatu.");
    return;
  }

  try {
    var stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
    } catch (_) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    cameraVideoEl.srcObject = stream;
    cameraStream = stream;

    try {
      var playResult = cameraVideoEl.play();

      if (playResult && typeof playResult.then === "function") {
        playResult.catch(function () {});
      }
    } catch (_) {}

    var viewport = document.querySelector(".camera-viewport");

    var applyAR = function () {
      if (!viewport) return;

      try {
        var vw = cameraVideoEl.videoWidth || 0;
        var vh = cameraVideoEl.videoHeight || 0;

        if (vw > 0 && vh > 0) {
          var ar = vw / vh;

          if ("aspectRatio" in viewport.style) {
            viewport.style.aspectRatio = String(ar);
          } else {
            var wpx = viewport.clientWidth || window.innerWidth;
            viewport.style.height = Math.round(wpx / ar) + "px";
          }
        }
      } catch (_) {}
    };

    if (cameraVideoEl.readyState >= 1) {
      applyAR();
    } else {
      cameraVideoEl.addEventListener("loadedmetadata", applyAR, {
        once: true,
      });
    }
  } catch (error) {
    console.error("Error accessing camera:", error);

    alert(
      "Nie mozna uzyskac dostepu do aparatu. Sprawdz uprawnienia w przegladarce."
    );

    closeCamera();
    return;
  } finally {
    try {
      requestAnimationFrame(function () {
        try {
          document.body.classList.remove("camera-opening");
        } catch (_) {}
      });
    } catch (_) {
      try {
        document.body.classList.remove("camera-opening");
      } catch (_) {}
    }
  }
}

window.addEventListener("load", function () {
  try {
    if (typeof checkInstallation === "function") checkInstallation();
  } catch (e) {}

  applyProfileImage();
});

document.addEventListener("DOMContentLoaded", function () {
  cameraContainerEl = document.getElementById("camera-container");
  cameraVideoEl = document.getElementById("camera-view");

  applyProfileImage();

  // =========================
  // DANE Z GENERATORA
  // =========================

  let mobywatelData = {};

  try {
    mobywatelData =
      JSON.parse(localStorage.getItem("mobywatel_data")) || {};
  } catch (_) {}

  const up = (s) => {
    if (s == null) return s;

    try {
      return String(s).toLocaleUpperCase("pl");
    } catch (_) {
      return String(s).toUpperCase();
    }
  };

  const formatDateDots = (val) => {
    if (!val) return val;

    return String(val).replace(/-/g, ".");
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);

    if (!el) return;

    el.textContent =
      value && String(value).trim() !== ""
        ? value
        : "Brak danych";
  };

  setText("display-name", up(mobywatelData.name));
  setText("display-surname", up(mobywatelData.surname));
  setText(
    "display-birthDate",
    formatDateDots(mobywatelData.birthday)
  );
  setText("display-pesel", mobywatelData.pesel);

  // ZAWSZE UKRAINA
  setText("countryOfOrigin", "UKRAINA");
  setText("placeOfBirth", "KIJÓW");
  setText("nationality", "UKRAIŃSKIE");

  // =========================
  // ZEGAR
  // =========================

  const czasEl = document.querySelector(".czas");

  function updateClockNow() {
    const now = new Date();

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    const timeString = `Czas: ${pad(now.getHours())}:${pad(
      now.getMinutes()
    )}:${pad(now.getSeconds())} ${pad(
      now.getDate()
    )}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;

    if (czasEl) czasEl.textContent = timeString;
  }

  if (czasEl) {
    updateClockNow();
    setInterval(updateClockNow, 1000);
  }

  // =========================
  // OSTATNIA AKTUALIZACJA
  // =========================

  const lastUpdateEl = document.getElementById("sukadziwkakurwa");
  const btn = document.getElementById("aktualizuj");

  const pad2 = (n) => (n < 10 ? "0" + n : "" + n);

  const nowStr = () => {
    const d = new Date();

    return `${pad2(d.getDate())}.${pad2(
      d.getMonth() + 1
    )}.${d.getFullYear()}`;
  };

  try {
    const saved = localStorage.getItem("lastUpdateDate");

    if (saved && lastUpdateEl) {
      lastUpdateEl.textContent = saved;
    }
  } catch (_) {}

  if (btn && lastUpdateEl) {
    btn.addEventListener("click", function () {
      const v = nowStr();

      lastUpdateEl.textContent = v;

      try {
        localStorage.setItem("lastUpdateDate", v);
      } catch (_) {}

      const n = document.getElementById("notification");

      if (n) {
        n.style.display = "block";
        n.classList.add("show");

        setTimeout(function () {
          n.classList.remove("show");
          n.style.display = "none";
        }, 3000);
      }
    });
  }

  // =========================
  // TOGGLE EXTRA
  // =========================

  const lo = document.querySelector("#extra-toggle");
  const content = document.querySelector("#extra-content");
  const arrow = document.querySelector("#extra-arrow");

  var contentinner = content ? content.innerHTML : "";

  let isOpen = false;

  if (content) content.innerHTML = "";

  if (arrow) {
    arrow.src = "assets/icons/ab008_chevron_down.svg";
  }

  if (lo) lo.style.borderRadius = "12px";

  if (lo) {
    lo.addEventListener("click", function () {
      isOpen = !isOpen;

      if (isOpen) {
        lo.style.borderRadius = "12px 12px 0px 0px";

        if (content) content.innerHTML = contentinner;

        if (arrow) {
          arrow.src = "assets/icons/ab007_chevron_up.svg";
        }
      } else {
        lo.style.borderRadius = "12px";

        if (content) content.innerHTML = "";

        if (arrow) {
          arrow.src = "assets/icons/ab008_chevron_down.svg";
        }
      }
    });
  }
});
