import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AircraftService } from '../../../shared/services/aircraft.service';
import { User } from '../../../shared/dto/User';
import { Aircraft } from '../../../shared/dto/Aircraft';
import { AircraftFormComponent } from '../../form-component/aircraft-form.component';
import { ADD_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import {
  getAircraftFormSuccessNotificationMessage,
  getAircraftFormTitle,
} from '../../../shared/labels/forms/aircraft-form';

@Component({
  selector: 'add-aircraft',
  standalone: true,
  imports: [AircraftFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './add-aircraft.component.html',
  styleUrls: [],
})
export class AddAircraftComponent implements OnInit {
  public authenticatedUser!: User;

  public initAircraftToAdd!: Aircraft;
  public formMode: string = ADD_FORM_MODE;

  /* Injections */
  public userService: UserService = inject(UserService);
  public aircraftService: AircraftService = inject(AircraftService);
  public router: Router = inject(Router);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Aircraft adding */
  addAircraft(aircraft: any): void {
    // Aircraft creation
    this.aircraftService.createAircraft(aircraft).then((result: any) => {
      // If aircraft is created
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getAircraftFormTitle()}`.toUpperCase(),
          `${getAircraftFormSuccessNotificationMessage(this.formMode)}`,
        );
      }
    });
  }
}
