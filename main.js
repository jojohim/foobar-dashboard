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

  //HANDLE ORDERS
  setInterval(function(){handleOrders(JSONdata)}, 5000);
  handleOrders(JSONdata);

  //HANDLE TAPS
  handleTaps(JSONdata.taps);

  //HANDLE BARTENDERS
  setInterval(function(){handleBartenders(JSONdata.bartenders)}, 5000);
  handleBartenders(JSONdata.bartenders);

  //HANDLE KEG STORAGE
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










