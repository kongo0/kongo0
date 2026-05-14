document.addEventListener("DOMContentLoaded", () => {
    let data = {};

    try {
        data = JSON.parse(localStorage.getItem("mobywatel_data")) || {};
    } catch (e) {
        console.warn("Błąd danych:", e);
    }

    // =========================
    // POMOCNICZE
    // =========================
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
    // NUMER LEGITYMACJI (POPRAWIONY)
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
    // DANE SZKOŁY
    // =========================
    setText("display-schoolName_legszk", data.schoolName);
    setText("display-schoolAddress_legszk", data.schoolAddress);
    setText("display-schoolPhone_legszk", data.schoolPhone);
    setText("display-schoolDirector_legszk", data.schoolDirector);

    // =========================
    // CZAS / HEADER
    // =========================
    updateClock();
    setInterval(updateClock, 1000);

    // =========================
    // TOGGLE "DODATKOWE DANE"
    // =========================
    const toggle = document.getElementById("extra-toggle");
    const content = document.getElementById("extra-content");
    const arrow = document.getElementById("extra-arrow");

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
    // AKTUALIZUJ BUTTON
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
// FUNKCJE GLOBALNE
// =========================

function generateSchoolId() {
    const year = new Date().getFullYear();
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(10000 + Math.random() * 90000);
    return `${year}/${part1}/${part2}`;
}

function updateClock() {
    const el = document.querySelector(".czas");
    if (!el) return;

    const now = new Date();

    const time = now.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    el.textContent = time;
}
