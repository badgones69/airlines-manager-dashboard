import { describe, it, expect, vi } from 'vitest';
import { Component, Inject } from '@angular/core';
import { MockAirportService } from '../mocks/mock-airport-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { NotificationService } from '../../app/shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { CONFIRMATION_DIALOG_MODE } from '../../app/shared/constants/dialogs-constants';
import { DELETE_FORM_MODE } from '../../app/shared/constants/forms-constants';
import { TestBed } from '@angular/core/testing';
import { getFormModeLabel } from '../../app/shared/labels/commons/form-common';
import { DeleteDestinationComponent } from '../../app/destination/pages/delete-destination/delete-destination.component';
import {
  getDestinationFormSuccessNotificationMessage,
  getDestinationFormTitle,
} from '../../app/shared/labels/forms/destination-form';

describe('DeleteDestinationComponent', () => {
  @Component({})
  class MockDeleteDestinationComponent {
    constructor(
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Delete destination" component', () => {
    TestBed.runInInjectionContext(() => {
      const deleteDestinationComponent: DeleteDestinationComponent =
        new DeleteDestinationComponent(Inject(NotificationService));
      deleteDestinationComponent.ngOnInit();

      expect(
        deleteDestinationComponent.deleteDestinationDialogTitle,
      ).toStrictEqual("Suppression d'une destination");
      expect(
        deleteDestinationComponent.deleteDestinationDialogMode,
      ).toStrictEqual(CONFIRMATION_DIALOG_MODE);
      expect(
        deleteDestinationComponent.deleteDestinationDialogMessage,
      ).toStrictEqual(
        'Confirmez-vous la suppression définitive de cette destination ?',
      );
    });
  });

  it('#deleteDestination should delete destination in DB', async () => {
    TestBed.runInInjectionContext(() => {
      let mockDeleteDestinationComponent: MockDeleteDestinationComponent =
        new MockDeleteDestinationComponent();
      const deleteDestinationComponent: DeleteDestinationComponent =
        new DeleteDestinationComponent(Inject(NotificationService));
      vi.spyOn(
        deleteDestinationComponent,
        'deleteDestination',
      ).mockImplementation(() => {
        mockDeleteDestinationComponent.airportService
          .deleteAirport('uuid-destination-to-delete')
          .then(async (result) => {
            if (result.status === 204) {
              const toastrSuccess: any =
                mockDeleteDestinationComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(DELETE_FORM_MODE)} ${getDestinationFormTitle()}`.toUpperCase(),
                  `${getDestinationFormSuccessNotificationMessage(DELETE_FORM_MODE)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual(
                "SUPPRESSION D'UNE DESTINATION",
              );
              expect(toastrSuccess.message).toStrictEqual(
                'Votre destination a bien été supprimé(e) !',
              );
            } else {
              const toastrError: any =
                mockDeleteDestinationComponent.notificationService.showErrorNotification(
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
      deleteDestinationComponent.deleteDestination(true);
    });
  });
});
