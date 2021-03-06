//HEADER FOR NOTES DATA
const notesURL = "https://kea2021-6773.restdb.io/rest/foobar-notes";
const apiKey = "60c48116e2c96c46a2463480";

const notesHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "x-apikey": apiKey,
    "cache-control": "no-cache"
};

export function handleNotes(notes){
    document.querySelector("#notesContainer").innerHTML ="";
    notes.forEach(displayNote);
  }
  
export function sortNotes(newNotes){
  //sorting in descending order, i.e. from largest to smallest no
    let sortedNotes = newNotes.sort((a,b) => b.timestamp - a.timestamp);
    return sortedNotes;
  }

function displayNote(note){
  //make copy
  const copy = document.querySelector("template#noteTemplate").content.cloneNode(true);
  //populate 
  copy.querySelector(".noteHeader").textContent = `${note.name} on ${note.date}`;
  copy.querySelector(".noteText").textContent = note.text;
  copy.querySelector(".deleteNote").id = note._id;
  deleteNote(copy);

  //append
  document.getElementById("notesContainer").appendChild(copy);
  }

///////////GET/////////////

  export async function getNotes(notesURL) {
    const response = await fetch(notesURL, {
        method: "get",
        headers: notesHeaders,
    });
    const notesData = await response.json();
    return notesData;
}

///////////POST/////////////

  function post(note){
    const postData = JSON.stringify(note);

    fetch(notesURL, {
      method: "post",
      headers: notesHeaders,
      body: postData,
    })
      .then((res) => res.json())
}

  export function postNoteListener(){
    //for notes form submission
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const form = document.querySelector("form");
  
    form.addEventListener("submit", (e) => {

      e.preventDefault();
      let day = new Date().getDate();
      let month = months[new Date().getMonth()];
      let minutes = String(new Date().getMinutes()).padStart(2, "0");
      let hours = new Date().getHours();
  
      post({
        text: document.querySelector("textarea").value,
        name: "Me",
        date:`${day} ${month} at ${hours}:${minutes}`,
        timestamp: Date.now(),
      })
    
      //reset textarea
      document.querySelector("textarea").value = "";
      document.querySelector("textarea").style.height = "2.5em";
  
    })
  }

  /////////DELETE////////////

  function deleteNote(copy){

    const button = copy.querySelector(".deleteNote");
    const id = copy.querySelector(".deleteNote").id;

    button.addEventListener("click", function() {
      
    button.querySelector(".loadingIcon").classList.remove("hidden");
    button.querySelector(".deleteIcon").classList.add("hidden");
    button.classList.add("load");

    fetch(`${notesURL}/` + id, {
      method: "delete",
      headers: notesHeaders,
    })
      .then((res) => res.json())
    })
  }