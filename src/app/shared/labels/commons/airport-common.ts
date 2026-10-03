import { getNameLabel } from './form-common';

export function getIATALabel(): string {
  return 'IATA';
}

export function getCityLabel(): string {
  return 'VILLE';
}

export function getLatitudeInputLabel(): string {
  return 'LATITUDE';
}

export function getLongitudeInputLabel(): string {
  return 'LONGITUDE';
}

export function getCountryLabel(): string {
  return 'PAYS';
}

export function getRegionLabel(): string {
  return 'RÉGION';
}

export function getUnknownRegionErrorMessage(): string {
  return 'région inconnue';
}

export function getIATAUniquenessErrorNotificationMessage(): string {
  return 'Code IATA déjà lié à un autre aéroport existant !';
}

export function getAirportsImportTemplateFile(): string {
  return `${getIATALabel()};${getNameLabel()};${getCityLabel()};${getLatitudeInputLabel()};${getLongitudeInputLabel()};${getCountryLabel()};${getRegionLabel()}`;
}
