import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { RouteService } from '../../../shared/services/route.service';
import {
  IMPORT_FORM_MODE,
  IMPORT_ROUTES,
} from '../../../shared/constants/forms-constants';
import { ImportDialogComponent } from '../../../shared/components/import-dialog/import-dialog.component';
import {
  getImportRoutesFormSuccessNotificationMessage,
  getImportRoutesFormTitle,
  getRoutesImportTemplateFile,
} from '../../../shared/labels/dialogs/import-routes-dialog';
import { getFormModeLabel } from '../../../shared/labels/commons/form-common';
import { isValidRoutesList } from '../../../shared/imports-validators/routes-import-validators';
import { RouteMapper } from '../../../shared/mappers/RouteMapper';
import { getImportFileDataErrorNotificationMessage } from '../../../shared/labels/commons/import-common';
import { AirportService } from '../../../shared/services/airport.service';

@Component({
  selector: 'import-routes',
  standalone: true,
  imports: [ImportDialogComponent],
  templateUrl: './import-routes.component.html',
  styleUrls: [],
})
export class ImportRoutesComponent implements OnInit {
  public origin: string = IMPORT_ROUTES;
  public routesImportDialogTitle!: string;
  public routesImportTemplateFileName!: string;
  public routesImportTemplateFile!: Blob;

  public routeMapper: RouteMapper = new RouteMapper();

  /* Injections */
  public routeService: RouteService = inject(RouteService);
  public airportService: AirportService = inject(AirportService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.routesImportDialogTitle = `${getFormModeLabel(
      IMPORT_FORM_MODE,
    )} ${getImportRoutesFormTitle()}`;
    this.routesImportTemplateFileName = 'import_routes_template.txt';
    this.routesImportTemplateFile = new Blob(
      [`${getRoutesImportTemplateFile()}`],
      { type: 'text/plain;charset=utf-8,' },
    );
  }

  /* Routes importing */
  importRoutes(routes: any[]): void {
    isValidRoutesList(routes, this.airportService).then((isValid: boolean) => {
      if (isValid) {
        const routesListToDB: any[] = this.routeMapper.routesListToDB(routes);

        // Routes import
        this.routeService.importRoutes(routesListToDB).then((result: any) => {
          // If routes are imported
          if (result) {
            /* Success notification showing */
            this.notificationService.showSuccessNotification(
              this.routesImportDialogTitle.toUpperCase(),
              `${getImportRoutesFormSuccessNotificationMessage()}`,
            );
          }
        });
      } else {
        /* Import file data error notification showing */
        this.notificationService.showErrorNotification(
          this.routesImportDialogTitle.toUpperCase(),
          `${getImportFileDataErrorNotificationMessage()}`,
        );
      }
    });
  }
}
