import "./sass/styles.scss";
import {optionChangeListener, handleBeerInfo} from './modules/beerInfo.js'
import {handleBartenders} from './modules/bartenders.js'
import {handleTaps} from './modules/taps.js'
import {convertTime, setToggleOrdersListener, handleOrders} from './modules/orders.js'
import {handleKegStorage} from './modules/kegs.js'
import {getBarStatus} from './modules/helpers.js'
import {handleNotes, sortNotes, postNoteListener, getNotes} from './modules/notes'

window.addEventListener("DOMContentLoaded", start);

async function start() {
  loadJSON();
  setEventListeners();
  setTimeAndDate();

  const jsonURL = "https://carrotsfoobar.herokuapp.com/";
  let newData = await getBarStatus(jsonURL);

  const notesURL = "https://kea2021-6773.restdb.io/rest/foobar-notes";
  let newNotes = await getNotes(notesURL);
  let sortedNotes = sortNotes(newNotes);

  //set intital data
  handleInitData(newData);
  handleNotes(sortedNotes);

  //interval to update data 
  setInterval(updateDataArrays, 4000);
  setInterval(updateNotes, 4000);

  async function updateDataArrays(){
  
  //update new data and set old data to oldData
  newData = await getBarStatus(jsonURL);
    //ORDERS
    handleOrders(newData);
    //BARTENDERS
    handleBartenders(newData.bartenders);
    //KEG STORAGE 
    handleKegStorage(newData.storage);
    //TAPS 
    handleTaps(newData.taps)
  }

  async function updateNotes(){
    newNotes = await getNotes(notesURL);
    sortedNotes = sortNotes(newNotes);
    handleNotes(sortedNotes);
  }
}

// Adding all listeners
function setEventListeners() {
  setToggleOrdersListener();
  optionChangeListener();
  postNoteListener();
}

async function loadJSON() {

  const beerInfoResponse = await fetch ("https://carrotsfoobar.herokuapp.com/beertypes");
  const JSONbeers = await beerInfoResponse.json();

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


////////////MEDIA QUERIES//////////////

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

