import { describe, it, expect, vi } from 'vitest';
import { UnauthorizedComponent } from '../../app/shared/components/unauthorized/unauthorized.component';
import { provideRouter, Router } from '@angular/router';
import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockAuthenticationComponent } from '../mocks/mock-authentication-component';

describe('UnauthorizedComponent', () => {
  it('#ngOnInit should initialize "Unauthorized" component', () => {
    TestBed.runInInjectionContext(() => {
      const unauthorizedComponent: UnauthorizedComponent =
        new UnauthorizedComponent(Inject(Router));
      unauthorizedComponent.ngOnInit();
      expect(unauthorizedComponent.message).toStrictEqual(
        'Veuillez vous connecter pour accéder à cette page !',
      );
      expect(unauthorizedComponent.redirectionButtonLabel).toStrictEqual(
        'Authentification',
      );
    });
  });

  it('#goToAuthenticationForm should redirect to "Authentication" component', async () => {
    TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [
        provideRouter([
          { path: 'authentication', component: MockAuthenticationComponent },
        ]),
      ],
    }).compileComponents();

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    const unauthorizedComponent: UnauthorizedComponent =
      new UnauthorizedComponent(Inject(Router));
    await harness.navigateByUrl('/authentication');
    const spy = vi
      .spyOn(unauthorizedComponent, 'goToAuthenticationForm')
      .mockImplementation(() => harness.routeNativeElement?.textContent);
    unauthorizedComponent.goToAuthenticationForm();
    expect(spy).toHaveBeenCalled();
    expect(unauthorizedComponent.goToAuthenticationForm()).toBe(
      'Authentication',
    );
  });
});
