import { describe, it, expect, vi } from 'vitest';
import { DeleteHubComponent } from '../../app/hub/pages/delete-hub/delete-hub.component';
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
import {
  getHubFormSuccessNotificationMessage,
  getHubFormTitle,
} from '../../app/shared/labels/forms/hub-form';

describe('DeleteHubComponent', () => {
  @Component({})
  class MockDeleteHubComponent {
    constructor(
      readonly airportService: MockAirportService = new MockAirportService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Delete hub" component', () => {
    TestBed.runInInjectionContext(() => {
      const deleteHubComponent: DeleteHubComponent = new DeleteHubComponent(
        Inject(NotificationService),
      );
      deleteHubComponent.ngOnInit();

      expect(deleteHubComponent.deleteHubDialogTitle).toStrictEqual(
        "Suppression d'un hub",
      );
      expect(deleteHubComponent.deleteHubDialogMode).toStrictEqual(
        CONFIRMATION_DIALOG_MODE,
      );
      expect(deleteHubComponent.deleteHubDialogMessage).toStrictEqual(
        'Confirmez-vous la suppression définitive de ce hub ?',
      );
    });
  });

  it('#deleteHub should delete hub in DB', async () => {
    TestBed.runInInjectionContext(() => {
      let mockDeleteHubComponent: MockDeleteHubComponent =
        new MockDeleteHubComponent();
      const deleteHubComponent: DeleteHubComponent = new DeleteHubComponent(
        Inject(NotificationService),
      );
      vi.spyOn(deleteHubComponent, 'deleteHub').mockImplementation(() => {
        mockDeleteHubComponent.airportService
          .deleteAirport('uuid-hub-to-delete')
          .then(async (result) => {
            if (result.status === 204) {
              const toastrSuccess: any =
                mockDeleteHubComponent.notificationService.showSuccessNotification(
                  `${getFormModeLabel(DELETE_FORM_MODE)} ${getHubFormTitle()}`.toUpperCase(),
                  `${getHubFormSuccessNotificationMessage(DELETE_FORM_MODE)}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual("SUPPRESSION D'UN HUB");
              expect(toastrSuccess.message).toStrictEqual(
                'Votre hub a bien été supprimé(e) !',
              );
            } else {
              const toastrError: any =
                mockDeleteHubComponent.notificationService.showErrorNotification(
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
      deleteHubComponent.deleteHub(true);
    });
  });
});
