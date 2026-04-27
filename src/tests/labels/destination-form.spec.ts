import { ADD_FORM_MODE } from '../../app/shared/constants/forms-constants';
import {
  getDestinationFormTitle,
  getDestinationDeleteDialogMessage,
  getDestinationFormSuccessNotificationMessage,
} from '../../app/shared/labels/forms/destination-form';
import { describe, it, expect } from 'vitest';

describe('DestinationFormLabels', () => {
  it('#getDestinationFormTitle should return destination form title', () => {
    const destinationFormTitle: string = getDestinationFormTitle();
    expect(destinationFormTitle).toStrictEqual("d'une destination");
  });

  it('#getDestinationDeleteDialogMessage should return destination delete dialog message', () => {
    const destinationDeleteDialogMessage: string = getDestinationDeleteDialogMessage();
    expect(destinationDeleteDialogMessage).toStrictEqual(
      'Confirmez-vous la suppression définitive de cette destination ?',
    );
  });

  it('#getDestinationFormSuccessNotificationMessage should return success notification message', () => {
    const successNotificationMessage: string =
      getDestinationFormSuccessNotificationMessage(ADD_FORM_MODE);
    expect(successNotificationMessage).toStrictEqual(
      'Votre destination a bien été créé(e) !',
    );
  });
});
