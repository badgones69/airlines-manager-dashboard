import { Injectable } from '@angular/core';
import { getCountryById } from '../../app/shared/utils/geographical-utils';

@Injectable({
    providedIn: 'root',
})
export class MockAirlineService {
  constructor() {}

  public findAirline = (): Promise<any> => {
    return Promise.resolve(
      {
        airlineID: 8,
        airlineUUID: 'airline-uuid',
        airlineICAO: 'XXX',
        airlineName: 'XXX Airlines',
        airlineLogo: 'X_BG-CB_LT-W',
        airlineNationality: getCountryById(20)
      }
    );
  }
}