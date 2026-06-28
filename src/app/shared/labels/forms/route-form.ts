import { getDeleteDialogMessage } from '../commons/dialog-common';
import { getFormActionLabel } from '../commons/form-common';

export function getRouteFormTitle(): string {
  return "d'une ligne";
}

export function getDepartureHubLabel(): string {
  return 'HUB DE DÉPART';
}

export function getArrivalAirportLabel(): string {
  return "AÉROPORT D'ARRIVÉE";
}

export function getRouteDeleteDialogMessage(): string {
  return `${getDeleteDialogMessage().replace('{}', 'cette ligne')}`;
}

export function getIdenticalAirportsErrorMessage(): string {
  return 'aéroports identiques';
}

export function getUnknownAirportErrorMessage(): string {
  return 'aéroport inconnu';
}

export function getRouteFormSuccessNotificationMessage(
  formMode: string,
): string {
  return `Votre ligne a bien été ${getFormActionLabel(formMode)} !`;
}

export function getExistingRouteErrorNotificationMessage(): string {
  return 'Cette ligne existe déjà !';
}
