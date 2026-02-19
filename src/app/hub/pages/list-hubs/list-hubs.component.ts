import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { InternationalPaginator } from '../../../shared/components/international-paginator';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';
import { AirportService } from '../../../shared/services/airport.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { getHubsListTitle } from '../../../shared/labels/lists';
import {
  getIATALabel,
  getCountryLabel,
  getCityLabel,
  getRegionLabel,
} from '../../../shared/labels/commons/airport-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { getNameLabel } from '../../../shared/labels/commons/form-common';
import { Airport } from '../../../shared/models/Airport';

@Component({
  selector: 'list-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatLabel,
    ForbiddenComponent,
    UnauthorizedComponent,
  ],
  templateUrl: './list-hubs.component.html',
  styleUrls: [
    '../../../shared/styles/lists.scss',
    '../../../shared/styles/flag-icons.css',
    './list-hubs.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class ListHubsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public authenticatedUser!: User;

  /* List properties */
  public hubsListTitle!: string;
  public hubsList: MatTableDataSource<Airport> = new MatTableDataSource();

  /* List columns identifiers */
  public columnsIdentifiers: string[] = [
    'iata',
    'name',
    'country',
    'city',
    'region',
    'actions',
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

  constructor(
    readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.hubsListTitle = getHubsListTitle();

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });

    this.airportService.hubs.subscribe((hubs) => {
      this.hubsList.data = this.airportMapper.airportsListFromDB(hubs);
    });
  }

  ngAfterViewInit() {
    this.hubsList.paginator = this.paginator;
  }

  /* Hub form (edit mode) opening */
  openHubForm(hub: Airport) {
    this.router.navigate(['hubs', 'edit', hub.uuid]);
  }
}
