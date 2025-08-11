import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

export const routes: Routes = [
  /* Authentication form (default route) */
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },
  { path: 'authentication', component: AuthenticationComponent },

  // Home page
  { path: 'home', component: HomeComponent },

  // Unauthorized error page
  { path: 'unauthorized', component: UnauthorizedComponent },
];
