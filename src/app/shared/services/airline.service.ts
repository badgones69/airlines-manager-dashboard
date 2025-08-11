import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import supabase from '../constants/services-constants';

@Injectable({
  providedIn: 'root',
})
export class AirlineService {
  readonly airlines$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this.refreshAirlinesList();
  }

  /* Airlines list loading */
  public refreshAirlinesList(): void {
    this.findAllAirlines().then((airlines) => {
      this.airlines$.next(airlines);
    });
  }

  /* Airlines list reading */
  public get airlines(): Observable<any[]> {
    return this.airlines$;
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
}
