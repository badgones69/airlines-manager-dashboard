import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Component, Inject } from '@angular/core';
import { User } from '../../app/shared/models/User';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import { provideToastr, ToastNoAnimation, ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { MockAirportService } from '../mocks/mock-airport-service';
import { EditDestinationComponent } from '../../app/destination/pages/edit-destination/edit-destination.component';
import { MockListDestinationsComponent } from '../mocks/mock-list-destinations-component';
import {
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../app/shared/labels/forms/destination-form';
import { getIATAUniquenessErrorMessage } from '../../app/shared/labels/commons/airport-common';

describe('EditDestinationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr({toastComponent: ToastNoAnimation})]
    }).compileComponents();
  });

  @Component({})
  class MockEditDestinationComponent {
    public authenticatedUser!: User;
    public destinationUUID!: string;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
      readonly route: any = {
        snapshot: {
          paramMap: new Map().set('uuid', 'destination-created-uuid'),
        },
      },
    ) {}
  }

  it('#ngOnInit should initialize "Edit destination" component', async () => {
    TestBed.runInInjectionContext(() => {
      let mockEditDestinationComponent: MockEditDestinationComponent =
        new MockEditDestinationComponent();
      const editDestinationComponent: EditDestinationComponent =
        new EditDestinationComponent(
          Inject(ActivatedRoute),
          Inject(NotificationService),
        );
      vi.spyOn(editDestinationComponent, 'ngOnInit').mockImplementation(() => {
        editDestinationComponent.destinationUUID =
          mockEditDestinationComponent.route.snapshot.paramMap.get('uuid') ??
          '';

        mockEditDestinationComponent.airportService
          .findAirport(editDestinationComponent.destinationUUID)
          .then(async (destinationToEdit) => {
            editDestinationComponent.initDestinationToEdit =
              editDestinationComponent.airportMapper.airportFromDB(
                destinationToEdit.data,
              );

            expect(
              editDestinationComponent.initDestinationToEdit,
            ).toStrictEqual({
              id: 21,
              uuid: 'destination-created-uuid',
              iata: 'CRE',
              name: 'Airport-Created',
              city: 'Cracovie',
              latitude: 1.5,
              longitude: 5.5,
              country: { id: 155, name: 'Pologne', icao: 'SP', flagCode: 'pl' },
              region: undefined,
              hub: false,
            });
          });

        mockEditDestinationComponent.userService.user.subscribe((user) => {
          if (user) {
            editDestinationComponent.authenticatedUser = JSON.parse(
              user.toString(),
            );
          }
        });
      });
      editDestinationComponent.ngOnInit();

      expect(editDestinationComponent.destinationUUID).toStrictEqual(
        'destination-created-uuid',
      );

      expect(editDestinationComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#editDestination should update destination in DB', async () => {
    TestBed.configureTestingModule({
      imports: [EditDestinationComponent],
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
      const destinationToUpdate: any = {
        airportID: 21,
        airportUUID: 'destination-created-uuid',
        airportIATA: 'UPD',
        airportName: 'Airport-Updated',
        airportCity: 'Varsovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: false,
      };

      let mockEditDestinationComponent: MockEditDestinationComponent =
        new MockEditDestinationComponent();
      const editDestinationComponent: EditDestinationComponent =
        new EditDestinationComponent(
          Inject(ActivatedRoute),
          Inject(NotificationService),
        );
      vi.spyOn(editDestinationComponent, 'editDestination').mockImplementation(
        () => {
          mockEditDestinationComponent.airportService
            .updateAirport(destinationToUpdate)
            .then(async (result) => {
              if (result.status === 409) {
                const toastrError: any =
                  mockEditDestinationComponent.notificationService.showErrorNotification(
                    `${getFormModeLabel(editDestinationComponent.formMode)} ${getDestinationFormTitle()}`.toUpperCase(),
                    `${getIATAUniquenessErrorMessage()}`,
                  );
                expect(toastrError.toastId).toStrictEqual(1);
                expect(toastrError.title).toStrictEqual("MODIFICATION D'UNE DESTINATION");
                expect(toastrError.message).toStrictEqual(
                  'Code IATA déjà lié à un autre aéroport existant !',
                );
              } else if (result.status.toString().startsWith('20')) {
                expect(result).toStrictEqual({
                  status: 200,
                  data : {
                    airportID: 21,
                    airportUUID: 'destination-created-uuid',
                    airportIATA: 'UPD',
                    airportName: 'Airport-Updated',
                    airportCity: 'Varsovie',
                    airportLatitude: 1.5,
                    airportLongitude: 5.5,
                    airportCountry: 155,
                    airportHub: false,
                  }
                });

                const toastrSuccess: any =
                  mockEditDestinationComponent.notificationService.showSuccessNotification(
                    `${getFormModeLabel(editDestinationComponent.formMode)} ${getDestinationFormTitle()}`.toUpperCase(),
                    `${getDestinationFormSuccessNotificationMessage(editDestinationComponent.formMode)}`,
                  );
                expect(toastrSuccess.toastId).toStrictEqual(2);
                expect(toastrSuccess.title).toStrictEqual(
                  "MODIFICATION D'UNE DESTINATION",
                );
                expect(toastrSuccess.message).toStrictEqual(
                  'Votre destination a bien été modifié(e) !',
                );

                await harness.navigateByUrl('/destinations/list');
                expect(harness.routeNativeElement?.textContent).toBe(
                  'List destinations',
                );
              } else {
                const toastrError: any =
                  mockEditDestinationComponent.notificationService.showErrorNotification(
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
      editDestinationComponent.editDestination(destinationToUpdate);
    });
  });
});
