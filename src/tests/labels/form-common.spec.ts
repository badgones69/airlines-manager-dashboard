import {
  ADD_FORM_MODE,
  DELETE_FORM_MODE,
  EDIT_FORM_MODE,
} from '../../app/shared/constants/forms-constants';
import {
  getFormModeLabel,
  getFormActionLabel,
  getPasswordInputLabel,
  getSubmitButtonLabel,
  getSubmitButtonIcon,
  getResetButtonLabel,
  getResetButtonIcon,
  getResetButtonType,
  getRequiredFieldErrorMessage,
  getICAO_IATA_FieldsErrorMessage,
  getBlankStringFieldErrorMessage,
  getUnknownCountryErrorMessage,
} from '../../app/shared/labels/commons/form-common';
import { describe, it, expect } from 'vitest';

describe('FormCommonLabels', () => {
  it('#getFormModeLabel should return form mode label', () => {
    const addFormModeLabel: string = getFormModeLabel(ADD_FORM_MODE);
    const editFormModeLabel: string = getFormModeLabel(EDIT_FORM_MODE);
    const deleteFormModeLabel: string = getFormModeLabel(DELETE_FORM_MODE);
    expect(addFormModeLabel).toStrictEqual('Ajout');
    expect(editFormModeLabel).toStrictEqual('Modification');
    expect(deleteFormModeLabel).toStrictEqual('Suppression');
  });

  it('#getFormActionLabel should return form action label', () => {
    const addFormActionLabel: string = getFormActionLabel(ADD_FORM_MODE);
    const editFormActionLabel: string = getFormActionLabel(EDIT_FORM_MODE);
    const deleteFormActionLabel: string = getFormActionLabel(DELETE_FORM_MODE);
    expect(addFormActionLabel).toStrictEqual('créé(e)');
    expect(editFormActionLabel).toStrictEqual('modifié(e)');
    expect(deleteFormActionLabel).toStrictEqual('supprimé(e)');
  });

  it('#getPasswordInputLabel should return "password" label', () => {
    const passwordLabel: string = getPasswordInputLabel();
    expect(passwordLabel).toStrictEqual('MOT DE PASSE');
  });

  it('#getSubmitButtonLabel should return submit button label', () => {
    const addSubmitButtonLabel: string = getSubmitButtonLabel(ADD_FORM_MODE);
    const editSubmitButtonLabel: string = getSubmitButtonLabel(EDIT_FORM_MODE);
    expect(addSubmitButtonLabel).toStrictEqual('Créer');
    expect(editSubmitButtonLabel).toStrictEqual('Modifier');
  });

  it('#getSubmitButtonIcon should return submit button icon', () => {
    const addSubmitButtonIcon: string = getSubmitButtonIcon(ADD_FORM_MODE);
    const editSubmitButtonIcon: string = getSubmitButtonIcon(EDIT_FORM_MODE);
    expect(addSubmitButtonIcon).toStrictEqual('add');
    expect(editSubmitButtonIcon).toStrictEqual('edit');
  });

  it('#getResetButtonLabel should return reset button label', () => {
    const addResetButtonLabel: string = getResetButtonLabel(ADD_FORM_MODE);
    const editResetButtonLabel: string = getResetButtonLabel(EDIT_FORM_MODE);
    expect(addResetButtonLabel).toStrictEqual('Effacer');
    expect(editResetButtonLabel).toStrictEqual('Annuler');
  });

  it('#getResetButtonIcon should return reset button icon', () => {
    const addResetButtonIcon: string = getResetButtonIcon(ADD_FORM_MODE);
    const editResetButtonIcon: string = getResetButtonIcon(EDIT_FORM_MODE);
    expect(addResetButtonIcon).toStrictEqual('ink_eraser');
    expect(editResetButtonIcon).toStrictEqual('undo');
  });

  it('#getResetButtonType should return reset button type', () => {
    const addResetButtonType: string = getResetButtonType(ADD_FORM_MODE);
    const editResetButtonType: string = getResetButtonType(EDIT_FORM_MODE);
    expect(addResetButtonType).toStrictEqual('reset');
    expect(editResetButtonType).toStrictEqual('button');
  });

  it('#getRequiredFieldErrorMessage should return required field error message', () => {
    const requiredFieldErrorMessage: string = getRequiredFieldErrorMessage();
    expect(requiredFieldErrorMessage).toStrictEqual('champ obligatoire');
  });

  it('#getICAO_IATA_FieldsErrorMessage should return ICAO/IATA fields error message', () => {
    const icao_iataFieldsErrorMessage: string =
      getICAO_IATA_FieldsErrorMessage();
    expect(icao_iataFieldsErrorMessage).toStrictEqual('3 lettres obligatoires');
  });

  it('#getBlankStringFieldErrorMessage should return blank-string field error message', () => {
    const blankStringFieldsErrorMessage: string =
      getBlankStringFieldErrorMessage();
    expect(blankStringFieldsErrorMessage).toStrictEqual(
      'min. 1 caractère obligatoire',
    );
  });

  it('#getUnknownCountryErrorMessage should return country fields error message', () => {
    const countryFieldsErrorMessage: string = getUnknownCountryErrorMessage();
    expect(countryFieldsErrorMessage).toStrictEqual('pays inconnu');
  });
});
