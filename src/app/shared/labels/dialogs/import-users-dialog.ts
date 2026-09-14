export function getImportUsersFormTitle(): string {
  return "d'utilisateur(s)";
}

export function getUsersImportTemplateFile(): string {
  return "givenName;surname;login;profile";
}

export function getNumberUsersLabel(numberUsers: number): string {
  return `${numberUsers?.toString()} utilisateur(s)`;
}

export function getImportUsersFormSuccessNotificationMessage(): string {
  return `Vos utilisateurs ont bien été importés !`;
}

export function getLoginUniquenessErrorNotificationMessage(): string {
  return 'Identifiant déjà lié à un autre utilisateur existant !';
}