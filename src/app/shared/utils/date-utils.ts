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
