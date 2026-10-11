import { Component, input } from '@angular/core';
@Component({
  selector: 'app-icon',
  template: `<svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path [attr.d]="paths[name()] || paths['calendar']" />
  </svg>`,
  styles: ':host{display:inline-flex;align-items:center;flex:none}',
})
export class Icon {
  readonly name = input('calendar');
  protected readonly paths: Record<string, string> = {
    calendar: 'M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1M8 14h3m-3 4h6',
    table: 'M4 10h16v4H4zM6 14v7m12-7v7M7 3v4m10-4v4',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    activity: 'M3 12h4l3-7 4 14 3-7h4',
    settings: 'M4 7h16M4 17h16M8 4v6m8 4v6',
    arrow: 'M4 12h15m-5-5 5 5-5 5',
    plus: 'M12 5v14M5 12h14',
    search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    refresh: 'M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 2M19 16a8 8 0 0 1-13 3l-2-2',
  };
}
