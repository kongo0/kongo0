const mobyData = JSON.parse(localStorage.getItem("mobywatel_data") || "{}");

/* =========================
   HELPERS
========================= */

function getData(key, fallbackKey) {
    return (
        mobyData[key] ??
        localStorage.getItem(fallbackKey || key) ??
        ""
    );
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    if (!value || value === "Brak danych") {
        el.textContent = "Brak danych";
        return;
    }

    el.textContent = value;
}

function setImg(id, value) {
    const el = document.getElementById(id);
    if (el && value) {
        el.src = value;
        el.style.opacity = "1";
    }
}

/* =========================
   DATE HELPERS
========================= */

function pad(n) {
    return n < 10 ? "0" + n : n;
}

function formatDate(d) {
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/* =========================
   GENERATOR DANYCH
========================= */

function generatePrawoJazdyData() {
    const birthRaw =
        getData("birthDate", "birthday") ||
        getData("birth_date");

    let birthDate = new Date(birthRaw);

    if (!birthRaw || isNaN(birthDate)) {
        birthDate = new Date();
    }

    // 18 lat + 7 dni
    const issueDate = new Date(birthDate);
    issueDate.setFullYear(issueDate.getFullYear() + 18);
    issueDate.setDate(issueDate.getDate() + 7);

    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 15);

    return {
        issueDate: formatDate(issueDate),
        expiryDate: formatDate(expiryDate),
        documentNumber:
            "PL-" + Math.floor(10000000 + Math.random() * 90000000),
        blankietNumber:
            "B" + Math.floor(100000000 + Math.random() * 900000000),
        issuingAuthority: "Prezydent m.st. Warszawy"
    };
}

/* =========================
   LOAD DATA
========================= */

function loadData() {
    // ===== DANE OSOBOWE =====
    setText("display-name", getData("name", "name"));
    setText("display-surname", getData("surname", "surname"));

    // 🔥 FIX: DATA + MIEJSCE
    setText("display-birthDate", getData("birthDate", "birthday"));
    setText("display-birthPlace", getData("birthPlace", "placeOfBirth"));

    setText("display-pesel", getData("pesel", "pesel"));

    // zdjęcie
    setImg("profileImage", getData("image", "profileImage"));

    // kategoria zawsze B
    setText("category", "B");

    // ===== GENEROWANE DANE =====
    const d = generatePrawoJazdyData();

    setText("display-issueDate", d.issueDate);
    setText("expiryDate", d.expiryDate);
    setText("display-documentNumber", d.documentNumber);
    setText("display-blanketNumber", d.blankietNumber);
    setText("display-issuingAuthority", d.issuingAuthority);

    const statusEl = document.getElementById("blanketStatus");
    if (statusEl) {
        statusEl.innerHTML =
            `<img src="assets/icons/zielona_kropka.svg" /> <span>WYDANY</span>`;
    }
}

/* =========================
   CLOCK
========================= */

function startClock() {
    const el = document.querySelector(".czas");
    if (!el) return;

    function update() {
        const now = new Date();
        el.textContent =
            `Czas: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ` +
            `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
    }

    update();
    setInterval(update, 1000);
}

/* =========================
   PROFILE IMAGE
========================= */

async function applyProfileImage() {
    const img = document.getElementById("profileImage");
    if (!img) return;

    const stored =
        localStorage.getItem("profileImage") ||
        localStorage.getItem("photo");

    if (stored) {
        img.src = stored;
        img.style.opacity = "1";
    }
}

/* =========================
   OSTATNIA AKTUALIZACJA (FIX = jak w dowod.js)
========================= */

const UPDATE_KEY = "last_update_date";

function pad2(n) {
    return n < 10 ? "0" + n : n;
}

function nowStr() {
    const d = new Date();
    return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function loadUpdateDate() {
    const saved = localStorage.getItem(UPDATE_KEY);

    const el = document.getElementById("sukadziwkakurwa");
    if (el) {
        el.textContent = saved || nowStr();
    }
}

function updateToToday() {
    const v = nowStr();

    localStorage.setItem(UPDATE_KEY, v);

    const main = document.getElementById("sukadziwkakurwa");
    if (main) main.textContent = v;

    const modal = document.getElementById("sukadziwkakurwa_modal");
    if (modal) modal.textContent = v;

    const n = document.getElementById("notification");
    if (n) {
        n.style.display = "block";
        n.classList.add("show");

        setTimeout(() => {
            n.classList.remove("show");
            n.style.display = "none";
        }, 3000);
    }
}

/* =========================
   CAMERA
========================= */

let stream = null;

async function openCamera() {
    const c = document.getElementById("camera-container");
    const v = document.getElementById("camera-view");

    if (!c || !v) return;

    c.style.display = "block";
    document.body.classList.add("camera-open");

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        v.srcObject = stream;
        await v.play();
    } catch (e) {
        alert("Brak dostępu do kamery");
        closeCamera();
    }
}

function closeCamera() {
    document.body.classList.remove("camera-open");

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }

    const v = document.getElementById("camera-view");
    const c = document.getElementById("camera-container");

    if (v) v.srcObject = null;
    if (c) c.style.display = "none";
}

/* =========================
   UI BIND
========================= */

function bindUI() {
    document
        .querySelector('.quick-actions img[src*="ai002_confirm_identity_mini.svg"]')
        ?.closest(".qa-item")
        ?.addEventListener("click", openCamera);

    document.getElementById("aktualizuj")
        ?.addEventListener("click", updateToToday);

    document.getElementById("aktualizuj_modal")
        ?.addEventListener("click", updateToToday);
}

/* =========================
   START
========================= */

window.addEventListener("load", () => {
    loadData();
    applyProfileImage();
    startClock();
    bindUI();
    loadUpdateDate();

    window.openCamera = openCamera;
    window.closeCamera = closeCamera;
});
