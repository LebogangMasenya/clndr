import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isSameMonth, isToday, subYears } from 'date-fns';
import { daysLabels } from '../../models/holiday.models';
import {CreateEventComponent} from '../create-modal/create-event.component';
@Component({
    selector: 'monthly-view',
    imports: [CommonModule, CreateEventComponent],
    template: `              
        <h1 class="text-xl font-bold">{{ calendarStore.selectedDate() | date: 'MMMM yyyy' }}</h1>
        <div class="grid grid-cols-7 border-t border-l border-gray-300">
            <div class="flex items-center justify-center py-2 border-b border-r border-gray-300" *ngFor="let dayLabel of daysLabels">
                <strong>{{ dayLabel }}</strong>
            </div>
            
            @for (day of calendarDays(); track day.date.toISOString()) {
                <div [class.bg-slate-50]="!day.isCurrentMonth" class="h-32 border-r border-b border-slate-200 p-2">
                    <span [class.bg-blue-600]="day.isToday" [class.text-white]="day.isToday"
                    class="inline-flex h-7 w-7 items-center justify-content-center rounded-full">
                        {{ day.date | date: 'd' }}
                        <button pButton label="New Event" class="p-button-sm   mt-2" (click)="showCreateModal = true"><i class="pi pi-plus"></i></button>
                        <button (click)="goToDate(day.date)">wdw</button>

                    </span>

                    @if (day.isHoliday) {
                        <div class="mt-1 text-[10px] bg-red-50 text-red-700 px-1 rounded truncate">
                            {{ day.holidayName }}
                        </div>
                    }
                    

                </div>
            }

        
            <create-event [(showCreateModal)]="showCreateModal"></create-event>
        </div>
        `,
    styles: ``
})
export class MonthlyViewComponent {
    calendarStore = inject(calenderStore);
    dateService = inject(DateService);
    daysLabels = daysLabels;
    showCreateModal = false;

    calendarDays = computed(() => { // listen to changes in state
        const selectedDate = this.calendarStore.selectedDate();
        const realDate = this.calendarStore.selectedDate();

        //  (1 year ago)
        const debugDate = subYears(realDate, 1);

        const holidays = this.calendarStore.holidayList();

        const monthDates = this.dateService.getMonthDates(debugDate);

        return monthDates.map(date => {
            const holiday = holidays.find(h => isSameDay(new Date(h.date), date));

            return {
                date,
                isHoliday: !!holiday,
                holidayName: holiday?.name || null,
                isCurrentMonth: isSameMonth(date, selectedDate),
                isToday: isToday(date)
            };
        });
    });

    goToDate(date: Date) {
        this.calendarStore.setSelectedDate(date);
        this.calendarStore.setView('week');
    }
}
