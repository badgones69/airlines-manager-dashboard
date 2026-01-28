import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import supabase from '../constants/services-constants';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  readonly airlines$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  readonly airlineLogo$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '',
  );

  constructor() {
    this.refreshAirlinesList();
    this.refreshAirlineLogo();
  }

  /* Airlines list loading */
  public refreshAirlinesList(): void {
    this.findAllAirlines().then((airlines) => {
      this.airlines$.next(airlines);
    });
  }

  /* Airline logo loading */
  public refreshAirlineLogo(newAirlineLogo?: string): void {
    if (newAirlineLogo) {
      this.airlineLogo$.next(newAirlineLogo);
    } else {
      this.findAirline().then((airline) => {
        this.airlineLogo$.next(airline?.airlineLogo ?? '');
      });
    }
  }

  /* Airlines list reading */
  public get airlines(): Observable<any[]> {
    return this.airlines$;
  }

  /* Airline logo reading */
  public get airlineLogo(): Observable<string> {
    return this.airlineLogo$;
  }

  /* All airlines retrieving */
  public async findAllAirlines(): Promise<any[]> {
    const { data } = await supabase.from('AIRLINE').select();

    return data || [];
  }

  /* Airline retrieving */
  public async findAirline(): Promise<any> {
    const { data } = await supabase.from('AIRLINE').select().eq('airlineID', 1);

    return data?.[0];
  }

  /* Airline updating */
  public async updateAirline(airlineUpdated: any): Promise<any> {
    const {
      airlineUUID,
      airlineICAO,
      airlineName,
      airlineLogo,
      airlineNationality,
    } = airlineUpdated;

    const data = await supabase
      .from('AIRLINE')
      .update({
        airlineICAO,
        airlineName,
        airlineLogo,
        airlineNationality,
      })
      .eq('airlineUUID', airlineUUID)
      .select();

    this.refreshAirlineLogo();
    this.refreshAirlinesList();
    return data;
  }
}
