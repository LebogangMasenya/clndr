import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { isSameDay, isSameMonth, isToday, subYears, subMonths, addMonths } from 'date-fns';
import { daysLabels } from '../../models/holiday.models';
import { Button, ButtonDirective } from "primeng/button";
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'nav-sidebar',
  template: `
  @if (view() === 'week') {
    <div class="w-full p-2 bg-blue-600">
<div class="flex items-center gap-1 text-amber-300 p-1 rounded-md border border-slate-200/60">
    <p-button 
        icon="pi pi-chevron-left" 
        (onClick)="goToPrevMonth()"
        [text]="true" 
        [plain]="true"
        severity="secondary"
        styleClass="h-7 w-7 p-0 hover:bg-white hover:shadow-sm transition-all"
    ></p-button>

    <p-button 
        icon="pi pi-chevron-right" 
        (onClick)="goToNextMonth()"
        [text]="true" 
        [plain]="true"
        severity="secondary"
        styleClass="h-7 w-7 p-0 hover:bg-white hover:shadow-sm transition-all"
    ></p-button>
</div>
      <div class="flex items-center justify-between mb-2 px-1">
        <span class="text-sm font-semibold text-slate-700">
          {{ calendarStore.selectedDate() | date: 'MMMM yyyy' }}
        </span>
      </div>

      <div class="grid grid-cols-7 text-center">
          @for (dayLabel of daysLabels; track dayLabel) {
            <div class="text-[10px] font-bold text-slate-400 py-1 uppercase">
              {{ dayLabel.substring(0, 1) }}
            </div>
          }
            
          @for (day of calendarDaysView(); track day.date.toISOString()) {
            <div class="relative aspect-square flex items-center justify-center p-4">
              <button 
                (click)="goToDate(day.date)"
                [class.text-slate-300]="!day.isCurrentMonth"
                [class.bg-blue-600]="day.isToday"
                [class.text-white]="day.isToday"
                [class.font-bold]="day.isToday"
                class="w-7 h-7 text-xs rounded-full flex items-center justify-center transition-colors hover:bg-slate-100 cursor-pointer border-none bg-transparent"
                [class.hover:bg-blue-500]="day.isToday">
                {{ day.date | date: 'd' }}
              </button>

                @if (day.isHoliday || day.isCurrentMonth) {
                  <div class="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
                }
            </div>
          }

          </div>
        </div>
  }
 
  <div>
   
  <section>
    <h2>Commands to try</h2>

    <ul>
      <li>
        <button>
          <span>Create event</span>
          <kbd class="ml-auto text-[10px] bg-slate-200/50 px-1.5 rounded text-slate-400 font-sans border border-slate-200">⌘ K</kbd>
        </button>
      </li>

       <li>
        <button>
          <span>Search events</span>
          <kbd class="ml-auto text-[10px] bg-slate-200/50 px-1.5 rounded text-slate-400 font-sans border border-slate-200">⌘ i</kbd>
        </button>
      </li>

    </ul>
</section>


</div>
  
  `,
  styles: `
    :host {
      display: block;
      width: 200px;
      background-color: #f0f0f0;
      padding: 1rem;
    }
  `,
  imports: [CommonModule, ButtonModule, ButtonDirective],

})
export class NavSidebarComponent {
  calendarStore = inject(calenderStore);
  dateService = inject(DateService);
  daysLabels = daysLabels;
  view = computed(() => this.calendarStore.currentViewLabel());

  calendarDaysView = computed(() => { // listen to changes in state
    const selectedDate = this.calendarStore.selectedDateLabel();
    const realDate = this.calendarStore.selectedDateLabel();

    //  (1 year ago)
    const debugDate = subYears(realDate, 1);

    const holidays = this.calendarStore.holidayListObject();

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

  goToNextMonth() {
    const date = this.calendarStore.selectedDate() 
    this.calendarStore.setSelectedDate(addMonths(date, 1));


  } 
  goToPrevMonth() {
    const date = this.calendarStore.selectedDate() 
    this.calendarStore.setSelectedDate(subMonths(date, 1));

  }
}