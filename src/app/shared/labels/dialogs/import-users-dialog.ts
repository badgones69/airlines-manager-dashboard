export function getImportUsersFormTitle(): string {
  return "d'utilisateur(s)";
}

export function getUsersImportTemplateFile(): string {
  return "Prénom;Nom;Identifiant;Profil";
}

export function getNumberUsersLabel(numberUsers: number): string {
  return `${numberUsers?.toString()} utilisateur(s)`;
}

export function getImportUsersFormSuccessNotificationMessage(): string {
  return `Vos utilisateurs ont bien été importés !`;
}