import { describe, it, expect } from 'vitest';
import {
  CONFIRMATION_DIALOG_MODE,
  INFO_DIALOG_MODE,
  OK_DIALOG_BUTTON_TYPE,
  CANCEL_DIALOG_BUTTON_TYPE,
} from '../../app/shared/constants/dialogs-constants';

describe('DialogsConstants', () => {
  it('CONFIRMATION_DIALOG_MODE should return "confirmation" dialog mode', () => {
    expect(CONFIRMATION_DIALOG_MODE).toStrictEqual('CONFIRMATION');
  });

  it('INFO_DIALOG_MODE should return "info" dialog mode', () => {
    expect(INFO_DIALOG_MODE).toStrictEqual('INFO');
  });

  it('OK_DIALOG_BUTTON_TYPE should return "OK" button type', () => {
    expect(OK_DIALOG_BUTTON_TYPE).toStrictEqual('OK');
  });

  it('CANCEL_DIALOG_BUTTON_TYPE should return "cancel" button type', () => {
    expect(CANCEL_DIALOG_BUTTON_TYPE).toStrictEqual('CANCEL');
  });
});
