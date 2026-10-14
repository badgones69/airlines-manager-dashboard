import { IMPORT_USERS, IMPORT_HUBS, IMPORT_DESTINATIONS, IMPORT_ROUTES } from '../constants/forms-constants';
import { getUsersImportTemplateFile } from '../labels/dialogs/import-users-dialog';
import { getAirportsImportTemplateFile } from '../labels/commons/airport-common';
import { getRoutesImportTemplateFile } from '../labels/dialogs/import-routes-dialog';

export function isNotBlank(value: string): boolean {
  return !!value && value.trim() !== '';
}

export function isValidHeader(
  origin: string,
  header: string | undefined,
): boolean {
  switch (origin) {
    case IMPORT_USERS:
      return !!header && header === getUsersImportTemplateFile();
    case IMPORT_HUBS:
    case IMPORT_DESTINATIONS:
      return !!header && header === getAirportsImportTemplateFile();
    case IMPORT_ROUTES:
      return !!header && header === getRoutesImportTemplateFile();
  }
  return false;
}
