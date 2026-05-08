import {
  getAuthenticationFormTitle,
  getSubmitButtonLabel,
  getErrorNotificationMessage,
} from '../../app/shared/labels/forms/authentication-form';
import { describe, it, expect } from 'vitest';

describe('AuthenticationFormLabels', () => {
  it('#getAuthenticationFormTitle should return authentication form title', () => {
    const authenticationFormTitle: string = getAuthenticationFormTitle();
    expect(authenticationFormTitle).toStrictEqual('Authentification');
  });

  it('#getSubmitButtonLabel should return submit button label', () => {
    const submitButtonLabel: string = getSubmitButtonLabel();
    expect(submitButtonLabel).toStrictEqual('Connexion');
  });

  it('#getErrorNotificationMessage should return error notification message', () => {
    const errorNotificationMessage: string = getErrorNotificationMessage();
    expect(errorNotificationMessage).toStrictEqual(
      'Identifiant et/ou mot de passe incorrects !',
    );
  });
});
