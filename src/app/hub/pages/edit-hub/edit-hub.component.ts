import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';
import { Airport } from '../../../shared/models/Airport';
import { AirportFormComponent } from '../../../shared/components/airport-form/airport-form.component';
import { EDIT_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { AirportService } from '../../../shared/services/airport.service';
import {
  getHubFormSuccessNotificationMessage,
  getHubFormTitle,
} from '../../../shared/labels/forms/hub-form';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';

@Component({
  selector: 'edit-hub',
  standalone: true,
  imports: [AirportFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './edit-hub.component.html',
  styleUrls: [],
})
export class EditHubComponent implements OnInit {
  public authenticatedUser!: User;

  public initHubToEdit!: Airport;
  public formMode: string = EDIT_FORM_MODE;
  public formTitle: string = getHubFormTitle();

  public airportMapper: AirportMapper = new AirportMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public airportService: AirportService = inject(AirportService);
  public router: Router = inject(Router);
  public route: ActivatedRoute = inject(ActivatedRoute);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    if (history.state.hub) {
      this.initHubToEdit = JSON.parse(history.state.hub);
    }

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Hub editing */
  editHub(hub: any): void {
    hub.airportUUID = this.initHubToEdit.uuid;
    // Hub updating
    this.airportService.updateAirport(hub).then((result: any) => {
      // If hub is updated
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
      }
    });
  }
}
