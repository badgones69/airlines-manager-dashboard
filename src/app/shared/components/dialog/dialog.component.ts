import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { getDialogButtonLabel } from '../../labels/commons/dialog-common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  CANCEL_DIALOG_BUTTON_TYPE,
  CONFIRMATION_DIALOG_MODE,
  OK_DIALOG_BUTTON_TYPE,
} from '../../constants/dialogs-constants';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent implements OnInit {
  @Input() public dialogMode!: string;
  @Input() public dialogTitle!: string;
  @Input() public dialogMessage!: string;
  @Output() public submitted = new EventEmitter();

  public isConfirmationDialog!: boolean;

  /* Dialog buttons labels */
  public okLabel!: string;
  public cancelLabel!: string;

  constructor() {}

  ngOnInit(): void {
    this.isConfirmationDialog = this.dialogMode === CONFIRMATION_DIALOG_MODE;

    /* Dialog buttons labels initialization */
    this.okLabel = getDialogButtonLabel(
      OK_DIALOG_BUTTON_TYPE,
      this.isConfirmationDialog
    );
    this.cancelLabel = getDialogButtonLabel(
      CANCEL_DIALOG_BUTTON_TYPE,
      this.isConfirmationDialog
    );
  }

  confirm(): void {
    this.submitted.emit(true);
  }
}
