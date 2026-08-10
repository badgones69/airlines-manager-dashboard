import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AircraftMapper } from '../../../shared/mappers/AircraftMapper';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { getAircraftFlightRouteInputLabel, getAircraftFlightsDialogTitle, getAircraftFlightDepartureTimeInputLabel, getAircraftNumberFlightsInputLabel, getValidateButtonLabel, getAircraftFlightLengthInputLabel, getNumberFlightsFieldValueErrorMessage } from '../../../shared/labels/dialogs/aircraft-flights-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { distinctUntilChanged, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { MatAutocomplete, MatOption, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Airport } from '../../../shared/dto/Airport';
import { capitalize } from '../../../shared/utils/labels-utils';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';
import { RouteMapper } from '../../../shared/mappers/RouteMapper';
import { AirportService } from '../../../shared/services/airport.service';
import { MAX_ERROR, MIN_ERROR, REQUIRED_ERROR, UNKNOWN_AIRPORT_ERROR } from '../../../shared/constants/forms-constants';
import { getRequiredFieldErrorMessage } from '../../../shared/labels/commons/form-common';
import { getUnknownAirportErrorMessage } from '../../../shared/labels/forms/route-form';
import { RouteService } from '../../../shared/services/route.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AircraftService } from '../../../shared/services/aircraft.service';
import { getDepartureTimeFieldIdentifier, getLengthFieldIdentifier, getRouteFieldIdentifier } from '../../../shared/labels/forms/aircraft-form';

@Component({
  selector: 'aircraft-flights',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './aircraft-flights.component.html',
  styleUrls: [
    './aircraft-flights.component.scss',
    '../../../shared/components/dialog/dialog.component.scss',
    '../../../shared/styles/forms.scss',
    '../../../shared/styles/commons.scss',
    '../../../shared/styles/flag-icons.css',
  ],
})
export class AircraftFlightsComponent implements OnInit {
  @Input() public isEdit!: boolean;
  @Output() public submitted = new EventEmitter();

  /* Form properties */
  public aircraftFlightsForm!: FormGroup;
  public aircraftFlightsDialogTitle: string = '';
  public route1Flag: string = '';
  public route2Flag: string = '';
  public route3Flag: string = '';
  public route4Flag: string = '';
  public route5Flag: string = '';
  public route6Flag: string = '';
  public route7Flag: string = '';
  public route8Flag: string = '';
  public route9Flag: string = '';
  public route10Flag: string = '';
  public route11Flag: string = '';
  public route12Flag: string = '';

  /* Form fields identifiers */
  public numberFlightsFieldIdentifier: string = 'numberFlights';
  public flightRouteFieldIdentifier: string = 'flightRoute';
  public flightDepartureTimeFieldIdentifier: string = 'flightDepartureTime';
  public flightLengthFieldIdentifier: string = 'flightLength';

  /* Form fields labels */
  public aircraftNumberFlightsInputLabel: string = '';
  public aircraftFlightRouteInputLabel: string = '';
  public aircraftFlightDepartureTimeInputLabel: string = '';
  public aircraftFlightLengthInputLabel: string = '';

  // Button label
  public validateButtonLabel!: string;

  // Flight route fields available values
  @Input() public routes: Airport[] = [];
  // List of routes matching first flight route field value
  public filteredRoutes1: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching second flight route field value
  public filteredRoutes2: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching third flight route field value
  public filteredRoutes3: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching fourth flight route field value
  public filteredRoutes4: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching fifth flight route field value
  public filteredRoutes5: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching sixth flight route field value
  public filteredRoutes6: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching seventh flight route field value
  public filteredRoutes7: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching eighth flight route field value
  public filteredRoutes8: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching ninth flight route field value
  public filteredRoutes9: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching tenth flight route field value
  public filteredRoutes10: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching eleventh flight route field value
  public filteredRoutes11: Observable<Airport[]> = new Observable<Airport[]>();
  // List of routes matching twelfth flight route field value
  public filteredRoutes12: Observable<Airport[]> = new Observable<Airport[]>();

  /* Injections */
  public airportService = inject(AirportService);
  public aircraftService = inject(AircraftService);
  public routeService = inject(RouteService);

  public aircraftMapper: AircraftMapper = new AircraftMapper();
  public airportMapper: AirportMapper = new AirportMapper();
  public routeMapper: RouteMapper = new RouteMapper();

  constructor(readonly notificationService: NotificationService) {
    /* Form fields creation & constraints definition */
    this.aircraftFlightsForm = new FormGroup(
      {
        numberFlights: new FormControl('', Validators.required),
        flights: new FormBuilder().array([]),
      },
    );
  }

