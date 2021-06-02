//CHARTS
let globalTapLevels = [];

export function handleTaps(taps){
  document.querySelector("#taps").innerHTML ="";
    globalTapLevels = [];
    globalTapLevels = taps;
    globalTapLevels.forEach(makeChartFromTaps);
    console.log(globalTapLevels);
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
    copy.querySelector(".tapName").textContent = `${tap.beer}`;
    copy.querySelector(".tapAmount").textContent = `${tapLevelInPints}`;
    copy.querySelector(".pintsLabel").textContent = "pints";
  
  
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
      parsing: false,
      options: {
        normalized: true,
        animation: false,
        cutout: "75%",
        tooltips: {
          enabled: true,
        }
      },
    };
  
    return config;
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

  