var selector = document.querySelector(".selector_box");

selector.addEventListener("click", () => {
  selector.classList.toggle("selector_open");
});

document.querySelectorAll(".date_input").forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".date").classList.remove("error_shown");
  });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
  option.addEventListener("click", () => {
    sex = option.id;
    document.querySelector(".selected_text").innerHTML = option.innerHTML;
  });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";

document.querySelectorAll(".input_holder").forEach((element) => {
  var input = element.querySelector(".input");

  input.addEventListener("click", () => {
    element.classList.remove("error_shown");
  });
});

upload.addEventListener("click", () => {
  imageInput.click();
  upload.classList.remove("error_shown");
});

imageInput.addEventListener("change", () => {

  const file = imageInput.files[0];
  if (!file) return;

  if (file.size > 5000000) {
    alert("Zdjęcie jest za duże (max 5MB)");
    return;
  }

  upload.classList.remove("upload_loaded");
  upload.classList.add("upload_loading");

  const reader = new FileReader();

  reader.onload = function(e) {

    const url = e.target.result;

    upload.setAttribute("selected", url);

    upload.classList.remove("upload_loading");
    upload.classList.add("upload_loaded");

    const img = upload.querySelector(".upload_uploaded");

    if (img) {
      img.src = url;
    }

  };

  reader.readAsDataURL(file);

});

document.querySelector(".go").addEventListener("click", () => {

  var
