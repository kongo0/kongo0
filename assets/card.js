var confirmElement = document.querySelector(".confirm");
var time = document.getElementById("time");

/* ===== ZEGAR ===== */

function setClock(){

var date = new Date();

if(time){
time.innerHTML =
"Czas: " +
date.toLocaleTimeString("pl-PL") +
" " +
date.toLocaleDateString("pl-PL");
}

setTimeout(setClock,1000);

}

setClock();

/* ===== PARAMETRY ===== */

var params = new URLSearchParams(window.location.search);

/* ===== USTAWIANIE DANYCH ===== */

function setData(id,value){

var el = document.getElementById(id);

if(el){
el.innerHTML=value;
}

}

/* ===== ŁADOWANIE DANYCH ===== */

function loadReadyData(result){

const birthdayDate = new Date();

birthdayDate.setFullYear(result["year"],result["month"]-1,result["day"]);

let day=birthdayDate.getDate();
let month=birthdayDate.getMonth()+1;
let year=birthdayDate.getFullYear();

day = day>9 ? day : "0"+day;
month = month>9 ? month : "0"+month;

/* dane podstawowe */

setData("name",result["name"]?.toUpperCase());
setData("surname",result["surname"]?.toUpperCase());
setData("nationality",result["nationality"]?.toUpperCase());
setData("birthday",day+"."+month+"."+year);

/* dodatkowe */

setData("familyName",result["familyName"]);
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

/* płeć */

var sex = result["sex"];

if(sex==="m"){
setData("sex","Mężczyzna");
}else{
setData("sex","Kobieta");
}

/* pesel */

if(parseInt(year)>=2000){
month=20+parseInt(month);
}

var later;

if(sex==="m"){
later="0295";
}else{
later="0382";
}

var pesel =
year.toString().substring(2)+
month+
day+
later+
"7";

setData("pesel",pesel);

/* seria i numer */

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

setData("seriesAndNumber",seriesAndNumber);

/* daty */

var givenDate = new Date(birthdayDate);
givenDate.setFullYear(givenDate.getFullYear()+18);

setData("givenDate",givenDate.toLocaleDateString("pl-PL"));

var expiryDate = new Date(givenDate);
expiryDate.setFullYear(expiryDate.getFullYear()+10);

setData("expiryDate",expiryDate.toLocaleDateString("pl-PL"));

}

/* ===== ZAŁADOWANIE DANYCH ===== */

let result = Object.fromEntries(params);

if(Object.keys(result).length>0){
loadReadyData(result);
}

/* ===== ZDJĘCIE (NAPRAWA) ===== */

document.addEventListener("DOMContentLoaded",function(){

var image = localStorage.getItem("image");

if(image){

var container = document.querySelector(".id_own_image");

if(container){

container.innerHTML="";

var img=document.createElement("img");

img.src=image;

img.style.width="100%";
img.style.height="100%";
img.style.objectFit="cover";

container.appendChild(img);

}

}

});

/* ===== AKTUALIZACJA ===== */

var update=document.querySelector(".update");

if(update){

update.addEventListener("click",()=>{

var date=new Date().toLocaleDateString("pl-PL");

localStorage.setItem("update",date);

document.querySelector(".bottom_update_value").innerHTML=date;

});

}

var last=localStorage.getItem("update");

if(last){
document.querySelector(".bottom_update_value").innerHTML=last;
}
