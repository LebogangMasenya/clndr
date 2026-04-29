import { Component, signal, inject, computed} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventViewComponent} from './components/event-view/event-view.component';
import {NavSidebarComponent} from './components/nav-sidebar/nav-sidebar.component';
import {TopControlsComponent} from './components/top-controls/top-controls.component';
import {MainViewComponent} from './components/main-view/main-view.component';
import { calenderStore } from './calender-store/calender-store';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DrawerModule, RippleModule, NavSidebarComponent, TopControlsComponent, EventViewComponent, MainViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clndr');
  calendarStore = inject(calenderStore);

  selectedEventId = computed(() => this.calendarStore.selectedEventIdLabel());
  visible: boolean = false;

  toggleDrawer() {
    this.visible = !this.visible;
  }
}
