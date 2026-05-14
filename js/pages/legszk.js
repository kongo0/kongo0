document.addEventListener("DOMContentLoaded", () => {
    let data = {};

    try {
        data = JSON.parse(localStorage.getItem("mobywatel_data")) || {};
    } catch (e) {
        console.warn("Błąd danych:", e);
    }

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
    setText("display-issueDate", data.issue_date);
    setText("display-expiryDate", data.expiry_date);

    // =========================
    // NUMER LEGITYMACJI
    // =========================
    const cardNumber =
        data.schoolId ||
        generateSchoolId();

    setText("display-cardNumber", cardNumber);

    // =========================
    // ZDJĘCIE
    // =========================
    const img = document.getElementById("profileImage");

    if (img) {
        if (data.image) {
            img.src = data.image;
            img.onload = () => {
                img.style.opacity = "1";
            };
        } else {
            img.style.opacity = "0.3";
        }
    }

    // =========================
    // RANDOM DANE SZKOŁY (NOWE)
    // =========================
    const school = generateSchoolData();

    setText("display-schoolName_legszk", data.schoolName || school.name);
    setText("display-schoolAddress_legszk", data.schoolAddress || school.address);
    setText("display-schoolPhone_legszk", data.schoolPhone || school.phone);
    setText("display-schoolDirector_legszk", data.schoolDirector || school.director);

    // =========================
    // DODATKOWE DANE - DOMYŚLNIE ZAMKNIĘTE
    // =========================
    const content = document.getElementById("extra-content");
    const arrow = document.getElementById("extra-arrow");

    if (content) {
        content.style.display = "none"; // 🔥 NA START ZAMKNIĘTE
    }

    if (arrow) {
        arrow.style.transform = "rotate(0deg)";
    }

    const toggle = document.getElementById("extra-toggle");

    if (toggle && content) {
        toggle.addEventListener("click", () => {
            const isOpen = content.style.display === "block";

            content.style.display = isOpen ? "none" : "block";

            if (arrow) {
                arrow.style.transform = isOpen
                    ? "rotate(0deg)"
                    : "rotate(180deg)";
            }
        });
    }

    // =========================
    // ZEGAR
    // =========================
    updateClock();
    setInterval(updateClock, 1000);

    // =========================
    // AKTUALIZUJ
    // =========================
    const btn = document.getElementById("aktualizuj");

    if (btn) {
        btn.addEventListener("click", () => {
            const notif = document.getElementById("notification");
            if (!notif) return;

            notif.classList.add("show");

            setTimeout(() => {
                notif.classList.remove("show");
            }, 2500);
        });
    }
});

// =========================
// GENERATORY
// =========================

function generateSchoolId() {
    const year = new Date().getFullYear();
    const a = Math.floor(1000 + Math.random() * 9000);
    const b = Math.floor(10000 + Math.random() * 90000);
    return `${year}/${a}/${b}`;
}

function generateSchoolData() {
    const schools = [
        {
            name: "Liceum Ogólnokształcące nr 3 im. Jana III Sobieskiego",
            address: "ul. Mickiewicza 12, Warszawa",
            phone: "+48 22 123 45 67",
            director: "mgr Anna Kowalska"
        },
        {
            name: "Technikum Informatyczne nr 1",
            address: "ul. Polna 8, Warszawa",
            phone: "+48 22 987 65 43",
            director: "mgr inż. Marek Nowak"
        },
        {
            name: "Szkoła Podstawowa nr 45",
            address: "ul. Słoneczna 15, Warszawa",
            phone: "+48 22 555 33 11",
            director: "mgr Ewa Wiśniewska"
        }
    ];

    return schools[Math.floor(Math.random() * schools.length)];
}

function updateClock() {
    const el = document.querySelector(".czas");
    if (!el) return;

    const now = new Date();

    el.textContent = now.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}
