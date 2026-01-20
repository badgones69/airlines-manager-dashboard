import { ADD_FORM_MODE } from '../../app/shared/constants/forms-constants';
import {
  getUserFormTitle,
  getRepeatedPasswordInputLabel,
  getUserDeleteDialogMessage,
  getIdentityFieldsErrorMessage,
  getLoginFieldFormatErrorMessage,
  getPasswordFieldFormatErrorMessage,
  getRepeatedPasswordFieldFormatErrorMessage,
  getUserFormSuccessNotificationMessage,
} from '../../app/shared/labels/forms/user-form';
import { describe, it, expect } from 'vitest';

describe('UserFormLabels', () => {
  it('#getUserFormTitle should return user form title', () => {
    const userFormTitle: string = getUserFormTitle();
    expect(userFormTitle).toStrictEqual("d'un utilisateur");
  });

  it('#getRepeatedPasswordInputLabel should return "repeated password" label', () => {
    const repeatedPasswordLabel: string = getRepeatedPasswordInputLabel();
    expect(repeatedPasswordLabel).toStrictEqual('RÉPÉTER MOT DE PASSE');
  });

  it('#getUserDeleteDialogMessage should return user delete dialog message', () => {
    const userDeleteDialogMessage: string = getUserDeleteDialogMessage();
    expect(userDeleteDialogMessage).toStrictEqual(
      'Confirmez-vous la suppression définitive de cet utilisateur ?',
    );
  });

  it('#getIdentityFieldsErrorMessage should return identity fields error message', () => {
    const identityFieldsErrorMessage: string = getIdentityFieldsErrorMessage();
    expect(identityFieldsErrorMessage).toStrictEqual('identité invalide');
  });

  it('#getLoginFieldFormatErrorMessage should return login field error message', () => {
    const loginFieldErrorMessage: string = getLoginFieldFormatErrorMessage();
    expect(loginFieldErrorMessage).toStrictEqual(
      'format invalide (a[-b].c[-d])',
    );
  });

  it('#getPasswordFieldFormatErrorMessage should return password field error message', () => {
    const passwordFieldErrorMessage: string =
      getPasswordFieldFormatErrorMessage();
    expect(passwordFieldErrorMessage).toStrictEqual(
      'mot de passe trop court et/ou pas assez sécurisé',
    );
  });

  it('#getRepeatedPasswordFieldFormatErrorMessage should return repeated password field error message', () => {
    const repeatedPasswordFieldErrorMessage: string =
      getRepeatedPasswordFieldFormatErrorMessage();
    expect(repeatedPasswordFieldErrorMessage).toStrictEqual(
      'mots de passe différents',
    );
  });

  it('#getUserFormSuccessNotificationMessage should return success notification message', () => {
    const successNotificationMessage: string =
      getUserFormSuccessNotificationMessage(ADD_FORM_MODE);
    expect(successNotificationMessage).toStrictEqual(
      'Votre utilisateur a bien été créé(e) !',
    );
  });
});
