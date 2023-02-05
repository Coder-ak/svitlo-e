const url = 'https://svitloe.coderak.net';

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

function secondsToTime(totalSeconds) {
  totalSeconds = totalSeconds / 1000;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

function showDiff(light, timestamp) {
  const diff = new Date().getTime() - timestamp;
  const textDiff = `Світ ${light ? 'є' : 'відсутній'} ${secondsToTime(diff)}`

  document.getElementById('vidkl').innerText = textDiff;
}

async function init() {
  const response = await fetch(url + '/light/');
  const { timestamp, light } = await response.json();

  const textShort = getStatus(light).charAt(0).toUpperCase() + getStatus(light).slice(1);
  const textFull = `З ${formatDate(timestamp)} ${getStatus(light)}`;

  document.getElementById('content').innerText = textFull;

  setInterval(() => showDiff(light, timestamp), 1000);

  document.title = textShort;
  document.querySelectorAll('meta[property=og\\:title]')[0].setAttribute('content', textShort)
  document.querySelectorAll('meta[property=og\\:description]')[0].setAttribute('content', textFull)
  document.querySelectorAll('meta[property=og\\:image]')[0].setAttribute('content',
    `https://svitloe.coderak.net/assets/light_${light ? 'on' : 'off'}.jpg?rnd=${Math.floor(Math.random() * 1000000000)}`);
}

async function stats() {
  const response = await fetch(url + '/light/all');
  const data = await response.json();

  const table = data.map((item, index) => {
    const diff = item.timestamp - data[index + 1]?.timestamp || 0;

    return `<div class="grid ${item.light ? 'on' : 'off'}">
      <img src="assets/lamp_${item.light ? 'on' : 'off'}.svg" title="${item.light ? 'Увімкнено' : 'Вимкнено'}" class="icon"/> <div class="time">${formatDate(item.timestamp, true)}</div> <div class="diff ${item.light ? 'off' : 'on'}">[${secondsToTime(diff)}]</div></div>`
  });

  document.getElementById('stats').innerHTML = table.join('\n');
}

document.addEventListener("DOMContentLoaded", function(event) {
  init();
  stats();
});
