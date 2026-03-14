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
    document.querySelector(".selected_text").innerHTML = option.innerHTML;
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

document.querySelectorAll(".date_input").forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".date").classList.remove("error_shown");
  });
});

/* ===== upload zdjęcia ===== */
var imageInput = document.getElementById("imageInput");

if (upload && imageInput) {
  upload.addEventListener("click", () => {
    upload.classList.remove("error_shown");
    imageInput.click();
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

    reader.onload = function (e) {
      var url = e.target.result;

      upload.setAttribute("selected", url);
      upload.classList.remove("upload_loading");
      upload.classList.add("upload_loaded");

      var img = upload.query
