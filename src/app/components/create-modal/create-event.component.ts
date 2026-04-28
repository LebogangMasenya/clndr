import {Component, inject, Input, Output, EventEmitter} from '@angular/core';
import {calenderStore} from '../../calender-store/calender-store';
import {DateService} from '../../services/date.service';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {ButtonModule} from 'primeng/button';

@Component({
    selector: 'create-event',
    template: `
        <div class="card flex justify-center">
            <p-toast />
        </div>

        <p-dialog header="New Event" 
            [(visible)]="showCreateModal" 
            [modal]="true" 
            appendTo="body"
            closable="false"
            [style]="{width: '60vw', height: '20vh'}"
            >
            <div class="flex flex-column gap-3">
                <div class="flex flex-column gap-2 ">
                    <label for="title">Event Title</label>
                    <input pInputText id="title" [(ngModel)]="newEvent.title" />
                </div>
                <div class="flex flex-column gap-2">
                    <label for="date">Date</label>
                    <p-datePicker id="date" [(ngModel)]="newEvent.date" appendTo="body"></p-datePicker>
                </div>

                <div class="flex flex-column gap-2">
                    <label for="description">Description (optional)</label>
                    <textarea pInputText id="description" [(ngModel)]="newEvent.description"></textarea>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <button pButton label="Cancel" class="p-button-secondary" (click)="closeModal()"></button>
                    <button pButton label="Save" (click)="saveEvent()"></button>
                </div>
            </div>
        </p-dialog>
    `,
    styles: `
    :host {
      display: block;
      width: 200px;
      background-color: #f0f0f0;
      padding: 1rem;
    }
  `,
    imports: [DialogModule, DatePickerModule, FormsModule, ToastModule, ButtonModule],
    standalone: true,
    providers: [MessageService]
})
export class CreateEventComponent {
    @Input() showCreateModal: boolean = false;
    @Output() showCreateModalChange = new EventEmitter<boolean>();
    CalenderStore = inject(calenderStore);
    DateService = inject(DateService);
    messageService = inject(MessageService);


    newEvent = {
        title: '',
        date: new Date(),
        description: ''
    };  

    saveEvent() {
        if (!this.newEvent.title || !this.newEvent.date) {
            this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please provide both title and date for the event.' });
            return;
        }

        this.DateService.createEvent(this.newEvent.title, this.newEvent.date, this.newEvent.description);
        this.showCreateModal = false;
        this.newEvent = { title: '', date: new Date(), description: '' };
        this.showCreateModalChange.emit(this.showCreateModal);
    }

    closeModal() {
        this.showCreateModal = false;
        this.showCreateModalChange.emit(this.showCreateModal);
    }
}