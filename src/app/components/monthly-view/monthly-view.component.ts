import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isSameMonth, isToday, subMonths, addMonths } from 'date-fns';
import { daysLabels } from '../../models/holiday.models';
import {CreateEventComponent} from '../create-modal/create-event.component';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'monthly-view',
    imports: [CommonModule, CreateEventComponent, ButtonModule],
    template: `     
    
    <div class="flex  justify-between m-2">
             <p-button icon="pi pi-caret-left" (onClick)="goToPrevMonth()">
            </p-button>
             <h1 class="text-xl font-bold">{{ calendarStore.selectedDate() | date: 'MMMM yyyy' }}</h1>
                     <p-button icon="pi pi-caret-right" (onClick)="goToNextMonth()">
        </p-button>
</div>
        <div class="grid grid-cols-7 border-t border-l border-gray-300">
            <div class="flex items-center justify-center py-2 border-b border-r border-gray-300" *ngFor="let dayLabel of daysLabels">
                <strong>{{ dayLabel }}</strong>
            </div>
            
            @for (day of calendarDays(); track day.date.toISOString()) {
                <div [class.bg-slate-50]="!day.isCurrentMonth" class="h-32 border-r border-b border-slate-200 p-2 container">
                    <span (click)="goToDate(day.date)" [class.bg-blue-600]="day.isToday" [class.text-white]="day.isToday"
                    class="inline-flex h-7 w-7 items-center justify-content-center rounded-full">
                        {{ day.date | date: 'd' }}
                    </span>

                    <button pButton label="New Event" class="p-button-sm  hover-button  mt-2" (click)="showCreateModal = true"><i class="pi pi-plus"></i></button>

                    @if (day.isHoliday) {
                        <div class="mt-1 text-[10px] bg-red-50 text-red-700 px-1 rounded truncate">
                            {{ day.holidayName }}
                        </div>
                    }
                    
                    @if(day.hasEvent) {
                        <div class="mt-1 text-[10px] bg-green-50 text-green-700 px-1 rounded truncate">
                          <button (click)="selectEvent(day.eventID || ' ')"> {{ day.eventTitle }} </button>
                        </div>
                    }

                </div>
            }

        
        <div class="hidden">
            <create-event [(showCreateModal)]="showCreateModal"></create-event>
        </div>        
    </div>
        `,
    styles: `
.hover-button {
  visibility: hidden;
}

.container:hover .hover-button {
  visibility: visible;
}


    
    `
})
export class MonthlyViewComponent {
    calendarStore = inject(calenderStore);
    dateService = inject(DateService);
    daysLabels = daysLabels;
    showCreateModal = false;

    calendarDays = computed(() => { // listen to changes in state
        const selectedDate = this.calendarStore.selectedDateLabel();
        const realDate = this.calendarStore.selectedDateLabel();

        const holidays = this.calendarStore.holidayListObject();
        const events = this.calendarStore.entities();
        const monthDates = this.dateService.getMonthDates(realDate);

        return monthDates.map(date => {
            const holiday = holidays.find(h => isSameDay(new Date(h.date), date));
            const event = events.find(e => isSameDay(new Date(e.date), date));
            return {
                date,
                isHoliday: !!holiday,
                holidayName: holiday?.name || null,
                isCurrentMonth: isSameMonth(date, selectedDate),
                isToday: isToday(date),
                hasEvent: !!event,
                eventTitle: event?.title || null,
                eventID : event?.id || null
            };
        });
    });

    goToDate(date: Date) {
        this.calendarStore.setSelectedDate(date);
        this.calendarStore.setView('week');
    }

    selectEvent(id: string) {
        this.calendarStore.setSelectedEventId(id);
    }

      goToNextMonth() {
        const date = this.calendarStore.selectedDate() 
        this.calendarStore.setSelectedDate(addMonths(date, 1));
    
    
      } 
      goToPrevMonth() {
        const date = this.calendarStore.selectedDate() 
        this.calendarStore.setSelectedDate(subMonths(date, 1));
    
      }
}
