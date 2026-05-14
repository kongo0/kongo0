// ==========================
// DANE Z GENERATORA -> LEGITYMACJA
// kompatybilne z aktualnym legszk.js
// ==========================

(function () {
  try {
    const up = function (s) {
      if (s == null) return "";
      try {
        return String(s).toLocaleUpperCase("pl");
      } catch (_) {
        return String(s).toUpperCase();
      }
    };

    const formatDateDots = function (val) {
      if (!val) return "";
      try {
        let s = String(val).trim();

        let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) {
          return `${m[3]}.${m[2]}.${m[1]}`;
        }

        return s.replace(/-/g, ".");
      } catch (_) {
        return val;
      }
    };

    const setText = function (id, value, formatter) {
      try {
        const el = document.getElementById(id);
        if (!el) return;

        if (value == null || value === "") {
          el.textContent = "Brak danych";
          return;
        }

        let finalValue = value;

        if (typeof formatter === "function") {
          finalValue = formatter(value);
        }

        el.textContent = finalValue;
      } catch (_) {}
    };

    // ==========================
    // ODCZYT DANYCH Z INDEX.HTML
    // ==========================

    const data = {
      name:
        localStorage.getItem("name") ||
        localStorage.getItem("display-name_legszk") ||
        "",

      surname:
        localStorage.getItem("surname") ||
        localStorage.getItem("display-surname_legszk") ||
        "",

      birthDate:
        localStorage.getItem("birthDate") ||
        localStorage.getItem("display-birthDate_legszk") ||
        "",

      pesel:
        localStorage.getItem("pesel") ||
        localStorage.getItem("display-pesel_legszk") ||
        "",

      cardNumber:
        localStorage.getItem("cardNumber") ||
        localStorage.getItem("display-cardNumber_legszk") ||
        "",

      issueDate:
        localStorage.getItem("issueDate") ||
        localStorage.getItem("display-issueDate_legszk") ||
        "",

      expiryDate:
        localStorage.getItem("expiryDate") ||
        localStorage.getItem("display-expiryDate_legszk") ||
        "",

      schoolName:
        localStorage.getItem("schoolName") ||
        localStorage.getItem("display-schoolName_legszk") ||
        "",

      schoolAddress:
        localStorage.getItem("schoolAddress") ||
        localStorage.getItem("display-schoolAddress_legszk") ||
        "",

      schoolPhone:
        localStorage.getItem("schoolPhone") ||
        localStorage.getItem("display-schoolPhone_legszk") ||
        "",

      schoolDirector:
        localStorage.getItem("schoolDirector") ||
        localStorage.getItem("display-schoolDirector_legszk") ||
        "",
    };

    // ==========================
    // ZAPIS POD KLUCZE LEGITYMACJI
    // ==========================

    localStorage.setItem("display-name_legszk", data.name);
    localStorage.setItem("display-surname_legszk", data.surname);
    localStorage.setItem("display-birthDate_legszk", data.birthDate);
    localStorage.setItem("display-pesel_legszk", data.pesel);
    localStorage.setItem("display-cardNumber_legszk", data.cardNumber);
    localStorage.setItem("display-issueDate_legszk", data.issueDate);
    localStorage.setItem("display-expiryDate_legszk", data.expiryDate);
    localStorage.setItem("display-schoolName_legszk", data.schoolName);
    localStorage.setItem(
      "display-schoolAddress_legszk",
      data.schoolAddress
    );
    localStorage.setItem("display-schoolPhone_legszk", data.schoolPhone);
    localStorage.setItem(
      "display-schoolDirector_legszk",
      data.schoolDirector
    );

    // ==========================
    // WYPEŁNIANIE HTML
    // ==========================

    setText("display-name", data.name, up);
    setText("display-surname", data.surname, up);

    setText(
      "display-birthDate",
      data.birthDate,
      formatDateDots
    );

    setText("display-pesel", data.pesel);

    setText(
      "display-cardNumber",
      data.cardNumber,
      up
    );

    setText(
      "display-issueDate",
      data.issueDate,
      formatDateDots
    );

    setText(
      "display-expiryDate",
      data.expiryDate,
      formatDateDots
    );

    setText(
      "display-schoolName_legszk",
      data.schoolName,
      up
    );

    setText(
      "display-schoolAddress_legszk",
      data.schoolAddress,
      up
    );

    setText(
      "display-schoolPhone_legszk",
      data.schoolPhone
    );

    setText(
      "display-schoolDirector_legszk",
      data.schoolDirector,
      up
    );

    // ==========================
    // FOTO
    // ==========================

    try {
      const photo =
        localStorage.getItem("profileImage") ||
        localStorage.getItem("photo");

      if (photo) {
        const profileImage =
          document.getElementById("profileImage");

        if (profileImage) {
          profileImage.src = photo;
          profileImage.style.opacity = "1";
        }
      }
    } catch (_) {}

    console.log("LEGITYMACJA: dane załadowane poprawnie");
  } catch (err) {
    console.error("LEGSZK LOAD ERROR:", err);
  }
})();
