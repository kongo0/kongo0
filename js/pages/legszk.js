const mobyData = JSON.parse(localStorage.getItem("mobywatel_data") || "{}");

/* =========================
   HELPERS
========================= */
function getData(key, fallbackKey) {
    return mobyData[key] ??
        localStorage.getItem(fallbackKey || key) ??
        "Brak danych";
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "Brak danych";
}

function setImg(id, value) {
    const el = document.getElementById(id);
    if (el && value && value !== "Brak danych") {
        el.src = value;
        el.style.opacity = "1";
    }
}

/* =========================
   RANDOM LEGITYMACJA NUMBER
========================= */
function generateLegitNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `LSZ/${year}/${rand}`;
}

/* =========================
   RANDOM SCHOOL DATA
========================= */
function generateSchoolData() {
    const schools = [
        {
            name: "Liceum Ogólnokształcące im. M. Kopernika",
            address: "ul. Kopernika 12, Warszawa",
            phone: "+48 22 123 45 67",
            director: "mgr Anna Nowak"
        },
        {
            name: "Technikum Informatyczne nr 3",
            address: "ul. Słoneczna 8, Warszawa",
            phone: "+48 22 555 12 12",
            director: "dr Piotr Zieliński"
        },
        {
            name: "Szkoła Podstawowa nr 45",
            address: "ul. Leśna 22, Warszawa",
            phone: "+48 22 777 88 99",
            director: "mgr Katarzyna Wiśniewska"
        }
    ];

    return schools[Math.floor(Math.random() * schools.length)];
}

/* =========================
   LOAD DATA
========================= */
function loadData() {

    setText("display-name", getData("name"));
    setText("display-surname", getData("surname"));
    setText("display-birthDate", getData("birthday"));
    setText("display-pesel", getData("pesel"));

    /* LEGITYMACJA NUMBER (RANDOM zamiast mDowód) */
    const legNumber = localStorage.getItem("legit_number") || generateLegitNumber();
    localStorage.setItem("legit_number", legNumber);
    setText("display-cardNumber", legNumber);

    /* EXTRA SCHOOL DATA */
    const school = generateSchoolData();

    setText("display-schoolName_legszk", school.name);
    setText("display-schoolAddress_legszk", school.address);
    setText("display-schoolPhone_legszk", school.phone);
    setText("display-schoolDirector_legszk", school.director);

    setImg("profileImage", getData("image"));
}

/* =========================
   EXTRA TOGGLE (ZAMKNIĘTE NA START)
========================= */
function bindExtraToggle() {
    const toggle = document.getElementById("extra-toggle");
    const content = document.getElementById("extra-content");
    const arrow = document.getElementById("extra-arrow");

    if (!toggle || !content) return;

    let open = false;

    /* START = ZAMKNIĘTE */
    content.style.maxHeight = "0px";

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

    const stored = localStorage.getItem("profileImage") || localStorage.getItem("image");
    if (!stored) return;

    img.src = stored;
    img.style.opacity = "1";
}

/* =========================
   OSTATNIA AKTUALIZACJA (jak w dowod.js)
========================= */

const UPDATE_KEY = "last_update_date_legszk";
const GENERATED_KEY = "document_generated_date_legszk";

function pad(n) {
    return n < 10 ? "0" + n : n;
}

function formatDate(d) {
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function getGeneratedDate() {
    let stored = localStorage.getItem(GENERATED_KEY);

    if (!stored) {
        const now = new Date();
        localStorage.setItem(GENERATED_KEY, now.toISOString());
        return now;
    }

    return new Date(stored);
}

function getInitialUpdateDate() {
    const stored = localStorage.getItem(UPDATE_KEY);
    if (stored) return new Date(stored);
    return getGeneratedDate();
}

function setUpdateDate(date) {
    localStorage.setItem(UPDATE_KEY, date.toISOString());

    const el = document.getElementById("sukadziwkakurwa");

    if (el) {
        el.textContent = formatDate(date);
    }
}

function loadUpdateDate() {
    setUpdateDate(getInitialUpdateDate());
}

function updateToToday() {
    const now = new Date();
    setUpdateDate(now);
}

/* =========================
   BIND UI
========================= */
function bindUI() {
    document.getElementById("aktualizuj")?.addEventListener("click", updateToToday);
}

/* =========================
   START
========================= */
window.addEventListener("load", () => {
    loadData();
    applyProfileImage();
    startClock();
    bindExtraToggle();
    bindUI();
    loadUpdateDate();
});
