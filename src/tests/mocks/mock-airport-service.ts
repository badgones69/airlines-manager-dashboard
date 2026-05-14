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
      airportUUID: 'uuid-hub',
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
      airportUUID: 'hub-uuid',
      airportIATA: 'CDG',
      airportName: 'Roissy-Charles de Gaulle',
      airportCity: 'Paris',
      airportLatitude: 6.6,
      airportLongitude: 7.7,
      airportCountry: 67,
      airportHub: true,
    },
  ]);

  public destinations: Observable<any[]> = of([
    {
      airportID: 3,
      airportUUID: 'uuid-destination',
      airportIATA: 'LGA',
      airportName: 'La Guardia',
      airportCity: 'New York',
      airportLatitude: 63.63,
      airportLongitude: 1.1,
      airportCountry: 63,
      airportRegion: 1,
      airportHub: false,
    },
    {
      airportID: 4,
      airportUUID: 'destination-uuid',
      airportIATA: 'IAH',
      airportName: 'George Bush',
      airportCity: 'Houston',
      airportLatitude: 4.4,
      airportLongitude: 63.63,
      airportCountry: 63,
      airportRegion: 4,
      airportHub: false,
    },
  ]);

  public findAirport = (airportUUID: string): Promise<any> => {
    return Promise.resolve({
      data: {
        airportID: 21,
        airportUUID: airportUUID,
        airportIATA: 'CRE',
        airportName: 'Airport-Created',
        airportCity: 'Cracovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: airportUUID === 'hub-created-uuid',
      },
    });
  };

  public createAirport = (airportToCreate: any): Promise<any> => {
    return Promise.resolve({
      airportID: 21,
      airportUUID: airportToCreate.airportUUID,
      airportIATA: 'CRE',
      airportName: 'Airport-Created',
      airportCity: 'Cracovie',
      airportLatitude: 1.5,
      airportLongitude: 5.5,
      airportCountry: 155,
      airportHub: airportToCreate.airportHub,
    });
  };

  public updateAirport = (airportToUpdate: any): Promise<any> => {
    return Promise.resolve({
      airportID: 21,
      airportUUID: airportToUpdate.airportUUID,
      airportIATA: 'UPD',
      airportName: 'Airport-Updated',
      airportCity: 'Varsovie',
      airportLatitude: 1.5,
      airportLongitude: 5.5,
      airportCountry: 155,
      airportHub: airportToUpdate.airportHub,
    });
  };

  public deleteAirport = (airportUUID: string): Promise<any> => {
    return Promise.resolve({
      status: 204,
    });
  };
}
