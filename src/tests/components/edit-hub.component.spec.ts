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
import { EditHubComponent } from '../../app/hub/pages/edit-hub/edit-hub.component';
import { MockListHubsComponent } from '../mocks/mock-list-hubs-component';
import {
  getHubFormSuccessNotificationMessage,
  getHubFormTitle,
} from '../../app/shared/labels/forms/hub-form';
import { getIATAUniquenessErrorMessage } from '../../app/shared/labels/commons/airport-common';

describe('EditHubComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr({toastComponent: ToastNoAnimation})]
    }).compileComponents();
  });

  @Component({})
  class MockEditHubComponent {
    public authenticatedUser!: User;
    public hubUUID!: string;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
      readonly route: any = {
        snapshot: { paramMap: new Map().set('uuid', 'hub-created-uuid') },
      },
    ) {}
  }

  it('#ngOnInit should initialize "Edit hub" component', async () => {
    TestBed.runInInjectionContext(() => {
      let mockEditHubComponent: MockEditHubComponent =
        new MockEditHubComponent();
      const editHubComponent: EditHubComponent = new EditHubComponent(
        Inject(ActivatedRoute),
        Inject(NotificationService),
      );
      vi.spyOn(editHubComponent, 'ngOnInit').mockImplementation(() => {
        editHubComponent.hubUUID =
          mockEditHubComponent.route.snapshot.paramMap.get('uuid') ?? '';

        mockEditHubComponent.airportService
          .findAirport(editHubComponent.hubUUID)
          .then(async (hubToEdit) => {
            editHubComponent.initHubToEdit =
              editHubComponent.airportMapper.airportFromDB(hubToEdit.data);

            expect(editHubComponent.initHubToEdit).toStrictEqual({
              id: 21,
              uuid: 'hub-created-uuid',
              iata: 'CRE',
              name: 'Airport-Created',
              city: 'Cracovie',
              latitude: 1.5,
              longitude: 5.5,
              country: { id: 155, name: 'Pologne', icao: 'SP', flagCode: 'pl' },
              region: undefined,
              hub: true,
            });
          });

        mockEditHubComponent.userService.user.subscribe((user) => {
          if (user) {
            editHubComponent.authenticatedUser = JSON.parse(user.toString());
          }
        });
      });
      editHubComponent.ngOnInit();

      expect(editHubComponent.hubUUID).toStrictEqual('hub-created-uuid');

      expect(editHubComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });
    });
  });

  it('#editHub should update hub in DB', async () => {
    TestBed.configureTestingModule({
      imports: [EditHubComponent],
      providers: [
        provideRouter([
          { path: 'hubs/list', component: MockListHubsComponent },
        ]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      const hubToUpdate: any = {
        airportID: 21,
        airportUUID: 'hub-created-uuid',
        airportIATA: 'UPD',
        airportName: 'Airport-Updated',
        airportCity: 'Varsovie',
        airportLatitude: 1.5,
        airportLongitude: 5.5,
        airportCountry: 155,
        airportHub: true,
      };

      let mockEditHubComponent: MockEditHubComponent =
        new MockEditHubComponent();
      const editHubComponent: EditHubComponent = new EditHubComponent(
        Inject(ActivatedRoute),
        Inject(NotificationService),
      );
      vi.spyOn(editHubComponent, 'editHub').mockImplementation(() => {
        mockEditHubComponent.airportService
          .updateAirport(hubToUpdate)
          .then(async (result) => {
            if (result.data) {
              expect(result.data).toStrictEqual({
                airportID: 21,
                airportUUID: 'hub-created-uuid',
                airportIATA: 'UPD',
                airportName: 'Airport-Updated',
                airportCity: 'Varsovie',
                airportLatitude: 1.5,
                airportLongitude: 5.5,
                airportCountry: 155,
                airportHub: true,
              });

              const toastrSuccess: any =
                mockEditHubComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(editHubComponent.formMode)} ${getHubFormTitle()}`.toUpperCase(),
                  `${getHubFormSuccessNotificationMessage(editHubComponent.formMode)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual(
                "MODIFICATION D'UN HUB",
              );
              expect(toastrSuccess.message).toStrictEqual(
                'Votre hub a bien été modifié(e) !',
              );

              await harness.navigateByUrl('/hubs/list');
              expect(harness.routeNativeElement?.textContent).toBe('List hubs');
            } else if (result.status === 409) {
              const toastrError: any =
                mockEditHubComponent.notificationService.showErrorNotification(
                  `${getFormModeLabel(editHubComponent.formMode)} ${getHubFormTitle()}`.toUpperCase(),
                  `${getIATAUniquenessErrorMessage()}`,
                );
              expect(toastrError.toastId).toStrictEqual(1);
              expect(toastrError.title).toStrictEqual("MODIFICATION D'UN HUB");
              expect(toastrError.message).toStrictEqual(
                'Code IATA déjà lié à un autre aéroport existant !',
              );
            } else {
              const toastrError: any =
                mockEditHubComponent.notificationService.showErrorNotification(
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
      editHubComponent.editHub(hubToUpdate);
    });
  });
});
