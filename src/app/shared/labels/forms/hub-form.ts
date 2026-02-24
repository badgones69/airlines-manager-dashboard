import { getDeleteDialogMessage } from "../commons/dialog-common";
import { getFormActionLabel } from "../commons/form-common";

export function getHubFormTitle(): string {
  return 'd\'un hub';
}

export function getHubDeleteDialogMessage(): string {
  return `${getDeleteDialogMessage().replace('{}', 'ce hub')}`;
}

export function getHubFormSuccessNotificationMessage(
  formMode: string,
): string {
  return `Votre hub a bien été ${getFormActionLabel(formMode)} !`;
}
