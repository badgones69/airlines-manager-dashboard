import { describe, it, expect, vi } from 'vitest';
import { AuthenticatedUserUneditableComponent } from '../../app/user/pages/authenticated-user-uneditable/authenticated-user-uneditable.component';
import { MockListUsersComponent } from '../mocks/mock-list-users-component';
import { provideRouter, Router } from '@angular/router';
import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

describe('AuthenticatedUserUneditableComponent', () => {

  it('#ngOnInit should initialize "AuthenticatedUserUneditable" component', () => {
    TestBed.runInInjectionContext(() => {
      const authenticatedUserUneditableComponent: AuthenticatedUserUneditableComponent = new AuthenticatedUserUneditableComponent(Inject(Router));
      authenticatedUserUneditableComponent.ngOnInit();
      expect(authenticatedUserUneditableComponent.message).toStrictEqual('Aucune action possible sur l\'utilisateur connecté !');
      expect(authenticatedUserUneditableComponent.redirectionButtonLabel).toStrictEqual('Liste des utilisateurs');
    });
  });

  it('#goToHome should redirect to "ListUsers" component', async () => {
    TestBed.configureTestingModule({
      imports: [AuthenticatedUserUneditableComponent],
      providers: [
        provideRouter([
          { path: 'users/list', component: MockListUsersComponent }
        ])
      ]
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    const authenticatedUserUneditableComponent: AuthenticatedUserUneditableComponent = new AuthenticatedUserUneditableComponent(Inject(Router));
    await harness.navigateByUrl('/users/list');
    const spy = vi.spyOn(authenticatedUserUneditableComponent, 'goToUsersList').mockImplementation(() => harness.routeNativeElement?.textContent);
    authenticatedUserUneditableComponent.goToUsersList();
    expect(spy).toHaveBeenCalled();
    expect(authenticatedUserUneditableComponent.goToUsersList()).toBe('List users');
  });
});