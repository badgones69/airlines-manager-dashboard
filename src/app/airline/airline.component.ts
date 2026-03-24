import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../shared/services/notification.service';
import {
  getFormModeLabel,
  getSubmitButtonLabel,
  getResetButtonLabel,
  getRequiredFieldErrorMessage,
  getICAO_IATA_FieldsErrorMessage,
  getBlankStringFieldErrorMessage,
  getResetButtonIcon,
  getUnknownCountryErrorMessage,
  getNameLabel,
} from '../shared/labels/commons/form-common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AirlineService } from '../shared/services/airline.service';
import {
  EDIT_FORM_MODE,
  ICAO_IATA_CODE_PATTERN,
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  BLANK_VALUE_ERROR,
  PATTERN_ERROR,
  REQUIRED_ERROR,
  UNKNOWN_COUNTRY_ERROR,
} from '../shared/constants/forms-constants';
import {
  getAirlineFormSuccessNotificationMessage,
  getAirlineFormTitle,
  getNationalityInputLabel,
  getICAOCodeInputLabel,
  getLogoInputLabel,
  getNoLogoLabel,
} from '../shared/labels/forms/airline-form';
import { AirlineMapper } from '../shared/mappers/AirlineMapper';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { Country } from '../shared/models/Country';
import {
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  getCountries,
  getCountryByName,
} from '../shared/utils/geographical-utils';
import { capitalize } from '../shared/utils/labels-utils';
import { onlyWhitespaceValueValidator } from '../shared/forms-validators/commons-validators';
import { ForbiddenComponent } from '../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../shared/components/unauthorized/unauthorized.component';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AirlineLogoComponent } from './airline-logo/airline-logo.component';
import { Airline } from '../shared/models/Airline';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../shared/labels/errors';

