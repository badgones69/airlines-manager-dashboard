import { TestBed } from "@angular/core/testing";
import { describe, expect, it, vi } from "vitest";
import { BLANK_VALUE_ERROR, EDIT_FORM_MODE, MAX_LENGTH_ERROR, MIN_LENGTH_ERROR, PATTERN_ERROR, REQUIRED_ERROR, UNKNOWN_COUNTRY_ERROR } from "../../app/shared/constants/forms-constants";
import { AirlineComponent } from "../../app/airline/airline.component";
import { Inject } from "@angular/core";
import { NotificationService } from "../../app/shared/services/notification.service";
import { ActivatedRoute, provideRouter } from "@angular/router";
import { Country } from "../../app/shared/models/Country";
import { getFormModeLabel, getResetButtonIcon, getResetButtonLabel, getSubmitButtonLabel } from "../../app/shared/labels/commons/form-common";
import { getAirlineFormSuccessNotificationMessage, getAirlineFormTitle, getICAOCodeInputLabel, getLogoInputLabel, getNameInputLabel, getNationalityInputLabel } from "../../app/shared/labels/forms/airline-form";
import { MockAirlineComponent } from "../mocks/mock-airline-component";
import { getCountryByName } from "../../app/shared/utils/geographical-utils";
import { MockHomeComponent } from "../mocks/mock-home-component";
import { RouterTestingHarness } from "@angular/router/testing";
import { getTechnicalErrorMessage, getTechnicalErrorTitle } from "../../app/shared/labels/errors";
import { AirlineLogoComponent } from "../../app/airline/airline-logo/airline-logo.component";
import { NoopScrollStrategy } from "@angular/cdk/overlay";

function testOnInit(airlineComponent: AirlineComponent): void {
  let mockAirlineComponent: MockAirlineComponent = new MockAirlineComponent();

  vi.spyOn(airlineComponent, 'ngOnInit').mockImplementation((airlineEdited) => {
    mockAirlineComponent.userService.user.subscribe((user) => {
      if (user) {
        airlineComponent.authenticatedUser = JSON.parse(user.toString());
      }
    });

    if (airlineEdited) {
      testAirlineServiceWithAirlineEdited(mockAirlineComponent, airlineComponent, airlineEdited)
    } else {
      testAirlineService(mockAirlineComponent, airlineComponent);
    }
  });

  airlineComponent.ngOnInit();

  expect(airlineComponent.authenticatedUser).toStrictEqual(
    {
      id: 7,  
      uuid: 'uuid-authenticated-user',
      givenName: 'Authneticated',
      surname: 'USER',
      login: 'a.u',
      profile: 1,
    }
  );

  expect(airlineComponent.airlineFormTitle).toStrictEqual('Modification de la compagnie');
  expect(airlineComponent.icaoInputLabel).toStrictEqual('ICAO');
  expect(airlineComponent.nameInputLabel).toStrictEqual('NOM');
  expect(airlineComponent.logoInputLabel).toStrictEqual('Modifier le logo');
  expect(airlineComponent.nationalityInputLabel).toStrictEqual('NATIONALITÉ');
  expect(airlineComponent.submitButtonLabel).toStrictEqual('Modifier');
  expect(airlineComponent.resetButtonLabel).toStrictEqual('Annuler');
  expect(airlineComponent.resetButtonIcon).toStrictEqual('undo');
} 

