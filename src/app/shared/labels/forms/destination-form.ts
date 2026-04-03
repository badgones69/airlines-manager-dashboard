import { getFormActionLabel } from '../commons/form-common';

export function getDestinationFormTitle(): string {
  return "d'une destination";
}

export function getDestinationFormSuccessNotificationMessage(formMode: string): string {
  return `Votre destination a bien été ${getFormActionLabel(formMode)} !`;
}