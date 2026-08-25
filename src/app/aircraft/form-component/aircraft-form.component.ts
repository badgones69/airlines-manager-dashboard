import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
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
  getBackButtonIcon,
  getBackButtonLabel,
  getFormModeLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
  getSubmitButtonIcon,
  getSubmitButtonLabel,
} from '../../shared/labels/commons/form-common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  EDIT_FORM_MODE,
  REQUIRED_ERROR,
  UNKNOWN_AIRPORT_ERROR,
  UNKNOWN_MANUFACTURER_ERROR,
  UNKNOWN_MODEL_ERROR,
} from '../../shared/constants/forms-constants';
import { capitalize } from '../../shared/utils/labels-utils';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { Aircraft } from '../../shared/dto/Aircraft';
import { Manufacturer } from '../../shared/dto/Manufacturer';
import { MANUFACTURERS } from '../../shared/data/manufacturers';
import { getAircraftFormTitle, getFlightsInputLabel, getHomeHubLabel, getManufacturerLabel, getModelLabel, getNumberFlightsLabel, getUnknownManufacturerErrorMessage, getUnknownModelErrorMessage } from '../../shared/labels/forms/aircraft-form';
import { Model } from '../../shared/dto/Model';
import { getUnknownAirportErrorMessage } from '../../shared/labels/forms/route-form';
import { Airport } from '../../shared/dto/Airport';
import { AirportService } from '../../shared/services/airport.service';
import { AirportMapper } from '../../shared/mappers/AirportMapper';
import { AircraftMapper } from '../../shared/mappers/AircraftMapper';
import { AircraftService } from '../../shared/services/aircraft.service';
import { Country } from '../../shared/dto/Country';
import { generateAircraftRegistration, getManufacturerByName, getModelByName, validateAndFormatFlights } from '../../shared/utils/aviation-utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AircraftFlightsComponent } from '../pages/aircraft-flights/aircraft-flights.component';
import { getAircraftFlightsDialogTitle, getAircraftFlightsErrorNotificationMessage } from '../../shared/labels/dialogs/aircraft-flights-dialog';
import { NotificationService } from '../../shared/services/notification.service';
import { Route } from '../../shared/dto/Route';
import { RouteService } from '../../shared/services/route.service';
import { RouteMapper } from '../../shared/mappers/RouteMapper';
import { RouterLink } from '@angular/router';
import { FlightMapper } from '../../shared/mappers/FlightMapper';

