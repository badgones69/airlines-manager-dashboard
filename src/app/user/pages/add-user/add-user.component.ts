import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/User';
import { UserFormComponent } from '../../form-component/user-form.component';
import { ADD_FORM_MODE } from '../../../shared/constants/forms-constants';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getUserFormSuccessNotificationMessage,
  getUserFormTitle,
} from '../../../shared/labels/forms/user-form';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import {
  getTechnicalErrorTitle,
  getTechnicalErrorMessage,
} from '../../../shared/labels/errors';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [UserFormComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './add-user.component.html',
  styleUrls: [],
})
export class AddUserComponent implements OnInit {
  public authenticatedUser!: User;

  public initUserToAdd!: User;
  public formMode: string = ADD_FORM_MODE;

  /* Injections */
  public userService: UserService = inject(UserService);
  public router: Router = inject(Router);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* User adding */
  addUser(user: any): void {
    // User creation
    this.userService.createUser(user).then((result: any) => {
      // If user is created
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(
            this.formMode,
          )} ${getUserFormTitle()}`.toUpperCase(),
          `${getUserFormSuccessNotificationMessage(this.formMode)}`,
        );
        // Redirection to users list
        this.router.navigate(['users', 'list']);
      } else {
        /* Technical error notification showing */
        this.notificationService.showErrorNotification(
          `${getTechnicalErrorTitle()}`,
          `${getTechnicalErrorMessage()}`,
        );
      }
    });
  }
}
