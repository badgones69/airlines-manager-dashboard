import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/User';
import { getStoredItem, removeStoredItem } from '../utils/storage-utils';
import { AUTHENTICATED_USER_STORAGE_NAME } from '../constants/storage-constants';
import supabase from '../constants/services-constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() {
    this.refreshUser();
  }

  /* Authenticated user loading */
  public refreshUser(): void {
    this.user$.next(getStoredItem(AUTHENTICATED_USER_STORAGE_NAME));
  }

  /* Authenticated user reading */
  public get user(): Observable<any> {
    return this.user$;
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
      .select()
      .eq('userLogin', login);
    return data?.[0];
  }
}
