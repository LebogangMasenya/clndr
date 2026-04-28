
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

export const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const monthsLabels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const timeLabels = Array.from({ length: 24 }, (_, i) => {
  const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour} ${ampm}`;
});