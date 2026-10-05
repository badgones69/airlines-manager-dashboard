import { IMPORT_USERS, IMPORT_HUBS, IMPORT_DESTINATIONS } from '../constants/forms-constants';
import { getUsersImportTemplateFile } from '../labels/dialogs/import-users-dialog';
import { getAirportsImportTemplateFile } from '../labels/commons/airport-common';

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
  }
  return false;
}
