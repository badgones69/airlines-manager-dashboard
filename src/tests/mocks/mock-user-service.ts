import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

    public disconnectUser(): Observable<any> {
      return of({});
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