  ngOnInit(): void {
    /* Form title, fields and button initialization */
    this.aircraftFlightsDialogTitle = getAircraftFlightsDialogTitle();
    this.aircraftNumberFlightsInputLabel = getAircraftNumberFlightsInputLabel();
    this.aircraftFlightRouteInputLabel = getAircraftFlightRouteInputLabel();
    this.aircraftFlightDepartureTimeInputLabel = getAircraftFlightDepartureTimeInputLabel();
    this.aircraftFlightLengthInputLabel = getAircraftFlightLengthInputLabel();
    this.validateButtonLabel = getValidateButtonLabel();

    this.aircraftFlightsForm
      .get(this.numberFlightsFieldIdentifier)
      ?.valueChanges.pipe(
        takeUntil(new Subject<void>()))
      .subscribe((numberFlightsValueChanged) =>
        this.setFlightsFields(numberFlightsValueChanged),
      );

    if(this.isEdit) {
      this.aircraftService.aircraftFlights.subscribe((aircraftFlights) => {
        if (aircraftFlights) {
          aircraftFlights.flights.forEach((flight: any, index: number) => {
            this.setRouteFlag(index, flight[getRouteFieldIdentifier(index)].country.flagCode);
          });

          this.setFlightsFields(aircraftFlights.numberFlights);
          this.aircraftFlightsForm.patchValue({
            numberFlights: aircraftFlights.numberFlights,
            flights: aircraftFlights.flights,
          });
        }
      });
    }
  }

  /* Routes filtering (by flight route field value) */
  private filterRoutes(flightRouteValue: any): Airport[] {
    if (flightRouteValue === null || flightRouteValue === undefined) {
      return this.routes;
    }

    const filterValue: string =
      typeof flightRouteValue === 'string'
        ? capitalize(flightRouteValue)
        : capitalize(flightRouteValue.iata);
    return this.routes.filter(
      (route) =>
        capitalize(route.iata).startsWith(filterValue),
    );
  }

  /* Flights fields array getter */
  get flights(): FormArray {
    return this.aircraftFlightsForm.get('flights') as FormArray;
  }

  /* Flight route fields getter */
  getFilteredRoutes(index: number): Observable<Airport[]> {
    switch (index) {
      case 0:
        return this.filteredRoutes1;
      case 1:
        return this.filteredRoutes2;
      case 2:
        return this.filteredRoutes3;
      case 3:
        return this.filteredRoutes4;
      case 4:
        return this.filteredRoutes5;
      case 5:
        return this.filteredRoutes6;
      case 6:
        return this.filteredRoutes7;
      case 7:
        return this.filteredRoutes8;
      case 8:
        return this.filteredRoutes9;
      case 9:
        return this.filteredRoutes10;
      case 10:
        return this.filteredRoutes11;
      case 11:
        return this.filteredRoutes12;
      default:
        return new Observable<Airport[]>();
    }
  }

  /* Flight route fields setter */
  setFilteredRoute(index: number, filteredValue: Observable<Airport[]>): void {
    switch (index) {
      case 0:
        this.filteredRoutes1 = filteredValue;
        break;
      case 1:
        this.filteredRoutes2 = filteredValue;
        break;
      case 2:
        this.filteredRoutes3 = filteredValue;
        break;
      case 3:
        this.filteredRoutes4 = filteredValue;
        break;
      case 4:
        this.filteredRoutes5 = filteredValue;
        break;
      case 5:
        this.filteredRoutes6 = filteredValue;
        break;
      case 6:
        this.filteredRoutes7 = filteredValue;
        break;
      case 7:
        this.filteredRoutes8 = filteredValue;
        break;
      case 8:
        this.filteredRoutes9 = filteredValue;
        break;
      case 9:
        this.filteredRoutes10 = filteredValue;
        break;
      case 10:
        this.filteredRoutes11 = filteredValue;
        break;
      case 11:
        this.filteredRoutes12 = filteredValue;
        break;
      default:
        break;
    }
  }

  /* Flight route fields flag getter */
  getRouteFlag(index: number): string {
    switch (index) {
      case 0:
        return this.route1Flag;
      case 1:
        return this.route2Flag;
      case 2:
        return this.route3Flag;
      case 3:
        return this.route4Flag;
      case 4:
        return this.route5Flag;
      case 5:
        return this.route6Flag;
      case 6:
        return this.route7Flag;
      case 7:
        return this.route8Flag;
      case 8:
        return this.route9Flag;
      case 9:
        return this.route10Flag;
      case 10:
        return this.route11Flag;
      case 11:
        return this.route12Flag;
      default:
        return '';
    }
  }

  /* Flight route fields flag setter */
  setRouteFlag(index: number, routeFlag: string): void {
    switch (index) {
      case 0:
        this.route1Flag = routeFlag;
        break;
      case 1:
        this.route2Flag = routeFlag;
        break;
      case 2:
        this.route3Flag = routeFlag;
        break;
      case 3:
        this.route4Flag = routeFlag;
        break;
      case 4:
        this.route5Flag = routeFlag;
        break;
      case 5:
        this.route6Flag = routeFlag;
        break;
      case 6:
        this.route7Flag = routeFlag;
        break;
      case 7:
        this.route8Flag = routeFlag;
        break;
      case 8:
        this.route9Flag = routeFlag;
        break;
      case 9:
        this.route10Flag = routeFlag;
        break;
      case 10:
        this.route11Flag = routeFlag;
        break;
      case 11:
        this.route12Flag = routeFlag;
        break;
      default:
        break;
    }
  }

