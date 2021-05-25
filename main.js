import "./sass/styles.scss";

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
let queueSelected = true;
let globalQueue = [];
let globalServing = [];
let globalTapLevels = [];
let globalBartenders = [];
let globalBeers = [];
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


// Individual listeners
function setServeOrderListner(copy) {
  const button = copy.querySelector(".serveButton");

  button.addEventListener("click", function () { //when serve is clicked 
    const id = parseInt(button.dataset.id); //get id of button
    const element = button.parentElement; //get parent element , i.e. order of button 
    let order;

    function getOrder(globalOrder) {
      if (globalOrder.id === id) { //if the global order id is equal to id clicked 
        return globalOrder; //return that specific order
      }
    }

    if (queueSelected) { //if queue is selected
      if (globalBartenders.some(bartender => bartender.status === "READY")) { //if some bartenders are READY
        order = globalQueue.find(getOrder);  //go through globalQueue and find order
        const index = globalQueue.findIndex(getOrder); //find index of the order
        globalQueue.splice(index, 1); //splice from queue
        globalServing.push(order); //add to serving
        updateBartender(order, false); //update the bartender from ready to busy
        element.remove(); 
      }
    } else {
      order = globalServing.find(getOrder); //if all bartenders are working do this
      const index = globalServing.findIndex(getOrder);
      globalServing.splice(index, 1);
      updateTapLevels(order);
      updateBartender(order, true);
      element.remove();
    }
  });
}

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

function optionChangeListener(){
beerDropdown.addEventListener("change", function (){
  document.querySelector("#beerInfoContainer").innerHTML = "";
  checkBeer(event);
});
}

function checkBeer(event){
//document.querySelectorAll(".beerInfoCard").classList.toggle("hidden");
filter = beerDropdown.options[beerDropdown.selectedIndex].value;
globalBeers.forEach((beer) => {
  if(beer.name == filter){
    displayBeer(beer);
  } else{
    return
  }
})
}


function updateTapLevels(order) {
  // Go through each beer in order and update the global 
  // tap levels if the beer names match
  order.order.forEach((orderBeer) => {
    globalTapLevels = globalTapLevels.map(tapBeer => {
      let newTapBeer = {...tapBeer};
      if (tapBeer.beer === orderBeer.name) {
        newTapBeer = {
          ...newTapBeer,
          level: newTapBeer.level - orderBeer.amount * 10
        };
      } 
      return newTapBeer;
    });
  });
}

function updateBartender(order, isWorking) {
  let newBartendersState;
  if (isWorking) {
    newBartendersState = globalBartenders.map(bartender => ({
      ...bartender,
      servingCustomer: bartender.servingCustomer === order.id ? null : bartender.servingCustomer,
      status: bartender.servingCustomer === order.id ? 'READY' : bartender.status
    }));
  } else {
    let bartenderFound = false;

    newBartendersState = globalBartenders.map(bartender => {
      if (bartender.status === 'READY' && !bartenderFound) {
        bartenderFound = true;
        return {
          ...bartender,
          servingCustomer: order.id,
          status: 'WORKING'
        }
      } else {
        return bartender;
      }
    });
  }

  globalBartenders = newBartendersState;
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

function handleBeerInfo(JSONbeers){

  //FOR EACH ORDER SET ATTRIBUTES AND THEN PUSH TO GLOBAL ARRAY
  ////for queue
  console.log(JSONbeers);
  JSONbeers.forEach((beer) => {
    const beerItem = getBeerInfo(beer);
    globalBeers.push(beerItem);
  });

  displayBeer(globalBeers[0]);
}

function getBeerInfo(beer){
  return {
    name: beer.name,
    category: beer.category,
    ranking: beer.popularity,
    alcLevel: beer.alc,
    description: beer.description.overallImpression,
  };
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
function setOrders(data) {
  const orders = data.queue;
  const serving = data.serving;

  //FOR EACH ORDER SET ATTRIBUTES AND THEN PUSH TO GLOBAL ARRAY
  ////for queue
  orders.forEach((order) => {
    const queueItem = getItems(order);
    globalQueue.push(queueItem);
  });
  ////for serving
  serving.forEach((serving) => {
    const servingItem = getItems(serving);
    globalServing.push(servingItem);
  });
}

function setTapLevels(data) {
  globalTapLevels = data.taps;
}

function setBartenders(data) {
  globalBartenders = data.bartenders;
}

function handleOrders() {
  document.querySelector(".queueFilter").value = `Queue (${globalQueue.length})`;
  document.querySelector(".servingFilter").value = `Serving (${globalServing.length})`;
  if (queueSelected) {
    document.querySelector("#orders .orderList").innerHTML = "";
    globalQueue.forEach((order) => displayOrder(order, true));
    document.querySelector(".servingFilter").classList.remove("active");
    document.querySelector(".queueFilter").classList.add("active"); //for each order display
  } else {
    document.querySelector("#orders .orderList").innerHTML = "";
    globalServing.forEach((order) => displayOrder(order, false));
    document.querySelector(".servingFilter").classList.add("active");
    document.querySelector(".queueFilter").classList.remove("active");
  }

  if (orders.length == 0 && queueSelected) {
    document.getElementById("noOrdersPlaceholder").classList.remove("hidden");
  } else {
    document.getElementById("noOrdersPlaceholder").classList.add("hidden");
  }
}

function handleBartenders() {
  document.querySelector("#bartenderCards").innerHTML = "";
  const bartenders = globalBartenders;
  bartenders.forEach(displayBartender);
}

function handleData(JSONdata) {
  setOrders(JSONdata);
  setTapLevels(JSONdata);
  setBartenders(JSONdata);

  //HANDLE ORDERS
  setInterval(handleOrders, 1000);
  handleOrders();

  //HANDLE TAPS
  globalTapLevels.forEach(makeChartFromTaps);

  // HANDLE BARTENDERS
  setInterval(handleBartenders, 1000);
  handleBartenders();

  //HANDLE KEG STORAGE
  const kegs = JSONdata.storage;
  kegs.forEach(displayKegStorage);
}

function getItems(order) {
  //create new cleaned up order with amount and type of beer filtered
  const uniqueArray = [...new Set(order.order)];
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
    copy = document
      .querySelector("template#orderCardQueue")
      .content.cloneNode(true);
  } else {
    copy = document
      .querySelector("template#orderCardServe")
      .content.cloneNode(true);
  }

  //populate clone
  copy.querySelector(".tableNumber").textContent = `Table: ${order.tableNumber}`; //random number between 1 & 5
  copy.querySelector(".timestamp").textContent = order.timestamp;
  ////////to do: for each type of beer only display once and then show amount

  const ul = document.createElement('ul');
  order.order.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.name} ...... ${order.amount}`;
    ul.appendChild(li);
  })

  copy.querySelector(".order").appendChild(ul);
  copy.querySelector(".orderTotal").textContent = `Total: ${order.total}`;
  copy.querySelector(".serveButton").dataset.id = order.id;

  //append
  setServeOrderListner(copy);
  document.querySelector("#orders .orderList").appendChild(copy);
}

//DISPLAY CURRENT TIME IN CORNER
function getCurrentTime() {
  document.querySelector(".dateTime").textContent = convertTime(new Date());
}

setInterval(getCurrentTime, 1000);
getCurrentTime();

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
