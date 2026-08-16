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
import { EditHubComponent } from './hub/pages/edit-hub/edit-hub.component';
import { AddDestinationComponent } from './destination/pages/add-destination/add-destination.component';
import { ListDestinationsComponent } from './destination/pages/list-destinations/list-destinations.component';
import { EditDestinationComponent } from './destination/pages/edit-destination/edit-destination.component';
import { AddRouteComponent } from './route/pages/add-route/add-route.component';
import { ListRoutesComponent } from './route/pages/list-routes/list-routes.component';
import { EditRouteComponent } from './route/pages/edit-route/edit-route.component';
import { RoutesNetworkComponent } from './route/pages/network/network.component';
import { AddAircraftComponent } from './aircraft/pages/add-aircraft/add-aircraft.component';
import { ListAircraftsComponent } from './aircraft/pages/list-aircrafts/list-aircrafts.component';

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
      { path: 'edit', component: EditUserComponent },
      { path: 'reset-password', component: ResetUserPasswordComponent },
    ],
  },

  /* Hub pages */
  {
    path: 'hubs',
    children: [
      { path: 'add', component: AddHubComponent },
      { path: 'list', component: ListHubsComponent },
      { path: 'edit', component: EditHubComponent },
    ],
  },

  /* Destination pages */
  {
    path: 'destinations',
    children: [
      { path: 'add', component: AddDestinationComponent },
      { path: 'list', component: ListDestinationsComponent },
      { path: 'edit', component: EditDestinationComponent },
    ],
  },

  /* Route pages */
  {
    path: 'routes',
    children: [
      { path: 'add', component: AddRouteComponent },
      { path: 'list', component: ListRoutesComponent },
      { path: 'edit', component: EditRouteComponent },
      { path: 'network', component: RoutesNetworkComponent },
    ],
  },
  
  /* Aircraft pages */
  {
    path: 'aircrafts',
    children: [
      { path: 'add', component: AddAircraftComponent },
      { path: 'list', component: ListAircraftsComponent },
    ],
  },
];
