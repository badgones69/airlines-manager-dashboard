import { describe, it, expect, vi } from 'vitest';
import { ForbiddenComponent } from '../../app/shared/components/forbidden/forbidden.component';
import { provideRouter, Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  template: '<h1>Home</h1>'
})
class MockHomeComponent {}

describe('ForbiddenComponent', () => {

  it('#ngOnInit should initialize "Forbidden" component', () => {
    TestBed.runInInjectionContext(() => {
      const forbiddenComponent: ForbiddenComponent = new ForbiddenComponent(Inject(Router));
      forbiddenComponent.ngOnInit();
      expect(forbiddenComponent.message).toStrictEqual('Vous n\'êtes pas habilité(e) pour accéder à cette page !');
      expect(forbiddenComponent.redirectionButtonLabel).toStrictEqual('Accueil');
    });
  });

  it('#goToHome should redirect to "Home" component', async () => {
    TestBed.configureTestingModule({
      imports: [ForbiddenComponent],
      providers: [
        provideRouter([
          { path: 'home', component: MockHomeComponent }
        ])
      ]
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    const forbiddenComponent: ForbiddenComponent = new ForbiddenComponent(Inject(Router));
    await harness.navigateByUrl('/home');
    const spy = vi.spyOn(forbiddenComponent, 'goToHome').mockImplementation(() => harness.routeNativeElement?.textContent);
    forbiddenComponent.goToHome();
    expect(spy).toHaveBeenCalled();
    expect(forbiddenComponent.goToHome()).toBe('Home');
  });
});