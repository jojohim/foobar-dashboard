export let globalBeers = [];
let beerDropdown =  document.querySelector("#beerTypeDropDown");
let filter;

export function handleBeerInfo(JSONbeers){

  JSONbeers.forEach((beer) => {
    const beerItem = getBeerInfo(beer);
    globalBeers.push(beerItem);
  });

  displayBeer(globalBeers[0]);
}

export function optionChangeListener(){
  beerDropdown.addEventListener("change", function (){
    document.querySelector("#beerInfoContainer").innerHTML = "";
    checkBeer();
  });
  }
export function getBeerInfo(beer){
    return {
      name: beer.name,
      category: beer.category,
      ranking: beer.popularity,
      alcLevel: beer.alc,
      description: beer.description.overallImpression,
    };
  }

  export function displayBeer(beer){
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