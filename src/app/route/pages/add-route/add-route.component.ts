import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { RouteService } from '../../../shared/services/route.service';
import { User } from '../../../shared/models/User';
import { Route } from '../../../shared/models/Route';
import { RouteFormComponent } from '../../form-component/route-form.component';
import { ADD_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import {
  getRouteFormSuccessNotificationMessage,
  getRouteFormTitle,
} from '../../../shared/labels/forms/route-form';

@Component({
  selector: 'add-route',
  standalone: true,
  imports: [RouteFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './add-route.component.html',
  styleUrls: [],
})
export class AddRouteComponent implements OnInit {
  public authenticatedUser!: User;

  public initRouteToAdd!: Route;
  public formMode: string = ADD_FORM_MODE;

  /* Injections */
  public userService: UserService = inject(UserService);
  public routeService: RouteService = inject(RouteService);
  public router: Router = inject(Router);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Route adding */
  addRoute(route: any): void {
    // Route creation
    this.routeService.createRoute(route).then((result: any) => {
      // If route is created
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
