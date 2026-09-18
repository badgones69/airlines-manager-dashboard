import { IDENTITY_PATTERN, LOGIN_PATTERN } from '../constants/forms-constants';
import { isNotBlank } from './commons-validators';

function isValidIdentity(identity: string): boolean {
  return isNotBlank(identity) && new RegExp(IDENTITY_PATTERN).exec(identity) != null;
}

function isValidLogin(login: string): boolean {
  return isNotBlank(login) && new RegExp(LOGIN_PATTERN).exec(login) != null;
}

function isValidProfile(profile: any): boolean {
  return !Number.isNaN(Number.parseInt(profile)) && [1, 2, 3].includes(profile);
}

export function isValidUsersList(usersList: any[]): boolean {
  return usersList.length > 0 &&
    usersList.every(user => 
      isValidIdentity(user.givenName) &&
      isValidIdentity(user.surname) &&
      isValidLogin(user.login) &&
      isValidProfile(user.profile)
    );
}