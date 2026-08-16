import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { INFO_DIALOG_MODE } from '../../../shared/constants/dialogs-constants';
import { Aircraft } from '../../../shared/dto/Aircraft';
import { getDepartureAirportLabel, getFlightNumberLabel, getFlightsDetailsDialogTitle, getLandingLabel, getTakeOffLabel } from '../../../shared/labels/dialogs/flights-details-dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getArrivalAirportLabel } from '../../../shared/labels/forms/route-form';
import { Flight } from '../../../shared/dto/Flight';
import { InternationalPaginator } from '../../../shared/components/international-paginator';
import { DatePipe } from '@angular/common';
import { sortFlightsByTakeOffTime } from '../../../shared/utils/aviation-utils';

@Component({
  selector: 'flights-details',
  imports: [
    DialogComponent,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './flights-details.component.html',
  styleUrls: [
    '../../../shared/styles/commons.scss',
    '../../../shared/styles/lists.scss',
    '../../../shared/styles/flag-icons.css',
    './flights-details.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class FlightsDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() public aircraft!: Aircraft;

  public flightsDetailsDialogTitle!: string;
  public flightsDetailsDialogMode!: string;

  /* List properties */
  public flightsList: MatTableDataSource<Flight> = new MatTableDataSource();

  /* List columns identifiers */
    public columnsIdentifiers: string[] = [
      'number',
      'departure-airport',
      'takeoff-time',
      'landing-time',
      'arrival-airport',
    ];
  
  /* List columns headers labels */
  public columnsHeaders: string[] = [
    getFlightNumberLabel(),
    getDepartureAirportLabel(),
    getTakeOffLabel(),
    getLandingLabel(),
    getArrivalAirportLabel(),
  ];

  constructor() {}

  ngOnInit(): void {
    this.flightsDetailsDialogTitle = `${getFlightsDetailsDialogTitle()}`;
    this.flightsDetailsDialogMode = INFO_DIALOG_MODE;
    this.flightsList.data = sortFlightsByTakeOffTime(this.aircraft.flights);
  }

  ngAfterViewInit() {
    this.flightsList.paginator = this.paginator;
  }
}
