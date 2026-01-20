import {
  formatDay,
  getMonthName,
  formatDate,
} from '../../app/shared/utils/date-utils';
import { describe, it, expect } from 'vitest';

describe('DateUtils', () => {
  it('#formatDay should return formatted day number', () => {
    const formattedDay: string = formatDay('01');
    expect(formattedDay).toStrictEqual('1er');
  });

  it('#getMonthName should return month name', () => {
    const monthName: string = getMonthName('10');
    expect(monthName).toStrictEqual('Octobre');
  });

  it('#formatDate should return formatted full date', () => {
    const formattedDate: string = formatDate('2021-10-20');
    expect(formattedDate).toStrictEqual('20 Octobre 2021');
  });
});
