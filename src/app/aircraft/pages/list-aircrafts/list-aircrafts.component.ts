import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { InternationalPaginator } from '../../../shared/components/international-paginator';
import { User } from '../../../shared/dto/User';
import { UserService } from '../../../shared/services/user.service';
import { AircraftService } from '../../../shared/services/aircraft.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AircraftMapper } from '../../../shared/mappers/AircraftMapper';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { Aircraft } from '../../../shared/dto/Aircraft';
import { Router, RouterLink } from '@angular/router';
import {
  getManufacturerLabel,
  getModelLabel,
  getHomeHubLabel,
} from '../../../shared/labels/forms/aircraft-form';
import { getAircraftsListTitle } from '../../../shared/labels/lists';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { FlightsDetailsComponent } from '../flights-details/flights-details.component';

@Component({
  selector: 'list-aircrafts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatLabel,
    MatIconModule,
    MatBadgeModule,
    RouterLink,
    UnauthorizedComponent,
  ],
  templateUrl: './list-aircrafts.component.html',
  styleUrls: [
    '../../../shared/styles/commons.scss',
    '../../../shared/styles/lists.scss',
    '../../../shared/styles/flag-icons.css',
    './list-aircrafts.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class ListAircraftsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public authenticatedUser!: User;

  /* List properties */
  public aircraftsListTitle!: string;
  public aircraftsList: MatTableDataSource<Aircraft> = new MatTableDataSource();

  /* List columns identifiers */
  public columnsIdentifiers: string[] = [
    'registration',
    'manufacturer',
    'model',
    'home-hub',
    'flights'
  ];

  /* List columns headers labels */
  public columnsHeaders: string[] = [
    'IMMATRICULATION',
    getManufacturerLabel(),
    getModelLabel(),
    getHomeHubLabel(),
    'VOLS',
  ];

  public aircraftMapper: AircraftMapper = new AircraftMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public aircraftService: AircraftService = inject(AircraftService);
  public router: Router = inject(Router);

  constructor(readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.aircraftsListTitle = getAircraftsListTitle();

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

    this.aircraftService.aircrafts.subscribe((aircrafts) => {
      this.aircraftsList.data = this.aircraftMapper.aircraftsListFromDB(aircrafts);
    });
  }

  ngAfterViewInit() {
    this.aircraftsList.paginator = this.paginator;
  }

  /* Flights details dialog opening */
  openFlightsDetails(aircraft: Aircraft) {
    let dialogRef: MatDialogRef<FlightsDetailsComponent> = this.dialog.open(
      FlightsDetailsComponent,
      {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );
    dialogRef.componentInstance.aircraft = aircraft;
  }
}
