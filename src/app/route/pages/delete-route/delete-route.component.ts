import { Component, inject, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { RouteService } from '../../../shared/services/route.service';
import { DELETE_FORM_MODE } from '../../../shared/constants/forms-constants';
import { CONFIRMATION_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import {
  getRouteDeleteDialogMessage,
  getRouteFormSuccessNotificationMessage,
  getRouteFormTitle,
} from '../../../shared/labels/forms/route-form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';

@Component({
  templateUrl: '../../pages/delete-route/delete-route.component.html',
  standalone: true,
  imports: [DialogComponent],
})
export class DeleteRouteComponent implements OnInit {
  @Input() public routeUUID!: string;

  public deleteRouteDialogTitle!: string;
  public deleteRouteDialogMode!: string;
  public deleteRouteDialogMessage!: string;

  /* Injections */
  public routeService: RouteService = inject(RouteService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.deleteRouteDialogTitle = `${getFormModeLabel(
      DELETE_FORM_MODE,
    )} ${getRouteFormTitle()}`;
    this.deleteRouteDialogMode = CONFIRMATION_DIALOG_MODE;
    this.deleteRouteDialogMessage = getRouteDeleteDialogMessage();
  }

  /* Route deleting */
  deleteRoute(isDeletionDialogConfirmed: boolean) {
    // If deletion is confirmed by user
    if (isDeletionDialogConfirmed) {
      // Route deletion
      this.routeService.deleteRoute(this.routeUUID).then((response) => {
        // If route is deleted
        if (response.status === 204) {
          /* Success notification showing */
          this.notificationService.showSuccessNotification(
            this.deleteRouteDialogTitle.toUpperCase(),
            getRouteFormSuccessNotificationMessage(DELETE_FORM_MODE),
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
