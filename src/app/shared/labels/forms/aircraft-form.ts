import {
  getFormActionLabel,
  getSubmitButtonLabel,
} from '../commons/form-common';

export function getAircraftFormTitle(): string {
  return "d'un avion";
}

export function getManufacturerLabel(): string {
  return 'CONSTRUCTEUR';
}

export function getModelLabel(): string {
  return 'MODÈLE';
}

export function getHomeHubLabel(): string {
  return 'HUB DE RATTACHEMENT';
}

export function getFlightsInputLabel(formMode: string): string {
  return `${getSubmitButtonLabel(formMode)} le(s) vol(s)`;
}

export function getRouteFieldIdentifier(index: number): string {
  return `flightRoute${index}`;
}

export function getDepartureTimeFieldIdentifier(index: number): string {
  return `flightDepartureTime${index}`;
}

export function getLengthFieldIdentifier(index: number): string {
  return `flightLength${index}`;
}

export function getUnknownManufacturerErrorMessage(): string {
  return 'constructeur inconnu';
}

export function getUnknownModelErrorMessage(): string {
  return 'modèle inconnu';
}

export function getAircraftFormSuccessNotificationMessage(
  formMode: string,
): string {
  return `Votre avion et ses vols ont bien été ${getFormActionLabel(formMode)}s !`;
}
