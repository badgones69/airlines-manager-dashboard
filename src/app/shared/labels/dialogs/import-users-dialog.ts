import { getGivenNameLabel, getLoginLabel, getProfileLabel, getSurnameLabel } from '../commons/user-common';

export function getImportUsersFormTitle(): string {
  return "d'utilisateur(s)";
}

export function getUsersImportTemplateFile(): string {
  return `${getGivenNameLabel()};${getSurnameLabel()};${getLoginLabel()};${getProfileLabel()}`;
}

export function getNumberUsersLabel(numberUsers: number): string {
  return `${numberUsers?.toString()} utilisateur(s)`;
}

export function getImportUsersFormSuccessNotificationMessage(): string {
  return 'Vos utilisateurs ont bien été importés !';
}
