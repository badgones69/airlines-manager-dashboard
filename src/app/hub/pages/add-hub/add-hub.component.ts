import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
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
  getHubFormSuccessNotificationMessage,
  getHubFormTitle,
} from '../../../shared/labels/forms/hub-form';

@Component({
  selector: 'add-hub',
  standalone: true,
  imports: [AirportFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './add-hub.component.html',
  styleUrls: [],
})
export class AddHubComponent implements OnInit {
  public authenticatedUser!: User;

  public initHubToAdd!: Airport;
  public formMode: string = ADD_FORM_MODE;
  public formTitle: string = getHubFormTitle();

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

  /* Hub adding */
  addHub(hub: any): void {
    // Hub creation
    this.airportService.createAirport(hub).then((result: any) => {
      // If hub is created
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getHubFormTitle()}`.toUpperCase(),
          `${getHubFormSuccessNotificationMessage(this.formMode)}`,
        );
        // Redirection to hubs list
        this.router.navigate(['hubs', 'list']);
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
