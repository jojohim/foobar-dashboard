import './sass/styles.scss'

window.addEventListener("DOMContentLoaded", start);

//GLOBAL ARRAYS
let queueSelected = true;

function start() {
  loadJSON();
}

async function loadJSON(){
  const dataResponse = await fetch("https://carrotsfoobar.herokuapp.com/");
  const JSONdata = await dataResponse.json();

  //once fetched, prepare data
  handleData(JSONdata);
}

function handleData(JSONdata){

  //HANDLE ORDERS
  console.log(JSONdata);
  const orders = JSONdata.queue;
  const serving = JSONdata.serving;

  document.querySelector(".queueFilter").value = `Queue (${orders.length})`;
  document.querySelector(".servingFilter").value = `Serving (${serving.length})`;

  if (queueSelected){
  orders.forEach(displayOrder); //for each order display
  } else{
    serving.forEach(displayOrder);
  }

  if (orders.length == 0){
    document.getElementById("noOrdersPlaceholder").classList.remove("hidden");
  } //if order is 0 display default

  //HANDLE TAPS
  const taps = JSONdata.taps;
  taps.forEach(makeChartFromTaps);

  //HANDLE BARTENDERS
  const bartenders = JSONdata.bartenders;
  bartenders.forEach(displayBartender);
}

function displayBartender(bartender){
  console.log(bartender);
  //create clone
  const copy = document.querySelector("template#bartenderCard").content.cloneNode(true);
  //populate clone
  copy.querySelector(".bartenderStatus").textContent = bartender.status;
  copy.querySelector(".bartenderName").textContent = bartender.name;
  copy.querySelector(".bartenderServing").textContent = bartender.servingCustomer;
  //append 
  document.querySelector("#bartenders").appendChild(copy);
}

function displayOrder(order){

  //create clone
  const copy = document.querySelector("template#orderCard").content.cloneNode(true);
  //populate clone
  copy.querySelector(".tableNumber").textContent = `Table: ${Math.floor(Math.random() * 5) + 1}`; //random number between 1 & 5
  copy.querySelector(".timestamp").textContent = convertTime(order.startTime);

  ////////to do: for each type of beer only display once and then show amount
  copy.querySelector(".order").textContent = `${order.order}`;

  copy.querySelector(".orderTotal").textContent = `Total: ${order.order.length}`;
  //append 
  document.querySelector("#orders").appendChild(copy);
}


function convertTime(epoch){   
  ///////to do: make time look pretty 
  const time = new Date(epoch);
  const dd = String(time.getDate()).padStart(2, '0'); 
  const mm = String(time.getMonth() + 1).padStart(2, '0');
  const year = time.getFullYear();
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const editedTime = `${dd}-${mm}-${year} ${hours}:${minutes}`
  return editedTime;
}

function makeChartFromTaps(tap){
/*
//CREATE COPY

const copy = document.querySelector("template#tapChart").content.cloneNode(true);

//POPULATE COPY
/////setup

const data = {
  datasets: [{
    label: tap.beer,
    data: [240, 10],
    backgroundColor: [
      'rgba(88,221,107,1.0)',
      'transparent',
    ],
}],
};

//////config

const config = {
  type: 'doughnut',
  data: data,
};

/////render

var Tap = new Chart(
  copy.getElementById('tap'),
  config
  );

//APPEND CHILD
document.querySelector("#taps").appendChild(copy);
*/
}