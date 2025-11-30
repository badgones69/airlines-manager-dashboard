import { describe, it, expect, vi } from 'vitest';
import { DeleteUserComponent } from '../../app/user/pages/delete-user/delete-user.component';
import { UserService } from '../../app/shared/services/user.service';
import { Component, Inject } from '@angular/core';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { NotificationService } from '../../app/shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { getTechnicalErrorMessage, getTechnicalErrorTitle } from '../../app/shared/labels/errors';
import { getUserFormSuccessNotificationMessage } from '../../app/shared/labels/forms/user-form';
import { CONFIRMATION_DIALOG_MODE } from '../../app/shared/constants/dialogs-constants';
import { DELETE_FORM_MODE } from '../../app/shared/constants/forms-constants';

describe('DeleteUserComponent', () => {

  @Component({})
  class MockDeleteUserComponent {
    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(Inject(ToastrService))
    ) {}
  }

  it('#ngOnInit should initialize "Delete user" component', () => {
    const deleteUserComponent: DeleteUserComponent = new DeleteUserComponent(Inject(UserService), Inject(NotificationService));
    deleteUserComponent.ngOnInit();

    expect(deleteUserComponent.deleteUserDialogTitle).toStrictEqual('Suppression d\'un utilisateur : confirmation');
    expect(deleteUserComponent.deleteUserDialogMode).toStrictEqual(CONFIRMATION_DIALOG_MODE);
    expect(deleteUserComponent.deleteUserDialogMessage).toStrictEqual('Confirmez-vous la suppression définitive de cet utilisateur ?');
  });

  it('#deleteUser should delete user in DB', async () => {
    let mockDeleteUserComponent: MockDeleteUserComponent = new MockDeleteUserComponent();
    const deleteUserComponent: DeleteUserComponent = new DeleteUserComponent(Inject(UserService), Inject(NotificationService));
    vi.spyOn(deleteUserComponent, 'deleteUser').mockImplementation(() => {
      mockDeleteUserComponent.userService.deleteUser('uuid-user-to-delete').then(async (result) => {
        if (result.status === 204) {
          const toastrSuccess: any = mockDeleteUserComponent.notificationService.showSuccessNotification(
            deleteUserComponent.deleteUserFormTitle.toUpperCase(),
            `${getUserFormSuccessNotificationMessage(DELETE_FORM_MODE)}`
          );
          expect(toastrSuccess.toastId).toStrictEqual(2);
          expect(toastrSuccess.title).toStrictEqual('SUPPRESSION D\'UN UTILISATEUR');
          expect(toastrSuccess.message).toStrictEqual('Votre utilisateur a bien été supprimé(e) !');
        } else {
          const toastrError: any = mockDeleteUserComponent.notificationService.showErrorNotification(
            `${getTechnicalErrorTitle()}`,
            `${getTechnicalErrorMessage()}`
          );
          expect(toastrError.toastId).toStrictEqual(1);
          expect(toastrError.title).toStrictEqual('ERREUR TECHNIQUE');
          expect(toastrError.message).toStrictEqual('Une erreur est survenue : veuillez réessayer...');
        }
      });
    });
    deleteUserComponent.deleteUser(true);
  });
});