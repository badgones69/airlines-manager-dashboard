import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { getDownloadTemplateFileInputLabel, getImportFileInputLabel, getImportButtonLabel, getNumberLabel, getImportFileFormatErrorNotificationMessage, getImportFileHeaderErrorNotificationMessage, getImportFileNoDataWarningNotificationMessage } from '../../labels/commons/import-common';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { mapImportFileData } from '../../utils/import-utils';
import { isValidHeader } from '../../imports-validators/commons-validators';
import { IMPORT_FORM_MODE } from '../../constants/forms-constants';

@Component({
  selector: 'import-dialog',
  standalone: true,
  templateUrl: './import-dialog.component.html',
  styleUrls: [
    './import-dialog.component.scss',
    '../../components/dialog/dialog.component.scss',
    '../../styles/forms.scss',
    '../../styles/commons.scss',
  ],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    AsyncPipe,
  ],
})
export class ImportDialogComponent implements OnInit {
  @Input() public origin!: string;
  @Input() public importDialogTitle!: string;
  @Input() public templateFileName!: string;
  @Input() public templateFile!: Blob;
  @Output() public submitted = new EventEmitter();
  
  /* Form properties */
  public templateFileURL!: string;
  public importFileSize$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public importFileData: any[] = [];

  /* Form fields labels */
  public downloadTemplateFileInputLabel!: string;
  public importFileInputLabel!: string;

  // Button label
  public importButtonLabel!: string;

  /* Injections */
  public userService: UserService = inject(UserService);

  constructor(readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    /* Form title, fields and button initialization */
    this.downloadTemplateFileInputLabel = getDownloadTemplateFileInputLabel();
    this.importFileInputLabel = getImportFileInputLabel();
    this.importButtonLabel = getImportButtonLabel();
  }

  /* Template file downloading */
  downloadTemplateFile() {
    this.templateFileURL = URL.createObjectURL(this.templateFile);
  }

  /* Import file checking */
  checkImportFile(event: any): void {
    const fileUploaded: File = event.target.files[0];
    if (fileUploaded.name.endsWith('.txt')) {
      fileUploaded.text().then((result) => {
        let lines: string[] = result.split('\r\n');
        if (!isValidHeader(this.origin, lines.shift())) {
          throw new Error('Invalid file');
        } else {
          this.importFileData = lines;

          if (this.importFileData.length < 1) {
            this.notificationService.showWarningNotification(IMPORT_FORM_MODE, getImportFileNoDataWarningNotificationMessage());
          }
        }
      })
      .catch(() => {
        this.notificationService.showErrorNotification(IMPORT_FORM_MODE, getImportFileHeaderErrorNotificationMessage());
      })
      .finally(() => {
        if (this.importFileData.length > 0) {
          this.importFileSize$.next(`${getNumberLabel(this.origin, this.importFileData.length)}`);
        }
      });
    } else {
      this.notificationService.showErrorNotification(IMPORT_FORM_MODE, getImportFileFormatErrorNotificationMessage());
    }
  }

  /* Form submit */
  submitImportForm() {
    this.submitted.emit(mapImportFileData(this.origin, this.importFileData, this.userService));
  }
}
