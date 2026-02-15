import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { AirlineComponent } from './airline/airline.component';
import { AddUserComponent } from './user/pages/add-user/add-user.component';
import { ListUsersComponent } from './user/pages/list-users/list-users.component';
import { EditUserComponent } from './user/pages/edit-user/edit-user.component';
import { ResetUserPasswordComponent } from './user/pages/reset-user-password/reset-user-password.component';
import { AddHubComponent } from './hub/pages/add-hub/add-hub.component';
import { ListHubsComponent } from './hub/pages/list-hubs/list-hubs.component';

export const routes: Routes = [
  /* Authentication form (default route) */
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'authentication', component: AuthenticationComponent },

  // Home page
  { path: 'home', component: HomeComponent },

  /* Airline pages */
  {
    path: 'airline',
    children: [{ path: 'edit', component: AirlineComponent }],
  },

  /* User pages */
  {
    path: 'users',
    children: [
      { path: 'add', component: AddUserComponent },
      { path: 'list', component: ListUsersComponent },
      { path: 'edit/:uuid', component: EditUserComponent },
      { path: 'reset-password/:uuid', component: ResetUserPasswordComponent },
    ],
  },

  /* Hub pages */
  {
    path: 'hubs',
    children: [
      { path: 'add', component: AddHubComponent },
      { path: 'list', component: ListHubsComponent },
    ],
  },
];
