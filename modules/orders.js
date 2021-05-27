import { displayBeer } from "./beerInfo";

//variables
let queueSelected = true;
let globalQueue = [];
let globalServing = [];
  
  
export function setToggleOrdersListener() {
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

export function handleOrders(JSONdata) { 
    //empty serving array
    globalServing = [];
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

    checkIfServing();
    displayOrderLength();
}

function checkIfServing(){
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
  
  }

function displayOrderLength(){
    console.log(globalQueue.length);
    document.querySelector(".queueFilter").value = `Queue (${globalQueue.length})`;
    document.querySelector(".servingFilter").value = `Serving (${globalServing.length})`;
}

function getOrderItems(order) {
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

//EXPORT TIME FOR ORDERS BUT ALSO FOR GLOBAL CLOCK

export function convertTime(epoch) {
    const time = new Date(epoch);
    const dd = String(time.getDate()).padStart(2, "0");
    const mm = String(time.getMonth() + 1).padStart(2, "0");
    const year = time.getFullYear();
    const hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const editedTime = `${dd}-${mm}-${year}, ${hours}:${minutes}`;
  
    return editedTime;
  }