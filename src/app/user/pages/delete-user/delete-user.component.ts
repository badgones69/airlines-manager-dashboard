import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';
import { DELETE_FORM_MODE } from '../../../shared/constants/forms-constants';
import { CONFIRMATION_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import {
  getUserDeleteDialogMessage,
  getUserFormSuccessNotificationMessage,
  getUserFormTitle,
} from '../../../shared/labels/forms/user-form';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { getConfirmationDialogTitle } from '../../../shared/labels/commons/dialog-common';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { getTechnicalErrorTitle, getTechnicalErrorMessage } from '../../../shared/labels/errors';

@Component({
  templateUrl: '../../pages/delete-user/delete-user.component.html',
  standalone: true,
  imports: [DialogComponent],
})
export class DeleteUserComponent implements OnInit {
  @Input() public userUUID!: string;

  public deleteUserFormTitle!: string;
  public deleteUserDialogTitle!: string;
  public deleteUserDialogMode!: string;
  public deleteUserDialogMessage!: string;

  constructor(
    readonly userService: UserService,
    readonly notificationService: NotificationService
  ) {
    this.deleteUserFormTitle = `${getFormModeLabel(
      DELETE_FORM_MODE
    )} ${getUserFormTitle()}`;
  }

  ngOnInit(): void {
    this.deleteUserDialogTitle = `${
      this.deleteUserFormTitle
    } ${getConfirmationDialogTitle()}`;
    this.deleteUserDialogMode = CONFIRMATION_DIALOG_MODE;
    this.deleteUserDialogMessage = getUserDeleteDialogMessage();
  }

  /* User deleting */
  deleteUser(isDeletionDialogConfirmed: boolean) {
    // If deletion is confirmed by user
    if (isDeletionDialogConfirmed) {
      // User deletion
      this.userService.deleteUser(this.userUUID).then((response) => {
        // If user is deleted
        if (response.status === 204) {
          /* Success notification showing */
          this.notificationService.showSuccessNotification(
            this.deleteUserFormTitle.toUpperCase(),
            getUserFormSuccessNotificationMessage(DELETE_FORM_MODE)
          );
        } else {
          /* Technical error notification showing */
          this.notificationService.showErrorNotification(
            `${getTechnicalErrorTitle()}`,
            `${getTechnicalErrorMessage()}`
          );
        }
      });
    }
  }
}
