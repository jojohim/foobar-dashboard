import './sass/styles.scss'

window.addEventListener("DOMContentLoaded", start);

//RESULTS FROM FETCH

let ordersResponseArray = [];

//GLOBAL ARRAYS
let queueSelected = true;
let globalQueue =[];
let globalServing = [];

function start() {
  loadJSON();
  document.querySelector(".dateTime").textContent = convertTime(new Date);
}

async function loadJSON(){
  const dataResponse = await fetch("https://carrotsfoobar.herokuapp.com/");
  const JSONdata = await dataResponse.json();

  //once fetched, prepare data
  handleData(JSONdata);
}

function handleData(JSONdata){

  console.log(JSONdata);
  const orders = JSONdata.queue;
  const serving = JSONdata.serving;

  //FOR EACH ORDER SET ATTRIBUTES AND THEN PUSH TO GLOBAL ARRAY
  ////for queue
  orders.forEach(order => {
    const queueItem = getItems(order);
    globalQueue.push(queueItem);
});
  ////for serving 

  serving.forEach(serving => {
    const servingItem = getItems(serving);
    globalServing.push(servingItem);
  })
  //HANDLE ORDERS

  //call handle order every few seconds

  function handleOrders(){

  document.querySelector(".queueFilter").value = `Queue (${globalQueue.length})`;
  document.querySelector(".servingFilter").value = `Serving (${globalServing.length})`;
  if (queueSelected){
  globalQueue.forEach(displayOrder);
  document.querySelector(".servingFilter").classList.remove("active");
  document.querySelector(".queueFilter").classList.add("active"); //for each order display
  } else{
    document.querySelector("#orders .orderList").innerHTML = "";
    globalServing.forEach(displayOrder);
    document.querySelector(".servingFilter").classList.add("active");
    document.querySelector(".queueFilter").classList.remove("active");
  }

  if (orders.length == 0 && queueSelected){
    document.getElementById("noOrdersPlaceholder").classList.remove("hidden");
  } else{
    document.getElementById("noOrdersPlaceholder").classList.add("hidden");
  } 
}

setInterval(handleOrders, 10000)
handleOrders();

  //HANDLE TAPS
  const taps = JSONdata.taps;
  taps.forEach(makeChartFromTaps);

  function handleBartenders(){
    document.querySelector("#bartenderCards").innerHTML = "";
  const bartenders = JSONdata.bartenders;
  bartenders.forEach(displayBartender);
  }
  setInterval(handleBartenders, 5000)
handleBartenders();

//HANDLE KEG STORAGE
const kegs = JSONdata.storage
kegs.forEach(displayKegStorage);
}

function getItems(order){

  //call clean order to clean up order
  return {
    timestamp: convertTime(order.startTime),
    order: order.order,
    tableNumber: Math.floor(Math.random() * 5) + 1,
    total: order.order.length,
  }
}


function displayBartender(bartender){
  //create clone
  const copy = document.querySelector("template#bartenderCard").content.cloneNode(true);
  //populate clone
  copy.querySelector(".bartenderStatus").textContent = bartender.status;
  copy.querySelector(".bartenderName").textContent = bartender.name;
  copy.querySelector(".bartenderServing").textContent = bartender.servingCustomer;
  copy.querySelector(".bartenderPhoto").src = "user.svg";
  //append 
  document.querySelector("#bartenderCards").appendChild(copy);
}

function displayOrder(order){

  //create clone
  const copy = document.querySelector("template#orderCard").content.cloneNode(true);
  //populate clone
  copy.querySelector(".tableNumber").textContent = `Table: ${order.tableNumber}`; //random number between 1 & 5
  copy.querySelector(".timestamp").textContent = order.timestamp;

  ////////to do: for each type of beer only display once and then show amount
  copy.querySelector(".order").textContent = `${order.order}`;

  copy.querySelector(".orderTotal").textContent = `Total: ${order.total}`;
  //append 
  document.querySelector("#orders .orderList").appendChild(copy);

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

function displayKegStorage(keg){
  console.log(keg)
  //CREATE COPY
  const copy = document.querySelector("template#kegStorage").content.cloneNode(true);

  //POPULATE
  copy.querySelector(".kegName").textContent = keg.name;
  copy.querySelector(".kegAmount").textContent = keg.amount;

  //APPEND
  document.getElementById("kegs").appendChild(copy);
}
function makeChartFromTaps(tap) {

 //CREATE COPY
 
 const copy = document.querySelector("template#tapChart").content.cloneNode(true);
 //give id to each
 copy.querySelector(".tap").dataset.id = tap.id;
 //POPULATE COPY

 ///FOR LABELLING

 const tapLevelInPints = tap.level/10;
 copy.querySelector(".tapName").textContent = tap.beer;
 copy.querySelector(".tapAmount").textContent = `${tapLevelInPints} Pints`;
 ///FOR CHART
 /////setup
 
 const data = {
 datasets: [{
 label: tap.beer,
 data: [tapLevelInPints, 250-tapLevelInPints],
 backgroundColor: [getColorForChart(), "transparent"],
 borderWidth: 1,
 borderColor: "#E4E0FF",
 }],
 };


  function getColorForChart(){
    if(tapLevelInPints >= 100){
      return "rgba(88,221,107,1.0)";
    } else if(tapLevelInPints < 100 && tapLevelInPints >= 50){
      return "rgba(229,186,88,1.0)";
    } else if(tapLevelInPints < 50){
      return "rgba(221,114,88,1.0)"};
  }

 //////config
 
 const config = {
 type: "doughnut",
 data: data,
 options: {
  cutout: "75%",
 }
 };

 //APPEND CHILD
 document.querySelector("#taps").appendChild(copy);
 
 /////render
 
 var Tap = new Chart(
 document.querySelector(`.tap[data-id="${tap.id}"]`),
 config
 );
 }



