import { Component, inject, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AircraftService } from '../../../shared/services/aircraft.service';
import { DELETE_FORM_MODE } from '../../../shared/constants/forms-constants';
import { CONFIRMATION_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import {
  getAircraftDeleteDialogMessage,
  getAircraftFormSuccessNotificationMessage,
  getAircraftFormTitle,
} from '../../../shared/labels/forms/aircraft-form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';

@Component({
  templateUrl: '../../pages/delete-aircraft/delete-aircraft.component.html',
  standalone: true,
  imports: [DialogComponent],
})
export class DeleteAircraftComponent implements OnInit {
  @Input() public aircraftUUID!: string;

  public deleteAircraftDialogTitle!: string;
  public deleteAircraftDialogMode!: string;
  public deleteAircraftDialogMessage!: string;

  /* Injections */
  public aircraftService: AircraftService = inject(AircraftService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.deleteAircraftDialogTitle = `${getFormModeLabel(
      DELETE_FORM_MODE,
    )} ${getAircraftFormTitle()}`;
    this.deleteAircraftDialogMode = CONFIRMATION_DIALOG_MODE;
    this.deleteAircraftDialogMessage = getAircraftDeleteDialogMessage();
  }

  /* Aircraft deleting */
  deleteAircraft(isDeletionDialogConfirmed: boolean) {
    // If deletion is confirmed by user
    if (isDeletionDialogConfirmed) {
      // Aircraft deletion
      this.aircraftService
        .deleteAircraft(this.aircraftUUID)
        .then((response) => {
          // If Aircraft is deleted
          if (response.status === 204) {
            /* Success notification showing */
            this.notificationService.showSuccessNotification(
              this.deleteAircraftDialogTitle.toUpperCase(),
              getAircraftFormSuccessNotificationMessage(DELETE_FORM_MODE),
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
