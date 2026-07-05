import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { EDIT_FORM_MODE } from '../../../shared/constants/forms-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/models/User';
import { UserFormComponent } from '../../form-component/user-form.component';
import { UserMapper } from '../../../shared/mappers/UserMapper';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import {
  getUserFormSuccessNotificationMessage,
  getUserFormTitle,
} from '../../../shared/labels/forms/user-form';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { AuthenticatedUserUneditableComponent } from '../authenticated-user-uneditable/authenticated-user-uneditable.component';

@Component({
  selector: 'edit-user',
  standalone: true,
  imports: [
    UserFormComponent,
    ForbiddenComponent,
    UnauthorizedComponent,
    AuthenticatedUserUneditableComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: [],
})
export class EditUserComponent implements OnInit {
  public authenticatedUser!: User;

  public initUserToEdit!: User;
  public formMode: string = EDIT_FORM_MODE;

  public userMapper: UserMapper = new UserMapper();

  /* Injections */
  public userService: UserService = inject(UserService);
  public router: Router = inject(Router);
  public route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    readonly notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    if (history.state.user) {
      this.initUserToEdit = JSON.parse(history.state.user);
    }

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* User editing */
  editUser(user: any): void {
    user.userUUID = this.initUserToEdit.uuid;
    // User updating
    this.userService.updateUser(user).then((result: any) => {
      // If user is updated
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          `${getFormModeLabel(this.formMode)} ${getUserFormTitle()}`,
          `${getUserFormSuccessNotificationMessage(this.formMode)}`,
        );
        // Redirection to users list
        this.router.navigate(['users', 'list']);
      }
    });
  }
}
