import { describe, it, expect, vi } from 'vitest';
import {
  ADD_FORM_MODE,
  BLANK_VALUE_ERROR,
  EDIT_FORM_MODE,
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  PATTERN_ERROR,
  REQUIRED_ERROR,
  UNKNOWN_COUNTRY_ERROR,
  UNKNOWN_REGION_ERROR,
} from '../../app/shared/constants/forms-constants';
import {
  getResetButtonLabel,
  getResetButtonIcon,
  getResetButtonType,
  getNameLabel,
  getFormModeLabel,
  getSubmitButtonIcon,
} from '../../app/shared/labels/commons/form-common';
import {
  getSubmitButtonLabel,
} from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';
import { AirportFormComponent } from '../../app/shared/components/airport-form/airport-form.component';
import { getCityLabel, getCountryLabel, getIATALabel, getLatitudeInputLabel, getLongitudeInputLabel, getRegionLabel } from '../../app/shared/labels/commons/airport-common';
import { getHubFormTitle } from '../../app/shared/labels/forms/hub-form';
import { getDestinationFormTitle } from '../../app/shared/labels/forms/destination-form';
import { Country } from '../../app/shared/models/Country';
import { Region } from '../../app/shared/models/Region';

describe('AirportFormComponent', () => {
  it('#ngOnInit should initialize "Airport form" component', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      vi.spyOn(airportFormComponent, 'ngOnInit').mockImplementation(() => {
        airportFormComponent.airportFormTitle = `${getFormModeLabel(
          airportFormComponent.formMode,
        )} ${airportFormComponent.formTitle}`;
        airportFormComponent.iataInputLabel = getIATALabel();
        airportFormComponent.nameInputLabel = getNameLabel();
        airportFormComponent.cityInputLabel = getCityLabel();
        airportFormComponent.latitudeInputLabel = getLatitudeInputLabel();
        airportFormComponent.longitudeInputLabel = getLongitudeInputLabel();
        airportFormComponent.countryInputLabel = getCountryLabel();
        airportFormComponent.regionInputLabel = getRegionLabel();
        airportFormComponent.submitButtonLabel = getSubmitButtonLabel(airportFormComponent.formMode);
        airportFormComponent.submitButtonIcon = getSubmitButtonIcon(airportFormComponent.formMode);
        airportFormComponent.resetButtonLabel =
          getResetButtonLabel(airportFormComponent.formMode);
        airportFormComponent.resetButtonIcon =
          getResetButtonIcon(airportFormComponent.formMode);
        airportFormComponent.resetButtonType =
          getResetButtonType(airportFormComponent.formMode);
      });
      airportFormComponent.formMode = ADD_FORM_MODE;
      airportFormComponent.formTitle = getHubFormTitle();
      airportFormComponent.ngOnInit();

      expect(airportFormComponent.airportFormTitle).toStrictEqual(
        'Ajout d\'un hub',
      );
      expect(airportFormComponent.iataInputLabel).toStrictEqual(
        'IATA',
      );
      expect(airportFormComponent.nameInputLabel).toStrictEqual(
        'NOM',
      );
      expect(airportFormComponent.cityInputLabel).toStrictEqual(
        'VILLE',
      );
      expect(airportFormComponent.latitudeInputLabel).toStrictEqual(
        'LATITUDE',
      );
      expect(airportFormComponent.longitudeInputLabel).toStrictEqual(
        'LONGITUDE',
      );
      expect(airportFormComponent.countryInputLabel).toStrictEqual(
        'PAYS',
      );
      expect(airportFormComponent.regionInputLabel).toStrictEqual(
        'RÉGION',
      );
      expect(airportFormComponent.submitButtonLabel).toStrictEqual(
        'Créer',
      );
      expect(airportFormComponent.submitButtonIcon).toStrictEqual('add');
      expect(airportFormComponent.resetButtonLabel).toStrictEqual('Effacer');
      expect(airportFormComponent.resetButtonIcon).toStrictEqual(
        'ink_eraser',
      );
      expect(airportFormComponent.resetButtonType).toStrictEqual('reset');

      airportFormComponent.formMode = EDIT_FORM_MODE;
      airportFormComponent.formTitle = getDestinationFormTitle();
      airportFormComponent.ngOnInit();

      expect(airportFormComponent.airportFormTitle).toStrictEqual(
        'Modification d\'une destination',
      );
      expect(airportFormComponent.submitButtonLabel).toStrictEqual(
        'Modifier',
      );
      expect(airportFormComponent.submitButtonIcon).toStrictEqual('edit');
      expect(airportFormComponent.resetButtonLabel).toStrictEqual('Annuler');
      expect(airportFormComponent.resetButtonIcon).toStrictEqual(
        'undo',
      );
      expect(airportFormComponent.resetButtonType).toStrictEqual('button');
    });
  });

  it('#changeCountry should change country field value', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();

      const country: Country = {
        id: 5,
        name: 'Allemagne',
        icao: 'D',
        flagCode: 'de',
      };
      airportFormComponent.changeCountry(country);
      expect(airportFormComponent.countryFlag).toStrictEqual('de');

      airportFormComponent.changeCountry('france');
      expect(airportFormComponent.countryFlag).toStrictEqual('fr');

      airportFormComponent.changeCountry('azerty');
      expect(airportFormComponent.countryFlag).toStrictEqual('xx');
    });
  });

  it('#changeRegion should change region field value', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();

      const region: Region = {
        id: 8,
        code: 'QC',
        name: 'Québec',
      };
      airportFormComponent.countryFlag = 'ca';
      airportFormComponent.changeRegion(region);
      expect(
        airportFormComponent.airportForm
          .get(airportFormComponent.regionFieldIdentifier)
          ?.hasError(UNKNOWN_REGION_ERROR)
      ).toBeFalsy();

      airportFormComponent.countryFlag = 'us';
      airportFormComponent.changeRegion('new york');
      expect(
        airportFormComponent.airportForm
          .get(airportFormComponent.regionFieldIdentifier)
          ?.hasError(UNKNOWN_REGION_ERROR)
      ).toBeFalsy();

      airportFormComponent.countryFlag = 'au';
      airportFormComponent.changeRegion('azerty');
      expect(
        airportFormComponent.airportForm
          .get(airportFormComponent.regionFieldIdentifier)
          ?.hasError(UNKNOWN_REGION_ERROR)
      ).toBeTruthy();
    });
  });

  it('#displayCountry should display country by its name', () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      expect(airportFormComponent.displayCountry(
        { id: 67, name: 'France', icao: 'F', flagCode: 'fr' }
      )).toStrictEqual(
        'France',
      );
    });
  });

  it('#displayRegion should display region by its name', () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      expect(airportFormComponent.displayRegion(
        { id: 1, code: 'NY', name: 'New York' }
      )).toStrictEqual(
        'New York (NY)',
      );
    });
  });

  it('#displayIATAErrorMessage should display IATA field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.iataFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayIATAErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.iataFieldIdentifier)
        ?.setErrors({ [MIN_LENGTH_ERROR]: true });

      expect(
        airportFormComponent.displayIATAErrorMessage(),
      ).toStrictEqual('3 lettres obligatoires');

      airportFormComponent.airportForm
        .get(airportFormComponent.iataFieldIdentifier)
        ?.setErrors({ [MAX_LENGTH_ERROR]: true });

      expect(
        airportFormComponent.displayIATAErrorMessage(),
      ).toStrictEqual('3 lettres obligatoires');

      airportFormComponent.airportForm
        .get(airportFormComponent.iataFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        airportFormComponent.displayIATAErrorMessage(),
      ).toStrictEqual('3 lettres obligatoires');
    });
  });

  it('#displayNameErrorMessage should display name field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.nameFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayNameErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.nameFieldIdentifier)
        ?.setErrors({ [BLANK_VALUE_ERROR]: true });

      expect(
        airportFormComponent.displayNameErrorMessage(),
      ).toStrictEqual('min. 1 caractère obligatoire');
    });
  });

  it('#displayLatitudeErrorMessage should display latitude field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.latitudeFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayLatitudeErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.latitudeFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        airportFormComponent.displayLatitudeErrorMessage(),
      ).toStrictEqual('coordonnée invalide (format décimal)');
    });
  });

  it('#displayLongitudeErrorMessage should display longitude field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.longitudeFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayLongitudeErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.longitudeFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        airportFormComponent.displayLongitudeErrorMessage(),
      ).toStrictEqual('coordonnée invalide (format décimal)');
    });
  });

  it('#displayCountryErrorMessage should display country field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.countryFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayCountryErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.countryFieldIdentifier)
        ?.setErrors([]);
      airportFormComponent.countryFlag = 'xx';
      airportFormComponent.displayCountryErrorMessage();

      expect(
        airportFormComponent.airportForm
          .get(airportFormComponent.countryFieldIdentifier)
          ?.hasError(UNKNOWN_COUNTRY_ERROR)
      ).toBeTruthy();

      expect(
        airportFormComponent.displayCountryErrorMessage(),
      ).toStrictEqual('pays inconnu');
    });
  });

  it('#displayRegionErrorMessage should display region field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();
      airportFormComponent.airportForm
        .get(airportFormComponent.regionFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        airportFormComponent.displayRegionErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      airportFormComponent.airportForm
        .get(airportFormComponent.regionFieldIdentifier)
        ?.setErrors({ [UNKNOWN_REGION_ERROR]: true });

      expect(
        airportFormComponent.displayRegionErrorMessage(),
      ).toStrictEqual('région inconnue');
    });
  });

  it('#submitAirportForm should submit airport', async () => {
    TestBed.runInInjectionContext(() => {
      const airportFormComponent: AirportFormComponent =
        new AirportFormComponent();

      airportFormComponent.isHub = false;
      airportFormComponent.countryFlag = 'us';
      airportFormComponent.airportForm.setValue({
        iata: 'lga',
        name: 'la guardia',
        city: 'new york',
        latitude: 63.63,
        longitude: 1.1,
        country: null,
        region: null,
      });
      
      airportFormComponent.airportForm
        .get(airportFormComponent.countryFieldIdentifier)
        ?.setValue('états-unis');

      airportFormComponent.airportForm
      .get(airportFormComponent.regionFieldIdentifier)
      ?.setValue('new york');
      
      vi.spyOn(airportFormComponent.submitted, 'emit');
      airportFormComponent.submitAirportForm();
      expect(airportFormComponent.submitted.emit).toHaveBeenCalledWith(
        {
          airportIATA: 'LGA',
          airportName: 'La Guardia',
          airportCity: 'New York',
          airportLatitude: 63.63,
          airportLongitude: 1.1,
          airportCountry: 63,
          airportRegion: 1,
          airportHub: false,
        },
      );
    });
  });
});
