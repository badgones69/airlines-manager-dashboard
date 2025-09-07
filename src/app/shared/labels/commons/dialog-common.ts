import {
  CANCEL_DIALOG_BUTTON_TYPE,
  OK_DIALOG_BUTTON_TYPE,
} from '../../constants/dialogs-constants';

export function getConfirmationDialogTitleLabel(): string {
  return ': confirmation';
}

export function getDeleteDialogMessage(): string {
  return 'Confirmez-vous la suppression définitive de {} ?';
}

export function getDialogButtonLabel(
  buttonType: string,
  isConfirmationDialog: boolean,
): string {
  if (buttonType === OK_DIALOG_BUTTON_TYPE) {
    return isConfirmationDialog ? 'Oui' : 'OK';
  } else if (buttonType === CANCEL_DIALOG_BUTTON_TYPE) {
    return isConfirmationDialog ? 'Non' : 'Annuler';
  }
  return '';
}
