import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import {
  getBlankStringFieldErrorMessage,
  getFormModeLabel,
  getICAO_IATA_FieldsErrorMessage,
  getLatitudeLongitudeFieldsErrorMessage,
  getNameLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
  getSubmitButtonIcon,
  getSubmitButtonLabel,
  getUnknownCountryErrorMessage,
} from '../../labels/commons/form-common';
import { Airport } from '../../models/Airport';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { onlyWhitespaceValueValidator } from '../../forms-validators/commons-validators';
import {
  BLANK_VALUE_ERROR,
  EDIT_FORM_MODE,
  ICAO_IATA_CODE_PATTERN,
  LATITUDE_LONGITUDE_PATTERN,
  MAX_LENGTH_ERROR,
  MIN_LENGTH_ERROR,
  PATTERN_ERROR,
  REQUIRED_ERROR,
  UNKNOWN_COUNTRY_ERROR,
  UNKNOWN_REGION_ERROR,
} from '../../constants/forms-constants';
import { AirportMapper } from '../../mappers/AirportMapper';
import { Country } from '../../models/Country';
import { capitalize } from '../../utils/labels-utils';
import {
  getCountries,
  getCountryByName,
  getRegionByName,
  getRegions,
} from '../../utils/geographical-utils';
import {
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  getIATALabel,
  getCityLabel,
  getLatitudeInputLabel,
  getLongitudeInputLabel,
  getCountryLabel,
  getRegionLabel,
  getUnknownRegionErrorMessage,
  getIATAUniquenessErrorMessage,
} from '../../labels/commons/airport-common';
import { AsyncPipe } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { Region } from '../../models/Region';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'airport-form',
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
  ],
  templateUrl: './airport-form.component.html',
  styleUrls: [
    '../../styles/forms.scss',
    '../../styles/commons.scss',
    '../../styles/forms.scss',
    '../../styles/flag-icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportFormComponent implements OnInit {
  @Input() public formMode!: string;
  @Input() public formTitle!: string;
  @Input() public airport!: Airport;
  @Input() public isHub!: boolean;
  @Output() public submitted = new EventEmitter();
  public isEditMode!: boolean;

  public airportMapper: AirportMapper = new AirportMapper();

  /* Form properties */
  public airportForm!: FormGroup;
  public airportFormTitle: string = '';
  public countryFlag: string = 'xx';

  /* Form fields identifiers */
  public iataFieldIdentifier: string = 'iata';
  public nameFieldIdentifier: string = 'name';
  public cityFieldIdentifier: string = 'city';
  public latitudeFieldIdentifier: string = 'latitude';
  public longitudeFieldIdentifier: string = 'longitude';
  public countryFieldIdentifier: string = 'country';
  public regionFieldIdentifier: string = 'region';

  /* Form fields labels */
  public iataInputLabel: string = '';
  public nameInputLabel: string = '';
  public cityInputLabel: string = '';
  public latitudeInputLabel: string = '';
  public longitudeInputLabel: string = '';
  public countryInputLabel: string = '';
  public regionInputLabel: string = '';

  /* Buttons labels and icons */
  public submitButtonLabel: string = '';
  public submitButtonIcon: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  // Country field available values
  public countries: Country[] = getCountries();
  // List of countries matching to country field value
  public filteredCountries: Observable<Country[]> = new Observable<Country[]>();
  // Region field available values
  public regions: Region[] = [];
  // List of regions matching to region field value
  public filteredRegions: Observable<Region[]> = new Observable<Region[]>();

  constructor() {
    /* Form fields creation & constraints definition */
    this.airportForm = new FormGroup({
      iata: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(ICAO_IATA_CODE_PATTERN)),
      ]),
      name: new FormControl('', [
        Validators.required,
        onlyWhitespaceValueValidator().bind(this),
      ]),
      city: new FormControl(''),
      latitude: new FormControl('', [
        Validators.required,
        Validators.pattern(LATITUDE_LONGITUDE_PATTERN),
      ]),
      longitude: new FormControl('', [
        Validators.required,
        Validators.pattern(LATITUDE_LONGITUDE_PATTERN),
      ]),
      country: new FormControl('', Validators.required),
      region: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.formMode === EDIT_FORM_MODE;

    /* Form title, fields and buttons initialization */
    this.airportFormTitle = `${getFormModeLabel(
      this.formMode,
    )} ${this.formTitle}`;
    this.iataInputLabel = getIATALabel();
    this.nameInputLabel = getNameLabel();
    this.cityInputLabel = getCityLabel();
    this.latitudeInputLabel = getLatitudeInputLabel();
    this.longitudeInputLabel = getLongitudeInputLabel();
    this.countryInputLabel = getCountryLabel();
    this.regionInputLabel = getRegionLabel();
    this.submitButtonLabel = getSubmitButtonLabel(this.formMode);
    this.submitButtonIcon = getSubmitButtonIcon(this.formMode);
    this.resetButtonLabel = getResetButtonLabel(this.formMode);
    this.resetButtonIcon = getResetButtonIcon(this.formMode);
    this.resetButtonType = getResetButtonType(this.formMode);

    // @ts-ignore
    this.filteredCountries = this.airportForm
      .get(this.countryFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((country) =>
          country ? this.filterCountries(country) : this.countries.slice(),
        ),
      );

    // @ts-ignore
    this.filteredRegions = this.airportForm
      .get(this.regionFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((region) =>
          region ? this.filterRegions(region) : this.regions.slice(),
        ),
      );

    this.airportForm
      .get(this.countryFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((countryValueChanged) =>
        this.changeCountry(countryValueChanged),
      );

    this.airportForm
      .get(this.regionFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((regionValueChanged) => this.changeRegion(regionValueChanged));

    this.airportForm.patchValue({
      iata: this.airport?.iata,
      name: this.airport?.name,
      city: this.airport?.city,
      latitude: this.airport?.latitude,
      longitude: this.airport?.longitude,
    });

    this.airportForm
      .get(this.countryFieldIdentifier)
      ?.setValue(this.airport?.country);
    this.countryFlag = this.airport?.country?.flagCode;
  }

  /* Country field listener (flag & regions) */
  changeCountry(countryValueChanged: any): void {
    if (countryValueChanged != null) {
      const filterValue: string =
        typeof countryValueChanged === 'string'
          ? capitalize(countryValueChanged)
          : capitalize(countryValueChanged.name);

      const countryFound = getCountryByName(filterValue);

      if (countryFound) {
        this.countryFlag = countryFound.flagCode;

        if (countryFound.regions) {
          this.regions = getRegions(countryFound.id);
          this.airportForm
            .get(this.regionFieldIdentifier)
            ?.setValidators(Validators.required);

          if (countryFound.id === this.airport?.country.id) { 
            this.airportForm
              .get(this.regionFieldIdentifier)
              ?.setValue(this.airport?.region);
          }
        }
      } else {
        this.countryFlag = 'xx';
        this.regions = [];
        this.airportForm.get(this.regionFieldIdentifier)?.setValidators([]);
        this.airportForm.get(this.regionFieldIdentifier)?.setValue(null);
      }
    }
  }

  /* Region field listener */
  changeRegion(regionValueChanged: any): void {
    if (regionValueChanged != null) {
      const filterValue: string =
        typeof regionValueChanged === 'string'
          ? capitalize(regionValueChanged)
          : capitalize(regionValueChanged.name);

      const regionFound = getRegionByName(filterValue, this.countryFlag);

      if (!regionFound) {
        this.airportForm
          .get(this.regionFieldIdentifier)
          ?.setErrors({ [UNKNOWN_REGION_ERROR]: true });
      }
    }
  }

  /* Countries filtering (by country field value) */
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

  /* Regions filtering (by region field value) */
  private filterRegions(regionValue: any): Region[] {
    if (regionValue === null || regionValue === undefined) {
      return this.regions;
    }

    const filterValue: string =
      typeof regionValue === 'string'
        ? capitalize(regionValue)
        : capitalize(regionValue.name);
    return this.regions.filter((region) =>
      capitalize(region.name).startsWith(filterValue),
    );
  }

  /* Country display (by name) */
  displayCountry(country: Country): string {
    return country ? country.name : '';
  }

  /* Region display (by name) */
  displayRegion(region: Region): string {
    return region ? `${region.name} (${region.code})` : '';
  }

  /* IATA field error message(s) display */
  displayIATAErrorMessage(): string {
    if (
      this.airportForm.get(this.iataFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airportForm
        .get(this.iataFieldIdentifier)
        ?.hasError(MIN_LENGTH_ERROR) ||
      this.airportForm
        .get(this.iataFieldIdentifier)
        ?.hasError(MAX_LENGTH_ERROR) ||
      this.airportForm.get(this.iataFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getICAO_IATA_FieldsErrorMessage();
    }
    return '';
  }

  /* Name field error message(s) display */
  displayNameErrorMessage(): string {
    if (
      this.airportForm.get(this.nameFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airportForm
        .get(this.nameFieldIdentifier)
        ?.hasError(BLANK_VALUE_ERROR)
    ) {
      return getBlankStringFieldErrorMessage();
    }
    return '';
  }

  /* Latitude field error message(s) display */
  displayLatitudeErrorMessage(): string {
    if (
      this.airportForm
        .get(this.latitudeFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airportForm
        .get(this.latitudeFieldIdentifier)
        ?.hasError(PATTERN_ERROR)
    ) {
      return getLatitudeLongitudeFieldsErrorMessage();
    }
    return '';
  }

  /* Longitude field error message(s) display */
  displayLongitudeErrorMessage(): string {
    if (
      this.airportForm
        .get(this.longitudeFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airportForm
        .get(this.longitudeFieldIdentifier)
        ?.hasError(PATTERN_ERROR)
    ) {
      return getLatitudeLongitudeFieldsErrorMessage();
    }
    return '';
  }

  /* Country field error message(s) display */
  displayCountryErrorMessage(): string {
    if (
      this.airportForm
        .get(this.countryFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.countryFlag) {
      this.airportForm
        .get(this.countryFieldIdentifier)
        ?.setErrors({ [UNKNOWN_COUNTRY_ERROR]: true });

      return getUnknownCountryErrorMessage();
    }
    return '';
  }

  /* Region field error message(s) display */
  displayRegionErrorMessage(): string {
    if (
      this.airportForm.get(this.regionFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.airportForm
        .get(this.regionFieldIdentifier)
        ?.hasError(UNKNOWN_REGION_ERROR)
    ) {
      return getUnknownRegionErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitAirportForm() {
    this.airportForm.value.hub = this.isHub;
    this.airportForm.value.country = getCountryByName(
      typeof this.airportForm.get(this.countryFieldIdentifier)?.value ===
        'string'
        ? this.airportForm.get(this.countryFieldIdentifier)?.value
        : this.airportForm.get(this.countryFieldIdentifier)?.value.name,
    );

    if (this.airportForm.value.country.regions) {
      this.airportForm.value.region = getRegionByName(
        typeof this.airportForm.get(this.regionFieldIdentifier)?.value ===
          'string'
          ? this.airportForm.get(this.regionFieldIdentifier)?.value
          : this.airportForm.get(this.regionFieldIdentifier)?.value.name,
        this.countryFlag,
      );
    }

    this.submitted.emit(this.airportMapper.airportToDB(this.airportForm.value));
  }
}

export function showIATAUniquenessErrorNotification(notificationService: NotificationService, formMode: string, formTitle: string): void {
  notificationService.showErrorNotification(
    `${getFormModeLabel(
      formMode,
    )} ${formTitle}`.toUpperCase(),
    `${getIATAUniquenessErrorMessage()}`,
  );
}
