const mobyData = JSON.parse(localStorage.getItem("mobywatel_data") || "{}");

/* =========================
   HELPERS (FIXED)
========================= */

function getData(...keys) {
    // sprawdza wiele możliwych kluczy (generator chaos fix)
    for (let k of keys) {
        const v =
            mobyData?.[k] ??
            localStorage.getItem(k);

        if (v && v !== "undefined" && v !== "null") {
            return v;
        }
    }
    return "";
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    if (!value || value.trim?.() === "") {
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
   GENERATOR PRAWO JAZDY
========================= */

function generatePrawoJazdyData() {
    const birthRaw = getData(
        "birthDate",
        "birthday",
        "birth_date",
        "dateOfBirth"
    );

    let birthDate = new Date(birthRaw);

    if (!birthRaw || isNaN(birthDate)) {
        birthDate = new Date();
    }

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
    setText("display-name", getData("name"));
    setText("display-surname", getData("surname"));

    // 🔥 FIX NA 100% DATY URODZENIA
    setText(
        "display-birthDate",
        getData(
            "birthDate",
            "birthday",
            "birth_date",
            "dateOfBirth"
        )
    );

    setText(
        "display-birthPlace",
        getData("birthPlace", "placeOfBirth")
    );

    setText("display-pesel", getData("pesel"));

    // zdjęcie
    setImg(
        "profileImage",
        getData("image", "profileImage", "photo")
    );

    // zawsze B
    setText("category", "B");

    // ===== DANE GENEROWANE =====
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
   OSTATNIA AKTUALIZACJA (DATA)
========================= */

const UPDATE_KEY = "last_update_date";
const GENERATED_KEY = "document_generated_date";

function pad(n) {
    return n < 10 ? "0" + n : n;
}

function formatDate(d) {
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
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
