import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calenderStore } from '../../calender-store/calender-store';
import { DateService } from '../../services/date.service';
import { CalenderEvent } from '../../models/calender-state.models';

@Component({
  selector: 'event-view',
  template: `<div>
    @if (eventData()) {
        <div class="p-4 border-l border-gray-200 h-full bg-white">
            <h1 class="text-xl font-bold">{{ eventData()?.title }}</h1>

            <section>
              {{eventData()?.description}}
              <span>{{eventData()?.date | date}}</span>
            </section>
        </div>

            <div class=" flex justify-baseline">

              <button (click)="deleteEvent(eventData()!.id)"><i class="pi-trash"></i></button>
              <button (click)="closeEVent()">X</button>
            </div>
    } @else {
        <div class="flex h-full items-center justify-center text-gray-400 italic">
            Select an event to view details
        </div>
    }

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