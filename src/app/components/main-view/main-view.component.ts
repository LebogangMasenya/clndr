import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {calenderStore} from '../../calender-store/calender-store';
import {WeeklyViewComponent} from '../weekly-view/weekly-view.component';
import {MonthlyViewComponent} from '../monthly-view/monthly-view.component';
import {YearViewComponent} from '../year-view/year-view.components';


@Component({
    selector: 'main-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, WeeklyViewComponent, MonthlyViewComponent, YearViewComponent],
    template: `
    <div class="flex flex-column h-screen">      
        <div class="flex-1">
            <weekly-view *ngIf="calendarStore.currentView() === 'week'"></weekly-view>
            <monthly-view *ngIf="calendarStore.currentView() === 'month'"></monthly-view>
            <year-view *ngIf="calendarStore.currentView() === 'year'"></year-view>
        </div>
</div>`,
styles: ``
})
export class MainViewComponent {
    calendarStore = inject(calenderStore);
}