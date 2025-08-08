import {
  ADD_FORM_MODE,
  DELETE_FORM_MODE,
  EDIT_FORM_MODE,
} from '../../constants/forms-constants';

export function getFormModeLabel(formMode: string): string {
  switch (formMode) {
    case ADD_FORM_MODE:
      return 'Ajout';
    case EDIT_FORM_MODE:
      return 'Modification';
    case DELETE_FORM_MODE:
      return 'Suppression';
    default:
      return '';
  }
}

export function getFormActionLabel(formMode: string): string {
  switch (formMode) {
    case ADD_FORM_MODE:
      return 'créé(e)';
    case EDIT_FORM_MODE:
      return 'modifié(e)';
    case DELETE_FORM_MODE:
      return 'supprimé(e)';
    default:
      return '';
  }
}

export function getPasswordInputLabel(): string {
  return 'MOT DE PASSE';
}

export function getSubmitButtonLabel(formMode: string): string {
  return formMode === ADD_FORM_MODE ? 'Créer' : 'Modifier';
}

export function getSubmitButtonIcon(formMode: string): string {
  return formMode === ADD_FORM_MODE ? 'add' : 'edit';
}

export function getResetButtonLabel(formMode: string): string {
  return formMode === ADD_FORM_MODE ? 'Effacer' : 'Annuler';
}

export function getResetButtonIcon(formMode: string): string {
  return formMode === ADD_FORM_MODE ? 'ink_eraser' : 'undo';
}

export function getResetButtonType(formMode: string): string {
  return formMode === ADD_FORM_MODE ? 'reset' : 'button';
}

export function getRequiredFieldErrorMessage(): string {
  return 'champ obligatoire';
}

export function getICAO_IATAFieldsErrorMessage(): string {
  return '3 lettres obligatoires';
}

export function getAllWhitespaceFieldErrorMessage(): string {
  return 'min. 1 caractère obligatoire';
}
