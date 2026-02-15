import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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
} from '../../shared/labels/commons/form-common';
import { Airport } from '../../shared/models/Airport';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { onlyWhitespaceValueValidator } from '../../shared/forms-validators/commons-validators';
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
} from '../../shared/constants/forms-constants';
import { AirportMapper } from '../../shared/mappers/AirportMapper';
import { Country } from '../../shared/models/Country';
import { capitalize } from '../../shared/utils/labels-utils';
import { getCountries, getCountryByName, getRegionByName, getRegions } from '../../shared/utils/geographical-utils';
import { distinctUntilChanged, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { getIATALabel, getCityLabel, getLatitudeInputLabel, getLongitudeInputLabel, getCountryLabel, getRegionLabel, getUnknownRegionErrorMessage, } from '../../shared/labels/commons/airport-common';
import { getHubFormTitle } from '../../shared/labels/forms/hub-form';
import { AsyncPipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { Region } from '../../shared/models/Region';


@Component({
  selector: 'hub-form',
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
    MatAutocompleteTrigger
  ],
  templateUrl: './hub-form.component.html',
  styleUrls: [
    '../../shared/styles/forms.scss',
    '../../shared/styles/commons.scss',
    '../../shared/styles/forms.scss',
    '../../shared/styles/flag-icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFormComponent implements OnInit {
  @Input() public formMode!: string;
  @Input() public hub!: Airport;
  @Output() public submitted = new EventEmitter();
  public isEditMode!: boolean;

  public airportMapper: AirportMapper = new AirportMapper();

  /* Form properties */
  public hubForm!: FormGroup;
  public hubFormTitle: string = '';
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
    this.hubForm = new FormGroup(
      {
        iata: new FormControl(
          '',
          [
            Validators.required,
            Validators.pattern(new RegExp(ICAO_IATA_CODE_PATTERN)),
          ],
        ),
        name: new FormControl(
          '',
          [
            Validators.required,
            onlyWhitespaceValueValidator().bind(this),
          ],
        ),
        city: new FormControl(''),
        latitude: new FormControl(
          '',
          [
            Validators.required,
            Validators.pattern(LATITUDE_LONGITUDE_PATTERN)
          ]
        ),
        longitude: new FormControl(
          '',
          [
            Validators.required,
            Validators.pattern(LATITUDE_LONGITUDE_PATTERN)
          ]
        ),
        country: new FormControl('', Validators.required),
        region: new FormControl('')
      },
    );
  }

  ngOnInit(): void {
    this.isEditMode = this.formMode === EDIT_FORM_MODE;

    /* Form title, fields and buttons initialization */
    this.hubFormTitle = `${getFormModeLabel(
      this.formMode,
    )} ${getHubFormTitle()}`;
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
    this.filteredCountries = this.hubForm
      .get(this.countryFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((country) =>
          country ? this.filterCountries(country) : this.countries.slice(),
        ),
      );

      // @ts-ignore
    this.filteredRegions = this.hubForm
      .get(this.regionFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((region) =>
          region ? this.filterRegions(region) : this.regions.slice(),
        ),
      );

    this.hubForm
      .get(this.countryFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((countryValueChanged) =>
        this.changeCountry(countryValueChanged),
      );

    this.hubForm
      .get(this.regionFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((regionValueChanged) =>
        this.changeRegion(regionValueChanged),
      );

    this.hubForm.patchValue({
      iata: this.hub?.iata,
      name: this.hub?.name,
      city: this.hub?.city,
      latitude: this.hub?.latitude,
      longitude: this.hub?.longitude,
    });

    this.hubForm
        .get(this.countryFieldIdentifier)
        ?.setValue(
          this.hub?.country,
        );
    this.countryFlag = this.hub?.country?.flagCode;
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
        }

        this.hubForm.get(this.regionFieldIdentifier)?.setValidators(Validators.required);

      } else {
        this.countryFlag = 'xx';
        this.regions = [];
        this.hubForm.get(this.regionFieldIdentifier)?.setValidators([]);
        this.hubForm.get(this.regionFieldIdentifier)?.setValue(null);
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
        this.hubForm
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

  /* ICAO field error message(s) display */
  displayIATAErrorMessage(): string {
    if (
      this.hubForm.get(this.iataFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.hubForm
        .get(this.iataFieldIdentifier)
        ?.hasError(MIN_LENGTH_ERROR) ||
      this.hubForm
        .get(this.iataFieldIdentifier)
        ?.hasError(MAX_LENGTH_ERROR) ||
      this.hubForm.get(this.iataFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getICAO_IATA_FieldsErrorMessage();
    }
    return '';
  }

  /* Name field error message(s) display */
  displayNameErrorMessage(): string {
    if (
      this.hubForm.get(this.nameFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.hubForm
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
      this.hubForm.get(this.latitudeFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.hubForm
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
      this.hubForm.get(this.longitudeFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.hubForm
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
      this.hubForm
        .get(this.countryFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.countryFlag) {
      this.hubForm
        .get(this.countryFieldIdentifier)
        ?.setErrors({ [UNKNOWN_COUNTRY_ERROR]: true });

      return getUnknownCountryErrorMessage();
    }
    return '';
  }

  /* Region field error message(s) display */
  displayRegionErrorMessage(): string {
    if (
      this.hubForm
        .get(this.regionFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.hubForm
        .get(this.regionFieldIdentifier)
        ?.hasError(UNKNOWN_REGION_ERROR)
    ) {
      return getUnknownRegionErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitHubForm() {
    this.hubForm.value.hub = true;
    this.hubForm.value.country = getCountryByName(
            typeof this.hubForm.get(this.countryFieldIdentifier)
              ?.value === 'string'
              ? this.hubForm.get(this.countryFieldIdentifier)?.value
              : this.hubForm.get(this.countryFieldIdentifier)?.value
                  .name,
    );

    if (this.hubForm.value.country.regions) {
      this.hubForm.value.region = getRegionByName(
            typeof this.hubForm.get(this.regionFieldIdentifier)
              ?.value === 'string'
              ? this.hubForm.get(this.regionFieldIdentifier)?.value
              : this.hubForm.get(this.regionFieldIdentifier)?.value
                  .name,
            this.countryFlag
      );
    }

    this.submitted.emit(this.airportMapper.airportToDB(this.hubForm.value));
  }
}

