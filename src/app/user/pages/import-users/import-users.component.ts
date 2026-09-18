import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';
import { IMPORT_FORM_MODE, IMPORT_USERS } from '../../../shared/constants/forms-constants';
import { ImportDialogComponent } from '../../../shared/components/import-dialog/import-dialog.component';
import { getImportUsersFormSuccessNotificationMessage, getImportUsersFormTitle, getUsersImportTemplateFile } from '../../../shared/labels/dialogs/import-users-dialog';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { isValidUsersList } from '../../../shared/imports-validators/users-import-validators';
import { UserMapper } from '../../../shared/mappers/UserMapper';
import { getImportFileDataErrorNotificationMessage } from '../../../shared/labels/commons/import-common';

@Component({
  selector: 'import-users',
  standalone: true,
  imports: [ImportDialogComponent],
  templateUrl: './import-users.component.html',
  styleUrls: [],
})
export class ImportUsersComponent implements OnInit {
  public origin: string = IMPORT_USERS;
  public usersImportDialogTitle!: string;
  public usersImportTemplateFileName!: string;
  public usersImportTemplateFile!: Blob;

  public userMapper: UserMapper = new UserMapper();

  /* Injections */
  public userService: UserService = inject(UserService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.usersImportDialogTitle = `${getFormModeLabel(
      IMPORT_FORM_MODE,
    )} ${getImportUsersFormTitle()}`;
    this.usersImportTemplateFileName = 'import_users_template.txt'
    this.usersImportTemplateFile = new Blob([`${getUsersImportTemplateFile()}`], { type: 'text/plain;charset=utf-8,' });
  }

  /* Users importing */
  importUsers(users: any[]): void {
    if (isValidUsersList(users)) {
      const usersLitToDB: any[] = this.userMapper.usersListToDB(users);

      // Users import
      this.userService.importUsers(usersLitToDB).then((result: any) => {
        // If users are imported
        if (result) {
          /* Success notification showing */
          this.notificationService.showSuccessNotification(
            this.usersImportDialogTitle.toUpperCase(),
            `${getImportUsersFormSuccessNotificationMessage()}`,
          );
        }
      });
    } else {
      /* Import file data error notification showing */
      this.notificationService.showErrorNotification(
        this.usersImportDialogTitle.toUpperCase(),
        `${getImportFileDataErrorNotificationMessage()}`,
      );
    }
  }
}
