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
    selectedDate: new Date(),
    events: [],
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
    withComputed((state) => ({
        currentView: state.currentView,
        selectedDate: state.selectedDate,
        events: state.events,
        selectedEventId: state.selectedEventId,
        holidayList: state.holidayList,
        monthName: computed(() => format(state.selectedDate(), 'MMMM')), // "January"
        yearLabel: computed(() => format(state.selectedDate(), 'yyyy')), // "2026"
        dayNumber: computed(() => format(state.selectedDate(), 'do')),   // "1st", "2nd"
        displayLabel: computed(() => format(state.selectedDate(), 'MMMM yyyy'))
    })),
    withMethods((store) => ({
        setView(view: 'month' | 'week' | 'day' | 'today' | 'year') {
            patchState(store, { currentView: view });
        },
        setSelectedDate(date: Date) {
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