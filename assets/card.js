var confirmElement = document.querySelector(".confirm");
var time = document.getElementById("time");

/* ===== DATA AKTUALIZACJI ===== */

if (localStorage.getItem("update") == null) {
  localStorage.setItem("update", "24.12.2024");
}

var date = new Date();

var updateText = document.querySelector(".bottom_update_value");
if(updateText){
updateText.innerHTML = localStorage.getItem("update");
}

var update = document.querySelector(".update");

if(update){
update.addEventListener("click", () => {

  var newDate = date.toLocaleDateString("pl-PL");

  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;

  scroll(0,0);

});
}

/* ===== ZEGAR ===== */

setClock();

function setClock(){

  date = new Date();

  if(time){
  time.innerHTML =
  "Czas: " +
  date.toLocaleTimeString("pl-PL") +
  " " +
  date.toLocaleDateString("pl-PL");
  }

  setTimeout(setClock,1000);

}

/* ===== ROZWIJANIE DODATKOWYCH DANYCH ===== */

var unfold = document.querySelector(".info_holder");

if(unfold){
unfold.addEventListener("click",()=>{

  if(unfold.classList.contains("unfolded")){
  unfold.classList.remove("unfolded");
  }
  else{
  unfold.classList.add("unfolded");
  }

});
}

/* ===== POBIERANIE DANYCH Z LINKU ===== */

var params = new URLSearchParams(window.location.search);

function loadReadyData(result){

Object.keys(result).forEach((key)=>{
result[key]=htmlEncode(result[key]);
});

const birthdayDate = new Date();

birthdayDate.setFullYear(result["year"], result["month"]-1, result["day"]);

var sex = result["sex"];

let day = birthdayDate.getDate();
let month = birthdayDate.getMonth()+1;
let year = birthdayDate.getFullYear();

var textSex;

if(sex==="m"){
textSex="Mężczyzna";
}else{
textSex="Kobieta";
}

/* ===== SERIA I NUMER ===== */

var seriesAndNumber = localStorage.getItem("seriesAndNumber");

if(!seriesAndNumber){

seriesAndNumber="";

var chars="ABCDEFGHIJKLMNOPQRSTUWXYZ".split("");

for(var i=0;i<4;i++){
seriesAndNumber+=chars[Math.floor(Math.random()*chars.length)];
}

seriesAndNumber+=" ";

for(var i=0;i<5;i++){
seriesAndNumber+=Math.floor(Math.random()*9);
}

localStorage.setItem("seriesAndNumber",seriesAndNumber);

}

day = day>9 ? day : "0"+day;
month = month>9 ? month : "0"+month;

setData("seriesAndNumber",seriesAndNumber);
setData("name",result["name"].toUpperCase());
setData("surname",result["surname"].toUpperCase());
setData("nationality",result["nationality"].toUpperCase());

setData("fathersName","WOJCIECH");
setData("mothersName","AGATA");

setData("birthday",day+"."+month+"."+year);

setData("familyName",result["familyName"]);
setData("sex",textSex);

setData("fathersFamilyName",result["fathersFamilyName"]);
setData("mothersFamilyName",result["mothersFamilyName"]);

setData("birthPlace",result["birthPlace"]);
setData("countryOfBirth",result["countryOfBirth"]);

setData(
"adress",
"ul. "+
result["address1"]+
"<br>"+
result["address2"]+
" "+
result["city"]
);

/* ===== DATY ===== */

var givenDate = new Date(birthdayDate);
givenDate.setFullYear(givenDate.getFullYear()+18);

setData("givenDate",givenDate.toLocaleDateString("pl-PL"));

var expiryDate = new Date(givenDate);
expiryDate.setFullYear(expiryDate.getFullYear()+10);

setData("expiryDate",expiryDate.toLocaleDateString("pl-PL"));

/* ===== PESEL ===== */

if(parseInt(year)>=2000){
month=20+parseInt(month);
}

var later;

if(sex==="m"){
later="0295";
}else{
later="0382";
}

if(day<10) day="0"+day;
if(month<10) month="0"+month;

var pesel = year.toString().substring(2)+month+day+later+"7";

setData("pesel",pesel);

}

/* ===== ZAŁADOWANIE DANYCH ===== */

let result = Object.fromEntries(params);

if(Object.keys(result).length>0){
loadReadyData(result);
}

/* ===== ŁADOWANIE ZDJĘCIA (NAPRAWIONE) ===== */

function loadImage(){

var image = localStorage.getItem("image");

if(image){
setImage(image);
}

}

function setImage(image){

var img = document.querySelector(".id_own_image");

if(img){
img.style.backgroundImage = "url('"+image+"')";
img.style.backgroundSize = "cover";
img.style.backgroundPosition = "center";
}

}

loadImage();

/* ===== USTAWIANIE DANYCH ===== */

function setData(id,value){

var el = document.getElementById(id);

if(el){
el.innerHTML=value;
}

}
