import { Injectable } from '@angular/core';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AirportService {

  constructor() {}

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

    return data;
  }
}
