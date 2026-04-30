import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { CalenderEvent } from '../../models/calender-state.models';

@Component({
  selector: 'event-view',
  template: `
    @if (eventData()) {
      <div class="flex flex-col justify-between p-6 border border-gray-100 rounded-xl h-full bg-white shadow-sm">
            
            <div class="flex items-start justify-between mb-5">
                <div class="flex flex-col">
                    <h2 class="text-xl font-bold text-gray-900">
                        {{ eventData()?.title }}
                    </h2>
                    <span class="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <i class="pi pi-calendar"></i>
                        {{ eventData()?.date | date }}
                    </span>
                </div>
                
                <button 
                    type="button" 
                    (click)="closeEVent()" 
                    class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border-0 bg-transparent cursor-pointer">
                    <i class="pi pi-times text-lg"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto mb-6">
                <p class="text-gray-600 text-sm leading-relaxed">
                    {{ eventData()?.description }}
                </p>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button 
                    type="button"
                    (click)="deleteEvent(eventData()!.id)" 
                    class="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg  border-0 text-sm font-semibold cursor-pointer group">
                    <i class="pi pi-trash text-red-500 group-hover:text-red-600"></i>
                    Delete Event
                </button>
            </div>
        </div>
    } @else {
        <div class="flex h-full items-center justify-center text-gray-400 italic">
            Select an event to view details
        </div>
    }


  `,
    styles: `
    
  `,
  imports: [CommonModule]
})
export class EventViewComponent {
  calendarStore = inject(calenderStore);
  dateService = inject(DateService);

  eventData =  this.calendarStore.selectedEvent;


  editEvent(updateData: CalenderEvent) {
    if(this.eventData()) {
      this.calendarStore.updateEvent(this.eventData()!.id, updateData)
    }
  }

  deleteEvent(id: string) {
    
      this.calendarStore.removeEvent(id)
      this.calendarStore.setSelectedEventId(null);
    
  }

  closeEVent() {
      this.calendarStore.setSelectedEventId(null);
  }
}