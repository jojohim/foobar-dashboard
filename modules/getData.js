const headers = {
    "Conent-Type": "application/json", 
  };

async function getBarStatus(url){
const response = await fetch(url, {
    method: 'get',
    headers: headers,
});

const statusData = await response.json();
return jsonData;
  }