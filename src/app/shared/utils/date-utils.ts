export function formatDate(date: string): string {
  const fullDate: string[] = date.split('-');
  return `${formatDay(fullDate[2])} ${getMonthName(fullDate[1])} ${
    fullDate[0]
  }`;
}

export function formatDay(dayNumber: string): string {
  const dayFirstDigit = dayNumber.charAt(0);
  if (dayFirstDigit === '0') {
    dayNumber = dayNumber.replace(dayFirstDigit, '');

    if (dayNumber === '1') {
      dayNumber += 'er';
    }
  }
  return dayNumber;
}

export function getMonthName(monthNumber: string): string {
  switch (monthNumber) {
    case '01':
      return 'Janvier';
    case '02':
      return 'Février';
    case '03':
      return 'Mars';
    case '04':
      return 'Avril';
    case '05':
      return 'Mai';
    case '06':
      return 'Juin';
    case '07':
      return 'Juillet';
    case '08':
      return 'Août';
    case '09':
      return 'Septembre';
    case '10':
      return 'Octobre';
    case '11':
      return 'Novembre';
    case '12':
      return 'Décembre';
    default:
      return 'xxx';
  }
}

function splitTime(time: string): string [] {
  return time.split(':');
}

function getTimeHours(time: string): number {
  return Number.parseInt(splitTime(time)[0]);
}

function getTimeMinutes(time: string): number {
  return Number.parseInt(splitTime(time)[1]);
}

function addHoursToDateTime(date: Date, hours: number): number {
  return date.getHours() + hours;
}

export function addMinutesToDateTime(date: Date, minutes: number): number {
 return date.getMinutes() + minutes;
}

export function convertDateTimeInMinutes(date: Date): number {
  let dateTimeInMinutes: number = date.getHours() * 60 + date.getMinutes();

  if (date.getDate() == new Date().getDate() + 1) {
    dateTimeInMinutes += 1440;
  }
  return dateTimeInMinutes;
}

export function convertStringTimeInDate(stringTime: string, isLandingTime: boolean): Date {
  let date: Date = new Date();
  const hours: number = getTimeHours(stringTime);
  const minutes: number = getTimeMinutes(stringTime);

  date.setHours(hours, minutes, 0);

  if (isLandingTime && hours == 0 && minutes == 0) {
    date.setHours(hours, minutes + 1440, 0);
  }
  return date;
}

export function getLanding(takeOff: Date, landingTime: string): Date {
  let landing: Date = new Date();
  landing.setHours(addHoursToDateTime(takeOff, getTimeHours(landingTime)), addMinutesToDateTime(takeOff, getTimeMinutes(landingTime)), 0);
  return landing;
}

export function hasSchedulesOverlap(flights: any[]): boolean {
  const flightsSorted: any[] = [...flights]
    .map(flight => ({
      ...flight,
      start: convertDateTimeInMinutes(flight.takeOff),
      end: convertDateTimeInMinutes(flight.landing),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i: number = 0; i < flightsSorted.length; i++) {
    if (
      i < flightsSorted.length - 1 &&
      flightsSorted[i + 1].start < flightsSorted[i].end
    ) {
      return true;
    }
  }
  return false;
}

export function hasSchedulesInconsistencies(flightsDurationsByDestination: Record<string, string[]>): boolean {
  return Object.values(flightsDurationsByDestination)
  .some((flightDurations) => flightDurations.length > 1);
}
