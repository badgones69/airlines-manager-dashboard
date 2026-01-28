import { EDIT_FORM_MODE } from '../../app/shared/constants/forms-constants';
import {
  getAirlineFormTitle,
  getICAOCodeInputLabel,
  getNameInputLabel,
  getLogoInputLabel,
  getNoLogoLabel,
  getNationalityInputLabel,
  getAirlineFormSuccessNotificationMessage,
} from '../../app/shared/labels/forms/airline-form';
import { describe, it, expect } from 'vitest';

describe('AirlineFormLabels', () => {
  it('#getAirlineFormTitle should return airline form title', () => {
    const airlineFormTitle: string = getAirlineFormTitle();
    expect(airlineFormTitle).toStrictEqual('de la compagnie');
  });

  it('#getICAOCodeInputLabel should return "ICAO" label', () => {
    const icaoLabel: string = getICAOCodeInputLabel();
    expect(icaoLabel).toStrictEqual('ICAO');
  });

  it('#getNameInputLabel should return "name" label', () => {
    const nameLabel: string = getNameInputLabel();
    expect(nameLabel).toStrictEqual('NOM');
  });

  it('#getLogoInputLabel should return "update logo" label', () => {
    const logoLabel: string = getLogoInputLabel(EDIT_FORM_MODE);
    expect(logoLabel).toStrictEqual('Modifier le logo');
  });

  it('#getNoLogoLabel should return "no logo" label', () => {
    const noLogoLabel: string = getNoLogoLabel();
    expect(noLogoLabel).toStrictEqual('Aucun logo');
  });

  it('#getNationalityInputLabel should return "nationality" label', () => {
    const nationalityLabel: string = getNationalityInputLabel();
    expect(nationalityLabel).toStrictEqual('NATIONALITÉ');
  });

  it('#getAirlineFormSuccessNotificationMessage should return success notification message', () => {
    const successNotificationMessage: string =
      getAirlineFormSuccessNotificationMessage(EDIT_FORM_MODE);
    expect(successNotificationMessage).toStrictEqual(
      'Votre compagnie et/ou son logo ont bien été modifié(e)s !',
    );
  });
});
