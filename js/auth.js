console.log("AUTH LOADED");

// jeśli nie ma tokens.js → blokada
if (typeof TOKENS === "undefined") {
    console.error("TOKENS is not loaded!");
}

// pobranie sesji
const session = JSON.parse(localStorage.getItem("session"));

// brak logowania → login
if (!session || !session.token) {
    window.location.href = "login.html";
}

// sprawdzanie tokena
else {
    const tokenData = TOKENS?.[session.token];

    // token nie istnieje
    if (!tokenData) {
        localStorage.removeItem("session");
        window.location.href = "login.html";
    }

    // sprawdzanie daty wygaśnięcia
    if (tokenData?.expires) {
        const now = new Date();
        const exp = new Date(tokenData.expires);

        if (now > exp) {
            localStorage.removeItem("session");
            window.location.href = "login.html";
        }
    }
}

// logout globalny
function logout() {
    localStorage.removeItem("session");
    window.location.href = "login.html";
}
