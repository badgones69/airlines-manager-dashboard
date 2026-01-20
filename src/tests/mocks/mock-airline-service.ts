import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAirlineService {
  constructor() {}

  public airlineLogo: Observable<any> = of('X_BG-CB_LT-W');

  public findAirline = (): Promise<any> => {
    return Promise.resolve({
      airlineID: 8,
      airlineUUID: 'airline-uuid',
      airlineICAO: 'XXX',
      airlineName: 'XXX Airlines',
      airlineLogo: 'X_BG-CB_LT-W',
      airlineNationality: 20,
    });
  };

  public updateAirline = (airlineToUpdate: any): Promise<any> => {
    return Promise.resolve({
      data: {
        airlineID: 8,
        airlineUUID: 'airline-uuid',
        airlineICAO: 'FRE',
        airlineName: 'FRE Airlines',
        airlineLogo: 'F_BG-G_LT-W',
        airlineNationality: 98,
      },
    });
  };
}
