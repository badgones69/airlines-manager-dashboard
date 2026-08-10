import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { getStoredItem, removeStoredItem } from '../utils/storage-utils';
import { EXISTING_FLIGHT_NUMBERS_STORAGE_NAME } from '../constants/storage-constants';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  readonly existingFlightNumbers$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(readonly notificationService: NotificationService) {
    this.refreshExistingFlightNumbers();
  }

  /* Existing flight numbers loading */
  public refreshExistingFlightNumbers(): void {
    this.existingFlightNumbers$.next(getStoredItem(EXISTING_FLIGHT_NUMBERS_STORAGE_NAME));
  }

  /* Existing flight numbers reading */
  public get existingFlightNumbers(): Observable<any[]> {
    return this.existingFlightNumbers$;
  }

  /* Existing flight numbers caching */
  public cacheExistingFlightNumbers(flightNumbers: string[]): Observable<any> {
    sessionStorage.setItem(
      EXISTING_FLIGHT_NUMBERS_STORAGE_NAME,
      JSON.stringify(flightNumbers),
    );
    this.refreshExistingFlightNumbers();
    return this.existingFlightNumbers;
  }

  /* Existing flight numbers uncaching */
  public uncacheExistingFlightNumbers(): Observable<any> {
    removeStoredItem(EXISTING_FLIGHT_NUMBERS_STORAGE_NAME);
    this.refreshExistingFlightNumbers();
    return this.existingFlightNumbers;
  }

  /* All existing flight numbers retrieving */
  public async findAllExistingFlightNumbers(): Promise<any[]> {
    const { data } = await supabase.from('FLIGHT').select('flightNumber');

    return data || [];
  }

  /* Flight creation */
  public async createFlight(flightToCreate: any, aircraftId: number): Promise<any> {
    const { flightNumber, flightRoute, flightTakeOff, flightLanding, flightReturn } = flightToCreate;

    const response = await supabase
    .from('FLIGHT')
    .insert({
        flightUUID: uuidv7(),
        flightNumber,
        flightRoute,
        flightTakeOff,
        flightLanding,
        flightAircraft: aircraftId,
        flightReturn,
    })
    .select();

    return response;
  }
}
