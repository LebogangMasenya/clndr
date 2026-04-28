import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventViewComponent} from './components/event-view/event-view.component';
import {NavSidebarComponent} from './components/nav-sidebar/nav-sidebar.component';
import {TopControlsComponent} from './components/top-controls/top-controls.component';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, DrawerModule, RippleModule, NavSidebarComponent, TopControlsComponent, EventViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clndr');
}
