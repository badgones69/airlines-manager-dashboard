import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { ListUsersComponent } from '../../app/user/pages/list-users/list-users.component';
import { provideRouter } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MockUserService } from '../mocks/mock-user-service';
import { UserMapper } from '../../app/shared/mappers/UserMapper';
import { getUsersListTitle } from '../../app/shared/labels/lists';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { DeleteUserComponent } from '../../app/user/pages/delete-user/delete-user.component';
import { ComponentType, NoopScrollStrategy } from '@angular/cdk/overlay';

describe('ListUsersComponent', () => {
  @Component({
    template: '<h1>Edit user</h1>',
  })
  class MockEditUserComponent {}

  @Component({})
  class MockListUsersComponent {
    public authenticatedUser!: User;
    public userMapper: UserMapper = new UserMapper();

    constructor(
      readonly userService: MockUserService = new MockUserService(),
    ) {}

    deleteUser(): void {
      this.open(DeleteUserComponent, {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      });
    }

    open(
      component: ComponentType<DeleteUserComponent>,
      config: MatDialogConfig<any>,
    ): void {
      // MatDialog open() method overrinding
    }
  }

  it('#ngOnInit should initialize "List users" component', () => {
    TestBed.runInInjectionContext(() => {
      const mockListUsersComponent: MockListUsersComponent =
        new MockListUsersComponent();
      const listUsersComponent: ListUsersComponent = new ListUsersComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listUsersComponent, 'ngOnInit').mockImplementation(() => {
        listUsersComponent.usersListTitle = getUsersListTitle();

        mockListUsersComponent.userService.user.subscribe((user) => {
          if (user) {
            listUsersComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
        mockListUsersComponent.userService.users.subscribe((users) => {
          if (users) {
            listUsersComponent.usersList.data =
              mockListUsersComponent.userMapper.usersListFromDB(users);
          }
        });
      });
      listUsersComponent.ngOnInit();

      expect(listUsersComponent.usersListTitle).toStrictEqual(
        'Liste des utilisateurs',
      );

      expect(listUsersComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });

      expect(listUsersComponent.usersList.data).toStrictEqual([
        {
          id: 1,
          uuid: 'user-admin-uuid',
          givenName: 'User',
          surname: 'ADMIN',
          login: 'u.a',
          profile: 1,
        },
        {
          id: 2,
          uuid: 'user-manager-uuid',
          givenName: 'User',
          surname: 'MANAGER',
          login: 'u.m',
          profile: 2,
        },
        {
          id: 3,
          uuid: 'user-consultant-uuid',
          givenName: 'User',
          surname: 'CONSULTANT',
          login: 'u.c',
          profile: 3,
        },
      ]);
    });
  });

  it('#displayProfileName should display profile name found by its id', () => {
    TestBed.runInInjectionContext(() => {
      const listUsersComponent: ListUsersComponent = new ListUsersComponent(
        Inject(MatDialog),
      );
      expect(listUsersComponent.displayProfileName(2)).toStrictEqual(
        'Gestionnaire',
      );
      expect(listUsersComponent.displayProfileName(4)).toStrictEqual('');
    });
  });

  it('#openUserForm should redirect to "Edit user" component', async () => {
    TestBed.configureTestingModule({
      imports: [ListUsersComponent],
      providers: [
        provideRouter([
          { path: 'users/edit/:uuid', component: MockEditUserComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/users/edit/:uuid');

    TestBed.runInInjectionContext(() => {
      const listUsersComponent: ListUsersComponent = new ListUsersComponent(
        Inject(MatDialog),
      );
      const spy = vi
        .spyOn(listUsersComponent, 'openUserForm')
        .mockImplementation(() => harness.routeNativeElement?.textContent);
      listUsersComponent.openUserForm({
        id: 3,
        uuid: 'user-consultant-uuid',
        givenName: 'User',
        surname: 'CONSULTANT',
        login: 'u.c',
        profile: 3,
      });
      expect(spy).toHaveBeenCalled();
      expect(
        listUsersComponent.openUserForm({
          id: 3,
          uuid: 'user-consultant-uuid',
          givenName: 'User',
          surname: 'CONSULTANT',
          login: 'u.c',
          profile: 3,
        }),
      ).toBe('Edit user');
    });
  });

  it('#deleteUser should open "Delete user" dialog', () => {
    TestBed.runInInjectionContext(() => {
      const mockListUsersComponent: MockListUsersComponent =
        new MockListUsersComponent();
      const listUsersComponent: ListUsersComponent = new ListUsersComponent(
        Inject(MatDialog),
      );
      vi.spyOn(listUsersComponent, 'deleteUser').mockImplementation(() => {
        vi.spyOn(mockListUsersComponent, 'deleteUser').mockImplementation(() => {
          expect(mockListUsersComponent.open).toHaveBeenCalledWith(
            DeleteUserComponent,
            {
              disableClose: false,
              autoFocus: true,
              scrollStrategy: new NoopScrollStrategy(),
            },
          );
        });
      });
      listUsersComponent.deleteUser({
        id: 2,
        uuid: 'user-manager-uuid',
        givenName: 'User',
        surname: 'MANAGER',
        login: 'u.m',
        profile: 2,
      });
    });
  });
});