function testAirlineService(mockAirlineComponent: MockAirlineComponent, airlineComponent: AirlineComponent): void {
  mockAirlineComponent.airlineService.findAirline().then((airline) => {
    airlineComponent.initAirlineToEdit = mockAirlineComponent.airlineMapper.airlineFromDB(airline);

    mockAirlineComponent.airlineService.airlineLogo.subscribe((airlineLogo) => {
      airlineComponent.airlineLogoImage = `src/images/logos/64x64/${airlineLogo}.png`;
      expect(airlineComponent.airlineLogoImage).toStrictEqual('src/images/logos/64x64/X_BG-CB_LT-W.png');
    });

    airlineComponent.airlineForm.patchValue({
      icao: airlineComponent.initAirlineToEdit?.icao,
      name: airlineComponent.initAirlineToEdit?.name
    });
    expect(airlineComponent.airlineForm.get(airlineComponent.icaoFieldIdentifier)?.value).toStrictEqual('XXX');
    expect(airlineComponent.airlineForm.get(airlineComponent.nameFieldIdentifier)?.value).toStrictEqual('XXX Airlines');

    airlineComponent.airlineForm
      .get(airlineComponent.nationalityFieldIdentifier)
      ?.setValue(
        airlineComponent.initAirlineToEdit?.nationality
      );

    expect(airlineComponent.airlineForm.get(airlineComponent.nationalityFieldIdentifier)?.value).toStrictEqual(
      {
        id: 20,
        name: 'Belgique',
        icao: 'OO',
        flagCode: 'be'
      }
    );

    airlineComponent.nationalityFlag = airlineComponent.initAirlineToEdit?.nationality.flagCode;

    expect(airlineComponent.nationalityFlag).toStrictEqual('be');
  });

  airlineComponent.airlineFormTitle = `${getFormModeLabel(EDIT_FORM_MODE)} ${getAirlineFormTitle()}`;
  airlineComponent.icaoInputLabel = getICAOCodeInputLabel();
  airlineComponent.nameInputLabel = getNameInputLabel();
  airlineComponent.logoInputLabel = getLogoInputLabel(EDIT_FORM_MODE);
  airlineComponent.nationalityInputLabel = getNationalityInputLabel();
  airlineComponent.submitButtonLabel = getSubmitButtonLabel(EDIT_FORM_MODE);
  airlineComponent.resetButtonLabel = getResetButtonLabel(EDIT_FORM_MODE);
  airlineComponent.resetButtonIcon = getResetButtonIcon(EDIT_FORM_MODE);
}

function testAirlineServiceWithAirlineEdited(mockAirlineComponent: MockAirlineComponent, airlineComponent: AirlineComponent, airlineEdited: any): void {
  mockAirlineComponent.airlineService.findAirline().then(() => {
    airlineEdited.nationality = getCountryByName(
      typeof airlineEdited.nationality === 'string'
        ? airlineEdited.nationality
        : airlineEdited.nationality.name
    );

    airlineComponent.airlineForm.patchValue({
      icao: airlineEdited?.icao,
      name: airlineEdited?.name
    });
    expect(airlineComponent.airlineForm.get(airlineComponent.icaoFieldIdentifier)?.value).toStrictEqual('MAL');
    expect(airlineComponent.airlineForm.get(airlineComponent.nameFieldIdentifier)?.value).toStrictEqual('Malvinas Airlines');

    airlineComponent.airlineForm
      .get(airlineComponent.nationalityFieldIdentifier)
      ?.setValue(
        airlineEdited?.nationality
      );

    expect(airlineComponent.airlineForm.get(airlineComponent.nationalityFieldIdentifier)?.value).toStrictEqual(
      {
        id: 10,
        name: 'Argentine',
        icao: 'LV',
        flagCode: 'ar'
      }
    );

    airlineComponent.nationalityFlag = airlineEdited?.nationality.flagCode;

    expect(airlineComponent.nationalityFlag).toStrictEqual('ar');
  });

  airlineComponent.airlineFormTitle = `${getFormModeLabel(EDIT_FORM_MODE)} ${getAirlineFormTitle()}`;
  airlineComponent.icaoInputLabel = getICAOCodeInputLabel();
  airlineComponent.nameInputLabel = getNameInputLabel();
  airlineComponent.logoInputLabel = getLogoInputLabel(EDIT_FORM_MODE);
  airlineComponent.nationalityInputLabel = getNationalityInputLabel();
  airlineComponent.submitButtonLabel = getSubmitButtonLabel(EDIT_FORM_MODE);
  airlineComponent.resetButtonLabel = getResetButtonLabel(EDIT_FORM_MODE);
  airlineComponent.resetButtonIcon = getResetButtonIcon(EDIT_FORM_MODE);
}

