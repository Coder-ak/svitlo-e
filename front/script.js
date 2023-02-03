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
  const response = await fetch('https://svitloe.coderak.net/light');
  const data = await response.json();

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
  const response = await fetch('https://svitloe.coderak.net/light/all');
  const data = await response.json();

  const table = data.map(item => {
    return `<div class="${item.light ? 'on' : 'off'}"><img src="lamp_${item.light ? 'on' : 'off'}.png" title="${item.light ? 'Увімкнено' : 'Вимкнено'}"/> ${formatDate(item.timestamp, true)}</div>`
  });

  document.getElementById('stats').innerHTML = table.join('\n');
}

document.addEventListener("DOMContentLoaded", function(event) {
  init();
  stats();
});
