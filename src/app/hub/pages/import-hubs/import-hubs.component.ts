import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AirportService } from '../../../shared/services/airport.service';
import { IMPORT_FORM_MODE, IMPORT_HUBS } from '../../../shared/constants/forms-constants';
import { ImportAirportsComponent } from '../../../shared/components/import-airports/import-airports.component';
import { getImportHubsFormSuccessNotificationMessage, getImportHubsFormTitle } from '../../../shared/labels/dialogs/import-hubs-dialog';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';

@Component({
  selector: 'import-hubs',
  standalone: true,
  imports: [ImportAirportsComponent],
  templateUrl: './import-hubs.component.html',
  styleUrls: [],
})
export class ImportHubsComponent implements OnInit {
  public origin: string = IMPORT_HUBS;
  public hubsImportDialogTitle!: string;
  public hubsImportTemplateFileName!: string;

  public airportMapper: AirportMapper = new AirportMapper();

  /* Injections */
  public airportService: AirportService = inject(AirportService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.hubsImportDialogTitle = `${getFormModeLabel(
      IMPORT_FORM_MODE,
    )} ${getImportHubsFormTitle()}`;
    this.hubsImportTemplateFileName = 'import_hubs_template.txt'
  }

  /* Hubs importing */
  importHubs(hubs: any[]): void {
    // Hubs import
    this.airportService.importAirports(hubs).then((result: any) => {
      // If hubs are imported
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          this.hubsImportDialogTitle.toUpperCase(),
          `${getImportHubsFormSuccessNotificationMessage()}`,
        );
      }
    });
  }
}
