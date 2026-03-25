import { describe, it, expect, vi } from 'vitest';
import { AddUserComponent } from '../../app/user/pages/add-user/add-user.component';
import { Component, Inject } from '@angular/core';
import { User } from '../../app/shared/models/User';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import {
  getUserFormTitle,
  getUserFormSuccessNotificationMessage,
} from '../../app/shared/labels/forms/user-form';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockListUsersComponent } from '../mocks/mock-list-users-component';

describe('AddUserComponent', () => {
  @Component({})
  class MockAddUserComponent {
    public authenticatedUser!: User;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Add user" component', () => {
    TestBed.runInInjectionContext(() => {
      let mockAddUserComponent: MockAddUserComponent =
        new MockAddUserComponent();
      const addUserComponent: AddUserComponent = new AddUserComponent(
        Inject(NotificationService),
      );
      vi.spyOn(addUserComponent, 'ngOnInit').mockImplementation(() => {
        mockAddUserComponent.userService.user.subscribe((user) => {
          if (user) {
            addUserComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
      });
      addUserComponent.ngOnInit();

      expect(addUserComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#addUser should create user in DB', async () => {
    TestBed.configureTestingModule({
      imports: [AddUserComponent],
      providers: [
        provideRouter([
          { path: 'users/list', component: MockListUsersComponent },
        ]),
      ],
    });

    const userToCreate: any = {
      userUUID: 'user-created-uuid',
      userGivenName: 'User',
      userSurname: 'CREATED',
      userLogin: 'u.c',
      userProfile: 2,
    };

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      let mockAddUserComponent: MockAddUserComponent =
        new MockAddUserComponent();
      const addUserComponent: AddUserComponent = new AddUserComponent(
        Inject(NotificationService),
      );
      vi.spyOn(addUserComponent, 'addUser').mockImplementation(() => {
        mockAddUserComponent.userService
          .createUser(userToCreate)
          .then(async (result) => {
            if (result.data) {
              expect(result.data).toStrictEqual({
                userID: 21,
                userUUID: 'user-created-uuid',
                userGivenName: 'User',
                userSurname: 'CREATED',
                userLogin: 'u.c',
                userProfile: 2,
              });

              const toastrSuccess: any =
                mockAddUserComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(addUserComponent.formMode)} ${getUserFormTitle()}`.toUpperCase(),
                  `${getUserFormSuccessNotificationMessage(addUserComponent.formMode)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual(
                "AJOUT D'UN UTILISATEUR",
              );
              expect(toastrSuccess.message).toStrictEqual(
                'Votre utilisateur a bien été créé(e) !',
              );

              await harness.navigateByUrl('/users/list');
              expect(harness.routeNativeElement?.textContent).toBe(
                'List users',
              );
            } else {
              const toastrError: any =
                mockAddUserComponent.notificationService.showErrorNotification(
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
      addUserComponent.addUser(userToCreate);
    });
  });
});
