import { getFormActionLabel } from '../commons/form-common';

export function getUserFormTitle(): string {
  return 'd\'un utilisateur';
}

export function getRepeatedPasswordInputLabel(): string {
  return 'RÉPÉTER MOT DE PASSE';
}

export function getIdentityFieldsErrorMessage(): string {
  return 'identité invalide';
}

export function getLoginFieldFormatErrorMessage(): string {
  return 'format invalide (a[-b].c[-d])';
}

export function getPasswordFieldFormatErrorMessage(): string {
  return 'mot de passe trop court et/ou pas assez sécurisé';
}

export function getRepeatedPasswordFieldFormatErrorMessage(): string {
  return 'mots de passe différents';
}

export function getUserFormSuccessNotificationMessage(
  formMode: string
): string {
  return `Votre utilisateur a bien été ${getFormActionLabel(formMode)} !`;
}
