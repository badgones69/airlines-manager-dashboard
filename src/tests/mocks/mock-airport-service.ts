import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAirportService {
  constructor() {}

  public hubs: Observable<any[]> = of([
    {
      airportID: 1,
      airportUUID: 'uuid-airport',
      airportIATA: 'JFK',
      airportName: 'John F. Kennedy',
      airportCity: 'New York',
      airportLatitude: 63.63,
      airportLongitude: 1.1,
      airportCountry: 63,
      airportRegion: 1,
      airportHub: true,
    },
    {
      airportID: 2,
      airportUUID: 'airport-uuid',
      airportIATA: 'CDG',
      airportName: 'Roissy-Charles de Gaulle',
      airportCity: 'Paris',
      airportLatitude: 6.6,
      airportLongitude: 7.7,
      airportCountry: 67,
      airportHub: true,
    },
  ]);

  public findAirport = (airportUUID: string): Promise<any> => {
    return Promise.resolve({
      data: {
        airportID: 21,
        airportUUID: 'airport-created-uuid',
        airportIATA: 'CRE',
        airportName: 'Airport-Created',
        airportCity: 'Cracovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: true,
      },
    });
  };

  public createAirport = (airportToCreate: any): Promise<any> => {
    return Promise.resolve({
      data: {
        airportID: 21,
        airportUUID: 'airport-created-uuid',
        airportIATA: 'CRE',
        airportName: 'Airport-Created',
        airportCity: 'Cracovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: true,
      },
    });
  };

  public updateAirport = (airportToUpdate: any): Promise<any> => {
    return Promise.resolve({
      data: {
        airportID: 21,
        airportUUID: 'airport-created-uuid',
        airportIATA: 'UPD',
        airportName: 'Airport-Updated',
        airportCity: 'Varsovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: true,
      },
    });
  };

  public deleteAirport = (airportUUID: string): Promise<any> => {
    return Promise.resolve({
      status: 204,
    });
  };
}
