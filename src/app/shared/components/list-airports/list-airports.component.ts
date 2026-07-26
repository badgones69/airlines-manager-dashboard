import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { InternationalPaginator } from '../international-paginator';
import { User } from '../../dto/User';
import { UserService } from '../../services/user.service';
import { AirportService } from '../../services/airport.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AirportMapper } from '../../mappers/AirportMapper';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import {
  getIATALabel,
  getCountryLabel,
  getCityLabel,
  getRegionLabel,
} from '../../labels/commons/airport-common';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { getNameLabel } from '../../labels/commons/form-common';
import { Airport } from '../../dto/Airport';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'list-airports',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatLabel,
    RouterLink,
    UnauthorizedComponent,
  ],
  templateUrl: './list-airports.component.html',
  styleUrls: [
    '../../../shared/styles/commons.scss',
    '../../../shared/styles/lists.scss',
    '../../../shared/styles/flag-icons.css',
    './list-airports.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class ListAirportsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public authenticatedUser!: User;
  @Input() public airportsListTitle!: string;
  @Input() public isHub!: boolean;
  @Input() public openAirportForm!: (airport: Airport) => void;
  @Input() public deleteAirport!: (airport: Airport) => void;

  /* List properties */
  public airportsList: MatTableDataSource<Airport> = new MatTableDataSource();

  /* List columns identifiers */
  public columnsIdentifiers: string[] = [
    'iata',
    'name',
    'country',
    'city',
    'region',
  ];

  /* List columns headers labels */
  public columnsHeaders: string[] = [
    getIATALabel(),
    getNameLabel(),
    getCountryLabel(),
    getCityLabel(),
    getRegionLabel(),
  ];

  public airportMapper: AirportMapper = new AirportMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public airportService: AirportService = inject(AirportService);
  public router: Router = inject(Router);

  constructor(readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());

        if (
          this.authenticatedUser.profile < 3 &&
          !this.columnsIdentifiers.includes('actions')
        ) {
          this.columnsIdentifiers.push('actions');
        }
      }
    });
    if (this.isHub) {
      this.airportService.hubs.subscribe((hubs) => {
        this.airportsList.data = this.airportMapper.airportsListFromDB(hubs);
      });
    } else {
      this.airportService.destinations.subscribe((destinations) => {
        this.airportsList.data =
          this.airportMapper.airportsListFromDB(destinations);
      });
    }
  }

  ngAfterViewInit() {
    this.airportsList.paginator = this.paginator;
  }
}
