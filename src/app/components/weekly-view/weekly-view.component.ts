import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';

@Component({
    selector: 'weekly-view',
    imports: [CommonModule],
    template: `  
        <div class="flex flex-column h-screen">
        </div>`,
    styles: ``
})
export class WeeklyViewComponent {
    calendarStore = inject(calenderStore);
}