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
     

        <p-dialog header="New Event" 
            [(visible)]="showCreateModal" 
            [modal]="true" 
            appendTo="body"
            closable="false"
           [style]="{ width: '450px' }"
            >
           <div class="flex flex-col gap-4 p-fluid py-2">
        
                <div class="flex flex-col gap-1">
                    <label for="title" class="text-sm font-medium text-gray-700">Event Title</label>
                    <input pInputText id="title" [(ngModel)]="newEvent.title" placeholder="Enter event title" />
                </div>

                <div class="flex flex-col gap-1">
                    <label for="date" class="text-sm font-medium text-gray-700">Date</label>
                    <p-datePicker id="date" [(ngModel)]="newEvent.date" appendTo="body" />
                </div>

                <div class="flex flex-col gap-1">
                    <label for="description" class="text-sm font-medium text-gray-700">Description (optional)</label>
                    <textarea 
                        pInputTextarea 
                        id="description" 
                        [(ngModel)]="newEvent.description" 
                        rows="3" 
                        class="resize-none"
                        placeholder="Enter description..."></textarea>
                </div>

                <div class="flex justify-end gap-3 mt-4">
                    <button 
                        pButton 
                        label="Cancel" 
                        icon="pi pi-times"
                        class="p-button-secondary p-button-text" 
                        (click)="closeModal()">
                    </button>
                    <button 
                        pButton 
                        label="Save" 
                        icon="pi pi-check"
                        (click)="saveEvent()">
                    </button>
                </div>
            </div>

            <div class="flex justify-center mt-2">
                <p-toast position="top-center" />
            </div>



        </p-dialog>
    `,
    styles: `
    ::ng-deep .p-dialog {
        background: white;
        color: black;
        border-radius: 16px;
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