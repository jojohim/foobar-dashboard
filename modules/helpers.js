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


