import { Injectable } from '@angular/core';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirportService {

  readonly hubs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this.refreshHubsList();
  }

  /* Hubs list loading */
  public refreshHubsList(): void {
    this.findAllHubs().then((hubs) => {
      this.hubs$.next(hubs);
    });
  }

  /* Hubs list reading */
  public get hubs(): Observable<any[]> {
    return this.hubs$;
  }

  /* All hubs retrieving */
  public async findAllHubs(): Promise<any[]> {
    const { data } = await supabase.from('AIRPORT').select().eq('airportHub', true);

    return data || [];
  }

  /* Airport creation */
  public async createAirport(airportToCreate: any): Promise<any> {
    const { airportIATA, airportName, airportCity, airportLatitude, airportLongitude, airportCountry, airportRegion, airportHub } =
      airportToCreate;

    const data = await supabase
      .from('AIRPORT')
      .insert({
        airportUUID: uuidv7(),
        airportIATA,
        airportName,
        airportCity,
        airportLatitude,
        airportLongitude,
        airportCountry,
        airportRegion,
        airportHub
      })
      .select();

    this.refreshHubsList();  
    return data;
  }
}
