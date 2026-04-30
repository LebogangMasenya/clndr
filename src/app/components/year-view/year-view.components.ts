import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isToday, format } from 'date-fns';
import { daysLabels, monthsLabels } from '../../models/holiday.models';


@Component({
    selector: 'year-view',
    imports: [CommonModule],
    template: `
    <h1 class="text-xl font-bold mb-4 pl-4">2025</h1>
    <div class="grid grid-cols-3 gap-6 p-4">
        @for (month of yearData(); track month.monthName) {
            <div class="flex flex-col">
                <h3 class="text-lg font-bold mb-3 text-slate-800" (click)="goToDateFromMonth(month.monthName)">
                   <button class="bg-transparent border-none hover:underline text-lg font-bold mb-3 text-slate-800">
                     {{ month.monthName }}
                   </button>
                </h3>

                <div class="grid grid-cols-7 text-[10px] font-bold text-slate-400 mb-1">
                    @for (label of daysLabels; track label) {
                        <div class="text-center">{{ label.substring(0, 1) }}</div>
                    }
                </div>

                <div class="grid grid-cols-7 border-t border-l border-slate-100">
                    @for (day of month.days; track day.date.toISOString()) {
                        <div 
                            class="aspect-square border-r border-b border-slate-100 flex flex-col items-center justify-center relative"
                            [class.bg-slate-50]="!day.isCurrentMonth">
                            
                            
                            <span 
                                [class.bg-blue-600]="day.isToday" 
                                [class.text-white]="day.isToday"
                                [class.opacity-25]="!day.isCurrentMonth"
                                (click)="goToDate(day.date)"
                                class="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ">
                            
                                    {{ day.date | date: 'd' }}
                              
                            </span>
                    
                            @if (day.isHoliday && day.isCurrentMonth) {
                                <div class="absolute bottom-0 w-1 h-1 bg-red-400 rounded-full"></div>
                            }
                            
                            @if(day.hasEvent) {
                                <div class="absolute bottom-0  bg-blue-600 w-1 h-1 px-1 rounded-full">
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


    yearData = computed(() => {
        const realDate = this.calendarStore.selectedDateLabel();

        const year = realDate.getFullYear();
        const holidays = this.calendarStore.holidayListObject();
        const events = this.calendarStore.entities();

        // Generate data for each of the 12 months
        return Array.from({ length: 12 }, (_, monthIndex) => {
            const firstOfMonth = new Date(year, monthIndex, 1);
            const monthDates = this.dateService.getMonthDates(firstOfMonth);

            return {
                monthName: format(firstOfMonth, 'MMMM'),
                days: monthDates.map(date => {
                    const holiday = holidays.find(h => isSameDay(new Date(h.date), date));
                    const event = events.find(e => isSameDay(new Date(e.date), date));

                    return {
                        date,
                        isHoliday: !!holiday,
                        holidayName: holiday?.name || null,
                        // Important: Check if day belongs to THIS specific month index
                        isCurrentMonth: date.getMonth() === monthIndex,
                        isToday: isToday(date),
                        hasEvent: !!event,
                        eventTitle: event?.title || null,
                        eventID: event?.id || null

                    };
                })
            };
        });
    });

    goToDateFromMonth(month: string) {
        const monthIndex = monthsLabels.findIndex(m => m === month);
        if (monthIndex !== -1) {
            const year = this.calendarStore.selectedDate().getFullYear();
            const date = new Date(year, monthIndex, 1);
            this.calendarStore.setSelectedDate(date);
            this.calendarStore.setView('month');
        }
    }

    goToDate(date: Date) {
        this.calendarStore.setSelectedDate(date);
        this.calendarStore.setView('week');
    }

  
}