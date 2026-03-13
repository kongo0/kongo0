var selector = document.querySelector(".selector_box");
var upload = document.querySelector(".upload");
var guide = document.querySelector(".guide_holder");
var sex = "m";

/* ===== selector ===== */
if (selector) {
  selector.addEventListener("click", () => {
    selector.classList.toggle("selector_open");
  });
}

document.querySelectorAll(".selector_option").forEach((option) => {
  option.addEventListener("click", () => {
    sex = option.id;
    var text = document.querySelector(".selected_text");
    if (text) text.innerHTML = option.innerHTML;
    selector.classList.remove("selector_open");
  });
});

/* ===== inputs ===== */
document.querySelectorAll(".input_holder").forEach((element) => {
  var input = element.querySelector(".input");
  if (!input) return;
  input.addEventListener("click", () => {
    element.classList.remove("error_shown");
  });
});

/* ===== upload ===== */
var imageInput = document.getElementById("imageInput");

if (upload && imageInput) {
  upload.addEventListener("click", () => {
    upload.classList.remove("error_shown");
    imageInput.click(); // otwiera galerię
  });

  imageInput.addEventListener("change", () => {
    var file = imageInput.files[0];
    if (!file) return;

    if (file.size > 5000000) {
      alert("Zdjęcie jest za duże (max 5MB)");
      return;
    }

    upload.classList.add("upload_loading");

    var reader = new FileReader();
    reader.onload = function(e) {
      var url = e.target.result;
      upload.setAttribute("selected", url);
      upload.classList.remove("upload_loading");
      upload.classList.add("upload_loaded");

      var img = upload.querySelector(".upload_uploaded");
      if (img) img.src = url;
    };
    reader.readAsDataURL(file);
  });
}

/* ===== button go ===== */
var go = document.querySelector(".go");
if (go) {
  go.addEventListener("click", () => {
    var empty = [];
    var params = new URLSearchParams();
    params.set("sex", sex);

    if (!upload || !upload.hasAttribute("selected")) {
      if (upload) upload.classList.add("error_shown");
      empty.push(upload);
    } else {
      params.set("image", upload.getAttribute("selected"));
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
      var input = element.querySelector(".input");
      if (!input) return;

      if (/^\s*$/.test(input.value)) {
        element.classList.add("error_shown");
        empty.push(element);
      } else {
        params.set(input.id, input.value);
      }
    });

    if (empty.length > 0) {
      empty[0].scrollIntoView({ behavior: "smooth" });
    } else {
      location.href = "card.html?" + params.toString();
    }
  });
}

/* ===== guide ===== */
if (guide) {
  guide.addEventListener("click", () => {
    guide.classList.toggle("unfolded");
  });
}
