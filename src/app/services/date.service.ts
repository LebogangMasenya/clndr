import {Injectable, inject} from '@angular/core';
import {calenderStore} from '../calender-store/calender-store';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval 
} from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  CalenderStore = inject(calenderStore);

  public getCurrentDate(): Date {
    return new Date();
  }

  public getWeekDates(date: Date): Date[] {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday as the first day of the week
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }

  public getMonthDates(date: Date): Date[] {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthStartWeekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const monthEndWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: monthStartWeekStart, end: monthEndWeekEnd });
  }

  public createEvent(title: string, date: Date, description?: string) {
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9), // Simple unique ID generator
      title,
      date,
      description
    };
    this.CalenderStore.addEvent(newEvent);
  }
  
}