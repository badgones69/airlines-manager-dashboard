import { getDepartureHubLabel, getArrivalAirportLabel } from '../../labels/forms/route-form';

export function getImportRoutesFormTitle(): string {
  return 'de ligne(s)';
}

export function getRoutesImportTemplateFile(): string {
  return `${getDepartureHubLabel()};${getArrivalAirportLabel()}`;
}

export function getNumberRoutesLabel(numberRoutes: number): string {
  return `${numberRoutes?.toString()} ligne(s)`;
}

export function getImportRoutesFormSuccessNotificationMessage(): string {
  return 'Vos lignes ont bien été importées !';
}
