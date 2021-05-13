import './styles.scss'

//TEST TEST 

window.addEventListener("DOMContentLoaded", start);

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
  const orders = JSONdata.queue
  orders.forEach(displayOrder) //for each order display

  //HANDLE TAPS
  const taps = JSONdata.taps;
  taps.forEach(makeChartFromTaps);
}

function displayOrder(order){

  //create clone
  const copy = document.querySelector("template#orderCard").content.cloneNode(true);
  //populate clone
  copy.querySelector(".tableNumber").innerHTML = `Table: ${Math.floor(Math.random() * 5) + 1}`; //random number between 1 & 5
  copy.querySelector(".timestamp").textContent = convertTime(order.startTime);
  console.log(convertTime(order.startTime));

  ////////to do: for each type of beer only display once and then show amount
  copy.querySelector(".order").textContent = `${order.order}`;

  copy.querySelector(".orderTotal").textContent = `Total: ${order.order.length}`;
  //append 
  document.querySelector("#orders").appendChild(copy);
}


function convertTime(epoch){   
  ///////to do: make time look pretty  
    return new Date(epoch);
}

function arrangeOrder(){
}

function makeChartFromTaps(tap){

  //create new canvas
  console.log(tap);

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

}