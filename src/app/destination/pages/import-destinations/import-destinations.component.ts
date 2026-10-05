import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { AirportService } from '../../../shared/services/airport.service';
import { IMPORT_FORM_MODE, IMPORT_DESTINATIONS } from '../../../shared/constants/forms-constants';
import { ImportAirportsComponent } from '../../../shared/components/import-airports/import-airports.component';
import { getImportDestinationsFormSuccessNotificationMessage, getImportDestinationsFormTitle } from '../../../shared/labels/dialogs/import-destinations-dialog';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { AirportMapper } from '../../../shared/mappers/AirportMapper';

@Component({
  selector: 'import-destinations',
  standalone: true,
  imports: [ImportAirportsComponent],
  templateUrl: './import-destinations.component.html',
  styleUrls: [],
})
export class ImportDestinationsComponent implements OnInit {
  public origin: string = IMPORT_DESTINATIONS;
  public destinationsImportDialogTitle!: string;
  public destinationsImportTemplateFileName!: string;

  public airportMapper: AirportMapper = new AirportMapper();

  /* Injections */
  public airportService: AirportService = inject(AirportService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.destinationsImportDialogTitle = `${getFormModeLabel(
      IMPORT_FORM_MODE,
    )} ${getImportDestinationsFormTitle()}`;
    this.destinationsImportTemplateFileName = 'import_destinations_template.txt'
  }

  /* Destinations importing */
  importDestinations(destinations: any[]): void {
    // Destinations import
    this.airportService.importAirports(destinations).then((result: any) => {
      // If destinations are imported
      if (result) {
        /* Success notification showing */
        this.notificationService.showSuccessNotification(
          this.destinationsImportDialogTitle.toUpperCase(),
          `${getImportDestinationsFormSuccessNotificationMessage()}`,
        );
      }
    });
  }
}
