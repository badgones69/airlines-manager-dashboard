import { Component, inject, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AirportService } from '../../../shared/services/airport.service';
import { DELETE_FORM_MODE } from '../../../shared/constants/forms-constants';
import { CONFIRMATION_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import {
  getDestinationDeleteDialogMessage,
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../../shared/labels/forms/destination-form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';

@Component({
  templateUrl:
    '../../pages/delete-destination/delete-destination.component.html',
  standalone: true,
  imports: [DialogComponent],
})
export class DeleteDestinationComponent implements OnInit {
  @Input() public destinationUUID!: string;

  public deleteDestinationDialogTitle!: string;
  public deleteDestinationDialogMode!: string;
  public deleteDestinationDialogMessage!: string;

  /* Injections */
  public airportService: AirportService = inject(AirportService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.deleteDestinationDialogTitle = `${getFormModeLabel(
      DELETE_FORM_MODE,
    )} ${getDestinationFormTitle()}`;
    this.deleteDestinationDialogMode = CONFIRMATION_DIALOG_MODE;
    this.deleteDestinationDialogMessage = getDestinationDeleteDialogMessage();
  }

  /* Destination deleting */
  deleteDestination(isDeletionDialogConfirmed: boolean) {
    // If deletion is confirmed by user
    if (isDeletionDialogConfirmed) {
      // Destination deletion
      this.airportService
        .deleteAirport(this.destinationUUID)
        .then((response) => {
          // If destination is deleted
          if (response.status === 204) {
            /* Success notification showing */
            this.notificationService.showSuccessNotification(
              this.deleteDestinationDialogTitle.toUpperCase(),
              getDestinationFormSuccessNotificationMessage(DELETE_FORM_MODE),
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
}
