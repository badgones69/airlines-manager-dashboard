import {
  getFormActionLabel,
  getSubmitButtonLabel,
} from '../commons/form-common';

export function getAirlineFormTitle(): string {
  return 'de la compagnie';
}

export function getICAOCodeInputLabel(): string {
  return 'ICAO';
}

export function getLogoInputLabel(formMode: string): string {
  return `${getSubmitButtonLabel(formMode)} le logo`;
}

export function getNoLogoLabel(): string {
  return 'Aucun logo';
}

export function getNationalityInputLabel(): string {
  return 'NATIONALITÉ';
}

export function getAirlineFormSuccessNotificationMessage(
  formMode: string,
): string {
  return `Votre compagnie et/ou son logo ont bien été ${getFormActionLabel(formMode)}s !`;
}
