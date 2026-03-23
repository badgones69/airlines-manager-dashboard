import {
  CANCEL_DIALOG_BUTTON_TYPE,
  OK_DIALOG_BUTTON_TYPE,
} from '../../app/shared/constants/dialogs-constants';
import {
  getDeleteDialogMessage,
  getDialogButtonLabel,
} from '../../app/shared/labels/commons/dialog-common';
import { describe, it, expect } from 'vitest';

describe('DialogCommonLabels', () => {

  it('#getDeleteDialogMessage should return delete dialog message', () => {
    const deleteDialogMessage: string = getDeleteDialogMessage();
    expect(deleteDialogMessage).toStrictEqual(
      'Confirmez-vous la suppression définitive de {} ?',
    );
  });

  it('#getDialogButtonLabel should return dialog button label', () => {
    const yesButtonLabel: string = getDialogButtonLabel(
      OK_DIALOG_BUTTON_TYPE,
      true,
    );
    const okButtonLabel: string = getDialogButtonLabel(
      OK_DIALOG_BUTTON_TYPE,
      false,
    );
    const noButtonLabel: string = getDialogButtonLabel(
      CANCEL_DIALOG_BUTTON_TYPE,
      true,
    );
    const cancelButtonLabel: string = getDialogButtonLabel(
      CANCEL_DIALOG_BUTTON_TYPE,
      false,
    );
    expect(yesButtonLabel).toStrictEqual('Oui');
    expect(okButtonLabel).toStrictEqual('OK');
    expect(noButtonLabel).toStrictEqual('Non');
    expect(cancelButtonLabel).toStrictEqual('Annuler');
  });
});
