import "./sass/styles.scss";
import {getBeerInfo} from './modules/beerInfo.js'

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "cache-control": "no-cache",
};

window.addEventListener("DOMContentLoaded", start);

// Pretty arrow function
// const setEventListeners = () => {

// }

//RESULTS FROM FETCH

let ordersResponseArray = [];

//GLOBAL ARRAYS
////for orders 
let queueSelected = true;
let globalQueue = [];
let globalServing = [];
let globalTapLevels = [];
let globalBartenders = [];
let globalBeers = [];

//variables for beer info section
let beerDropdown =  document.querySelector("#beerTypeDropDown");
let filter;


function start() {
  loadJSON();
  setEventListeners();
}


// Adding all listeners
function setEventListeners() {
  setToggleOrdersListeners();
  optionChangeListener();
}

function convertTime(epoch) {
  ///////to do: make time look pretty
  const time = new Date(epoch);
  const dd = String(time.getDate()).padStart(2, "0");
  const mm = String(time.getMonth() + 1).padStart(2, "0");
  const year = time.getFullYear();
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const editedTime = `${dd}-${mm}-${year}, ${hours}:${minutes}`;

  return editedTime;
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
  console.log(JSONdata);

  //HANDLE ORDERS
  setInterval(function(){handleOrders(JSONdata)}, 5000);
  handleOrders(JSONdata);

  //HANDLE TAPS
  //setInterval(function(){handleTaps(JSONdata.taps)}, 5000);
  handleTaps(JSONdata.taps);

  // HANDLE BARTENDERS
  setInterval(function(){handleBartenders(JSONdata.bartenders)}, 5000);
  handleBartenders(JSONdata.bartenders);

  //HANDLE KEG STORAGE
  const kegs = JSONdata.storage;
  kegs.forEach(displayKegStorage);
}

function handleOrders(JSONdata) { 
    //empty serving array
    globalServing = [];
    //globalQueue = [];
  
    //set variables
    const queueItems = JSONdata.queue;
    const servingItems = JSONdata.serving;
  
    //FOR EACH ORDER SET ATTRIBUTES AND THEN PUSH TO GLOBAL ARRAY
    ////for queue
    queueItems.forEach((queue) => {
      const queueItem = getOrderItems(queue);
      globalQueue.push(queueItem);
    });
    ////for serving
    servingItems.forEach((serving) => {
      const servingItem = getOrderItems(serving);
      globalServing.push(servingItem);
    });
  
    if (queueSelected) {
      document.querySelector(".orderList").innerHTML = "";
      globalQueue.forEach((order) => displayOrder(order, true));
      document.querySelector(".servingFilter").classList.remove("active");
      document.querySelector(".queueFilter").classList.add("active"); //for each order display
    } else {
      document.querySelector(".orderList").innerHTML = "";
      globalServing.forEach((order) => displayOrder(order, false));
      document.querySelector(".servingFilter").classList.add("active");
      document.querySelector(".queueFilter").classList.remove("active");
    }
  
    console.log(globalQueue.length);
    document.querySelector(".queueFilter").value = `Queue (${globalQueue.length})`;
    document.querySelector(".servingFilter").value = `Serving (${globalServing.length})`;
  
  }
  
  // Individual listeners
  function setToggleOrdersListeners() {
    const buttons = document.querySelectorAll(".orderStatusFilter");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!button.classList.contains("selected")) {
          buttons.forEach(function (button) {
            button.classList.remove("selected");
          });
  
          button.classList.add("selected");
          queueSelected = !queueSelected;
        }
      });
    });
  }
  
  function getOrderItems(order) {
    //create new cleaned up order with amount and type of beer filtered
    ////remove multiple sets from array 
    const uniqueArray = [...new Set(order.order)];
    ////for each new set item break up components to create cleaned up order
    const parsedOrder = uniqueArray.map(item => ({
      name: item,
      amount: order.order.filter(order => order === item).length
    }));
  
    return {
      id: order.id,
      timestamp: convertTime(order.startTime),
      order: parsedOrder,
      tableNumber: Math.floor(Math.random() * 5) + 1,
      total: order.order.length,
    };
  }

//STATIC BEER INFO

function optionChangeListener(){
beerDropdown.addEventListener("change", function (){
  document.querySelector("#beerInfoContainer").innerHTML = "";
  checkBeer();
});
}

function checkBeer(){
filter = beerDropdown.options[beerDropdown.selectedIndex].value;
globalBeers.forEach((beer) => {
  if(beer.name == filter){
    displayBeer(beer);
  } else{
    return
  }
})
}

function handleBeerInfo(JSONbeers){

  //FOR EACH ORDER SET ATTRIBUTES AND THEN PUSH TO GLOBAL ARRAY
  ////for queue
  JSONbeers.forEach((beer) => {
    const beerItem = getBeerInfo(beer);
    globalBeers.push(beerItem);
  });

  displayBeer(globalBeers[0]);
}