@Component({
  selector: 'aircraft-form',
  standalone: true,
  imports: [
    CommonModule,
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
    RouterLink,
  ],
  templateUrl: './aircraft-form.component.html',
  styleUrls: [
    './aircraft-form.component.scss',
    '../../shared/styles/forms.scss',
    '../../shared/styles/commons.scss',
    '../../shared/styles/flag-icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AircraftFormComponent implements OnInit {
  @Input() public formMode!: string;
  @Input() public formTitle!: string;
  @Input() public aircraft!: Aircraft;
  @Output() public submitted = new EventEmitter();
  public isEditMode!: boolean;

  /* Form properties */
  public aircraftForm!: FormGroup;
  public aircraftFormTitle: string = '';
  public manufacturerFlag: string = '';
  public homeHubFlag: string = '';
  public numberFlights: number = -1;
  public numberFlightsLabel$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /* Form fields identifiers */
  public manufacturerFieldIdentifier: string = 'manufacturer';
  public modelFieldIdentifier: string = 'model';
  public homeHubFieldIdentifier: string = 'homeHub';

  /* Form fields labels */
  public manufacturerInputLabel: string = '';
  public modelInputLabel: string = '';
  public homeHubInputLabel: string = '';
  public flightsInputLabel: string = '';

  /* Buttons labels and icons */
  public backButtonLabel: string = '';
  public backButtonIcon: string = '';
  public submitButtonLabel: string = '';
  public submitButtonIcon: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  // Manufacturer field available values
  public manufacturers: Manufacturer[] = MANUFACTURERS;
  // List of manufacturers matching to manufacturer field value
  public filteredManufacturers: Observable<Manufacturer[]> = new Observable<Manufacturer[]>();
  // Model field available values
  public models: Model[] = [];
  // List of models matching to manufacturer field value
  public filteredModels: Observable<Model[]> = new Observable<Model[]>();
  // Home hub field available values
  public hubs: Airport[] = [];
  // List of hubs matching to home hub field value
  public filteredHubs: Observable<Airport[]> = new Observable<Airport[]>();
  // List of all home hub routes
  public hubRoutes: Route[] = [];

  /* Injections */
  public airportService = inject(AirportService);
  public aircraftService = inject(AircraftService);
  public routeService = inject(RouteService);
  public dialog: MatDialog = inject(MatDialog);

  public airportMapper: AirportMapper = new AirportMapper();
  public flightMapper: FlightMapper = new FlightMapper();
  public routeMapper: RouteMapper = new RouteMapper();
  public aircraftMapper: AircraftMapper = new AircraftMapper();

  constructor(
    readonly notificationService: NotificationService,
  ) {
    /* Form fields creation & constraints definition */
    this.aircraftForm = new FormGroup(
      {
        manufacturer: new FormControl('', Validators.required),
        model: new FormControl(''),
        homeHub: new FormControl('', Validators.required),
      },
    );
  }

  ngOnInit(): void {
    this.isEditMode = this.formMode === EDIT_FORM_MODE;

    /* Form title, fields and buttons initialization */
    this.aircraftFormTitle = `${getFormModeLabel(
      this.formMode,
    )} ${getAircraftFormTitle()}`;
    this.manufacturerInputLabel = getManufacturerLabel();
    this.modelInputLabel = getModelLabel();
    this.homeHubInputLabel = getHomeHubLabel();
    this.flightsInputLabel = getFlightsInputLabel(this.formMode);
    this.backButtonLabel = getBackButtonLabel();
    this.backButtonIcon = getBackButtonIcon();
    this.submitButtonLabel = getSubmitButtonLabel(this.formMode);
    this.submitButtonIcon = getSubmitButtonIcon(this.formMode);
    this.resetButtonLabel = getResetButtonLabel(this.formMode);
    this.resetButtonIcon = getResetButtonIcon(this.formMode);
    this.resetButtonType = getResetButtonType(this.formMode);

    // @ts-ignore
    this.filteredManufacturers = this.aircraftForm
      .get(this.manufacturerFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((manufacturer) =>
          manufacturer ? this.filterManufacturers(manufacturer) : this.manufacturers.slice(),
        ),
      );

    this.setAvailableModels([]);

    this.aircraftForm
      .get(this.manufacturerFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((manufacturerValueChanged) =>
        this.changeManufacturer(manufacturerValueChanged),
      );

    this.aircraftForm
      .get(this.modelFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((modelValueChanged) =>
        this.changeModel(modelValueChanged),
      );

    this.aircraftForm
      .get(this.homeHubFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((homeHubValueChanged) =>
        this.changeHomeHub(homeHubValueChanged),
      );

    this.airportService.hubs.subscribe((hubs) => {
      this.hubs = this.airportMapper.airportsListFromDB(hubs);

      // @ts-ignore
      this.filteredHubs = this.aircraftForm
        .get(this.homeHubFieldIdentifier)
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          startWith(''),
          map((homeHub) =>
            homeHub ? this.filterHubs(homeHub) : this.hubs.slice(),
          ),
        );

      this.aircraftForm.patchValue({
        manufacturer: this.aircraft?.manufacturer,
        model: this.aircraft?.model,
        homeHub: this.aircraft?.homeHub,
      });

      this.manufacturerFlag = this.aircraft?.manufacturer?.headquarterCountryFlagCode;
      this.homeHubFlag = this.aircraft?.homeHub?.country.flagCode;
    });

    if (this.isEditMode) {
      this.aircraftService.refreshAircraftFlights(
        {
          numberFlights: this.aircraft.flights.length / 2,
          flights: this.flightMapper.flightsListToFields(this.aircraft.flights),
        }
      );
      this.aircraftService.aircraftFlights.subscribe((aircraftFlights: any) => {
        this.numberFlights = aircraftFlights.numberFlights;
        this.numberFlightsLabel$.next(getNumberFlightsLabel(this.numberFlights));
      });
    }
  }

  /* Available models values reload */
  private setAvailableModels(listModels: Model[]): void {
    // @ts-ignore
    this.filteredModels = this.aircraftForm
      .get(this.modelFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((model) =>
          model ? this.filterModels(model) : listModels.slice(),
        ),
      );
  }

  /* Manufacturer field listener (flag & models) */
  changeManufacturer(manufacturerValueChanged: any): void {
    if (manufacturerValueChanged != null) {
      const manufacturerValue: string =
        typeof manufacturerValueChanged === 'string'
          ? capitalize(manufacturerValueChanged)
          : capitalize(manufacturerValueChanged.name);

      const manufacturerFound: Manufacturer | undefined = this.manufacturers.find(
        (manufacturer) =>
          capitalize(manufacturer.name) === capitalize(manufacturerValue),
      );

      if (manufacturerFound) {
        this.manufacturerFlag = manufacturerFound.headquarterCountryFlagCode;
        this.models = manufacturerFound.models;
        this.setAvailableModels(this.models);
        this.aircraftForm.get(this.modelFieldIdentifier)?.setValidators([Validators.required]);
        this.changeModel(this.aircraftForm.get(this.modelFieldIdentifier)?.value);
      } else {
        if (manufacturerValueChanged === '') {
          this.manufacturerFlag = '';
        } else {
          this.manufacturerFlag = 'xx';
        }
        this.models = [];
        this.setAvailableModels([]);
        this.aircraftForm.get(this.modelFieldIdentifier)?.setValidators([]);
        this.aircraftForm.get(this.modelFieldIdentifier)?.setValue(null);
      }
    }
  }

  /* Model field listener */
  changeModel(modelValueChanged: any): void {
    if (modelValueChanged != null) {
      const filterValue: string =
        typeof modelValueChanged === 'string'
          ? capitalize(modelValueChanged)
          : capitalize(modelValueChanged.name);

      const modelFound = this.models.some(
        (model) => capitalize(model.name) === capitalize(filterValue)
      );

      if (!modelFound && filterValue !== '') {
        this.aircraftForm
          .get(this.modelFieldIdentifier)
          ?.setErrors({ [UNKNOWN_MODEL_ERROR]: true });
      }
    }
  }

  /* Home hub field listener (flag & routes) */
  changeHomeHub(homeHubValueChanged: any): void {
    if (homeHubValueChanged != null) {
      const filterValue: string =
        typeof homeHubValueChanged === 'string'
          ? capitalize(homeHubValueChanged)
          : capitalize(homeHubValueChanged.name);

      const homeHubFound: Airport | undefined = this.hubs.find(
        (homeHub) =>
          capitalize(homeHub.name) === capitalize(filterValue) ||
          capitalize(homeHub.iata) === capitalize(filterValue),
      );

      if (homeHubFound) {
        this.homeHubFlag = homeHubFound.country.flagCode;
        this.routeService.findRoutesByDepartureHub(homeHubFound.id ?? 0).then((routes) => {
          this.hubRoutes = this.routeMapper.routesListFromDB(routes);
          let mustResetFlights: boolean = false;
          let mustChangeRegistration: boolean = homeHubFound.id != this.aircraft.homeHub.id;

          this.aircraftService.aircraftFlights.subscribe((aircraftFlights) => {
            mustResetFlights = aircraftFlights.numberFlights > 0;
          });

          if (mustChangeRegistration) {
            if (mustResetFlights) {
              this.aircraftService.refreshAircraftFlights(null);
              this.numberFlightsLabel$.next('');
              this.aircraftForm.setErrors({});
            }
            this.aircraftForm.value.registration = generateAircraftRegistration(homeHubFound.country);
          }
        });

      } else if (homeHubValueChanged === '') {
        this.homeHubFlag = '';
      } else {
        this.homeHubFlag = 'xx';
      }
    }
  }

  /* Flights listener */
  changeFlights(): void {
    let dialogRef: MatDialogRef<AircraftFlightsComponent> = this.dialog.open(
      AircraftFlightsComponent,
      {
        disableClose: false,
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );

    dialogRef.componentInstance.isEdit = this.numberFlightsLabel$.getValue() !== '';
    dialogRef.componentInstance.routes = this.hubRoutes.map((route) => route.arrivalAirport);

    dialogRef.componentInstance.submitted.subscribe((aircraftFlights: any) => {
      this.aircraftService.refreshAircraftFlights(aircraftFlights);
      this.numberFlights = aircraftFlights.numberFlights;
      this.numberFlightsLabel$.next(getNumberFlightsLabel(this.numberFlights));
      this.aircraftForm.setErrors(null);
    });
  }

  /* Manufacturers filtering (by manufacturer field value) */
  private filterManufacturers(manufacturerValue: any): Manufacturer[] {
    if (manufacturerValue === null || manufacturerValue === undefined) {
      return this.manufacturers;
    }

    const filterValue: string =
      typeof manufacturerValue === 'string'
        ? capitalize(manufacturerValue)
        : capitalize(manufacturerValue.name);
    return this.manufacturers.filter(
      (manufacturer) =>
        capitalize(manufacturer.name).startsWith(capitalize(filterValue)),
    );
  }

  /* Models filtering (by model field value) */
  private filterModels(modelValue: any): Model[] {
    if (modelValue === null || modelValue === undefined) {
      return this.models;
    }

    const filterValue: string =
      typeof modelValue === 'string'
        ? capitalize(modelValue)
        : capitalize(modelValue.name);
    return this.models.filter(
      (model) =>
        capitalize(model.name).startsWith(capitalize(filterValue)),
    );
  }

  /* Hubs filtering (by home hub field value) */
  private filterHubs(homeHubValue: any): Airport[] {
    if (homeHubValue === null || homeHubValue === undefined) {
      return this.hubs;
    }

    const filterValue: string =
      typeof homeHubValue === 'string'
        ? capitalize(homeHubValue)
        : capitalize(homeHubValue.iata);
    return this.hubs.filter(
      (hub) =>
        capitalize(hub.iata).startsWith(filterValue) ||
        capitalize(hub.name).startsWith(capitalize(filterValue)),
    );
  }

  /* Manufacturer display (by name) */
  displayManufacturer(manufacturer: Manufacturer): string {
    return manufacturer ? manufacturer.name : '';
  }

  /* Model display (by name) */
  displayModel(model: Model): string {
    return model ? model.name : '';
  }

  /* Home hub display (by name) */
  displayHomeHub(homeHub: Airport): string {
    return homeHub ? homeHub.name : '';
  }

  /* Manufacturer field error message(s) display */
  displayManufacturerErrorMessage(): string {
    if (
      this.aircraftForm
        .get(this.manufacturerFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.manufacturerFlag) {
      this.aircraftForm
        .get(this.manufacturerFieldIdentifier)
        ?.setErrors({ [UNKNOWN_MANUFACTURER_ERROR]: true });

      return getUnknownManufacturerErrorMessage();
    }
    return '';
  }

  /* Model field error message(s) display */
  displayModelErrorMessage(): string {
    if (
      this.aircraftForm
        .get(this.modelFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.aircraftForm
        .get(this.modelFieldIdentifier)
        ?.hasError(UNKNOWN_MODEL_ERROR)
    ) {
      return getUnknownModelErrorMessage();
    }
    return '';
  }

  /* Home hub field error message(s) display */
  displayHomeHubErrorMessage(): string {
    if (
      this.aircraftForm
        .get(this.homeHubFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.homeHubFlag) {
      this.aircraftForm
        .get(this.homeHubFieldIdentifier)
        ?.setErrors({ [UNKNOWN_AIRPORT_ERROR]: true });

      return getUnknownAirportErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitAircraftForm() {
    const manufacturerValue = this.aircraftForm.get(
      this.manufacturerFieldIdentifier,
    )?.value;

    if (typeof manufacturerValue === 'string') {
      this.aircraftForm.value.manufacturer = getManufacturerByName(manufacturerValue)?.id;
    } else {
      this.aircraftForm.value.manufacturer = manufacturerValue.id;
    }

    const modelValue = this.aircraftForm.get(
      this.modelFieldIdentifier,
    )?.value;

    if (typeof modelValue === 'string') {
      this.aircraftForm.value.model = getModelByName(modelValue, this.aircraftForm.value.manufacturer)?.id;
    } else {
      this.aircraftForm.value.model = modelValue.id;
    }

    const homeHubValue = this.aircraftForm.get(
      this.homeHubFieldIdentifier,
    )?.value;

    let homeHubCountry!: Country | undefined;

    if (typeof homeHubValue === 'string') {
      const homeHubFound: Airport | undefined = this.hubs.find(
        (hub) =>
          capitalize(hub.name) === capitalize(homeHubValue) ||
          capitalize(hub.iata) === capitalize(homeHubValue),
      );
      homeHubCountry = homeHubFound?.country
      this.aircraftForm.value.homeHub = homeHubFound?.id
    } else {
      homeHubCountry = homeHubValue.country;
      this.aircraftForm.value.homeHub = homeHubValue.id;
    }

    if (!this.isEditMode) {
      this.aircraftForm.value.registration = generateAircraftRegistration(homeHubCountry);
    }

    this.aircraftService.aircraftFlights.subscribe((aircraftFlights) => {
      if (aircraftFlights.numberFlights == 0) {
        this.aircraftForm.value.flights = [];
        this.submitted.emit(this.aircraftMapper.aircraftToDB(this.aircraftForm.value));
      } else {
        this.aircraftForm.value.flights = validateAndFormatFlights(aircraftFlights.flights, this.aircraftForm.value.homeHub, this.hubRoutes);

        if (this.aircraftForm.value.flights.length == 0) {
          this.notificationService.showErrorNotification(
            `${getAircraftFlightsDialogTitle()}`.toUpperCase(),
            `${getAircraftFlightsErrorNotificationMessage()}`,
          );
        } else {
          this.submitted.emit(this.aircraftMapper.aircraftToDB(this.aircraftForm.value));
        }
      }
    });
  }
}
