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

    if (value === null || value === undefined || value === "") {
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
   DRIVER LICENSE GENERATOR
========================= */

function generatePrawoJazdyData() {
    const birthDateRaw = getData("birthDate", "birthday");

    let birthDate = birthDateRaw ? new Date(birthDateRaw) : null;

    // jeśli brak daty → fallback
    if (!birthDate || isNaN(birthDate)) {
        birthDate = new Date();
    }

    // 18 lat + 7 dni
    const issueDate = new Date(birthDate);
    issueDate.setFullYear(issueDate.getFullYear() + 18);
    issueDate.setDate(issueDate.getDate() + 7);

    // ważność 15 lat (realistycznie)
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 15);

    // FAKE ALE REALISTYCZNE DANE
    const docNumber =
        "PL-" +
        Math.floor(10000000 + Math.random() * 90000000);

    const blankietNumber =
        "B" +
        Math.floor(100000000 + Math.random() * 900000000);

    const issuingAuthority =
        "Prezydent m.st. Warszawy";

    return {
        issueDate: formatDate(issueDate),
        expiryDate: formatDate(expiryDate),
        documentNumber: docNumber,
        blankietNumber: blankietNumber,
        issuingAuthority: issuingAuthority,
        status: "Wydany",
        category: "B"
    };
}

/* =========================
   LOAD DATA (NAJWAŻNIEJSZE)
========================= */

function loadData() {
    // dane osobowe
    setText("display-name", getData("name", "name"));
    setText("display-surname", getData("surname", "surname"));
    setText("display-birthDate", getData("birthDate", "birthday"));
    setText("display-birthPlace", getData("birthPlace", "placeOfBirth"));
    setText("display-pesel", getData("pesel", "pesel"));

    // KATEGORIA ZAWSZE B
    setText("category", "B");

    // zdjęcie
    setImg("profileImage", getData("image", "profileImage"));

    // generowane dane prawa jazdy
    const d = generatePrawoJazdyData();

    setText("display-issueDate", d.issueDate);
    setText("expiryDate", d.expiryDate);
    setText("display-documentNumber", d.documentNumber);
    setText("display-blanketNumber", d.blankietNumber);
    setText("display-issuingAuthority", d.issuingAuthority);

    // status
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
   PROFILE IMAGE (CACHE + LOCALSTORAGE)
========================= */

async function applyProfileImage() {
    const img = document.getElementById("profileImage");
    if (!img) return;

    const stored = localStorage.getItem("profileImage") || localStorage.getItem("photo");

    if (stored) {
        img.src = stored;
        img.style.opacity = "1";
    }
}

/* =========================
   CAMERA (UPROSZCZONE)
========================= */

let stream = null;

async function openCamera() {
    const container = document.getElementById("camera-container");
    const video = document.getElementById("camera-view");

    if (!container || !video) return;

    container.style.display = "block";
    document.body.classList.add("camera-open");

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.srcObject = stream;
        await video.play();
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

    const container = document.getElementById("camera-container");
    const video = document.getElementById("camera-view");

    if (video) video.srcObject = null;
    if (container) container.style.display = "none";
}

/* =========================
   UI BIND
========================= */

function bindUI() {
    document
        .querySelector('.quick-actions img[src*="ai002_confirm_identity_mini.svg"]')
        ?.closest(".qa-item")
        ?.addEventListener("click", openCamera);
}

/* =========================
   START
========================= */

window.addEventListener("load", () => {
    loadData();
    applyProfileImage();
    startClock();
    bindUI();

    window.openCamera = openCamera;
    window.closeCamera = closeCamera;
});
