//variables
let queueSelected = true;
let globalQueue = [];

let globalServing = [];

//let uniqueQueue = [...new Set(...globalQueue)];

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

  globalServing = [];
  document.querySelector(".orderList").innerHTML = "";

  globalQueue = [];
  document.querySelector(".orderList").innerHTML = "";

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
    checkIfUrgent(queueItems);
    displayOrderLength();
    toggleNoOrderPlaceholder();
}

function checkIfServing(){
    if (queueSelected) {
      document.querySelector("#orders h1").textContent = "Queue";
      globalQueue.forEach((order) => displayOrder(order, true));
      document.querySelector(".servingFilter").classList.remove("active");
      document.querySelector("#orders").style.backgroundColor = "rgba(71,140,250,1.0)";
      document.querySelector("#orderNav").style.backgroundColor = "rgba(71,140,250,1.0)";
      document.querySelector(".queueFilter").classList.add("active"); 
    } else {
      document.querySelector("#orders h1").textContent = "Now Serving";
      globalServing.forEach((order) => displayOrder(order, false));
      document.querySelector(".servingFilter").classList.add("active");
      document.querySelector("#orderNav").style.backgroundColor = "rgba(51,106,194,1.0)";
      document.querySelector("#orders").style.backgroundColor = "rgba(51,106,194,1.0)";
      document.querySelector(".queueFilter").classList.remove("active");
    }
  
  }
function toggleNoOrderPlaceholder(){
  if (globalQueue.length == 0 && queueSelected){
      document.querySelector("#noOrdersPlaceholder").classList.remove("hidden");
    } else{
      document.querySelector("#noOrdersPlaceholder").classList.add("hidden");
  }
}

function displayOrderLength(){
    document.querySelector(".queueFilter").value = `Queue (${globalQueue.length})`;
    document.querySelector(".servingFilter").value = `Serving (${globalServing.length})`;
}

function getOrderItems(order) {
    ////remove duplicate sets from array 
    const uniqueArray = [...new Set(order.order)];
    ////for each new set item break up components
    const parsedOrder = uniqueArray.map(item => ({
    //create new clean object with amount and name separate
      name: item,
      amount: order.order.filter(order => order === item).length
    }));
    //return order with cleaned objects
    return {
      id: order.id,
      timestamp: order.startTime,
      parsedTime: convertTime(order.startTime),
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
    copy.querySelector(".tableNumber").textContent = `Table: ${order.tableNumber}`; //random number between 1 & 5 `#${order.id}`
    copy.querySelector(".timestamp").textContent = order.parsedTime;
    copy.querySelector(".orderContainer").dataset.id = order.id;
  
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

  function checkIfUrgent(queueItems){
    queueItems.forEach(function(order) { 
      const timeDifference = ((Date.now() - order.startTime) / 6000).toFixed(1);
      console.log(timeDifference)
      if(timeDifference > 10){
      document.querySelector(`#orders [data-id="${order.id}"]`).classList.add("urgent");
      } else {
        return;
      }
    });
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