describe('AirlineComponent', () => {

  it('#ngOnInit should initialize "Airline" component', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));

      testOnInit(airlineComponent);

      const airlineEdited: any = {
        id: 8,
        uuid: 'airline-uuid',
        icao: 'MAL',
        name: 'Malvinas Airlines',
        logo: 'M_BG-CB_LT-W',
        nationality: 'argentine'
      } 
      airlineComponent.ngOnInit(airlineEdited);

      expect(airlineComponent.authenticatedUser).toStrictEqual(
        {
          id: 7,  
          uuid: 'uuid-authenticated-user',
          givenName: 'Authneticated',
          surname: 'USER',
          login: 'a.u',
          profile: 1,
        }
      );

      expect(airlineComponent.airlineFormTitle).toStrictEqual('Modification de la compagnie');
      expect(airlineComponent.icaoInputLabel).toStrictEqual('ICAO');
      expect(airlineComponent.nameInputLabel).toStrictEqual('NOM');
      expect(airlineComponent.logoInputLabel).toStrictEqual('Modifier le logo');
      expect(airlineComponent.nationalityInputLabel).toStrictEqual('NATIONALITÉ');
      expect(airlineComponent.submitButtonLabel).toStrictEqual('Modifier');
      expect(airlineComponent.resetButtonLabel).toStrictEqual('Annuler');
      expect(airlineComponent.resetButtonIcon).toStrictEqual('undo');
    });
  });

  it('#changeLogo should change airline logo', async () => {
    TestBed.runInInjectionContext(() => {
      let mockAirlineComponent: MockAirlineComponent = new MockAirlineComponent();
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));

      vi.spyOn(airlineComponent, 'changeLogo').mockImplementation(() => {
        vi.spyOn(mockAirlineComponent, 'changeLogo').mockImplementation(() => {
          expect(mockAirlineComponent.open).toHaveBeenCalledWith(AirlineLogoComponent, {
            disableClose: false,
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy(),
          });
        });
      });
      airlineComponent.changeLogo();
    });
  });

  it('#changeNationalityFlag should change nationality field flag', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));

      const country: Country = {
        id: 5,
        name: 'Allemagne',
        icao: 'D',
        flagCode: 'de'
      };
      airlineComponent.changeNationalityFlag(country);
      expect(airlineComponent.nationalityFlag).toStrictEqual('de');

      airlineComponent.changeNationalityFlag('france');
      expect(airlineComponent.nationalityFlag).toStrictEqual('fr');

      airlineComponent.changeNationalityFlag('azerty');
      expect(airlineComponent.nationalityFlag).toStrictEqual('xx');
    });
  });

  it('#displayCountry should display country name', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));

      const country: Country = {
        id: 5,
        name: 'Allemagne',
        icao: 'D',
        flagCode: 'de'
      };
      
      expect(airlineComponent.displayCountry(country)).toStrictEqual('Allemagne');
    });
  });

  it('#displayICAOErrorMessage should display ICAO field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));
      airlineComponent.airlineForm
        .get(airlineComponent.icaoFieldIdentifier)?.setErrors({[REQUIRED_ERROR]: true});
        
      expect(airlineComponent.displayICAOErrorMessage()).toStrictEqual('champ obligatoire');

      airlineComponent.airlineForm
        .get(airlineComponent.icaoFieldIdentifier)?.setErrors({[MIN_LENGTH_ERROR]: true});
        
      expect(airlineComponent.displayICAOErrorMessage()).toStrictEqual('3 lettres obligatoires');

      airlineComponent.airlineForm
        .get(airlineComponent.icaoFieldIdentifier)?.setErrors({[MAX_LENGTH_ERROR]: true});
        
      expect(airlineComponent.displayICAOErrorMessage()).toStrictEqual('3 lettres obligatoires');

      airlineComponent.airlineForm
        .get(airlineComponent.icaoFieldIdentifier)?.setErrors({[PATTERN_ERROR]: true});
        
      expect(airlineComponent.displayICAOErrorMessage()).toStrictEqual('3 lettres obligatoires');
    });
  });

  it('#displayNameErrorMessage should display name field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));
      airlineComponent.airlineForm
        .get(airlineComponent.nameFieldIdentifier)?.setErrors({[REQUIRED_ERROR]: true});
            
      expect(airlineComponent.displayNameErrorMessage()).toStrictEqual('champ obligatoire');

      airlineComponent.airlineForm
        .get(airlineComponent.nameFieldIdentifier)?.setErrors({[BLANK_VALUE_ERROR]: true});
            
      expect(airlineComponent.displayNameErrorMessage()).toStrictEqual('min. 1 caractère obligatoire');
    });
  });

  it('#displayNationalityErrorMessage should display nationality field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));
      airlineComponent.airlineForm
        .get(airlineComponent.nationalityFieldIdentifier)?.setErrors({[REQUIRED_ERROR]: true});
        
      expect(airlineComponent.displayNationalityErrorMessage()).toStrictEqual('champ obligatoire');

      airlineComponent.airlineForm
        .get(airlineComponent.nationalityFieldIdentifier)?.setErrors([]);
      airlineComponent.nationalityFlag = 'xx';
      expect(airlineComponent.airlineForm.get(airlineComponent.nationalityFieldIdentifier)?.hasError(UNKNOWN_COUNTRY_ERROR));
      expect(airlineComponent.displayNationalityErrorMessage()).toStrictEqual('pays inconnu');
    });
  });

  it('#submitAirlineForm should update airline in DB', async () => {
    TestBed.configureTestingModule({
      imports: [AirlineComponent],
      providers: [
        provideRouter([
          { path: 'home', component: MockHomeComponent }
        ])
      ]
    });

    const airlineToUpdate: any = {
      airlineID: 8,
      airlineUUID: 'airline-uuid',
      airlineICAO: 'FRE',
      airlineName: 'FRE Airlines',
      airlineLogo: 'F_BG-G_LT-W',
      airlineNationality: {
        id: 98,
        name: 'Irlande',
        icao: 'EI',
        flagCode: 'ie'
      }
    }

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      let mockAirlineComponent: MockAirlineComponent = new MockAirlineComponent();
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));
      vi.spyOn(airlineComponent, 'submitAirlineForm').mockImplementation(() => {
        mockAirlineComponent.airlineService.updateAirline(airlineToUpdate).then(async (result) => {
          if (result.data) {
            expect(result.data).toStrictEqual(
              {
                airlineID: 8,
                airlineUUID: 'airline-uuid',
                airlineICAO: 'FRE',
                airlineName: 'FRE Airlines',
                airlineLogo: 'F_BG-G_LT-W',
                airlineNationality: 98
              }
            );

            const toastrSuccess: any = mockAirlineComponent.notificationService.showSuccessNotification(
              `${getFormModeLabel(EDIT_FORM_MODE)} ${getAirlineFormTitle()}`.toUpperCase(),
              `${getAirlineFormSuccessNotificationMessage(EDIT_FORM_MODE)}`
            );
            expect(toastrSuccess.toastId).toStrictEqual(2);
            expect(toastrSuccess.title).toStrictEqual('MODIFICATION DE LA COMPAGNIE');
            expect(toastrSuccess.message).toStrictEqual('Votre compagnie et/ou son logo ont bien été modifié(e)s !');

            await harness.navigateByUrl('home');
            expect(harness.routeNativeElement?.textContent).toBe('Home');
          } else {
            const toastrError: any = mockAirlineComponent.notificationService.showErrorNotification(
              `${getTechnicalErrorTitle()}`,
              `${getTechnicalErrorMessage()}`
            );
            expect(toastrError.toastId).toStrictEqual(1);
            expect(toastrError.title).toStrictEqual('ERREUR TECHNIQUE');
            expect(toastrError.message).toStrictEqual('Une erreur est survenue : veuillez réessayer...');
          }
        });
      });
      airlineComponent.submitAirlineForm();
    });
  });

  it('#resetAirlineForm should reset "Airline" component', async () => {
    TestBed.runInInjectionContext(() => {
      let mockAirlineComponent: MockAirlineComponent = new MockAirlineComponent();
      const airlineComponent: AirlineComponent = new AirlineComponent(Inject(NotificationService), Inject(ActivatedRoute));
      vi.spyOn(airlineComponent, 'resetAirlineForm').mockImplementation(() => {
        mockAirlineComponent.airlineService.airlineLogo.subscribe((airlineLogo) => {
          airlineComponent.airlineLogoImage = `src/images/logos/64x64/${airlineLogo}.png`;
          expect(airlineComponent.airlineLogoImage).toStrictEqual('src/images/logos/64x64/X_BG-CB_LT-W.png');
        });
        testOnInit(airlineComponent);
      });
      airlineComponent.resetAirlineForm();
    });
  });
});