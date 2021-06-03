import "./sass/styles.scss";
import {optionChangeListener, handleBeerInfo} from './modules/beerInfo.js'
import {handleBartenders} from './modules/bartenders.js'
import {handleTaps} from './modules/taps.js'
import {convertTime, setToggleOrdersListener, handleOrders} from './modules/orders.js'
import {handleKegStorage} from './modules/kegs.js'

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "cache-control": "no-cache",
};

window.addEventListener("DOMContentLoaded", start);

//GLOBAL ARRAYS

function start() {
  loadJSON();
  setEventListeners();
  setTimeAndDate();
}

// Adding all listeners
function setEventListeners() {
  setToggleOrdersListener();
  optionChangeListener();
}

async function loadJSON() {
  const dataResponse = await fetch("https://carrotsfoobar.herokuapp.com/");
  const JSONdata = await dataResponse.json();
  const beerInfoResponse = await fetch ("https://carrotsfoobar.herokuapp.com/beertypes");
  const JSONbeers = await beerInfoResponse.json()

  //once fetched, prepare data
  handleData(JSONdata);
  handleBeerInfo(JSONbeers);
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

