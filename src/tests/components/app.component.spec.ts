import { Component, Inject } from '@angular/core';
import { User } from '../../app/shared/models/User';
import { describe, it, vi, expect } from 'vitest';
import { MockUserService } from '../mocks/mock-user-service';
import { AppComponent } from '../../app/app.component';
import { provideRouter } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { AboutComponent } from '../../app/about/about.component';
import { ComponentType, NoopScrollStrategy } from '@angular/cdk/overlay';
import { MockAuthenticationComponent } from '../mocks/mock-authentication-component';

describe('AppComponent', () => {
  @Component({})
  class MockAppComponent {
    public authenticatedUser!: User;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
    ) {}

    openAboutDialog(): void {
      this.open(AboutComponent, {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      });
    }

    open(
      component: ComponentType<AboutComponent>,
      config: MatDialogConfig<any>,
    ): void {
      // MatDialog open() method overrinding
    }
  }

  it('#ngOnInit should initialize "App" component', () => {
    TestBed.runInInjectionContext(() => {
      let mockAppComponent: MockAppComponent = new MockAppComponent();
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      vi.spyOn(appComponent, 'ngOnInit').mockImplementation(() => {
        mockAppComponent.userService.user.subscribe((user) => {
          if (user) {
            appComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
      });
      appComponent.ngOnInit();

      expect(appComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#menuToggle should open menu and close it with all submenus', () => {
    TestBed.runInInjectionContext(() => {
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      appComponent.menuToggle();
      expect(appComponent.menuOpened).toBeTruthy();
      appComponent.menuToggle();
      expect(appComponent.menuOpened).toBeFalsy();
      expect(appComponent.airlineSubMenuExpanded).toBeFalsy();
      expect(appComponent.userSubMenuExpanded).toBeFalsy();
      expect(appComponent.hubSubMenuExpanded).toBeFalsy();
    });
  });

  it('#airlineSubMenuToggle should open/close "airline" submenu items', () => {
    TestBed.runInInjectionContext(() => {
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      appComponent.airlineSubMenuToggle();
      expect(appComponent.airlineSubMenuExpanded).toBeTruthy();
      appComponent.airlineSubMenuToggle();
      expect(appComponent.airlineSubMenuExpanded).toBeFalsy();
    });
  });

  it('#userSubMenuToggle should open/close "user" submenu items', () => {
    TestBed.runInInjectionContext(() => {
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      appComponent.userSubMenuToggle();
      expect(appComponent.userSubMenuExpanded).toBeTruthy();
      appComponent.userSubMenuToggle();
      expect(appComponent.userSubMenuExpanded).toBeFalsy();
    });
  });

  it('#hubSubMenuToggle should open/close "hub" submenu items', () => {
    TestBed.runInInjectionContext(() => {
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      appComponent.hubSubMenuToggle();
      expect(appComponent.hubSubMenuExpanded).toBeTruthy();
      appComponent.hubSubMenuToggle();
      expect(appComponent.hubSubMenuExpanded).toBeFalsy();
    });
  });

  it('#openAboutDialog should open "About" dialog', () => {
    TestBed.runInInjectionContext(() => {
      const mockAppComponent: MockAppComponent = new MockAppComponent();
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      vi.spyOn(appComponent, 'openAboutDialog').mockImplementation(() => {
        vi.spyOn(mockAppComponent, 'openAboutDialog').mockImplementation(() => {
          expect(mockAppComponent.open).toHaveBeenCalledWith(AboutComponent, {
            disableClose: false,
            autoFocus: true,
            scrollStrategy: new NoopScrollStrategy(),
          });
        });
      });
      appComponent.openAboutDialog();
    });
  });

  it('#logout should disconnect authenticated user', async () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'authentication', component: MockAuthenticationComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      const mockAppComponent: MockAppComponent = new MockAppComponent();
      const appComponent: AppComponent = new AppComponent(Inject(MatDialog));
      vi.spyOn(appComponent, 'logout').mockImplementation(() => {
        mockAppComponent.userService
          .disconnectUser()
          .subscribe(async (user) => {
            expect(user).toStrictEqual({});

            await harness.navigateByUrl('authentication');
            expect(harness.routeNativeElement?.textContent).toBe(
              'Authentication',
            );
          });
      });
      appComponent.logout();
    });
  });
});
