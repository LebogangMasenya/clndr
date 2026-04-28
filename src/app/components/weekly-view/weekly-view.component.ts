import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isSameMonth, isToday, subYears } from 'date-fns';
import { daysLabels, timeLabels } from '../../models/holiday.models';
import {CreateEventComponent} from '../create-modal/create-event.component';


@Component({
    selector: 'weekly-view',
    imports: [CommonModule, CreateEventComponent],
    template: `  
            <h1 class="text-xl font-bold">{{ calendarStore.selectedDate() | date: 'MMMM yyyy' }}</h1>

      <div class="flex h-full flex-col overflow-hidden bg-white">
    
        <div class="flex border-b border-slate-200 flex-none">
            <div class="w-16 flex-shrink-0 border-r border-slate-100 bg-slate-50"></div> 
            
            <div class="grid flex-1 grid-cols-7">
                @for (day of calendarDays(); track day.date.toISOString()) {
                    <div class="flex flex-col items-center justify-center py-2 border-r border-slate-100 relative">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {{ day.date | date: 'EEE' }}
                            <button pButton label="New Event" class="p-button-sm   mt-2" (click)="showCreateModal = true"><i class="pi pi-plus"></i></button>

                        </span>
                        <span [class.bg-blue-600]="day.isToday" 
                                [class.text-white]="day.isToday"
                                class="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium">
                            {{ day.date | date: 'd' }}
                        </span>

                        @if (day.isHoliday) {
                            <div class="absolute bottom-0 left-0 right-0 text-[9px] bg-red-50 text-red-700 px-1 truncate text-center">
                            {{ day.holidayName }}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>

        <div class="flex flex-1 overflow-y-auto">
            
            <div class="w-16 flex-shrink-0 bg-white border-r border-slate-100 relative pt-2">
                @for (hour of timeLabels; track hour) {
                    <div class="h-12 relative">
                        <span class="absolute -top-2 right-2 text-[10px] text-slate-400 uppercase">
                            {{ hour }}
                        </span>
                    </div>
                }
            </div>

            <div class="grid flex-1 grid-cols-7 relative pt-2">
            
                <div class="absolute inset-0 pointer-events-none">
                    @for (hour of timeLabels; track hour) {
                    <div class="h-12 border-b border-slate-100 w-full"></div>
                    }
                </div>

                @for (day of calendarDays(); track day.date.toISOString()) {
                    <div class="relative h-[1152px] border-r border-slate-100 hover:bg-slate-50/50 transition-colors">
                    </div>
                }

                <div class="absolute left-0 right-0 border-t border-red-500 z-20 pointer-events-none flex items-center"
                    [style.top.px]="currentTimePosition()">
                    <div class="h-2 w-2 rounded-full bg-red-500 -ml-1"></div>
                </div>
            </div>
        </div>
                    <create-event [(showCreateModal)]="showCreateModal"></create-event>

    </div>`,
    styles: ``
})
export class WeeklyViewComponent {
    calendarStore = inject(calenderStore);
    dateService = inject(DateService);
    daysLabels = daysLabels;
    timeLabels = timeLabels;
    showCreateModal = false;
    calendarDays = computed(() => {
        const selectedDate = this.calendarStore.selectedDate();
        const realDate = this.calendarStore.selectedDate();

        const debugDate = subYears(realDate, 1);

        const holidays = this.calendarStore.holidayList();

        const weekDates = this.dateService.getWeekDates(debugDate);

        return weekDates.map(date => {
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

    HOUR_HEIGHT = 48; // height in pixels for one hour block  
    currentTimePosition() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Position = (Hours * Height) + (Minutes * (Height / 60))
        const paddingOffset = 8;
        return (hours * this.HOUR_HEIGHT) + (minutes * (this.HOUR_HEIGHT / 60)) + paddingOffset;
    }
}
