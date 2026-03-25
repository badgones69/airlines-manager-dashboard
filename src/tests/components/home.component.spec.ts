import { describe, it, expect, vi } from 'vitest';
import { HomeComponent } from '../../app/home/home.component';
import {
  getAirlineWelcomeMessage,
  getDefaultWelcomeMessage,
} from '../../app/shared/labels/pages/home';
import { MockHomeComponent } from '../mocks/mock-home-component';
import { TestBed } from '@angular/core/testing';

function testAirlineService(
  mockHomeComponent: MockHomeComponent,
  homeComponent: HomeComponent,
): void {
  mockHomeComponent.airlineService.findAirline().then((airline: any) => {
    homeComponent.welcomeMessage =
      getAirlineWelcomeMessage(airline.airlineName) ??
      getDefaultWelcomeMessage();

    homeComponent.welcomeLogo = 'src/images/'.concat(
      airline.airlineLogo
        ? `logos/256x256/${airline.airlineLogo}.png`
        : 'favicon.ico',
    );

    expect(homeComponent.welcomeMessage).toStrictEqual(
      'Bienvenue sur le portail de la compagnie XXX Airlines',
    );
    expect(homeComponent.welcomeLogo).toStrictEqual(
      'src/images/logos/256x256/X_BG-CB_LT-W.png',
    );
  });
}

describe('HomeComponent', () => {
  it('#ngOnInit should initialize "Home" component', () => {
    TestBed.runInInjectionContext(() => {
      let mockHomeComponent: MockHomeComponent = new MockHomeComponent();
      const homeComponent: HomeComponent = new HomeComponent();
      vi.spyOn(homeComponent, 'ngOnInit').mockImplementation(() => {
        mockHomeComponent.userService.user.subscribe((user) => {
          if (user) {
            homeComponent.authenticatedUser = JSON.parse(user.toString());
            testAirlineService(mockHomeComponent, homeComponent);
          }
        });
      });
      homeComponent.ngOnInit();

      expect(homeComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });
});
