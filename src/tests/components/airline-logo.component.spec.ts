import { describe, it, expect, vi } from 'vitest';
import { AirlineLogoComponent } from '../../app/airline/airline-logo/airline-logo.component';

describe('AirlineLogoComponent', () => {
  it('#ngOnInit should initialize "Airline Logo" component', () => {
    const airlineLogoComponent: AirlineLogoComponent =
      new AirlineLogoComponent();
    airlineLogoComponent.ngOnInit();
    expect(airlineLogoComponent.airlineLogoDialogTitle).toStrictEqual(
      'Logo de la compagnie',
    );
    expect(airlineLogoComponent.airlineLogoBackgroundInputLabel).toStrictEqual(
      'FOND (COULEUR)',
    );
    expect(airlineLogoComponent.airlineLogoLetterInputLabel).toStrictEqual(
      'LETTRE',
    );
    expect(airlineLogoComponent.airlineLogoLetterColorInputLabel).toStrictEqual(
      'LETTRE (COULEUR)',
    );
    expect(airlineLogoComponent.airlineLogoPreviewInputLabel).toStrictEqual(
      'PRÉVISUALISATION',
    );
    expect(airlineLogoComponent.selectButtonLabel).toStrictEqual(
      'Sélectionner',
    );
  });

  it('#editAirlineLogo should submit airline logo', () => {
    const airlineLogoComponent: AirlineLogoComponent =
      new AirlineLogoComponent();
    airlineLogoComponent.logoLetter = 'X';
    airlineLogoComponent.logoBackground = 'BG-G';
    airlineLogoComponent.logoLetterColor = 'LT-W';
    vi.spyOn(airlineLogoComponent.submitted, 'emit');
    airlineLogoComponent.editAirlineLogo();
    expect(airlineLogoComponent.submitted.emit).toHaveBeenCalledWith(
      'X_BG-G_LT-W',
    );
  });
});