@Component({
  selector: 'airline',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ToastrModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    NgOptimizedImage,
    ForbiddenComponent,
    UnauthorizedComponent,
  ],
  templateUrl: './airline.component.html',
  styleUrls: [
    './airline.component.scss',
    '../shared/styles/commons.scss',
    '../shared/styles/forms.scss',
    '../shared/styles/flag-icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirlineComponent implements OnInit {
  public authenticatedUser!: User;

  public initAirlineToEdit!: Airline;

  public airlineMapper: AirlineMapper = new AirlineMapper();

  /* Form properties */
  public airlineForm!: FormGroup;
  public airlineFormTitle: string = '';
  public airlineLogoImage!: string;
  public noLogoLabel: string = getNoLogoLabel();
  public nationalityFlag: string = 'xx';

  /* Form fields identifiers */
  public icaoFieldIdentifier: string = 'icao';
  public nameFieldIdentifier: string = 'name';
  public nationalityFieldIdentifier: string = 'nationality';

  /* Form fields labels */
  public icaoInputLabel: string = '';
  public nameInputLabel: string = '';
  public logoInputLabel: string = '';
  public nationalityInputLabel: string = '';

  /* Buttons labels and icons */
  public submitButtonLabel: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';

  // Nationality field available values
  public countries: Country[] = getCountries();
  // List of countries matching to nationality field value
  public filteredCountries: Observable<Country[]> = new Observable<Country[]>();

  /* Injections */
  public userService: UserService = inject(UserService);
  public airlineService: AirlineService = inject(AirlineService);
  public dialog: MatDialog = inject(MatDialog);
  public router: Router = inject(Router);

  constructor(
    readonly route: ActivatedRoute,
    readonly notificationService: NotificationService,
  ) {
    /* Form fields creation & constraints definition */
    this.airlineForm = new FormGroup({
      icao: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(ICAO_IATA_CODE_PATTERN)),
      ]),
      name: new FormControl('', [
        Validators.required,
        onlyWhitespaceValueValidator().bind(this),
      ]),
      nationality: new FormControl('', Validators.required),
    });
  }

  ngOnInit(airlineEdited?: any): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });

    /* Form title, fields and buttons initialization */
    this.airlineFormTitle = `${getFormModeLabel(
      EDIT_FORM_MODE,
    )} ${getAirlineFormTitle()}`;
    this.icaoInputLabel = getICAOCodeInputLabel();
    this.nameInputLabel = getNameLabel();
    this.logoInputLabel = getLogoInputLabel(EDIT_FORM_MODE);
    this.nationalityInputLabel = getNationalityInputLabel();
    this.submitButtonLabel = getSubmitButtonLabel(EDIT_FORM_MODE);
    this.resetButtonLabel = getResetButtonLabel(EDIT_FORM_MODE);
    this.resetButtonIcon = getResetButtonIcon(EDIT_FORM_MODE);

    this.airlineService.findAirline().then((airline) => {
      this.initAirlineToEdit = this.airlineMapper.airlineFromDB(airline);

      if (airlineEdited) {
        airlineEdited.nationality = getCountryByName(
          typeof airlineEdited.nationality === 'string'
            ? airlineEdited.nationality
            : airlineEdited.nationality.name,
        );
      }

      this.airlineService.airlineLogo.subscribe((airlineLogo) => {
        if (airlineLogo) {
          this.airlineLogoImage = `src/images/logos/64x64/${airlineLogo}.png`;
        }
      });

      // @ts-ignore
      this.filteredCountries = this.airlineForm
        .get(this.nationalityFieldIdentifier)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          startWith(''),
          map((country) =>
            country ? this.filterCountries(country) : this.countries.slice(),
          ),
        );

      this.airlineForm
        .get(this.nationalityFieldIdentifier)
        ?.valueChanges.pipe(takeUntil(new Subject<void>()))
        .subscribe((countryValueChanged) =>
          this.changeNationalityFlag(countryValueChanged),
        );

      this.airlineForm.patchValue({
        icao: airlineEdited?.icao ?? this.initAirlineToEdit?.icao,
        name: airlineEdited?.name ?? this.initAirlineToEdit?.name,
      });

      this.airlineForm
        .get(this.nationalityFieldIdentifier)
        ?.setValue(
          airlineEdited?.nationality ?? this.initAirlineToEdit?.nationality,
        );
      this.nationalityFlag =
        airlineEdited?.nationality.flagCode ??
        this.initAirlineToEdit?.nationality.flagCode;
    });
  }

  /* Logo field listener */
  changeLogo() {
    let dialogRef: MatDialogRef<AirlineLogoComponent> = this.dialog.open(
      AirlineLogoComponent,
      {
        disableClose: false,
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );

    dialogRef.componentInstance.submitted.subscribe((airlineNewLogo: any) => {
      this.airlineService.refreshAirlineLogo(airlineNewLogo);
      this.ngOnInit(this.airlineForm.value);
    });
  }

  /* Nationality field listener (flag) */
  changeNationalityFlag(countryValueChanged: any): void {
    if (countryValueChanged != null) {
      const filterValue: string =
        typeof countryValueChanged === 'string'
          ? capitalize(countryValueChanged)
          : capitalize(countryValueChanged.name);

      const countryFound = getCountryByName(filterValue);

      if (countryFound) {
        this.nationalityFlag = countryFound.flagCode;
      } else {
        this.nationalityFlag = 'xx';
      }
    }
  }

  /* Countries filtering (by nationality field value) */
  private filterCountries(countryValue: any): Country[] {
    if (countryValue === null || countryValue === undefined) {
      return this.countries;
    }

    const filterValue: string =
      typeof countryValue === 'string'
        ? capitalize(countryValue)
        : capitalize(countryValue.name);
    return this.countries.filter((country) =>
      capitalize(country.name).startsWith(filterValue),
    );
  }

  /* Country display (by name) */
  displayCountry(country: Country): string {
    return country.name;
  }

  /* ICAO field error message(s) display */
  displayICAOErrorMessage(): string {
    if (
      this.airlineForm.get(this.icaoFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airlineForm
        .get(this.icaoFieldIdentifier)
        ?.hasError(MIN_LENGTH_ERROR) ||
      this.airlineForm
        .get(this.icaoFieldIdentifier)
        ?.hasError(MAX_LENGTH_ERROR) ||
      this.airlineForm.get(this.icaoFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getICAO_IATA_FieldsErrorMessage();
    }
    return '';
  }

  /* Name field error message(s) display */
  displayNameErrorMessage(): string {
    if (
      this.airlineForm.get(this.nameFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airlineForm
        .get(this.nameFieldIdentifier)
        ?.hasError(BLANK_VALUE_ERROR)
    ) {
      return getBlankStringFieldErrorMessage();
    }
    return '';
  }

  /* Nationality field error message(s) display */
  displayNationalityErrorMessage(): string {
    if (
      this.airlineForm
        .get(this.nationalityFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.nationalityFlag) {
      this.airlineForm
        .get(this.nationalityFieldIdentifier)
        ?.setErrors({ [UNKNOWN_COUNTRY_ERROR]: true });

      return getUnknownCountryErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitAirlineForm() {
    this.airlineService.airlineLogo
      .subscribe((airlineLogo) => {
        /* Airline data mapping */
        const airlineToDB = {
          ...this.airlineForm.value,
          id: this.initAirlineToEdit.id,
          uuid: this.initAirlineToEdit.uuid,
          icao: this.airlineForm.get(this.icaoFieldIdentifier)?.value,
          name: this.airlineForm.get(this.nameFieldIdentifier)?.value,
          logo: airlineLogo,
          nationality: getCountryByName(
            typeof this.airlineForm.get(this.nationalityFieldIdentifier)
              ?.value === 'string'
              ? this.airlineForm.get(this.nationalityFieldIdentifier)?.value
              : this.airlineForm.get(this.nationalityFieldIdentifier)?.value
                  .name,
          ),
        };

        // Airline updating
        this.airlineService
          .updateAirline(this.airlineMapper.airlineToDB(airlineToDB))
          .then((result: any) => {
            // If airline is updated
            if (result.data) {
              /* Success notification showing */
              this.notificationService.showSuccessNotification(
                `${getFormModeLabel(EDIT_FORM_MODE)} ${getAirlineFormTitle()}`.toUpperCase(),
                `${getAirlineFormSuccessNotificationMessage(EDIT_FORM_MODE)}`,
              );
              // Redirection to home page
              this.router.navigate(['home']);
            } else {
              /* Technical error notification showing */
              this.notificationService.showErrorNotification(
                `${getTechnicalErrorTitle()}`,
                `${getTechnicalErrorMessage()}`,
              );
            }
          });
      })
      .unsubscribe();
  }

  /* Form reset */
  resetAirlineForm() {
    this.airlineService.refreshAirlineLogo();
    this.ngOnInit();
  }
}
