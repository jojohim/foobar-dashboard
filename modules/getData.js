//HEADER FOR BAR STATUS DATA
const barStatusHeaders = {
    "Content-Type": "application/json",
};

//HEADER FOR NOTES DATA
const apiKey = "60c48116e2c96c46a2463480";

const notesHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "x-apikey": apiKey,
    "cache-control": "no-cache"
};


export async function getBarStatus(jsonURL) {
    const response = await fetch(jsonURL, {
      method: "get",
      headers: barStatusHeaders,
    });
    const jsonData = await response.json();
    return jsonData;
  }

export async function getNotes(notesURL) {
    const response = await fetch(notesURL, {
        method: "get",
        headers: notesHeaders,
    });
    const notesData = await response.json();
    return notesData;
}

