import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '../../models/holiday.models';
import { calenderStore } from '../../calender-store/calender-store';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { CreateEventComponent } from '../create-modal/create-event.component';
interface SearchResult {
    label: string;
    icon: string;
    category: string;
    action: () => void;
}


@Component({
    selector: 'top-controls',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
  <div class="flex items-center justify-between p-4 border-b w-full h-16 bg-white flex-none">
    
    <div class="flex items-center gap-2 min-w-30">
        <h1 class="text-xl font-black tracking-tighter text-blue-600">CLNDR.io</h1>
    </div>

    <div class="hidden md:flex flex-1 px-4 overflow-hidden">
        <p-menubar [model]="items" class="n-menubar" />
    </div>

    <div class="md:hidden flex items-center">
        <p-button icon="pi pi-bars" [text]="true" severity="secondary" (onClick)="mobileMenuVisible =true" >
        </p-button>
    </div>


    <div class="flex items-center gap-3 min-w-25 justify-end">
        <p-button icon="pi pi-search" [text]="true" (onClick)="openCommandPalette()">
            <span class="text-xs text-slate-400 ml-2">⌘K</span>
        </p-button>

              <div class="hidden">
            <create-event [(showCreateModal)]="showCreateModal"></create-event>
        </div>  

    </div>

    <p-dialog header="Calendar Command Palette" [(visible)]="showCommandPaletteDialog" appendTo="body" [modal]="true" [closable]="true" [style]="{width: '50vw', height: '30vh'}">
        <p-autocomplete 
            #searchQuery
            [(ngModel)]="value" 
            [suggestions]="suggestedItems" 
            (completeMethod)="search($event)"
            optionLabel="label"
            (onSelect)="handleCommandSelect($event)"
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

<p-drawer [(visible)]="mobileMenuVisible" position="top" [modal]="false" [style]="{height: 'auto'}"> 
    <ng-template pTemplate="content">
        <ul class="flex flex-col gap-1 py-4">
            @for (item of items; track item.label) {
                <li>
                    <button 
                        type="button"
                        (click)="executeCommand(item, $event)"
                        class="w-full text-left flex items-center gap-3 p-3 m-0 rounded-md hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent group">
                        
                        <i [class]="item.icon + ' text-slate-500 group-hover:text-slate-700'"></i>
                        
                        <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            {{ item.label }}
                        </span>
                    </button>
                </li>
            }
        </ul>
    </ng-template>
</p-drawer>

     
      
  `,
    styles: `
::ng-deep .n-menubar {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important; 
}

::ng-deep .n-menubar .p-menubar-root-list {
    background: transparent !important;
}

::ng-deep .n-menubar .p-menuitem-link {
    padding: 0.5rem 0.75rem !important;
    color: blue !important;
}

::ng-deep .n-menubar .p-menubar-item-label {
    color: #2563eb !important; 
    font-weight: 500;
}

::ng-deep .n-menubar .p-menubar-item-content:hover {
background-color: rgba(0, 0, 0, 0.03) !important;
    border-radius: 6px;
}
    
  `,
    imports: [MenubarModule, DialogModule, AutoCompleteModule, DatePickerModule, ButtonModule, CommonModule, FormsModule, DrawerModule, CreateEventComponent],
    standalone: true
})
export class TopControlsComponent {
    HolidayService = inject(HolidayService);
    CalenderStore = inject(calenderStore);
    private cdr = inject(ChangeDetectorRef);
    private zone = inject(NgZone);

    Holidays: Holiday[] = [];
    suggestedItems: any[] = [];
    value: any;

    showCommandPaletteDialog: boolean = false;
    showCreateModal: boolean = false;
    mobileMenuVisible: boolean = false;

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
                this.setView('month');
            }
        },
        {
            label: 'Year',
            icon: 'pi pi-fw pi-calendar',
            command: () => {
                this.setView('year');
            }
        }
    ];

    executeCommand(item: MenuItem, event: Event) {
        this.zone.run(() => {
            if(item.command) {
                item.command({originalEvent: event, item: item})
            }

            this.mobileMenuVisible = false;

            this.cdr.markForCheck()
        })
    }

    openCommandPalette() {
        this.showCommandPaletteDialog = true;
    }

    openCreateModal() {
       this.zone.run(() => {
        this.showCommandPaletteDialog = false;
        this.showCreateModal = true;
        this.cdr.markForCheck();
       })
    }

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        const allOptions: SearchResult[] = [
            // 1. Static Commands
            { label: 'Create New Event', category: 'Action', icon: 'pi-plus', action: () => this.openCreateModal() },
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


    handleCommandSelect(event: { value: SearchResult }) {
        if (event.value && event.value.action) {
            event.value.action(); // This calls this.openCreateModal()
        }
    }


    setView(view: string) {
        this.CalenderStore.setView(view as 'month' | 'week' | 'day' | 'today' | 'year');
        this.cdr.markForCheck();
    }



    jumpToDate(date: string) {
        this.CalenderStore.setView('week');
        this.CalenderStore.setSelectedDate(new Date(date));
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // Check for Cmd + K (Mac) or Ctrl + K (Windows/Linux)
        const isKPressed = event.key.toLowerCase() === 'k';
        const isIPressed = event.key.toLowerCase() === 'i';
        const isModifierPressed = event.metaKey || event.ctrlKey;

        if (isModifierPressed && isIPressed) {
            event.preventDefault();
            this.zone.run(() => {
                this.openCommandPalette();
                this.cdr.markForCheck();
            });
        }

        if (isModifierPressed && isKPressed) {
            event.preventDefault(); // Prevents browser-level search bar from popping up
            this.openCreateModal();
        }

        if (event.key === 'Escape' && this.showCommandPaletteDialog) {
            this.showCommandPaletteDialog = false;
            this.cdr.markForCheck();
        }
    }
}