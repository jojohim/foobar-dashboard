import "./sass/styles.scss";
import {optionChangeListener, handleBeerInfo} from './modules/beerInfo.js'
import {handleBartenders} from './modules/bartenders.js'
import {handleTaps} from './modules/taps.js'
import {convertTime, setToggleOrdersListener, handleOrders} from './modules/orders.js'
import {handleKegStorage} from './modules/kegs.js'
import {headers} from './modules/settings.js'
import {getBarStatus} from './modules/getData.js'


window.addEventListener("DOMContentLoaded", start);

//GLOBAL ARRAYS

function start() {
  loadJSON();
  setEventListeners();
  setTimeAndDate();
  getNotes();

    //to get dynamic JSON data
    const url = "https://carrotsfoobar.herokuapp.com/";
    let newData = await getBarStatus(url);
    let oldData = [];
}

async function getBarStatus(url){
  const headers = {
    "Conent-Type": "application/json", 
  };

}
// Adding all listeners
function setEventListeners() {
  setToggleOrdersListener();
  optionChangeListener();
}

async function loadJSON() {
  /*const dataResponse = await fetch("https://carrotsfoobar.herokuapp.com/");
  const JSONdata = await dataResponse.json();*/

  const beerInfoResponse = await fetch ("https://carrotsfoobar.herokuapp.com/beertypes");
  const JSONbeers = await beerInfoResponse.json();

  //once fetched, prepare data
  handleData(JSONdata);
  handleBeerInfo(JSONbeers);
}

async function getNotes(){
  const notesResponse = await fetch("https://kea2021-6773.restdb.io/rest/foobar-notes", {
    method: "get",
    headers: headers,});
  const JSONnotes = await notesResponse.json();

  handleNotes(JSONnotes);
}

function handleNotes(notes){
  notes.forEach(displayNote);
}

function displayNote(note){
//make copy
const copy = document.querySelector("template#noteTemplate").content.cloneNode(true);
//populate 
copy.querySelector(".noteHeader").textContent = `${note.name} at ${note.date}`;
copy.querySelector(".noteText").textContent = note.text;
//append
document.getElementById("notesContainer").appendChild(copy);

//setInterval(function(){ console.log("cleared"); document.getElementById("notesContainer").innerHTML = "";}, 4000);
}

function handleData(JSONdata) {
  console.log(JSONdata)
  //HANDLE ORDERS
  setInterval(function(){handleOrders(JSONdata)}, 4000);
  handleOrders(JSONdata);

  //HANDLE TAPS
  handleTaps(JSONdata.taps);


  //HANDLE BARTENDERS
  setInterval(function(){handleBartenders(JSONdata.bartenders)}, 5000);
  handleBartenders(JSONdata.bartenders);

  //HANDLE KEG STORAGE
  setInterval(function(){handleKegStorage(JSONdata.storage)}, 5000);
  handleKegStorage(JSONdata.storage);
}

////////DATE AND TIME CONVERSIONS////////////

function setTimeAndDate(){
  setInterval(getCurrentTime, 1000);
  getCurrentTime();
}

function getCurrentTime() {
  document.querySelector(".dateTime").textContent = convertTime(new Date());
}


//MEDIA QUERIES

const ordersShowing = false;
const orderSection = document.querySelector("#orders");
const showHideOrdersButton = document.querySelector("#showHideOrders")
const mediaQuery = window.matchMedia('(max-width: 1100px)');

showHideOrdersButton.addEventListener("click", showHideOrders);
function handleMobileChange(e){
  if(e.matches){
    orderSection.classList.add("hidden");
    showHideOrdersButton.classList.remove("hidden");
  } else{
    orderSection.classList.remove("hidden");
    showHideOrdersButton.classList.add("hidden");
  }
}

function showHideOrders(){
orderSection.classList.toggle("hidden");
if (showHideOrdersButton.innerHTML == "Show Orders"){
  showHideOrdersButton.innerHTML = "Hide Orders"
} else {
  showHideOrdersButton.innerHTML = "Show Orders";
}
}

mediaQuery.addListener(handleMobileChange);
handleMobileChange(mediaQuery);

