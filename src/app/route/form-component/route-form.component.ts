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
  getFormModeLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
  getSubmitButtonIcon,
  getSubmitButtonLabel,
} from '../../shared/labels/commons/form-common';
import { Route } from '../../shared/models/Route';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  EDIT_FORM_MODE,
  REQUIRED_ERROR,
  UNKNOWN_AIRPORT_ERROR,
} from '../../shared/constants/forms-constants';
import { RouteMapper } from '../../shared/mappers/RouteMapper';
import {
  capitalize,
} from '../../shared/utils/labels-utils';
import {
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { Airport } from '../../shared/models/Airport';
import { getArrivalAirportLabel, getDepartureHubLabel, getRouteFormTitle, getUnknownAirportErrorMessage } from '../../shared/labels/forms/route-form';
import { AirportService } from '../../shared/services/airport.service';
import { AirportMapper } from '../../shared/mappers/AirportMapper';
@Component({
  selector: 'route-form',
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
  templateUrl: './route-form.component.html',
  styleUrls: [
    '../../shared/styles/forms.scss',
    '../../shared/styles/commons.scss',
    '../../shared/styles/forms.scss',
    '../../shared/styles/flag-icons.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteFormComponent implements OnInit {
  @Input() public formMode!: string;
  @Input() public formTitle!: string;
  @Input() public route!: Route;
  @Output() public submitted = new EventEmitter();
  public isEditMode!: boolean;

  public airportMapper: AirportMapper = new AirportMapper();
  public routeMapper: RouteMapper = new RouteMapper();

  /* Form properties */
  public routeForm!: FormGroup;
  public routeFormTitle: string = '';
  public departureHubFlag: string = 'xx';
  public arrivalAirportFlag: string = 'xx';

  /* Form fields identifiers */
  public departureHubFieldIdentifier: string = 'departureHub';
  public arrivalAirportFieldIdentifier: string = 'arrivalAirport';

  /* Form fields labels */
  public departureHubInputLabel: string = '';
  public arrivalAirportInputLabel: string = '';

  /* Buttons labels and icons */
  public submitButtonLabel: string = '';
  public submitButtonIcon: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  // All hub available values
  public allHubs: Airport[] = [];
  // Departure hub field available values
  public hubs: Airport[] = [];
  // List of hubs matching to departure hub field value
  public filteredHubs: Observable<Airport[]> = new Observable<Airport[]>();
  // All destination available values
  public allDestinations: Airport[] = [];
  // Arrival airport field available values
  public destinations: Airport[] = [];
  // List of destinations matching to arrival airport field value
  public filteredDestinations: Observable<Airport[]> = new Observable<Airport[]>();

  /* Injections */
  public airportService = inject(AirportService);

  constructor() {
    /* Form fields creation & constraints definition */
    this.routeForm = new FormGroup({
      departureHub: new FormControl('', Validators.required),
      arrivalAirport: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.formMode === EDIT_FORM_MODE;

    /* Form title, fields and buttons initialization */
    this.routeFormTitle = `${getFormModeLabel(
      this.formMode,
    )} ${getRouteFormTitle()}`;
    this.departureHubInputLabel = getDepartureHubLabel();
    this.arrivalAirportInputLabel = getArrivalAirportLabel();
    this.submitButtonLabel = getSubmitButtonLabel(this.formMode);
    this.submitButtonIcon = getSubmitButtonIcon(this.formMode);
    this.resetButtonLabel = getResetButtonLabel(this.formMode);
    this.resetButtonIcon = getResetButtonIcon(this.formMode);
    this.resetButtonType = getResetButtonType(this.formMode);

    this.airportService.hubs.subscribe((hubs) => {
      this.allHubs = this.airportMapper.airportsListFromDB(hubs);
      this.hubs = this.allHubs;

      this.airportService.destinations.subscribe((destinations) => {
        this.allDestinations = [...this.allHubs, ...this.airportMapper.airportsListFromDB(destinations)];
        this.destinations = this.allDestinations;
      });
    
      this.setAvailableDepartureHubs(this.hubs);
      this.setAvailableArrivalAirports(this.destinations);      
    });

    this.routeForm
      .get(this.departureHubFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((departureHubValueChanged) =>
        this.changeDepartureHub(departureHubValueChanged),
      );

    this.routeForm
      .get(this.arrivalAirportFieldIdentifier)
      ?.valueChanges.pipe(takeUntil(new Subject<void>()))
      .subscribe((arrivalAirportValueChanged) =>
        this.changeArrivalAirport(arrivalAirportValueChanged));

    this.routeForm.patchValue({
      departureHub: this.route?.departureHub,
      arrivalAirport: this.route?.arrivalAirport,
    });

    this.routeForm
      .get(this.departureHubFieldIdentifier)
      ?.setValue(this.route?.departureHub);
    this.departureHubFlag = this.route?.departureHub?.country?.flagCode;

    this.routeForm
      .get(this.arrivalAirportFieldIdentifier)
      ?.setValue(this.route?.arrivalAirport);
    this.arrivalAirportFlag = this.route?.arrivalAirport?.country?.flagCode;
  }

  /* Available departure hubs values reload */
  private setAvailableDepartureHubs(listHubs: Airport[]): void {
    // @ts-ignore
    this.filteredHubs = this.routeForm
      .get(this.departureHubFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((hub) =>
          hub ? this.filterHubs(hub) : listHubs.slice(),
        ),
      );
  }

  /* Available arrival airports values reload */
  private setAvailableArrivalAirports(listDestinations: Airport[]): void {
    // @ts-ignore
    this.filteredDestinations = this.routeForm
      .get(this.arrivalAirportFieldIdentifier)
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        map((destination) =>
          destination ? this.filterDestinations(destination) : listDestinations.slice(),
        ),
      );
  }

  /* Departure hub field listener (flag & destinations) */
  changeDepartureHub(departureHubValueChanged: any): void {
    if (departureHubValueChanged != null) {
      const departureHubValue: string =
      typeof departureHubValueChanged === 'string'
        ? capitalize(departureHubValueChanged)
        : capitalize(departureHubValueChanged.iata);

      const departureHubFound: Airport | undefined = this.allHubs.find(
        (hub) => capitalize(hub.name) === capitalize(departureHubValue) ||
          capitalize(hub.iata) === capitalize(departureHubValue),
      );

      if (departureHubFound) {
        this.departureHubFlag = departureHubFound.country.flagCode;

        this.destinations = this.allDestinations.filter(
          (destination) => destination.iata !== departureHubFound.iata  
        );
        this.setAvailableArrivalAirports(this.destinations);
      } else {
        this.departureHubFlag = 'xx';
        this.setAvailableArrivalAirports(this.allDestinations);
      }
    }
  }

  /* Arrival airport field listener (flag & hubs) */
  changeArrivalAirport(arrivalAirportValueChanged: any): void {
    if (arrivalAirportValueChanged != null) {
      const arrivalAirportValue: string =
      typeof arrivalAirportValueChanged === 'string'
        ? capitalize(arrivalAirportValueChanged)
        : capitalize(arrivalAirportValueChanged.iata);

      const arrivalAirportFound: Airport | undefined = this.allDestinations.find(
        (destination) => capitalize(destination.name) === capitalize(arrivalAirportValue) ||
          capitalize(destination.iata) === capitalize(arrivalAirportValue),
      );

      if (arrivalAirportFound) {
        this.arrivalAirportFlag = arrivalAirportFound.country.flagCode;

        this.hubs = this.allHubs.filter(
          (hub) => hub.iata !== arrivalAirportFound.iata  
        );
        this.setAvailableDepartureHubs(this.hubs);
      } else {
        this.arrivalAirportFlag = 'xx';
        this.setAvailableDepartureHubs(this.allHubs);
      }
    }
  }

  /* Hubs filtering (by departure hub field value) */
  private filterHubs(departureHubValue: any): Airport[] {
    if (departureHubValue === null || departureHubValue === undefined) {
      return this.hubs;
    }

    const filterValue: string =
      typeof departureHubValue === 'string'
        ? capitalize(departureHubValue)
        : capitalize(departureHubValue.iata);
    return this.hubs.filter((hub) =>
      capitalize(hub.iata).startsWith(filterValue) ||
      capitalize(hub.name).startsWith(capitalize(filterValue)),
    );
  }

  /* Destinations filtering (by arrival airport field value) */
  private filterDestinations(arrivalAirportValue: any): Airport[] {
    if (arrivalAirportValue === null || arrivalAirportValue === undefined) {
      return this.destinations;
    }

    const filterValue: string =
      typeof arrivalAirportValue === 'string'
        ? capitalize(arrivalAirportValue)
        : capitalize(arrivalAirportValue.iata);
    return this.destinations.filter((destination) =>
      capitalize(destination.iata).startsWith(filterValue) ||
      capitalize(destination.name).startsWith(capitalize(filterValue)),
    );
  }

  /* Airport display (by name) */
  displayAirport(airport: Airport): string {
    return airport ? airport.name : '';
  }

  /* Departure hub field error message(s) display */
  displayDepartureHubErrorMessage(): string {
    if (
      this.routeForm
        .get(this.departureHubFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.departureHubFlag) {
      this.routeForm
        .get(this.departureHubFieldIdentifier)
        ?.setErrors({ [UNKNOWN_AIRPORT_ERROR]: true });

      return getUnknownAirportErrorMessage();
    }
    return '';
  }

  /* Arrival airport field error message(s) display */
  displayArrivalAirportErrorMessage(): string {
    if (
      this.routeForm.get(this.arrivalAirportFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.arrivalAirportFlag) {
      this.routeForm
        .get(this.arrivalAirportFieldIdentifier)
        ?.setErrors({ [UNKNOWN_AIRPORT_ERROR]: true });

      return getUnknownAirportErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitRouteForm() {
    const departureHubValue = this.routeForm.get(this.departureHubFieldIdentifier)?.value;

    if (typeof departureHubValue === 'string') {
      this.routeForm.value.departureHub = this.allHubs.find(
        (hub) => capitalize(hub.name) === capitalize(departureHubValue) ||
          capitalize(hub.iata) === capitalize(departureHubValue),
      )?.id;
    } else {
      this.routeForm.value.departureHub = departureHubValue.id;
    }

    const arrivalAirportValue = this.routeForm.get(this.arrivalAirportFieldIdentifier)?.value;

    if (typeof arrivalAirportValue === 'string') {
      this.routeForm.value.arrivalAirport = this.allDestinations.find(
        (destination) => capitalize(destination.name) === capitalize(arrivalAirportValue) ||
          capitalize(destination.iata) === capitalize(arrivalAirportValue),
      )?.id;
    } else {
      this.routeForm.value.arrivalAirport = arrivalAirportValue.id;
    }

    this.submitted.emit(this.routeMapper.routeToDB(this.routeForm.value));
  }
}
