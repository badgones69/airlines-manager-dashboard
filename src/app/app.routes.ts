import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { AddUserComponent } from './user/pages/add-user/add-user.component';

export const routes: Routes = [
  /* Authentication form (default route) */
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'authentication', component: AuthenticationComponent },

  // Home page
  { path: 'home', component: HomeComponent },

  /* User pages */
  {
    path: 'users',
    children: [
      { path: 'add', component: AddUserComponent },
    ],
  },
];
