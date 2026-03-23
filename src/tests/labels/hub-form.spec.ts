import { ADD_FORM_MODE } from '../../app/shared/constants/forms-constants';
import {
  getHubFormTitle,
  getHubDeleteDialogMessage,
  getHubFormSuccessNotificationMessage,
} from '../../app/shared/labels/forms/hub-form';
import { describe, it, expect } from 'vitest';

describe('HubFormLabels', () => {
  it('#getHubFormTitle should return hub form title', () => {
    const hubFormTitle: string = getHubFormTitle();
    expect(hubFormTitle).toStrictEqual("d'un hub");
  });

  it('#getHubDeleteDialogMessage should return hub delete dialog message', () => {
    const hubDeleteDialogMessage: string = getHubDeleteDialogMessage();
    expect(hubDeleteDialogMessage).toStrictEqual(
      'Confirmez-vous la suppression définitive de ce hub ?',
    );
  });

  it('#getHubFormSuccessNotificationMessage should return success notification message', () => {
    const successNotificationMessage: string =
      getHubFormSuccessNotificationMessage(ADD_FORM_MODE);
    expect(successNotificationMessage).toStrictEqual(
      'Votre hub a bien été créé(e) !',
    );
  });
});
