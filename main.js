import "./sass/styles.scss";
import {optionChangeListener, handleBeerInfo} from './modules/beerInfo.js'
import {handleBartenders} from './modules/bartenders.js'
import {handleTaps} from './modules/taps.js'
import {convertTime, setToggleOrdersListener, handleOrders} from './modules/orders.js'
import {handleKegStorage} from './modules/kegs.js'
import {getBarStatus, getNotes} from './modules/getData.js'
import {handleNotes} from './modules/notes'

window.addEventListener("DOMContentLoaded", start);

//GLOBAL ARRAYS

async function start() {
  loadJSON();
  setEventListeners();
  setTimeAndDate();

  const jsonURL = "https://carrotsfoobar.herokuapp.com/";
  let newData = await getBarStatus(jsonURL);
  let oldData = [];

  const notesURL = "https://kea2021-6773.restdb.io/rest/foobar-notes";
  let newNotes = await getNotes(notesURL);

  //set intital data
  handleInitData(newData);
  handleNotes(newNotes);

  //set global interval to update data 
  setInterval(updateDataArrays, 5000);

  async function updateDataArrays(){
  
  //update new data and set old data to oldData
  oldData = newData;
  newData = await getBarStatus(jsonURL);

  //remove, update and add data by comparing the two
    //ORDERS
    handleOrders(newData);

    //BARTENDERS
    handleBartenders(newData.bartenders);

    //KEG STORAGE 
    handleKegStorage(newData.storage);

    //TAPS 
    handleTaps(newData.taps)
  }
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
  const JSONbeers = await beerInfoResponse.json()


  //once fetched, prepare data
  handleBeerInfo(JSONbeers);
}

function handleInitData(newData) {

  //HANDLE ORDERS
  handleOrders(newData);

  //HANDLE TAPS
  handleTaps(newData.taps);

  //HANDLE BARTENDERS
  handleBartenders(newData.bartenders);

  //HANDLE KEG STORAGE
  handleKegStorage(newData.storage);
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

