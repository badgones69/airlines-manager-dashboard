import { IMPORT_HUBS, IMPORT_USERS } from '../../constants/forms-constants';
import { getNumberHubsLabel } from '../dialogs/import-hubs-dialog';
import { getNumberUsersLabel } from '../dialogs/import-users-dialog';

export function getDownloadTemplateFileInputLabel(): string {
  return 'Télécharger le modèle';
}

export function getImportFileInputLabel(): string {
  return 'Sélectionner le fichier';
}

export function getNumberLabel(origin: string, number: number): string {
  let numbersLabel: string = '';

  switch (origin) {
    case IMPORT_USERS:
      numbersLabel = getNumberUsersLabel(number);
      break;
    case IMPORT_HUBS:
      numbersLabel = getNumberHubsLabel(number);
      break;
  }
  return numbersLabel;
}

export function getImportButtonLabel() {
  return 'Importer';
}

export function getImportFileFormatErrorNotificationMessage(): string {
  return "Le fichier sélectionné n'est pas au format TXT !";
}

export function getImportFileHeaderErrorNotificationMessage(): string {
  return "Le fichier sélectionné n'a pas un en-tête valide !";
}

export function getImportFileNoDataWarningNotificationMessage(): string {
  return 'Le fichier sélectionné ne contient aucune donnée !';
}

export function getImportFileDataErrorNotificationMessage(): string {
  return "Les données de votre fichier d'import ne sont pas valides !";
}
