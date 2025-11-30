import { getResetUserPasswordFormTitle, getSubmitButtonLabel, getResetUserPasswordFormSuccessNotificationMessage } from '../../app/shared/labels/forms/reset-user-password-form';
import { describe, it, expect } from 'vitest';

describe('ResetUserPasswordFormLabels', () => {
  
  it('#getResetUserPasswordFormTitle should return reset user password form title', () => {
    const resetUserPasswordFormTitle: string = getResetUserPasswordFormTitle(true);
    expect(resetUserPasswordFormTitle).toStrictEqual('Réinitialisation du mot de passe d\'un utilisateur');
  });

  it('#getSubmitButtonLabel should return submit button label', () => {
    const submitButtonLabel: string = getSubmitButtonLabel();
    expect(submitButtonLabel).toStrictEqual('Réinitialiser');
  });

  it('#getResetUserPasswordFormSuccessNotificationMessage should return success notification message', () => {
    const successNotificationMessage: string = getResetUserPasswordFormSuccessNotificationMessage();
    expect(successNotificationMessage).toStrictEqual('Le mot de passe de votre utilisateur a bien été réinitialisé !');
  });
});