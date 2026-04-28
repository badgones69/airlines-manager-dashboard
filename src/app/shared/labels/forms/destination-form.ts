import { getDeleteDialogMessage } from '../commons/dialog-common';
import { getFormActionLabel } from '../commons/form-common';

export function getDestinationFormTitle(): string {
  return "d'une destination";
}

export function getDestinationDeleteDialogMessage(): string {
  return `${getDeleteDialogMessage().replace('{}', 'cette destination')}`;
}

export function getDestinationFormSuccessNotificationMessage(
  formMode: string,
): string {
  return `Votre destination a bien été ${getFormActionLabel(formMode)} !`;
}
