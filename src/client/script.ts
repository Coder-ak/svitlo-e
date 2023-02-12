import { SvitloData } from '../interfaces/svitlo-data';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { uk } from 'date-fns/locale';

export class Svitlo {
  constructor() {
    this.init();
    this.stats();
  }

  private getStatus(status: boolean) {
    return status ? 'світло є!' : 'світла нема :(';
  }

  private formatDate(timestamp: number, long = false) {
    const dateFormat = long ? 'EEE, dd MMM, HH:mm' : 'HH:mm';
    return format(timestamp, dateFormat, { locale: uk });
  }

  private formatDuration(start: number, end: number): string {
    const duration = intervalToDuration({ start, end });
    return formatDuration(duration, {
      delimiter: '',
      format: ['days', 'hours', 'minutes', 'seconds'],
      zero: true,
      locale: {
        formatDistance: (_token, count) => {
          if (_token === 'xDays') {
            return count ? count + 'д ' : '';
          }
          return `${this.zeroPad(count)}${_token !== 'xSeconds' ? ':' : ''}`;
        }
      },
    });
  }

  private zeroPad(num: string): string {
    return String(num).padStart(2, '0');
  }

  private getState(light: boolean): string {
    return light ? 'on' : 'off';
  }

  private showDiff({ light, timestamp }: SvitloData) {
    const textDiff = `Світ ${light ? 'є' : 'відсутній'} ${this.formatDuration(timestamp, new Date().getTime())}`;
    document.getElementById('vidkl')!.innerText = textDiff;
  }

  private async getLightData(endpoint: string): Promise<Response> {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorEl = document.getElementById('error');
      errorEl!.style.display = 'block';
      errorEl!.innerHTML = '<b>!!!</b> Щось пішло не так. Спробуйте оновити сторінку.';
      throw new Error('Something went badly wrong!');
    }

    return response;
  }

  private async init() {
    const response = await this.getLightData('/light/rad0');

    const { timestamp, light } = await response.json();

    const textShort = this.getStatus(light).charAt(0).toUpperCase() + this.getStatus(light).slice(1);
    const textFull = `З ${this.formatDate(timestamp)} ${this.getStatus(light)}`;

    document.getElementById('content')!.innerText = textFull;

    this.showDiff({ light, timestamp });
    setInterval(() => this.showDiff({ light, timestamp }), 1000);

    document.title = textShort;
  }

  private async stats() {
    const response = await this.getLightData('/light/all/rad0?limit=31');
    const data: SvitloData[] = await response.json();

    const table = data.map((item, index) => {
      // don't show last entry to display correct duration for previous entry
      if (index === data.length - 1) {
        return;
      }
      return `<div class="grid ${this.getState(item.light)}">
        <img src="assets/lamp_${this.getState(item.light)}.svg" title="${
        item.light ? 'Увімкнено' : 'Вимкнено'
      }" class="icon"/> <div class="time">${this.formatDate(item.timestamp, true)}</div> <div class="diff ${
        this.getState(!item.light)
      }">${this.formatDuration(item.timestamp, data[index + 1]?.timestamp || item.timestamp)}</div></div>`;
    });

    document.getElementById('stats')!.innerHTML = table.join('\n');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Svitlo();
});
