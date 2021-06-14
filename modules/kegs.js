export function handleKegStorage(kegs){
  document.getElementById("kegs").innerHTML = "";
    kegs.forEach(displayKegStorage);
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