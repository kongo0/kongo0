const mobyData = JSON.parse(localStorage.getItem("mobywatel_data") || "{}");

/* =========================
   DATA HELPERS
========================= */
function getData(key, fallbackKey) {
    return mobyData[key] ??
        localStorage.getItem(fallbackKey || key) ??
        "Brak danych";
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setImg(id, value) {
    const el = document.getElementById(id);
    if (el && value && value !== "Brak danych") {
        el.src = value;
        el.style.opacity = "1";
    }
}

/* =========================
   ID DATA (OVERLAY)
========================= */
function generateIdData() {
    const series = getData("mdow_series", "md_idSeries");

    const status = "Wydany";
    const issuer = "Urząd Miasta Warszawy";

    const now = new Date();

    const issueDate = new Date();
    issueDate.setFullYear(now.getFullYear() - 1);

    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 4);

    const pad = (n) => (n < 10 ? "0" + n : n);

    const format = (d) =>
        `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

    return {
        series,
        status,
        issuer,
        issueDate: format(issueDate),
        expiryDate: format(expiryDate)
    };
}

/* =========================
   CLOCK
========================= */
function startClock() {
    const el = document.querySelector(".czas");
    if (!el) return;

    function update() {
        const now = new Date();
        const p = (n) => (n < 10 ? "0" + n : n);

        el.textContent =
            `Czas: ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())} ` +
            `${p(now.getDate())}.${p(now.getMonth() + 1)}.${now.getFullYear()}`;
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

    const stored = localStorage.getItem("profileImage") || localStorage.getItem("photo");
    if (!stored) return;

    img.src = stored;
    img.style.opacity = "1";
}

/* =========================
   CAMERA
========================= */
let cameraStream = null;
let cameraVideoEl = null;
let cameraContainerEl = null;

async function openCamera() {
    cameraContainerEl = document.getElementById("camera-container");
    cameraVideoEl = document.getElementById("camera-view");

    if (!cameraContainerEl || !cameraVideoEl) {
        window.location.href = "qr.html?scan=1";
        return;
    }

    cameraContainerEl.style.display = "block";
    document.body.classList.add("camera-open");

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        cameraVideoEl.srcObject = cameraStream;
        await cameraVideoEl.play();

    } catch (err) {
        alert("Brak dostępu do kamery");
        closeCamera();
    }
}

function closeCamera() {
    document.body.classList.remove("camera-open");

    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }

    if (cameraVideoEl) {
        cameraVideoEl.srcObject = null;
    }

    if (cameraContainerEl) {
        cameraContainerEl.style.display = "none";
    }
}

/* =========================
   TOAST
========================= */
function showToast(msg) {
    const n = document.getElementById("notification");
    if (!n) return;

    const t = n.querySelector(".notification-text");
    if (t && msg) t.textContent = msg;

    n.style.display = "block";
    n.classList.add("show");

    setTimeout(() => {
        n.classList.remove("show");
        n.style.display = "none";
    }, 3000);
}

/* =========================
   COPY
========================= */
function copy(text, msg) {
    navigator.clipboard.writeText(text || "").then(() => {
        showToast(msg || "Skopiowano");
    });
}

/* =========================
   LOAD DATA
========================= */
function loadData() {

    setText("display-name", getData("name", "name"));
    setText("display-surname", getData("surname", "surname"));
    setText("display-nationality", getData("nationality", "nationality"));
    setText("display-birthDate", getData("birthday", "birthDate"));
    setText("display-pesel", getData("pesel", "pesel"));

    setText("idSeriesMain", getData("mdow_series", "md_idSeries"));
    setText("expiryDateMain", getData("expiry_date", "md_expiryDate"));
    setText("issueDateMain", getData("issue_date", "md_issueDate"));

    setText("fathernameMain", getData("father_name", "fathername"));
    setText("mothernameMain", getData("mother_name", "mothername"));

    setText("lastName", getData("family_name", "lastName"));
    setText("gender", getData("sex", "gender"));
    setText("fatherSurname", getData("father_family_name", "fatherSurname"));
    setText("motherSurname", getData("mother_family_name", "motherSurname"));
    setText("placeOfBirth", getData("birthPlace", "placeOfBirth"));
    setText("address", getData("address", "address"));

    setText(
        "postalcode",
        (getData("postal_code", "postalcode") + " " + getData("city", "")).trim()
    );

    setText("registrationDate", getData("home_date", "registrationDate"));

    setImg("profileImage", getData("image", "profileImage"));
}

/* =========================
   DOWÓD OVERLAY
========================= */
function openIdOverlay() {
    const d = generateIdData();

    const el = document.getElementById("idcard-data-overlay");
    if (el) el.style.display = "block";

    setText("idSeries", d.series);
    setText("docStatus", d.status);
    setText("issuingAuthority", d.issuer);
    setText("issueDate", d.issueDate);
    setText("expiryDate", d.expiryDate);
}

/* =========================
   FIXED TOGGLE (DZIAŁA ZAWSZE)
========================= */
function bindExtraToggle() {
    const toggle = document.getElementById("extra-toggle");
    const content = document.getElementById("extra-content");
    const arrow = document.getElementById("extra-arrow");

    if (!toggle || !content) return;

    let open = false;

    content.style.overflow = "hidden";
    content.style.maxHeight = "0px";
    content.style.transition = "max-height 0.3s ease";

    toggle.style.cursor = "pointer";

    toggle.addEventListener("click", () => {
        open = !open;

        if (open) {
            content.style.maxHeight = content.scrollHeight + "px";
            if (arrow) arrow.style.transform = "rotate(180deg)";
        } else {
            content.style.maxHeight = "0px";
            if (arrow) arrow.style.transform = "rotate(0deg)";
        }
    });
}

/* =========================
   UI BIND
========================= */
function bindUI() {

    const scan = document.querySelector('.quick-actions img[src*="ai002_confirm_identity_mini.svg"]');
    scan?.closest(".qa-item")?.addEventListener("click", openCamera);

    const dataBtn = document.querySelector('.quick-actions img[src*="dane_dowoduosobistego.svg"]');
    dataBtn?.closest(".qa-item")?.addEventListener("click", openIdOverlay);

    const moreBtn = document.querySelector('.quick-actions img[src*="ab011_more_vertical.svg"]');
    moreBtn?.closest(".qa-item")?.addEventListener("click", () => {
        document.getElementById("more-shortcuts-overlay").style.display = "block";
    });
}

/* =========================
   START
========================= */
window.addEventListener("load", () => {
    loadData();
    applyProfileImage();
    startClock();
    bindUI();
    bindExtraToggle();

    window.openCamera = openCamera;
    window.closeCamera = closeCamera;
});
function bindExtraToggle() {
    const toggle = document.getElementById("extra-toggle");
    const content = document.getElementById("extra-content");
    const arrow = document.getElementById("extra-arrow");

    if (!toggle || !content) return;

    toggle.addEventListener("click", () => {
        const isOpen = content.classList.contains("open");

        if (isOpen) {
            content.classList.remove("open");
            toggle.classList.remove("active");
        } else {
            content.classList.add("open");
            toggle.classList.add("active");
        }
    });
}
