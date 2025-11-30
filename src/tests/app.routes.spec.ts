import { describe, it, expect } from 'vitest';
import { routes } from '../app/app.routes';
import { AuthenticationComponent } from '../app/authentication/authentication.component';
import { HomeComponent } from '../app/home/home.component';
import { AirlineComponent } from '../app/airline/airline.component';
import { AddUserComponent } from '../app/user/pages/add-user/add-user.component';
import { ListUsersComponent } from '../app/user/pages/list-users/list-users.component';
import { EditUserComponent } from '../app/user/pages/edit-user/edit-user.component';
import { ResetUserPasswordComponent } from '../app/user/pages/reset-user-password/reset-user-password.component';

describe('App routes', () => {
    
  it('First route should return default route ("authentication")', () => {
    expect(routes[0].path).toStrictEqual('');
    expect(routes[0].redirectTo).toStrictEqual('/authentication');
    expect(routes[0].pathMatch).toStrictEqual('full');
  });

  it('Second route should return "authentication" route', () => {
    expect(routes[1].path).toStrictEqual('authentication');
    expect(routes[1].component).toStrictEqual(AuthenticationComponent);
  });

  it('Third route should return "home" route', () => {
    expect(routes[2].path).toStrictEqual('home');
    expect(routes[2].component).toStrictEqual(HomeComponent);
  });

  it('Fourth route should return "airline" subroutes ("edit")', () => {
    expect(routes[3].path).toStrictEqual('airline');
    expect(routes[3].children?.length).toStrictEqual(1);
    expect(routes[3].children?.[0].path).toStrictEqual('edit');
    expect(routes[3].children?.[0].component).toStrictEqual(AirlineComponent);
  });

  it('Fifth route should return "users" subroutes ("add", "list", "edit", "reset-password")', () => {
    expect(routes[4].path).toStrictEqual('users');
    expect(routes[4].children?.length).toStrictEqual(4);
    expect(routes[4].children?.[0].path).toStrictEqual('add');
    expect(routes[4].children?.[0].component).toStrictEqual(AddUserComponent);
    expect(routes[4].children?.[1].path).toStrictEqual('list');
    expect(routes[4].children?.[1].component).toStrictEqual(ListUsersComponent);
    expect(routes[4].children?.[2].path).toStrictEqual('edit/:uuid');
    expect(routes[4].children?.[2].component).toStrictEqual(EditUserComponent);
    expect(routes[4].children?.[3].path).toStrictEqual('reset-password/:uuid');
    expect(routes[4].children?.[3].component).toStrictEqual(ResetUserPasswordComponent);
  });
});