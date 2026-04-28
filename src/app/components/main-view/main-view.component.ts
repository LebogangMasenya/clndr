import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {calenderStore} from '../../calender-store/calender-store';
import {DayViewComponent} from '../day-view/day-view.component';
import {WeeklyViewComponent} from '../weekly-view/weekly-view.component';
import {MonthlyViewComponent} from '../monthly-view/monthly-view.component';

@Component({
    selector: 'main-view',
    imports: [CommonModule, FormsModule, DayViewComponent, WeeklyViewComponent, MonthlyViewComponent],
    template: `
    <div class="flex flex-column h-screen">
        <div class="p-4 border-b">
            <h1 class="text-2xl font-bold">{{ displayLabel() }}</h1>
        </div>
        <div class="flex-1">
            <day-view *ngIf="calendarStore.currentView() === 'day'"></day-view>
            <weekly-view *ngIf="calendarStore.currentView() === 'week'"></weekly-view>
            <monthly-view *ngIf="calendarStore.currentView() === 'month'"></monthly-view>
        </div>
</div>`,
styles: ``
})
export class MainViewComponent {
    calendarStore = inject(calenderStore);
    
    displayLabel = this.calendarStore.displayLabel;
}