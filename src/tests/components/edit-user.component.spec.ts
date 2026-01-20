import { describe, it, expect, vi } from 'vitest';
import { EditUserComponent } from '../../app/user/pages/edit-user/edit-user.component';
import { UserService } from '../../app/shared/services/user.service';
import { Component, Inject } from '@angular/core';
import { User } from '../../app/shared/models/User';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
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

describe('EditUserComponent', () => {
  @Component({})
  class MockEditUserComponent {
    public authenticatedUser!: User;
    public userUUID!: string;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
      readonly route: any = {
        snapshot: { paramMap: new Map().set('uuid', 'user-created-uuid') },
      },
    ) {}
  }

  it('#ngOnInit should initialize "Edit user" component', async () => {
    let mockEditUserComponent: MockEditUserComponent =
      new MockEditUserComponent();
    const editUserComponent: EditUserComponent = new EditUserComponent(
      Inject(UserService),
      Inject(NotificationService),
      Inject(ActivatedRoute),
      Inject(Router),
    );
    vi.spyOn(editUserComponent, 'ngOnInit').mockImplementation(() => {
      editUserComponent.userUUID =
        mockEditUserComponent.route.snapshot.paramMap.get('uuid') ?? '';

      mockEditUserComponent.userService
        .findUser(editUserComponent.userUUID)
        .then(async (userToEdit) => {
          editUserComponent.initUserToEdit =
            editUserComponent.userMapper.userFromDB(userToEdit.data);

          expect(editUserComponent.initUserToEdit).toStrictEqual({
            id: 21,
            uuid: 'user-created-uuid',
            givenName: 'User',
            surname: 'CREATED',
            login: 'u.c',
            profile: 2,
          });
        });

      mockEditUserComponent.userService.user.subscribe((user) => {
        if (user) {
          editUserComponent.authenticatedUser = JSON.parse(user.toString());
        }
      });
    });
    editUserComponent.ngOnInit();

    expect(editUserComponent.userUUID).toStrictEqual('user-created-uuid');

    expect(editUserComponent.authenticatedUser).toStrictEqual({
      id: 7,
      uuid: 'uuid-authenticated-user',
      givenName: 'Authneticated',
      surname: 'USER',
      login: 'a.u',
      profile: 1,
    });
  });

  it('#editUser should update user in DB', async () => {
    TestBed.configureTestingModule({
      imports: [EditUserComponent],
      providers: [
        provideRouter([
          { path: 'users/list', component: MockListUsersComponent },
        ]),
      ],
    });

    const userToUpdate: any = {
      userID: 21,
      userGivenName: 'User',
      userSurname: 'TO-UPDATE',
      userLogin: 'u.t-u',
      userProfile: 3,
    };

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    let mockEditUserComponent: MockEditUserComponent =
      new MockEditUserComponent();
    const editUserComponent: EditUserComponent = new EditUserComponent(
      Inject(UserService),
      Inject(NotificationService),
      Inject(ActivatedRoute),
      Inject(Router),
    );
    vi.spyOn(editUserComponent, 'editUser').mockImplementation(() => {
      mockEditUserComponent.userService
        .updateUser(userToUpdate)
        .then(async (result) => {
          if (result.data) {
            expect(result.data).toStrictEqual({
              userID: 21,
              userUUID: 'user-created-uuid',
              userGivenName: 'User',
              userSurname: 'TO-UPDATE',
              userLogin: 'u.t-u',
              userProfile: 3,
            });

            const toastrSuccess: any =
              mockEditUserComponent.notificationService.showSuccessNotification(
                `${getFormModeLabel(editUserComponent.formMode)} ${getUserFormTitle()}`.toUpperCase(),
                `${getUserFormSuccessNotificationMessage(editUserComponent.formMode)}`,
              );
            expect(toastrSuccess.toastId).toStrictEqual(2);
            expect(toastrSuccess.title).toStrictEqual(
              "MODIFICATION D'UN UTILISATEUR",
            );
            expect(toastrSuccess.message).toStrictEqual(
              'Votre utilisateur a bien été modifié(e) !',
            );

            await harness.navigateByUrl('/users/list');
            expect(harness.routeNativeElement?.textContent).toBe('List users');
          } else {
            const toastrError: any =
              mockEditUserComponent.notificationService.showErrorNotification(
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
    editUserComponent.editUser(userToUpdate);
  });
});
