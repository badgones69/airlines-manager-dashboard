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

  /* Airport retrieving */
  public async findAirport(airportUUID: string): Promise<any> {
    const { data } = await supabase
      .from('AIRPORT')
      .select()
      .eq('airportUUID', airportUUID);

    return data?.[0];
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

  /* Airport updating */
  public async updateAirport(airportUpdated: any): Promise<any> {
    const { airportUUID, airportIATA, airportName, airportCity, airportLatitude, airportLongitude, airportCountry, airportRegion } =
      airportUpdated;

    const data = await supabase
      .from('AIRPORT')
      .update({
        airportIATA,
        airportName,
        airportCity,
        airportLatitude,
        airportLongitude,
        airportCountry,
        airportRegion,
      })
      .eq('airportUUID', airportUUID)
      .select();

    this.refreshHubsList();
    return data;
  }
}
