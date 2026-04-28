import {Component, Input} from '@angular/core';

@Component({
  selector: 'event-view',
  template: `<p>Event</p>
  `,
    styles: `
    :host {
      display: block;
      width: 200px;
      background-color: #f0f0f0;
      padding: 1rem;
    }
  `,
  imports: []
})
export class EventViewComponent {

}