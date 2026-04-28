
export interface Holiday {
  name: string;
  date: string;
  uuid: string;
  weekday: {
    date: {
        name: string;
        numeric: string;
    }
  }
}
export interface HolidayResponse {
  holidays: Holiday[];
}