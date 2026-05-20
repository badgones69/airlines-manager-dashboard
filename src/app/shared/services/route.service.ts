import { Injectable } from '@angular/core';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { getFormModeLabel } from '../labels/commons/form-common';
import { ADD_FORM_MODE } from '../constants/forms-constants';
import { getExistingRouteErrorNotificationMessage, getRouteFormTitle } from '../labels/forms/route-form';
import { NotificationService } from './notification.service';
import { getTechnicalErrorMessage, getTechnicalErrorTitle } from '../labels/errors';

@Injectable({
  providedIn: 'root',
})
export class RouteService {

  constructor(readonly notificationService: NotificationService) {}

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
}
