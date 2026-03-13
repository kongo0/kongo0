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
imageInput.accept = ".jpeg,.png,.jpg,.gif";

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

  var file = imageInput.files[0];

  if (!file) return;

  if (file.size > 5000000) {
    alert("Zdjęcie jest za duże (max 5MB)");
    return;
  }

  upload.classList.remove("upload_loaded");
  upload.classList.add("upload_loading");

  upload.removeAttribute("selected");

  var data = new FormData();
  data.append("image", file);

  fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: "Client-ID e4d98a899c8c946"
    },
    body: data
  })
  .then(res => res.json())
  .then(response => {

    if (!response.success) {
      throw new Error("Upload failed");
    }

    var url = response.data.link;

    upload.classList.remove("error_shown");
    upload.classList.remove("upload_loading");
    upload.classList.add("upload_loaded");

    upload.setAttribute("selected", url);

    var img = upload.querySelector(".upload_uploaded");

    if (img) {
      img.src = url;
    }

  })
  .catch(err => {

    console.error(err);

    upload.classList.remove("upload_loading");
    upload.classList.add("error_shown");

    alert("Błąd podczas wgrywania zdjęcia.");
  });
});

document.querySelector(".go").addEventListener("click", () => {

  var empty = [];
  var params = new URLSearchParams();

  params.set("sex", sex);

  if (!upload.hasAttribute("selected")) {
    empty.push(upload);
    upload.classList.add("error_shown");
  } else {
    params.set("image", upload.getAttribute("selected"));
  }

  const day = document.getElementById("day");
  const month = document.getElementById("month");
  const year = document.getElementById("year");

  [day, month, year].forEach((input) => {

    if (isEmpty(input.value)) {
      empty.push(input);
      input.classList.add("error_shown");
    } else {
      params.set(input.id, input.value);
    }

  });

  document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");

    if (isEmpty(input.value)) {

      empty.push(element);
      element.classList.add("error_shown");

    } else {

      params.set(input.id, input.value);

    }

  });

  if (empty.length !== 0) {

    empty[0].scrollIntoView({
      behavior: "smooth"
    });

  } else {

    forwardToId(params);

  }

});

function isEmpty(value) {
  return /^\s*$/.test(value);
}

function forwardToId(params) {
  location.href = "id.html?" + params.toString();
}

var guide = document.querySelector(".guide_holder");

guide.addEventListener("click", () => {
  guide.classList.toggle("unfolded");
});
