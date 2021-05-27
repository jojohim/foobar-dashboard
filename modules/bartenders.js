
let globalBartenders = [];

export function handleBartenders(bartenders) {

    //push bartenders to global Array
    globalBartenders = bartenders;
  
    //make inner HTML nothing
    document.querySelector("#bartenderCards").innerHTML = "";
  
    //for each bartender in global array display
    globalBartenders.forEach(displayBartender);
  }

export function displayBartender(bartender) {
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