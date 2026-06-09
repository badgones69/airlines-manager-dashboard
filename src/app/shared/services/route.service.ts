import { Injectable } from '@angular/core';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { getFormModeLabel } from '../labels/commons/form-common';
import { ADD_FORM_MODE, EDIT_FORM_MODE } from '../constants/forms-constants';
import { getExistingRouteErrorNotificationMessage, getRouteFormTitle } from '../labels/forms/route-form';
import { NotificationService } from './notification.service';
import { getTechnicalErrorMessage, getTechnicalErrorTitle } from '../labels/errors';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  readonly routes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(readonly notificationService: NotificationService) {
    this.refreshRoutesList();
  }

  /* Routes list loading */
  public refreshRoutesList(): void {
    this.findAllRoutes().then((routes) => {
      this.routes$.next(routes);
    });
  }

  /* Routes list reading */
  public get routes(): Observable<any[]> {
    return this.routes$;
  }

  /* All routes retrieving */
  public async findAllRoutes(): Promise<any[]> {
    const { data } = await supabase
    .from('ROUTE')
    .select(
      `*,
        routeDepartureHub:AIRPORT!routeDepartureHub(*),
        routeArrivalAirport:AIRPORT!routeArrivalAirport(*)
      `
    );

    return data || [];
  }

  /* Route retrieving */
  public async findRoute(routeUUID: string): Promise<any> {
    const { data } = await supabase
      .from('ROUTE')
      .select(
        `*,
          routeDepartureHub:AIRPORT!routeDepartureHub(*),
          routeArrivalAirport:AIRPORT!routeArrivalAirport(*)
        `
      )
      .eq('routeUUID', routeUUID);

    return data?.[0];
  }

  /* Route creation */
  public async createRoute(routeToCreate: any): Promise<any> {
    const {
      routeDepartureHub,
      routeArrivalAirport,
    } = routeToCreate;

    const response = await supabase
      .from('ROUTE')
      .insert({
        routeUUID: uuidv7(),
        routeDepartureHub,
        routeArrivalAirport,
      })
      .select();

    this.refreshRoutesList();

    if (response.status === 409) {
      /* Existing route error notification showing */
      this.notificationService.showErrorNotification(
        `${getFormModeLabel(
          ADD_FORM_MODE,
        )} ${getRouteFormTitle()}`.toUpperCase(),
        `${getExistingRouteErrorNotificationMessage()}`,
      );
    } else if (response.status.toString().startsWith('20')) {
      return response.data;
    } else {
      /* Technical error notification showing */
      this.notificationService.showErrorNotification(
        `${getTechnicalErrorTitle()}`,
        `${getTechnicalErrorMessage()}`,
      );
    }
  }

  /* Route updating */
  public async updateRoute(routeUpdated: any): Promise<any> {
    const {
      routeUUID,
      routeDepartureHub,
      routeArrivalAirport,
    } = routeUpdated;

    const response = await supabase
      .from('ROUTE')
      .update({
        routeDepartureHub,
        routeArrivalAirport,
      })
      .eq('routeUUID', routeUUID)
      .select();

    this.refreshRoutesList();
    
    if (response.status === 409) {
      /* Existing route error notification showing */
      this.notificationService.showErrorNotification(
        `${getFormModeLabel(
          EDIT_FORM_MODE,
        )} ${getRouteFormTitle()}`.toUpperCase(),
        `${getExistingRouteErrorNotificationMessage()}`,
      );
    } else if (response.status.toString().startsWith('20')) {
      return response.data;
    } else {
      /* Technical error notification showing */
      this.notificationService.showErrorNotification(
        `${getTechnicalErrorTitle()}`,
        `${getTechnicalErrorMessage()}`,
      );
    }
  }
}
