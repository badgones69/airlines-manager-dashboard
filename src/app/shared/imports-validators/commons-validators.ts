import { IMPORT_USERS } from '../constants/forms-constants';
import { getUsersImportTemplateFile } from '../labels/dialogs/import-users-dialog';

export function isNotBlank(value: string): boolean {
  return !!value && value.trim() !== '';
}

export function isValidHeader(origin: string, header: string | undefined): boolean {
  if (origin === IMPORT_USERS) {
    return !!header && header === getUsersImportTemplateFile();
  }
  return false;
}