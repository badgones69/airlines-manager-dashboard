import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { RouteService } from '../../../shared/services/route.service';
import { User } from '../../../shared/models/User';
import { Route } from '../../../shared/models/Route';
import { RouteFormComponent } from '../../form-component/route-form.component';
import { EDIT_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import {
  getRouteFormSuccessNotificationMessage,
  getRouteFormTitle,
} from '../../../shared/labels/forms/route-form';
import { RouteMapper } from '../../../shared/mappers/RouteMapper';

@Component({
  selector: 'edit-route',
  standalone: true,
  imports: [RouteFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './edit-route.component.html',
  styleUrls: [],
})
export class EditRouteComponent implements OnInit {
  public authenticatedUser!: User;

  public initRouteToEdit!: Route;
  public formMode: string = EDIT_FORM_MODE;

  public routeUUID!: string;
  public routeMapper: RouteMapper = new RouteMapper();

  public isLoading: boolean = false;

  /* Injections */
  public userService: UserService = inject(UserService);
  public routeService: RouteService = inject(RouteService);
  public router: Router = inject(Router);

  constructor(
    readonly notificationService: NotificationService,
    readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.routeUUID = this.route.snapshot.paramMap.get('uuid') ?? '';

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });

    this.routeService.findRoute(this.routeUUID).then((route) => {
      this.initRouteToEdit = this.routeMapper.routeFromDB(route);
      this.isLoading = false;
    });
  }

  /* Route editing */
  editRoute(route: any): void {
    route.routeUUID = this.routeUUID;
    // Route updating
    this.routeService.updateRoute(route).then((result: any) => {
      // If route is updated
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getRouteFormTitle()}`.toUpperCase(),
          `${getRouteFormSuccessNotificationMessage(this.formMode)}`,
        );
        // Redirection to routes list
        this.router.navigate(['routes', 'list']);
      }
    });
  }
}
