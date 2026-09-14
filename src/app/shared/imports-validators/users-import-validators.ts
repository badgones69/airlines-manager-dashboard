import { IDENTITY_PATTERN, LOGIN_PATTERN } from "../constants/forms-constants";
import { isNotBlank } from "./commons-validators";

function isValidIdentity(identity: string): boolean {
  return isNotBlank(identity) && identity.match(new RegExp(IDENTITY_PATTERN)) != null;
}

function isValidLogin(login: string): boolean {
  return isNotBlank(login) && login.match(new RegExp(LOGIN_PATTERN)) != null;
}

function isValidProfile(profile: any): boolean {
  return !isNaN(Number.parseInt(profile)) && [1, 2, 3].includes(profile)
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