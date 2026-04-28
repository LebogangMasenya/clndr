import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  HolidayResponse } from '../../models/holiday.models';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class HolidayService {
    private apikey = process.env['HOLIDAY_API'];

    constructor(private http: HttpClient) {}

    public getHolidays(year: number) {
        const url = `https://holidayapi.com/v1/holidays?key=${this.apikey}&country=ZA&year=${year}`;
        return this.http.get<HolidayResponse>(url).pipe(
            map(response => response.holidays)
        ); // cache this response for the year to avoid multiple API calls
    }
}