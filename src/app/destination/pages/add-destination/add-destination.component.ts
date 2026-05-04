import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';
import { Airport } from '../../../shared/models/Airport';
import { AirportFormComponent } from '../../../shared/components/airport-form/airport-form.component';
import { ADD_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';
import { AirportService } from '../../../shared/services/airport.service';
import {
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../../shared/labels/forms/destination-form';
import { Router } from '@angular/router';

@Component({
  selector: 'add-destination',
  standalone: true,
  imports: [AirportFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './add-destination.component.html',
  styleUrls: [],
})
export class AddDestinationComponent implements OnInit {
  public authenticatedUser!: User;

  public initDestinationToAdd!: Airport;
  public formMode: string = ADD_FORM_MODE;
  public formTitle: string = getDestinationFormTitle();

  /* Injections */
  public userService: UserService = inject(UserService);
  public airportService: AirportService = inject(AirportService);
  public router: Router = inject(Router);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Destination adding */
  addDestination(destination: any): void {
    // Destination creation
    this.airportService.createAirport(destination).then((result: any) => {
      // If destination is created
      if (result.data) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getDestinationFormTitle()}`.toUpperCase(),
          `${getDestinationFormSuccessNotificationMessage(this.formMode)}`,
        );
        // Redirection to destinations list
        this.router.navigate(['destinations', 'list']);
      } else {
        /* Technical error notification showing */
        this.notificationService.showErrorNotification(
          `${getTechnicalErrorTitle()}`,
          `${getTechnicalErrorMessage()}`,
        );
      }
    });
  }
}
