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
    let sortedNotes = newNotes.sort((a,b) => b.timestamp - a.timestamp);
    return sortedNotes;
  }

export async function getNotes(notesURL) {
    const response = await fetch(notesURL, {
        method: "get",
        headers: notesHeaders,
    });
    const notesData = await response.json();
    return notesData;
}

function displayNote(note){
  //make copy
  const copy = document.querySelector("template#noteTemplate").content.cloneNode(true);
  //populate 
  copy.querySelector(".noteHeader").textContent = `${note.name} on ${note.date}`;
  copy.querySelector(".noteText").textContent = note.text;
  copy.querySelector(".deleteNote").id = note._id;
  deleteNoteListener(copy);
  //append
  document.getElementById("notesContainer").appendChild(copy);

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
  
      postNotes({
        text: document.querySelector(".noteTextArea").textContent,
        name: "Me",
        date:`${day} ${month} at ${hours}:${minutes}`,
        timestamp: Date.now(),
      })
  
      document.querySelector(".noteTextArea").innerHTML = "";
  
    })
  }

  function postNotes(data){

    const postData = JSON.stringify(data);
    fetch(notesURL, {
      method: "post",
      headers: notesHeaders,
      body: postData,
    })
      .then((res) => res.json())
}

  function deleteNoteListener(copy){

    const button = copy.querySelector(".deleteNote");
    const id = copy.querySelector(".deleteNote").id;

    button.addEventListener("click", function() {
    
    //button.classList.add("clicked");
    button.style.backgroundImage = "url(loading-icon.svg)";
    button.classList.add("load");
  
    fetch(`${notesURL}/` + id, {
      method: "delete",
      headers: notesHeaders,
    })
      .then((res) => res.json())
    })
  }