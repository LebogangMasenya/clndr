import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventViewComponent} from './components/event-view/event-view.component';
import {NavSidebarComponent} from './components/nav-sidebar/nav-sidebar.component';
import {TopControlsComponent} from './components/top-controls/top-controls.component';
import {MainViewComponent} from './components/main-view/main-view.component';
import { calenderStore } from './calender-store/calender-store';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DrawerModule, RippleModule, NavSidebarComponent, TopControlsComponent, EventViewComponent, MainViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clndr');
  calendarStore = inject(calenderStore);

  selectedEventId = this.calendarStore.selectedEventId;
}
