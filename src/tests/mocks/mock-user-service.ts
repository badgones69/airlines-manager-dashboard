import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../app/shared/models/User';
import { AUTHENTICATED_USER_STORAGE_NAME } from '../../app/shared/constants/storage-constants';
import { mockSessionStorage } from './mock-session-storage';

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage
});

@Injectable({
    providedIn: 'root',
})
export class MockUserService {
    constructor() {}

    public user: Observable<any> = of(JSON.stringify(
        {
          id: 7,  
          uuid: 'uuid-authenticated-user',
          givenName: 'Authneticated',
          surname: 'USER',
          login: 'a.u',
          profile: 1,
        }
    ))

    public users: Observable<any[]> = of(
      [
        {
          userID: 1,
          userUUID: 'user-admin-uuid',
          userGivenName: 'User',
          userSurname: 'ADMIN',
          userLogin: 'u.a',
          userProfile: 1
        },
        {
          userID: 2,
          userUUID: 'user-manager-uuid',
          userGivenName: 'User',
          userSurname: 'MANAGER',
          userLogin: 'u.m',
          userProfile: 2
        },
        {
          userID: 3,
          userUUID: 'user-consultant-uuid',
          userGivenName: 'User',
          userSurname: 'CONSULTANT',
          userLogin: 'u.c',
          userProfile: 3
        }
      ]
    )

    public connectUser(user: User): Observable<any> {
      globalThis.sessionStorage.setItem(AUTHENTICATED_USER_STORAGE_NAME, JSON.stringify(user));
      return of({
          id: 1,  
          uuid: 'user-admin-uuid',
          givenName: 'User',
          surname: 'ADMIN',
          login: 'u.a',
          profile: 1,
      });
    }

    public disconnectUser(): Observable<any> {
      return of({});
    }

    public async authenticateUser(login: string): Promise<any> {
      return Promise.resolve(
        {
          data: {
            userID: 1,
            userUUID: 'user-admin-uuid',
            userGivenName: 'User',
            userSurname: 'ADMIN',
            userLogin: 'u.a',
            userProfile: 1
          }
        }
      );
    }

    public findUser = (userUUID: string): Promise<any> => {
      return Promise.resolve(
        {
          data: {
            userID: 21,
            userUUID: 'user-created-uuid',
            userGivenName: 'User',
            userSurname: 'CREATED',
            userLogin: 'u.c',
            userProfile: 2
          }
        }
      );
    }

    public createUser = (userToCreate: any): Promise<any> => {
      return Promise.resolve(
        {
          data: {
            userID: 21,
            userUUID: 'user-created-uuid',
            userGivenName: 'User',
            userSurname: 'CREATED',
            userLogin: 'u.c',
            userProfile: 2
          }
        }
      );
    }

    public resetUserPassword = (userToResetPassword: any): Promise<any> => {
      return Promise.resolve(
        {
          data: {
            userID: 21,
            userUUID: 'user-created-uuid',
            userGivenName: 'User',
            userSurname: 'PASSWORD-RESETTED',
            userLogin: 'u.p-r',
            userProfile: 2
          }
        }
      );
    }

    public updateUser = (userToUpdate: any): Promise<any> => {
      return Promise.resolve(
        {
          data: {
            userID: 21,
            userUUID: 'user-created-uuid',
            userGivenName: 'User',
            userSurname: 'TO-UPDATE',
            userLogin: 'u.t-u',
            userProfile: 3
          }
        }
      )
    }

    public deleteUser = (userUUID: string): Promise<any> => {
      return Promise.resolve(
        {
          status: 204
        }
      );
    }
}