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
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';
import { AirportService } from '../../../shared/services/airport.service';
import {
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../../shared/labels/forms/destination-form';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';
import { getIATAUniquenessErrorMessage } from '../../../shared/labels/commons/airport-common';

@Component({
  selector: 'edit-destination',
  standalone: true,
  imports: [AirportFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './edit-destination.component.html',
  styleUrls: [],
})
export class EditDestinationComponent implements OnInit {
  public authenticatedUser!: User;

  public initDestinationToEdit!: Airport;
  public formMode: string = EDIT_FORM_MODE;
  public formTitle: string = getDestinationFormTitle();

  public destinationUUID!: string;
  public airportMapper: AirportMapper = new AirportMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public airportService: AirportService = inject(AirportService);
  public router: Router = inject(Router);

  constructor(
    readonly notificationService: NotificationService,
    readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.destinationUUID = this.route.snapshot.paramMap.get('uuid') ?? '';

    this.airportService
      .findAirport(this.destinationUUID)
      .then((destination) => {
        this.initDestinationToEdit =
          this.airportMapper.airportFromDB(destination);
      });

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Destination editing */
  editDestination(destination: any): void {
    destination.airportUUID = this.destinationUUID;
    // Destination updating
    this.airportService.updateAirport(destination).then((result: any) => {
      // If destination is updated
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
      } else if (result.status === 409) {
        /* IATA uniqueness error notification showing */
        this.notificationService.showErrorNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getDestinationFormTitle()}`.toUpperCase(),
          `${getIATAUniquenessErrorMessage()}`,
        );
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
