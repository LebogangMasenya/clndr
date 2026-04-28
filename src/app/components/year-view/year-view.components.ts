import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isSameMonth, isToday, subYears } from 'date-fns';
import { daysLabels, monthsLabels } from '../../models/holiday.models';


@Component({
    selector: 'year-view',
    imports: [CommonModule],
    template: `
        <div class="grid grid-cols-3 gap-4">
            @for (month of monthsLabels; track month) {
                <div class="border rounded p-2">
                    <h3 class="text-center font-bold mb-2">{{ month }}</h3>
                    <div class="grid grid-cols-7 border-t border-l border-gray-300">
                        <div class="flex items-center justify-center py-1 border-b border-r border-gray-300" *ngFor="let dayLabel of daysLabels">
                            <strong>{{ dayLabel }}</strong>
                        </div>

                        @for (day of calendarDays(); track day.date.toISOString()) {
                            <div [class.bg-slate-50]="!day.isCurrentMonth" class="h-20 border-r border-b border-slate-200 p-1">
                                <span [class.bg-blue-600]="day.isToday" [class.text-white]="day.isToday"
                                class="inline-flex h-6 w-6 items-center justify-content-center rounded-full text-sm">
                                    {{ day.date | date: 'd' }}
                                </span>

                                @if (day.isHoliday) {
                                    <div class="mt-1 text-[10px] bg-red-50 text-red-700 px-1 rounded truncate">
                                        {{ day.holidayName }}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </div>  
    `,
    styles: ``
})
export class YearViewComponent {
    calendarStore = inject(calenderStore);
    dateService = inject(DateService);
    daysLabels = daysLabels;
    monthsLabels = monthsLabels;

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
}