  /* Flight route fields identifiers getter */
  getRouteFieldIdentifier(index: number): string {
    return getRouteFieldIdentifier(index);
  }

  /* Flight departure time fields identifiers getter */
  getDepartureTimeFieldIdentifier(index: number): string {
    return getDepartureTimeFieldIdentifier(index);
  }

  /* Flight length fields identifiers getter */
  getLengthFieldIdentifier(index: number): string {
    return getLengthFieldIdentifier(index);
  }

  /* Number flights field listener (flights fields) */
  setFlightsFields(numberFlights: number) { 
    let numberFields: number = this.flights.length;
    
    if (numberFlights > 0 && numberFlights < 13) {
      if (numberFields < numberFlights) {
        while (numberFields < numberFlights) {
          this.flights.push(new FormGroup(
            {
              [getRouteFieldIdentifier(numberFields)]: new FormControl('', Validators.required),
              [getDepartureTimeFieldIdentifier(numberFields)]: new FormControl('', Validators.required),
              [getLengthFieldIdentifier(numberFields)]: new FormControl('', Validators.required),
            }
          ));
          numberFields++;
        }
      } else {
        while (numberFields > numberFlights) {
          numberFields--;
          this.flights.removeAt(numberFields);
          this.setRouteFlag(numberFields, '');
        }
      }
    } else {
      for (let i: number = 0; i < 12; i++) {
        this.setRouteFlag(i, '');
      }
      this.flights.clear();
    }

    for (let i: number = 0; i < this.flights.length; i++) {
      // @ts-ignore
      const filteredRoute = (this.flights
        ?.controls[i] as FormGroup)
        ?.controls[getRouteFieldIdentifier(i)]
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          startWith(''),
          map((route) =>
            route ? this.filterRoutes(route) : this.routes.slice(),
          ),
      );
      this.setFilteredRoute(i, filteredRoute);

      (this.flights
        ?.controls[i] as FormGroup)
        ?.controls[getRouteFieldIdentifier(i)]
        ?.valueChanges.pipe(takeUntil(new Subject<void>()))
        .subscribe((flightRouteValueChanged) =>
          this.changeFlightRoute(flightRouteValueChanged, i),
        );
    }
  }

  /* Flight route fields listener (flag) */
  changeFlightRoute(flightRouteValueChanged: any, index: number): void {
    if (flightRouteValueChanged != null) {
      const filterValue: string =
        typeof flightRouteValueChanged === 'string'
          ? capitalize(flightRouteValueChanged)
          : capitalize(flightRouteValueChanged.iata);

      const flightDestinationFound: Airport | undefined = this.routes.find(
        (destination) => 
          capitalize(destination.iata) === capitalize(filterValue),
      );

      if (flightDestinationFound) {
        (this.flights.controls[index] as FormGroup).controls[getRouteFieldIdentifier(index)].patchValue(flightDestinationFound, { emitEvent: false });
        this.setRouteFlag(index, flightDestinationFound.country.flagCode);
      } else if (flightRouteValueChanged === '') {
        this.setRouteFlag(index, '');
      } else {
        this.setRouteFlag(index, 'xx');
      }
    }
  }

  /* Flight route display (by IATA code) */
  displayFlightRoute(route: Airport): string {
    return route ? route.iata : '';
  }

  /* Number flights field error message(s) display */
  displayNumberFlightsErrorMessage(): string {
    if (
        this.aircraftFlightsForm.get(this.numberFlightsFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.aircraftFlightsForm.get(this.numberFlightsFieldIdentifier)
        ?.hasError(MIN_ERROR) ||
      this.aircraftFlightsForm.get(this.numberFlightsFieldIdentifier)
      ?.hasError(MAX_ERROR)    
    ) {
      return getNumberFlightsFieldValueErrorMessage();
    }
    return '';
  }

  /* Flight route fields error message(s) display */
  displayFlightRouteErrorMessage(index: number): string {
    const flightRouteField: AbstractControl = (this.flights
      ?.controls[index] as FormGroup)
      ?.controls[getRouteFieldIdentifier(index)]

    if (
        flightRouteField
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if ('xx' === this.getRouteFlag(index)) {
      flightRouteField?.setErrors({ [UNKNOWN_AIRPORT_ERROR]: true });
      return getUnknownAirportErrorMessage();
    }
    return '';
  }

  /* Flight departure time fields error message(s) display */
  displayFlightDepartureTimeErrorMessage(index: number): string {
    const flightDepartureTimeField: AbstractControl = (this.flights
      ?.controls[index] as FormGroup)
      ?.controls[getDepartureTimeFieldIdentifier(index)]

    if (
        flightDepartureTimeField
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    }
    return '';
  }

  /* Flight length fields error message(s) display */
  displayFlightLengthErrorMessage(index: number): string {
    const flightLengthField: AbstractControl = (this.flights
      ?.controls[index] as FormGroup)
      ?.controls[getLengthFieldIdentifier(index)];

    if (
        flightLengthField
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitFlightsForm(): void {
    globalThis.setTimeout(() => {
      this.submitted.emit(this.aircraftFlightsForm.value);
    }, 1000);
  }
}
