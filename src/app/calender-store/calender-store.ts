import {  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState} from '@ngrx/signals';
  import {
  addEntity,
  removeEntities,
  updateAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import {CalenderState, CalenderEvent} from '../models/calender-state.models';

const initialState: CalenderState = {
    currentView: 'month',
    selectedDate: new Date(),
    events: []
};

export const calenderStore = signalStore(
     { providedIn: 'root' },
    withState(initialState),
    withEntities<CalenderEvent>(),
    withMethods((store) => ({
        setView(view: 'month' | 'week' | 'day' | 'today') {
            patchState(store, { currentView: view });
        },
        setSelectedDate(date: Date) {
            patchState(store, { selectedDate: date });
        },
        addEvent(event: CalenderEvent) {
            patchState(store, addEntity(event));
        },
        removeEvent(eventId: string) {
            patchState(store, removeEntities([eventId]));
        }
    }))

);