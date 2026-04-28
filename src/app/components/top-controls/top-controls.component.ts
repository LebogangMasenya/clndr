import { Component, Input, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { HolidayService } from '../../services/holiday-services/holiday.service';
import {Holiday} from '../../models/holiday.models';
import {calenderStore} from '../../calender-store/calender-store';
import { DatePickerModule } from 'primeng/datepicker';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import { HostListener } from '@angular/core';

interface SearchResult {
    label: string;
    icon: string;
    category: string;
    action: () => void;
}


@Component({
    selector: 'top-controls',
    template: `
   <div class="card">
    <h1>CLNDR.io</h1>
    <p-menubar [model]="items" />

        <div> 
            <p-dialog header="Calendar Command Palette" [(visible)]="showCommandPaletteDialog" (onShow)="searchQuery.forceInput()" [modal]="true" [closable]="true" [style]="{width: '50vw'}">
            <p>Search your calendar</p>
                <p-autocomplete 
                    #searchQuery
                    [(ngModel)]="value" 
                    [suggestions]="suggestedItems" 
                    (completeMethod)="search($event)"
                    optionLabel="label"
                    placeholder="Type a command or search events..."
                    [style]="{'width':'100%'}"
                    [inputStyle]="{'width':'100%'}">
                    
                    <ng-template let-item pTemplate="item">
                        <div class="flex align-items-center justify-content-between w-full">
                            <div>
                                <i [className]="'pi ' + item.icon + ' mr-2'"></i>
                                <span>{{ item.label }}</span>
                            </div>
                            <small class="text-secondary" style="font-size: 0.7rem; text-transform: uppercase;">
                                {{ item.category }}
                            </small>
                        </div>
                    </ng-template>
                </p-autocomplete>
            </p-dialog>

            <p-dialog header="New Event" 
                [(visible)]="showCreateModal" 
                [modal]="true" 
                [style]="{width: '400px'}">
                <div class="flex flex-column gap-3">
                    <div class="flex flex-column gap-2">
                        <label for="title">Event Title</label>
                        <input pInputText id="title" [(ngModel)]="newEvent.title" />
                    </div>
                    <div class="flex flex-column gap-2">
                        <label for="date">Date</label>
                        <p-datePicker id="date" [(ngModel)]="newEvent.date" appendTo="body"></p-datePicker>
                    </div>
                    <p-button label="Save Event" (onClick)="saveEvent()" icon="pi pi-check"></p-button>
                </div>         
            </p-dialog>
        </div>
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
    imports: [MenubarModule, DialogModule, AutoCompleteModule, DatePickerModule, ButtonModule, CommonModule, FormsModule],
    standalone: true

})
export class TopControlsComponent {
    HolidayService = inject(HolidayService);
    CalenderStore = inject(calenderStore);

    Holidays: Holiday[] = [];
    suggestedItems: any[] = [];
    value: any;

    showCommandPaletteDialog: boolean = false;
    showCreateModal: boolean = false;

    ngOnInit() {
        const currentYear = 2025;
        this.HolidayService.getHolidays(currentYear).subscribe(holidays => {
            this.Holidays = holidays;
        });
    }

    items: MenuItem[] = [
        {
            label: 'Week',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                this.setView('week');
            }
        },
        {
            label: 'Month',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // Handle month view logic here
                this.setView('month');
            }
        },
        {
            label: 'Year',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // Handle year view logic here
                this.setView('year');
            }
        },
        {
            label: 'Today',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                this.setView('today');
            }
        },
        {
            label: "Command",
            icon: "pi pi-fw pi-cog",
            shortcut: '⌘K',
            command: () => {
                this.openCommandPalette();
            }
        }
    ];

    newEvent = {
        title: '',
        date: new Date()
    };
    
    saveEvent() {
        const eventToAdd = {
            id: Math.random().toString(36).substring(2, 9), // Simple unique ID generator
            title: this.newEvent.title,
            date: this.newEvent.date
        };
        this.CalenderStore.addEvent(eventToAdd);
        this.showCreateModal = false;
        // Reset form
        this.newEvent = { title: '', date: new Date() };
    }

    openCommandPalette() {
        this.showCommandPaletteDialog = true;
    }

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        const allOptions: SearchResult[] = [
            // 1. Static Commands
            { label: 'Create New Event', category: 'Action', icon: 'pi-plus', action: () => this.createNew() },
            { label: 'Switch to Month View', category: 'Action', icon: 'pi-table', action: () => this.setView('month') },
            { label: 'Switch to Week View', category: 'Action', icon: 'pi-list', action: () => this.setView('week') },
            { label: 'Switch to Day View', category: 'Action', icon: 'pi-calendar', action: () => this.setView('day') },
            { label: 'Switch to Today View', category: 'Action', icon: 'pi-home', action: () => this.setView('today') },

            ...this.Holidays.map(h => ({
                label: h.name,
                category: 'Holiday',
                icon: 'pi-flag-fill',
                action: () => this.jumpToDate(h.date)
            })),

            // 3. Date Parsing (Check if the query looks like a date) (NLP magic)
            // If they type "25 Dec", suggest jumping to that date
        ];

        this.suggestedItems = allOptions.filter(item =>
            item.label.toLowerCase().includes(query)
        );

    }


    setView(view: string) {
        this.CalenderStore.setView(view as 'month' | 'week' | 'day' | 'today');
    }   

    createNew() {
        this.CalenderStore.addEvent({ id: 'new', title: 'New Event', date: new Date() });
    }

    jumpToDate(date: string) {
        this.CalenderStore.setSelectedDate(new Date(date));
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // Check for Cmd + K (Mac) or Ctrl + K (Windows/Linux)
        const isKPressed = event.key.toLowerCase() === 'k';
        const isModifierPressed = event.metaKey || event.ctrlKey;

        if (isModifierPressed && isKPressed) {
            event.preventDefault(); // Stop the browser from opening its own search/address bar
            this.openCommandPalette();
        }

        if (event.key === 'Escape' && this.showCommandPaletteDialog) {
            this.showCommandPaletteDialog = false;
        }
    }
}