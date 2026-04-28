import {Component} from '@angular/core';

@Component({
  selector: 'nav-sidebar',
  template: `<p>Nav Sidebar</p>
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
export class NavSidebarComponent {
    
}