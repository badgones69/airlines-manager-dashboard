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

  readonly aircrafts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  readonly aircraftFlights$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(readonly notificationService: NotificationService) {
    this.refreshAircraftsList();
    this.refreshAircraftFlights();
  }

  /* Aircrafts list loading */
  public refreshAircraftsList(): void {
    this.findAllAircrafts().then((aircrafts) => {
      this.aircrafts$.next(aircrafts);
    });
  }

  /* Aircraft flights loading */
  public refreshAircraftFlights(aircraftFlights?: any): void {
    if (aircraftFlights) {
      this.aircraftFlights$.next(aircraftFlights);
    }
  }

  /* Aircrafts list reading */
  public get aircrafts(): Observable<any[]> {
    return this.aircrafts$;
  }

  /* Aircraft flights reading */
  public get aircraftFlights(): Observable<any> {
    return this.aircraftFlights$;
  }

  /* All aircrafts retrieving */
  public async findAllAircrafts(): Promise<any[]> {
    const { data } = await supabase.from('AIRCRAFT').select(
      `*,
        aircraftHomeHub:AIRPORT!aircraftHomeHub(*),
        aircraftFlights:FLIGHT(
          *,
          flightRoute:ROUTE!flightRoute(
            *,
            routeDepartureHub:AIRPORT!routeDepartureHub(*),
            routeArrivalAirport:AIRPORT!routeArrivalAirport(*)
          )
        )
      `,
    );

    return data || [];
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

      this.refreshAircraftsList();

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
