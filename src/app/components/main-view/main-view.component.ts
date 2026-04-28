import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {calenderStore} from '../../calender-store/calender-store';
import {DayViewComponent} from '../day-view/day-view.component';
import {WeeklyViewComponent} from '../weekly-view/weekly-view.component';
import {MonthlyViewComponent} from '../monthly-view/monthly-view.component';
import {YearViewComponent} from '../year-view/year-view.components';

@Component({
    selector: 'main-view',
    imports: [CommonModule, FormsModule, DayViewComponent, WeeklyViewComponent, MonthlyViewComponent, YearViewComponent],
    template: `
    <div class="flex flex-column h-screen">      
        <div class="flex-1">
            <day-view *ngIf="calendarStore.currentView() === 'day'"></day-view>
            <weekly-view *ngIf="calendarStore.currentView() === 'week'"></weekly-view>
            <monthly-view *ngIf="calendarStore.currentView() === 'month'"></monthly-view>
            <year-view *ngIf="calendarStore.currentView() === 'year'"></year-view>
        </div>
</div>`,
styles: ``
})
export class MainViewComponent {
    calendarStore = inject(calenderStore);
    
    displayLabel = this.calendarStore.displayLabel;
}