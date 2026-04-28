import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {  Holiday, HolidayResponse } from '../models/holiday.models';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HolidayService {
    private apikey = environment.holidayApiKey || ''; 
    private cache$? : Observable<Holiday[]>; // Cache for holiday data  
    constructor(private http: HttpClient) {}

    public getHolidays(year: number) {
        const url = `https://holidayapi.com/v1/holidays?key=${this.apikey}&country=ZA&year=${year}`;
        if (!this.cache$) {
            this.cache$ = this.http.get<HolidayResponse>(url).pipe(
                map(res => res.holidays),
                shareReplay(1) // Keeps the result in memory
            );
        }
        return this.cache$;
    }
}