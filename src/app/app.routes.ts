import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';

export const routes: Routes = [
  /* Authentication form (default route) */
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'authentication', component: AuthenticationComponent },
];