function displayBeer(beer){
  const copy = document.getElementById("beerInfoTemplate").content.cloneNode(true);

  copy.querySelector(".beerName").textContent = beer.name;
  copy.querySelector(".beerCategory").textContent = `Style: ${beer.category}`;
  copy.querySelector(".beerFlavor").textContent = beer.description;
  copy.querySelector(".alcPercentage").textContent = `${beer.alcLevel}%`;
  copy.querySelector(".ranking").textContent = `#${beer.ranking}`;
  copy.querySelector(".labelIcon").src = `${cleanBeerName(beer.name)}.png`

  document.querySelector("#beerInfoContainer").appendChild(copy);
}

function cleanBeerName(beerName){
  const cleanedName = beerName.toLowerCase().replaceAll(' ', '');
  return cleanedName;
}

function handleBartenders(bartenders) {

  //push bartenders to global Array
  globalBartenders = bartenders;

  //make inner HTML nothing
  document.querySelector("#bartenderCards").innerHTML = "";

  //for each bartender in global array display
  globalBartenders.forEach(displayBartender);
}

function displayBartender(bartender) {
  //create clone
  const copy = document.querySelector("template.bartenderCard").content.cloneNode(true);
  //populate clone

  copy.querySelector(".bartenderStatus").textContent = getStatus();
  copy.querySelector(".bartenderName").textContent = bartender.name;
  copy.querySelector(".bartenderPhoto").src = "user.svg";

  /////change colour of status
  copy.querySelector(".bartenderStatus").style.color = getColorForStatus();

  function getColorForStatus() {
    if (bartender.status == "WORKING") {
      return "rgba(221,114,88,1.0)";
    } else {
      return "rgba(88,221,107,1.0)";
    }
  }

  function getStatus(){
    if(bartender.status == "WORKING"){
      return "Busy";
    } else {
      return "Ready";
    }
  }
  //append
  document.querySelector("#bartenderCards").appendChild(copy);
}

function displayOrder(order, isQueue) {
  //create clone
  let copy;
  if (isQueue) {
    copy = document.querySelector("template#orderCardQueue").content.cloneNode(true);
  } else {
    copy = document.querySelector("template#orderCardServe").content.cloneNode(true);
  }

  //populate clone
  copy.querySelector(".tableNumber").textContent = `Table: ${order.tableNumber}`; //random number between 1 & 5
  copy.querySelector(".timestamp").textContent = order.timestamp;
  ////////to do: for each type of beer only display once and then show amount

  const ul = document.createElement('ul');
  order.order.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.name} ............................ ${order.amount}`;
    ul.appendChild(li);
  })

  copy.querySelector(".order").appendChild(ul);
  copy.querySelector(".orderTotal").textContent = `Total: ${order.total}`;
  copy.querySelector(".serveButton").dataset.id = order.id;

  //append
  document.querySelector("#orders .orderList").appendChild(copy);
}

//DISPLAY CURRENT TIME IN CORNER
function getCurrentTime() {
  document.querySelector(".dateTime").textContent = convertTime(new Date());
}

setInterval(getCurrentTime, 1000);
getCurrentTime();


function displayKegStorage(keg) {
  //CREATE COPY
  const copy = document.querySelector("template#kegStorage").content.cloneNode(true);

  //POPULATE
  copy.querySelector(".kegName").textContent = keg.name;
  copy.querySelector(".kegAmount").textContent = keg.amount;

  //APPEND
  document.getElementById("kegs").appendChild(copy);
}

function getChartConfig(beer, tapLevelInPints) {
  const data = {
    datasets: [
      {
        label: beer,
        data: [tapLevelInPints, 250 - tapLevelInPints],
        backgroundColor: [getColorForChart(tapLevelInPints), "transparent"],
        borderWidth: 1,
        borderColor: "#E4E0FF",
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      cutout: "75%",
    },
  };

  return config;
}

function handleTaps(taps){
  globalTapLevels = [];
  globalTapLevels = taps;
  globalTapLevels.forEach(makeChartFromTaps);
}

function makeChartFromTaps(tap) {
  //CREATE COPY
  const copy = document
    .querySelector("template#tapChart")
    .content.cloneNode(true);
  //give id to each
  copy.querySelector(".tap").dataset.id = tap.id;
  //POPULATE COPY

  ///FOR LABELLING
  const tapLevelInPints = tap.level / 10;
  copy.querySelector(".tapName").textContent = tap.beer;
  copy.querySelector(".tapAmount").textContent = `${tapLevelInPints} Pints`;


  ///FOR CHART
  //////config
  const config = getChartConfig(tap.beer, tapLevelInPints); 

  //APPEND CHILD
  document.querySelector("#taps").appendChild(copy);

  /////render
  var tapChart = new Chart(
    document.querySelector(`.tap[data-id="${tap.id}"]`),
    config
  );
}

function getColorForChart(level) {
  if (level >= 100) {
    return "rgba(88,221,107,1.0)";
  } else if (level < 100 && level >= 50) {
    return "rgba(229,186,88,1.0)";
  } else if (level < 50) {
    return "rgba(221,114,88,1.0)";
  }
}
