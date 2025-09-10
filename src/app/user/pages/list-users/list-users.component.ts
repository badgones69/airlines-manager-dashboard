import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { InternationalPaginator } from '../../../shared/components/international-paginator';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserMapper } from '../../../shared/mappers/UserMapper';
import { Profile } from '../../../shared/models/Profile';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { getUsersListTitle } from '../../../shared/labels/lists';
import {
  getGivenNameLabel,
  getSurnameLabel,
  getLoginLabel,
  getProfileLabel,
  getProfilesValues,
} from '../../../shared/labels/commons/user-common';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { Router, RouterLink } from '@angular/router';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { getPasswordInputLabel } from '../../../shared/labels/commons/form-common';
import { getSubmitButtonLabel } from '../../../shared/labels/forms/reset-user-password-form';

@Component({
  selector: 'list-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatLabel,
    RouterLink,
    ForbiddenComponent,
    UnauthorizedComponent,
  ],
  templateUrl: './list-users.component.html',
  styleUrls: [
    '../../../shared/styles/lists.scss',
    './list-users.component.scss',
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: InternationalPaginator }],
})
export class ListUsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public authenticatedUser!: User;

  /* List properties */
  public usersListTitle!: string;
  public usersList: MatTableDataSource<User> = new MatTableDataSource();

  /* List columns identifiers */
  public columnsIdentifiers: string[] = [
    'profile',
    'givenName',
    'surname',
    'login',
    'passwordReset',
    'actions',
  ];

  /* List columns headers labels */
  public columnsHeaders: string[] = [
    getProfileLabel(),
    getGivenNameLabel(),
    getSurnameLabel(),
    getLoginLabel(),
    getPasswordInputLabel(),
  ];

  // Profiles values
  public profiles: Profile[] = getProfilesValues();

  public passwordResetColumnButtonName = getSubmitButtonLabel();
  public userMapper: UserMapper = new UserMapper();

  constructor(
    readonly userService: UserService,
    readonly router: Router,
    readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.usersListTitle = getUsersListTitle();

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });

    this.userService.users.subscribe((users) => {
      this.usersList.data = this.userMapper.usersListFromDB(users);
    });
  }

  ngAfterViewInit() {
    this.usersList.paginator = this.paginator;
  }

  /* Profile name display */
  displayProfileName(userProfileId: number): string {
    return (
      this.profiles.find((profile) => profile.id === userProfileId)?.name ?? ''
    );
  }

  /* User form (edit mode) opening */
  openUserForm(user: User) {
    this.router.navigate(['users', 'edit', user.uuid]);
  }

  /* User deletion confirmation dialog opening */
  deleteUser(user: User) {
    let dialogRef: MatDialogRef<DeleteUserComponent> = this.dialog.open(
      DeleteUserComponent,
      {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      }
    );
    dialogRef.componentInstance.userUUID = user.uuid!;
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }
}
