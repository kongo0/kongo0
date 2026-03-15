var params = new URLSearchParams(window.location.search);

/* ===== ZEGAR ===== */

function setClock(){
  var date = new Date();
  var time = document.getElementById("time");

  if(time){
    time.innerHTML =
      date.toLocaleTimeString("pl-PL") + " " +
      date.toLocaleDateString("pl-PL");
  }

  setTimeout(setClock,1000);
}

setClock();

/* ===== USTAWIANIE DANYCH ===== */

function setData(id,value){
  var el = document.getElementById(id);
  if(el){
    el.innerHTML = value;
  }
}

/* ===== ŁADOWANIE DANYCH Z GENERATORA ===== */

function loadReadyData(result){

  const birthdayDate = new Date();
  birthdayDate.setFullYear(result["year"], result["month"]-1, result["day"]);

  let day = birthdayDate.getDate();
  let month = birthdayDate.getMonth()+1;
  let year = birthdayDate.getFullYear();

  day = day>9 ? day : "0"+day;
  month = month>9 ? month : "0"+month;

  setData("name", result["name"]?.toUpperCase());
  setData("surname", result["surname"]?.toUpperCase());
  setData("nationality", result["nationality"]?.toUpperCase());
  setData("birthday", day+"."+month+"."+year);

  var pesel = year.toString().substring(2)+month+day+"12345";
  setData("pesel", pesel);
}

/* ===== PARAMETRY Z LINKU ===== */

let result = Object.fromEntries(params);

if(Object.keys(result).length>0){
  loadReadyData(result);
}

/* ===== ŁADOWANIE ZDJĘCIA (NAPRAWA) ===== */

document.addEventListener("DOMContentLoaded", function(){

  var image = localStorage.getItem("image");

  if(image){

    var container = document.querySelector(".id_own_image");

    if(container){

      container.innerHTML = "";

      var img = document.createElement("img");
      img.src = image;

      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      container.appendChild(img);

    }

  }

});

/* ===== AKTUALIZACJA ===== */

var update = document.querySelector(".update");

if(update){

  update.addEventListener("click", ()=>{

    var date = new Date().toLocaleDateString("pl-PL");

    localStorage.setItem("update",date);

    var el = document.querySelector(".bottom_update_value");
    if(el){
      el.innerHTML = date;
    }

  });

}

var last = localStorage.getItem("update");

if(last){
  var el = document.querySelector(".bottom_update_value");
  if(el){
    el.innerHTML = last;
  }
}
