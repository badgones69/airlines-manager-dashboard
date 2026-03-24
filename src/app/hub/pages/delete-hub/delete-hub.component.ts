import { Component, inject, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AirportService } from '../../../shared/services/airport.service';
import { DELETE_FORM_MODE } from '../../../shared/constants/forms-constants';
import { CONFIRMATION_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import {
  getHubDeleteDialogMessage,
  getHubFormSuccessNotificationMessage,
  getHubFormTitle,
} from '../../../shared/labels/forms/hub-form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';

@Component({
  templateUrl: '../../pages/delete-hub/delete-hub.component.html',
  standalone: true,
  imports: [DialogComponent],
})
export class DeleteHubComponent implements OnInit {
  @Input() public hubUUID!: string;

  public deleteHubDialogTitle!: string;
  public deleteHubDialogMode!: string;
  public deleteHubDialogMessage!: string;

  /* Injections */
  public airportService: AirportService = inject(AirportService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.deleteHubDialogTitle = `${getFormModeLabel(
      DELETE_FORM_MODE,
    )} ${getHubFormTitle()}`;
    this.deleteHubDialogMode = CONFIRMATION_DIALOG_MODE;
    this.deleteHubDialogMessage = getHubDeleteDialogMessage();
  }

  /* Hub deleting */
  deleteHub(isDeletionDialogConfirmed: boolean) {
    // If deletion is confirmed by user
    if (isDeletionDialogConfirmed) {
      // Hub deletion
      this.airportService.deleteAirport(this.hubUUID).then((response) => {
        // If hub is deleted
        if (response.status === 204) {
          /* Success notification showing */
          this.notificationService.showSuccessNotification(
            this.deleteHubDialogTitle.toUpperCase(),
            getHubFormSuccessNotificationMessage(DELETE_FORM_MODE),
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
