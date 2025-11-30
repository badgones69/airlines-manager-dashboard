import { getAirlineLogoDialogTitle, getAirlineLogoBackgroundInputLabel, getAirlineLogoLetterInputLabel, getAirlineLogoLetterColorInputLabel, getAirlineLogoPreviewLabel, getSelectButtonLabel } from '../../app/shared/labels/dialogs/airline-logo-dialog';
import { describe, it, expect } from 'vitest';

describe('AirlineLogoDialogLabels', () => {
  
  it('#getAirlineLogoDialogTitle should return airline logo dialog title', () => {
    const airlineLogoDialogTitle: string = getAirlineLogoDialogTitle();
    expect(airlineLogoDialogTitle).toStrictEqual('Logo de la compagnie');
  });

  it('#getAirlineLogoBackgroundInputLabel should return "background" label', () => {
    const backgroundLabel: string = getAirlineLogoBackgroundInputLabel();
    expect(backgroundLabel).toStrictEqual('FOND (COULEUR)');
  });

  it('#getAirlineLogoLetterInputLabel should return "letter" label', () => {
    const letterLabel: string = getAirlineLogoLetterInputLabel();
    expect(letterLabel).toStrictEqual('LETTRE');
  });

  it('#getAirlineLogoLetterColorInputLabel should return "letter color" label', () => {
    const letterColorLabel: string = getAirlineLogoLetterColorInputLabel();
    expect(letterColorLabel).toStrictEqual('LETTRE (COULEUR)');
  });

  it('#getAirlineLogoPreviewLabel should return "preview" label', () => {
    const previewLabel: string = getAirlineLogoPreviewLabel();
    expect(previewLabel).toStrictEqual('PRÉVISUALISATION');
  });

  it('#getSelectButtonLabel should return "select" button label', () => {
    const selectButtonLabel: string = getSelectButtonLabel();
    expect(selectButtonLabel).toStrictEqual('Sélectionner');
  });
});