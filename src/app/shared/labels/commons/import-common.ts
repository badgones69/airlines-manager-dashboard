import { IMPORT_USERS } from "../../constants/forms-constants";
import { getNumberUsersLabel } from "../dialogs/import-users-dialog";

export function getDownloadTemplateFileInputLabel(): string {
  return 'Télécharger le modèle';
}

export function getImportFileInputLabel(): string {
  return 'Sélectionner le fichier';
}

export function getNumberLabel(origin: string, number: number): string {
  switch (origin) {
    case IMPORT_USERS: 
      return getNumberUsersLabel(number);
    default:
      return ''
  }
}

export function getImportButtonLabel() {
  return 'Importer';
}