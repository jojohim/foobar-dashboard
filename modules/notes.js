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
  //append
  document.getElementById("notesContainer").appendChild(copy);
  
  //setInterval(function(){ console.log("cleared"); document.getElementById("notesContainer").innerHTML = "";}, 4000);
  }