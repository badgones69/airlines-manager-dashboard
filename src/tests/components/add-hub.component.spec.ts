import { describe, it, expect, vi } from 'vitest';
import { AddHubComponent } from '../../app/hub/pages/add-hub/add-hub.component';
import { Component, Inject } from '@angular/core';
import { MockAirportService } from '../mocks/mock-airport-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockListHubsComponent } from '../mocks/mock-list-hubs-component';
import { MockUserService } from '../mocks/mock-user-service';
import { getHubFormSuccessNotificationMessage, getHubFormTitle } from '../../app/shared/labels/forms/hub-form';

describe('AddHubComponent', () => {
  @Component({})
  class MockAddHubComponent {
    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Add hub" component', () => {
    TestBed.runInInjectionContext(() => {
      let mockAddHubComponent: MockAddHubComponent = new MockAddHubComponent();
      const addHubComponent: AddHubComponent = new AddHubComponent(
        Inject(NotificationService),
      );
      vi.spyOn(addHubComponent, 'ngOnInit').mockImplementation(() => {
        mockAddHubComponent.userService.user.subscribe((user) => {
          if (user) {
            addHubComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
      });
      addHubComponent.ngOnInit();

      expect(addHubComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#addHub should create hub in DB', async () => {
    TestBed.configureTestingModule({
      imports: [AddHubComponent],
      providers: [
        provideRouter([
          { path: 'hubs/list', component: MockListHubsComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      const hubToCreate: any = {
        airportUUID: 'airport-created-uuid',
        airportIATA: 'CRE',
        airportName: 'Airport-Created',
        airportCity: 'Cracovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: true,
      };

      let mockAddHubComponent: MockAddHubComponent = new MockAddHubComponent();
      const addHubComponent: AddHubComponent = new AddHubComponent(
        Inject(NotificationService),
      );
      vi.spyOn(addHubComponent, 'addHub').mockImplementation(() => {
        mockAddHubComponent.airportService
          .createAirport(hubToCreate)
          .then(async (result) => {
            if (result.data) {
              expect(result.data).toStrictEqual({
                airportID: 21,
                airportUUID: 'airport-created-uuid',
                airportIATA: 'CRE',
                airportName: 'Airport-Created',
                airportCity: 'Cracovie',
                airportLatitude: 1.5,
                airportLongitude: 5.5,
                airportCountry: 155,
                airportHub: true,
              });

              const toastrSuccess: any =
                mockAddHubComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(addHubComponent.formMode)} ${getHubFormTitle()}`.toUpperCase(),
                  `${getHubFormSuccessNotificationMessage(addHubComponent.formMode)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual("AJOUT D'UN HUB");
              expect(toastrSuccess.message).toStrictEqual(
                'Votre hub a bien été créé(e) !',
              );

              await harness.navigateByUrl('/hubs/list');
              expect(harness.routeNativeElement?.textContent).toBe('List hubs');
            } else {
              const toastrError: any =
                mockAddHubComponent.notificationService.showErrorNotification(
                  `${getTechnicalErrorTitle()}`,
                  `${getTechnicalErrorMessage()}`,
                );
              expect(toastrError.toastId).toStrictEqual(1);
              expect(toastrError.title).toStrictEqual('ERREUR TECHNIQUE');
              expect(toastrError.message).toStrictEqual(
                'Une erreur est survenue : veuillez réessayer...',
              );
            }
          });
      });
      addHubComponent.addHub(hubToCreate);
    });
  });
});
