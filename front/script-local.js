const jsonData = [
    {
        "timestamp": 1675267305210,
        "light": false,
        "_id": "c6WICWwEFi2dVaZl"
    },
    {
        "timestamp": 1675249482401,
        "light": true,
        "_id": "WVhGwapF7kfUKApO"
    },
    {
        "timestamp": 1675234855000,
        "light": false,
        "_id": "3ctlpJN65DmJ9m1u"
    },
    {
        "timestamp": 1675224055000,
        "light": true,
        "_id": "3ctlpJhraDmJ9m1u"
    },
    {
        "timestamp": 1675202563101,
        "light": false,
        "_id": "8AxVAuY1sNsNI1yx"
    },
    {
        "timestamp": 1675200768989,
        "light": true,
        "_id": "JGczVFSjaxLxy4kx"
    },
    {
        "timestamp": 1675200757326,
        "light": false,
        "_id": "K9FYFs7mJs2V7iKB"
    },
    {
        "timestamp": 1675188031000,
        "light": true,
        "_id": "LyTjTc5ufqNCXVdJ"
    }
];


function getStatus(status) {
  return status ? 'світло є!' : 'світла нема :(';
}

function formatDate(timestamp, long = false) {
  const options = long ? {weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'} : {timeStyle: 'short'};
  return new Date(timestamp).toLocaleTimeString('uk-UA', options);
}

function getLampIcon(status) {
  return `lamp_${status ? 'on' : 'off'}`;
}

async function init() {
  // const response = await fetch('https://svitloe.coderak.net/light');
  // const data = await response.json();
  const data = [jsonData[0]];
  console.log('json', data);
  const textShort = getStatus(data[0].light).charAt(0).toUpperCase() + getStatus(data[0].light).slice(1);
  const textFull = `З ${formatDate(data[0].timestamp)} ${getStatus(data[0].light)}`;

  document.getElementById('content').innerText = textFull;

  document.title = textShort;
  document.querySelectorAll('meta[property=og\\:title]')[0].setAttribute('content', textShort)
  document.querySelectorAll('meta[property=og\\:description]')[0].setAttribute('content', textFull)
  document.querySelectorAll('meta[property=og\\:image]')[0].setAttribute('content',
    `https://svitloe.coderak.net/light_${data[0].light ? 'on' : 'off'}.jpg?rnd=${Math.floor(Math.random() * 1000000000)}`);
}

async function stats() {
   // const response = await fetch('https://svitloe.coderak.net/light/all');
  // const data = await response.json();
  const data = jsonData;

  const table = jsonData.map(item => {
    return `<div class="${item.light ? 'on' : 'off'}"><img src="lamp_${item.light ? 'on' : 'off'}.png" title="${item.light ? 'Увімкнено' : 'Вимкнено'}"/> ${formatDate(item.timestamp, true)}</div>`
  });

  document.getElementById('stats').innerHTML = table.join('\n');
}

document.addEventListener("DOMContentLoaded", function(event) {
  init();
  stats();
});