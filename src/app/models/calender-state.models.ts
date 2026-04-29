import { Holiday } from "./holiday.models";

export interface CalenderState {
    currentView: 'month' | 'week' | 'day' | 'today' | 'year';
    selectedDate: Date;
    selectedEventId: string | null;
    holidayList: Holiday[]; 
}

export interface CalenderEvent {
    id: string;
    title: string;
    date: Date;
    description?: string;
}