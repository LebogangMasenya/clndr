export interface CalenderState {
    currentView: 'month' | 'week' | 'day' | 'today';
    selectedDate: Date;
    events: CalenderEvent[]; 
    selectedEventId: string | null;
}

export interface CalenderEvent {
    id: string;
    title: string;
    date: Date;
    description?: string;
}