import { describe, it, expect, vi } from 'vitest';
import { DialogComponent } from '../../app/shared/components/dialog/dialog.component';
import { CONFIRMATION_DIALOG_MODE, INFO_DIALOG_MODE } from '../../app/shared/constants/dialogs-constants';

describe('DialogComponent', () => {

  it('#ngOnInit should initialize "Dialog" component', () => {
    const dialogComponent: DialogComponent = new DialogComponent();
    dialogComponent.dialogMode = CONFIRMATION_DIALOG_MODE;
    dialogComponent.ngOnInit();
    expect(dialogComponent.isConfirmationDialog).toBeTruthy();
    expect(dialogComponent.okLabel).toStrictEqual('Oui');
    expect(dialogComponent.cancelLabel).toStrictEqual('Non');
    dialogComponent.dialogMode = INFO_DIALOG_MODE;
    dialogComponent.ngOnInit();
    expect(dialogComponent.isConfirmationDialog).toBeFalsy();
    expect(dialogComponent.okLabel).toStrictEqual('OK');
    expect(dialogComponent.cancelLabel).toStrictEqual('Annuler');
  });

  it('#confirm should submit dialog response', () => {
    const dialogComponent: DialogComponent = new DialogComponent();
    vi.spyOn(dialogComponent.submitted, 'emit');
    dialogComponent.confirm();
    expect(dialogComponent.submitted.emit).toHaveBeenCalledWith(true);
  });
});