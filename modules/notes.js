export function handleNotes(notes){
    document.querySelector("#notesContainer").innerHTML ="";
    notes.forEach(displayNote);
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

  function deleteNoteListener(copy){

    const apiKey = "60c48116e2c96c46a2463480";

    const button = copy.querySelector(".deleteNote");
    const id = copy.querySelector(".deleteNote").id;
    button.addEventListener("click", function() {
    
    button.classList.add("clicked");
  
    fetch("https://kea2021-6773.restdb.io/rest/foobar-notes/" + id, {
      method: "delete",
      headers: {    
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    }
    })
      .then((res) => res.json())
    })
  }