import { Component, Input, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { HolidayService } from '../../services/holiday-services/holiday.service';
import {Holiday} from '../../models/holiday.models';

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
            <p-menubar [model]="items" />

        <div> 
            <p-dialog header="Calendar Command Palette" [(visible)]="showCommandPaletteDialog" [modal]="true" [closable]="true" [style]="{width: '50vw'}">
            <p>Search your calendar</p>
                <p-autocomplete 
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
    imports: [MenubarModule, DialogModule, AutoCompleteModule],
    standalone: true

})
export class TopControlsComponent {
    HolidayService = inject(HolidayService);

    Holidays: Holiday[] = [];

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
                // Handle week view logic here
            }
        },
        {
            label: 'Month',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // Handle month view logic here
            }
        },
        {
            label: 'Year',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // Handle year view logic here
            }
        },
        {
            label: 'Today',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                // Handle today view logic here
            }
        },
        {
            label: "Command",
            icon: "pi pi-fw pi-cog",
            command: () => {
                this.openCommandPalette();
            }
        }
    ];

    showCommandPaletteDialog: boolean = false;

    openCommandPalette() {
        this.showCommandPaletteDialog = true;
    }

    suggestedItems: any[] = [];
    value: any;
    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        const allOptions: SearchResult[] = [
            // 1. Static Commands
            { label: 'Create New Event', category: 'Action', icon: 'pi-plus', action: () => this.createNew() },
            { label: 'Switch to Month View', category: 'Action', icon: 'pi-table', action: () => this.setView('month') },

            ...this.Holidays.map(h => ({
                label: h.name,
                category: 'Holiday',
                icon: 'pi-flag-fill',
                action: () => this.jumpToDate(h.date)
            })),

            // 3. Date Parsing (Check if the query looks like a date)
            // If they type "25 Dec", suggest jumping to that date
        ];

        this.suggestedItems = allOptions.filter(item =>
            item.label.toLowerCase().includes(query)
        );

    }


    setView(view: string) {

    }

    createNew() {

    }

    jumpToDate(date: string) {

    }
}