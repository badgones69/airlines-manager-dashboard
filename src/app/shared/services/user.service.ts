import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/User';
import { getStoredItem, removeStoredItem } from '../utils/storage-utils';
import { AUTHENTICATED_USER_STORAGE_NAME } from '../constants/storage-constants';
import supabase from '../constants/services-constants';
import { v7 as uuidv7 } from 'uuid';
import { hash } from 'bcrypt-ts';
import { NotificationService } from './notification.service';
import { ADD_FORM_MODE, EDIT_FORM_MODE } from '../constants/forms-constants';
import { getFormModeLabel } from '../labels/commons/form-common';
import {
  getLoginUniquenessErrorNotificationMessage,
  getUserFormTitle,
} from '../labels/forms/user-form';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../labels/errors';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  readonly users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(readonly notificationService: NotificationService) {
    this.refreshUser();
    this.refreshUsersList();
  }

  /* Authenticated user loading */
  public refreshUser(): void {
    this.user$.next(getStoredItem(AUTHENTICATED_USER_STORAGE_NAME));
  }

  /* Users list loading */
  public refreshUsersList(): void {
    this.findAllUsers().then((users) => {
      this.users$.next(users);
    });
  }

  /* Authenticated user reading */
  public get user(): Observable<any> {
    return this.user$;
  }

  /* Users list reading */
  public get users(): Observable<any[]> {
    return this.users$;
  }

  /* Authenticated user session opening */
  public connectUser(user: User): Observable<any> {
    sessionStorage.setItem(
      AUTHENTICATED_USER_STORAGE_NAME,
      JSON.stringify(user),
    );
    this.refreshUser();
    return this.user;
  }

  /* Authenticated user session closing */
  public disconnectUser(): Observable<any> {
    removeStoredItem(AUTHENTICATED_USER_STORAGE_NAME);
    this.refreshUser();
    return this.user;
  }

  /* User authentication */
  public async authenticateUser(login: string): Promise<any> {
    const { data } = await supabase
      .from('USER')
      .select(
        `*,
          userAirline:AIRLINE!userAirline(*)
        `,
      )
      .eq('userLogin', login);
    return data;
  }

  /* All users retrieving */
  public async findAllUsers(): Promise<any[]> {
    const { data } = await supabase.from('USER').select();

    return data || [];
  }

  /* User retrieving */
  public async findUser(userUUID: string): Promise<any> {
    const { data } = await supabase
      .from('USER')
      .select()
      .eq('userUUID', userUUID);

    return data?.[0];
  }

  /* User creation */
  public async createUser(userToCreate: any): Promise<any> {
    const { userGivenName, userSurname, userLogin, userPassword, userProfile, userAirline } =
      userToCreate;

    const hashedPassword = await hash(userPassword, 13);

    const response = await supabase
      .from('USER')
      .insert({
        userUUID: uuidv7(),
        userGivenName,
        userSurname,
        userLogin,
        userPassword: hashedPassword,
        userProfile,
        userAirline,
      })
      .select();

    this.refreshUsersList();

    if (response.status === 409) {
      /* Login uniqueness error notification showing */
      this.notificationService.showErrorNotification(
        `${getFormModeLabel(
          ADD_FORM_MODE,
        )} ${getUserFormTitle()}`.toUpperCase(),
        `${getLoginUniquenessErrorNotificationMessage()}`,
      );
    } else if (response.status.toString().startsWith('20')) {
      return response.data;
    } else {
      /* Technical error notification showing */
      this.notificationService.showErrorNotification(
        `${getTechnicalErrorTitle()}`,
        `${getTechnicalErrorMessage()}`,
      );
    }
  }

  /* User password reset */
  public async resetUserPassword(userToResetPassword: any): Promise<any> {
    const { userUUID, userPassword } = userToResetPassword;

    const hashedPassword = await hash(userPassword, 13);

    const data = await supabase
      .from('USER')
      .update({
        userPassword: hashedPassword,
      })
      .eq('userUUID', userUUID)
      .select();

    this.refreshUsersList();
    return data;
  }

  /* User updating */
  public async updateUser(userUpdated: any): Promise<any> {
    const { userUUID, userGivenName, userSurname, userLogin, userProfile } =
      userUpdated;

    const response = await supabase
      .from('USER')
      .update({
        userGivenName,
        userSurname,
        userLogin,
        userProfile,
      })
      .eq('userUUID', userUUID)
      .select();

    this.refreshUsersList();

    if (response.status === 409) {
      /* Login uniqueness error notification showing */
      this.notificationService.showErrorNotification(
        `${getFormModeLabel(
          EDIT_FORM_MODE,
        )} ${getUserFormTitle()}`.toUpperCase(),
        `${getLoginUniquenessErrorNotificationMessage()}`,
      );
    } else if (response.status.toString().startsWith('20')) {
      return response.data;
    } else {
      /* Technical error notification showing */
      this.notificationService.showErrorNotification(
        `${getTechnicalErrorTitle()}`,
        `${getTechnicalErrorMessage()}`,
      );
    }
  }

  /* User deletion */
  public async deleteUser(userUUID: string): Promise<any> {
    const response = await supabase
      .from('USER')
      .delete()
      .eq('userUUID', userUUID);

    this.refreshUsersList();
    return response;
  }
}
