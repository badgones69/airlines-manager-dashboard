import { inject, Injectable } from '@angular/core';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { NotificationService } from './notification.service';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../labels/errors';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlightService } from './flight.service';

@Injectable({
  providedIn: 'root',
})
export class AircraftService {
  public flightService: FlightService = inject(FlightService);

  readonly aircraftFlights$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(readonly notificationService: NotificationService) {
    this.refreshAircraftFlights();
  }

  /* Aircraft flights loading */
  public refreshAircraftFlights(aircraftFlights?: any): void {
    if (aircraftFlights) {
      this.aircraftFlights$.next(aircraftFlights);
    }
  }

  /* Aircraft flights reading */
  public get aircraftFlights(): Observable<any> {
    return this.aircraftFlights$;
  }

  /* Aircraft creation */
  public async createAircraft(aircraftToCreate: any): Promise<any> {
    const { aircraftRegistration, aircraftManufacturer, aircraftModel, aircraftHomeHub, aircraftFlights } = aircraftToCreate;

    const aircraftResponse = await supabase
      .from('AIRCRAFT')
      .insert({
        aircraftUUID: uuidv7(),
        aircraftRegistration,
        aircraftManufacturer,
        aircraftModel,
        aircraftHomeHub,
      })
      .select();

    if (aircraftResponse.status.toString().startsWith('20')) {
      const aircraftId: number = aircraftResponse.data![0]!.aircraftID;
      const flightsResponsesStatus: string[] = [];

      await Promise.all(aircraftFlights.map(async (flight: any) => {
        const flightResponse = await this.flightService.createFlight(flight, aircraftId);

        if (flightResponse.status.toString().startsWith('20')) {
          flightsResponsesStatus.push(flightResponse.status.toString());
        }
      }));

      if (flightsResponsesStatus.length == aircraftFlights.length) {
        /* Flight numbers caching */
        this.flightService.findAllExistingFlightNumbers().then((existingFlightNumbers) => {
          this.flightService.cacheExistingFlightNumbers(existingFlightNumbers.map((flight) => flight.flightNumber));
        });
        return aircraftResponse.data;
      } else {
        /* Technical error notification showing */
        this.notificationService.showErrorNotification(
          `${getTechnicalErrorTitle()}`,
          `${getTechnicalErrorMessage()}`,
        );
      }
    } else {
      /* Technical error notification showing */
      this.notificationService.showErrorNotification(
        `${getTechnicalErrorTitle()}`,
        `${getTechnicalErrorMessage()}`,
      );
    }
  }
}
