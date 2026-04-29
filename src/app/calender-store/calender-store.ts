import {  patchState,
  signalStore,
  withComputed,
  withMethods,
    withProps,
        withHooks,
  withState} from '@ngrx/signals';
import {
  addEntity,
  removeEntities,
  updateAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import {CalenderState, CalenderEvent} from '../models/calender-state.models';
import {HolidayService} from '../services/holiday.service';
import { format } from 'date-fns';
import { computed, inject } from '@angular/core';

const initialState: CalenderState = {
    currentView: 'month',
    selectedDate: new Date(2025, 0, 1),
    selectedEventId: null,
    holidayList: []
};

export const calenderStore = signalStore(
     { providedIn: 'root' },
    withState(initialState),
    withProps(() => ({
        holidayService: inject(HolidayService)
    })),
    withEntities<CalenderEvent>(),
    withComputed(({currentView, selectedDate, selectedEventId, entityMap, entities, holidayList}) => ({
        currentViewLabel: currentView,
        selectedDateLabel: selectedDate,
        selectedEventIdLabel: selectedEventId,
        eventsLabel: entities,
        selectedEvent: computed(() => {
            const id = selectedEventId();
            return id ? entityMap()[id] : null; // Instant lookup, woww
        }),
        holidayListObject: holidayList,
        monthName: computed(() => format(selectedDate(), 'MMMM')), // "January"
        yearLabel: computed(() => format(selectedDate(), 'yyyy')), // "2026"
        dayNumber: computed(() => format(selectedDate(), 'do')),   // "1st", "2nd"
        displayLabel: computed(() => format(selectedDate(), 'MMMM yyyy'))
    })),
    withMethods((store) => ({
        setView(view: 'month' | 'week' | 'day' | 'today' | 'year') {
            patchState(store, { currentView: view });
        },
        setSelectedDate(date: Date) {
            date = new Date(2025, date.getMonth(), date.getDate());
            patchState(store, { selectedDate: date });
        },
        setSelectedEventId(eventId: string | null) {
            patchState(store, { selectedEventId: eventId });
        },
        addEvent(event: CalenderEvent) {
            patchState(store, addEntity(event));
        },
        removeEvent(eventId: string) {
            patchState(store, removeEntities([eventId]));
        },
        updateEvent(eventId: string, updatedData: Partial<CalenderEvent>) {
            patchState(store, updateAllEntities((event) => {
                if (event.id === eventId) {
                    return { ...event, ...updatedData };
                }
                return event;
            }));
        }
    })),
   withHooks({
    onInit(store) {
        store.holidayService.getHolidays(2025).subscribe(holidays => {
            patchState(store, { holidayList: holidays });
        });
    },
    onDestroy() {
        // unsubscribe
    }
   })

);