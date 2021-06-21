//HEADER FOR BAR STATUS DATA
const barStatusHeaders = {
    "Content-Type": "application/json",
};

export async function getBarStatus(jsonURL) {
    const response = await fetch(jsonURL, {
      method: "get",
      headers: barStatusHeaders,
    });
    const jsonData = await response.json();
    return jsonData;
  }

export const textarea = document.querySelector("textarea");


export function expandTextArea() {
    var heightLimit = 100; /* Maximum height: 200px */
    textarea.style.height = ""; /* Reset the height*/
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
  };
