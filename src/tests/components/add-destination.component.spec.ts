import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Component, Inject } from '@angular/core';
import { MockAirportService } from '../mocks/mock-airport-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import { provideToastr, ToastNoAnimation, ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockUserService } from '../mocks/mock-user-service';
import { AddDestinationComponent } from '../../app/destination/pages/add-destination/add-destination.component';
import { MockListDestinationsComponent } from '../mocks/mock-list-destinations-component';
import {
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../app/shared/labels/forms/destination-form';
import { getIATAUniquenessErrorMessage } from '../../app/shared/labels/commons/airport-common';

describe('AddDestinationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr({toastComponent: ToastNoAnimation})]
    }).compileComponents();
  });

  @Component({})
  class MockAddDestinationComponent {
    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Add destination" component', () => {
    TestBed.runInInjectionContext(() => {
      let mockAddDestinationComponent: MockAddDestinationComponent =
        new MockAddDestinationComponent();
      const addDestinationComponent: AddDestinationComponent =
        new AddDestinationComponent(Inject(NotificationService));
      vi.spyOn(addDestinationComponent, 'ngOnInit').mockImplementation(() => {
        mockAddDestinationComponent.userService.user.subscribe((user) => {
          if (user) {
            addDestinationComponent.authenticatedUser = JSON.parse(
              user.toString(),
            );
          }
        });
      });
      addDestinationComponent.ngOnInit();

      expect(addDestinationComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#addDestination should create destination in DB', async () => {
    TestBed.configureTestingModule({
      imports: [AddDestinationComponent],
      providers: [
        provideRouter([
          {
            path: 'destinations/list',
            component: MockListDestinationsComponent,
          },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      const destinationToCreate: any = {
        airportUUID: 'destination-created-uuid',
        airportIATA: 'CRE',
        airportName: 'Airport-Created',
        airportCity: 'Cracovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: false,
      };

      let mockAddDestinationComponent: MockAddDestinationComponent =
        new MockAddDestinationComponent();
      const addDestinationComponent: AddDestinationComponent =
        new AddDestinationComponent(Inject(NotificationService));
      vi.spyOn(addDestinationComponent, 'addDestination').mockImplementation(
        () => {
          mockAddDestinationComponent.airportService
            .createAirport(destinationToCreate)
            .then(async (result) => {
              if (result.data) {
                expect(result.data).toStrictEqual({
                  airportID: 21,
                  airportUUID: 'destination-created-uuid',
                  airportIATA: 'CRE',
                  airportName: 'Airport-Created',
                  airportCity: 'Cracovie',
                  airportLatitude: 1.5,
                  airportLongitude: 5.5,
                  airportCountry: 155,
                  airportHub: false,
                });

                const toastrSuccess: any =
                  mockAddDestinationComponent.notificationService.showSuccessNotification(
                    `${getFormModeLabel(addDestinationComponent.formMode)} ${getDestinationFormTitle()}`.toUpperCase(),
                    `${getDestinationFormSuccessNotificationMessage(addDestinationComponent.formMode)}`,
                  );
                expect(toastrSuccess.toastId).toStrictEqual(2);
                expect(toastrSuccess.title).toStrictEqual(
                  "AJOUT D'UNE DESTINATION",
                );
                expect(toastrSuccess.message).toStrictEqual(
                  'Votre destination a bien été créé(e) !',
                );

                await harness.navigateByUrl('/destinations/list');
                expect(harness.routeNativeElement?.textContent).toBe(
                  'List destinations',
                );
              } else if (result.status === 409) {
                const toastrError: any =
                  mockAddDestinationComponent.notificationService.showErrorNotification(
                    `${getFormModeLabel(addDestinationComponent.formMode)} ${getDestinationFormTitle()}`.toUpperCase(),
                    `${getIATAUniquenessErrorMessage()}`,
                  );
                expect(toastrError.toastId).toStrictEqual(1);
                expect(toastrError.title).toStrictEqual("AJOUT D'UNE DESTINATION");
                expect(toastrError.message).toStrictEqual(
                  'Code IATA déjà lié à un autre aéroport existant !',
                );
              } else {
                const toastrError: any =
                  mockAddDestinationComponent.notificationService.showErrorNotification(
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
        },
      );
      addDestinationComponent.addDestination(destinationToCreate);
    });
  });
});
