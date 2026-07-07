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
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';
import { RouteService } from '../../../shared/services/route.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouteMapper } from '../../../shared/mappers/RouteMapper';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { Route } from '../../../shared/models/Route';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteRouteComponent } from '../delete-route/delete-route.component';
import {
  getArrivalAirportLabel,
  getDepartureHubLabel,
} from '../../../shared/labels/forms/route-form';
import { getRoutesListTitle } from '../../../shared/labels/lists';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'list-routes',
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
  templateUrl: './list-routes.component.html',
  styleUrls: [
    '../../../shared/styles/commons.scss',
    '../../../shared/styles/lists.scss',
    '../../../shared/styles/flag-icons.css',
    './list-routes.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class ListRoutesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public authenticatedUser!: User;

  /* List properties */
  public routesListTitle!: string;
  public routesList: MatTableDataSource<Route> = new MatTableDataSource();

  /* List columns identifiers */
  public columnsIdentifiers: string[] = ['departure-hub', 'arrival-airport'];

  /* List columns headers labels */
  public columnsHeaders: string[] = [
    getDepartureHubLabel(),
    getArrivalAirportLabel(),
  ];

  public routeMapper: RouteMapper = new RouteMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public routeService: RouteService = inject(RouteService);
  public router: Router = inject(Router);

  constructor(readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.routesListTitle = getRoutesListTitle();

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

    this.routeService.routes.subscribe((routes) => {
      this.routesList.data = this.routeMapper.routesListFromDB(routes);
    });
  }

  ngAfterViewInit() {
    this.routesList.paginator = this.paginator;
  }

  /* Route form (edit mode) opening */
  openRouteForm(route: Route) {
    this.router.navigate(['routes', 'edit'], {
      state: { route: JSON.stringify(route) },
    });
  }

  /* Route deletion confirmation dialog opening */
  deleteRoute(route: Route) {
    let dialogRef: MatDialogRef<DeleteRouteComponent> = this.dialog.open(
      DeleteRouteComponent,
      {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );
    dialogRef.componentInstance.routeUUID = route.uuid!;
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }
}
