import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteUserComponent } from '../../app/user/pages/delete-user/delete-user.component';
import { Component, Inject } from '@angular/core';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { NotificationService } from '../../app/shared/services/notification.service';
import { provideToastr, ToastNoAnimation, ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import {
  getUserFormSuccessNotificationMessage,
  getUserFormTitle,
} from '../../app/shared/labels/forms/user-form';
import { CONFIRMATION_DIALOG_MODE } from '../../app/shared/constants/dialogs-constants';
import { DELETE_FORM_MODE } from '../../app/shared/constants/forms-constants';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';

describe('DeleteUserComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr({toastComponent: ToastNoAnimation})]
    }).compileComponents();
  });

  @Component({})
  class MockDeleteUserComponent {
    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Delete user" component', () => {
    TestBed.runInInjectionContext(() => {
      const deleteUserComponent: DeleteUserComponent = new DeleteUserComponent(
        Inject(NotificationService),
      );
      deleteUserComponent.ngOnInit();

      expect(deleteUserComponent.deleteUserDialogTitle).toStrictEqual(
        "Suppression d'un utilisateur",
      );
      expect(deleteUserComponent.deleteUserDialogMode).toStrictEqual(
        CONFIRMATION_DIALOG_MODE,
      );
      expect(deleteUserComponent.deleteUserDialogMessage).toStrictEqual(
        'Confirmez-vous la suppression définitive de cet utilisateur ?',
      );
    });
  });

  it('#deleteUser should delete user in DB', async () => {
    TestBed.runInInjectionContext(() => {
      let mockDeleteUserComponent: MockDeleteUserComponent =
        new MockDeleteUserComponent();
      const deleteUserComponent: DeleteUserComponent = new DeleteUserComponent(
        Inject(NotificationService),
      );
      vi.spyOn(deleteUserComponent, 'deleteUser').mockImplementation(() => {
        mockDeleteUserComponent.userService
          .deleteUser('uuid-user-to-delete')
          .then(async (result) => {
            if (result.status === 204) {
              const toastrSuccess: any =
                mockDeleteUserComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(DELETE_FORM_MODE)} ${getUserFormTitle()}`.toUpperCase(),
                  `${getUserFormSuccessNotificationMessage(DELETE_FORM_MODE)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual(
                "SUPPRESSION D'UN UTILISATEUR",
              );
              expect(toastrSuccess.message).toStrictEqual(
                'Votre utilisateur a bien été supprimé(e) !',
              );
            } else {
              const toastrError: any =
                mockDeleteUserComponent.notificationService.showErrorNotification(
                  `${getTechnicalErrorTitle()}`,
                  `${getTechnicalErrorMessage()}`,
                );
              expect(toastrError.toastId).toStrictEqual(1);
              expect(toastrError.title).toStrictEqual('ERREUR TECHNIQUE');
              expect(toastrError.message).toStrictEqual(
                'Une erreur est survenue : veuillez réessayer...',
              );
            }
          });
      });
      deleteUserComponent.deleteUser(true);
    });
  });
});
