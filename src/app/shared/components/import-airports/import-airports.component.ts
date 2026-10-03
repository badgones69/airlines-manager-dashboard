import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { isValidAirportsList } from '../../imports-validators/airports-import-validators';
import { AirportMapper } from '../../mappers/AirportMapper';
import { getImportFileDataErrorNotificationMessage } from '../../labels/commons/import-common';
import { getAirportsImportTemplateFile } from '../../labels/commons/airport-common';

@Component({
  selector: 'import-airports',
  standalone: true,
  imports: [ImportDialogComponent],
  templateUrl: './import-airports.component.html',
  styleUrls: [],
})
export class ImportAirportsComponent implements OnInit {
  @Input() public origin!: string;
  @Input() public importDialogTitle!: string;
  @Input() public importTemplateFileName!: string;
  @Output() public submitted = new EventEmitter();
  public airportsImportTemplateFile!: Blob;

  public airportMapper: AirportMapper = new AirportMapper();

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.airportsImportTemplateFile = new Blob([`${getAirportsImportTemplateFile()}`], { type: 'text/plain;charset=utf-8,' });
  }

  /* Airports importing */
  importAirports(airports: any[]): void {
    if (isValidAirportsList(airports)) {
      this.submitted.emit(this.airportMapper.airportsListToDB(airports));
    } else {
      /* Import file data error notification showing */
      this.notificationService.showErrorNotification(
        this.importDialogTitle.toUpperCase(),
        `${getImportFileDataErrorNotificationMessage()}`,
      );
    }
  }
}
