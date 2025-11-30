import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AirlineService } from '../../shared/services/airline.service';
import { AirlineMapper } from '../../shared/mappers/AirlineMapper';
import { NotificationService } from '../../shared/services/notification.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { getAlphabet } from '../../shared/labels/commons/commons';
import {
  getAirlineLogoBackgroundInputLabel,
  getAirlineLogoDialogTitle,
  getAirlineLogoLetterColorInputLabel,
  getAirlineLogoLetterInputLabel,
  getAirlineLogoPreviewLabel,
  getSelectButtonLabel,
} from '../../shared/labels/dialogs/airline-logo-dialog';

@Component({
  selector: 'airline-logo',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatSelectModule,
    NgOptimizedImage,
  ],
  templateUrl: './airline-logo.component.html',
  styleUrls: [
    '../../shared/components/dialog/dialog.component.scss',
    './airline-logo.component.scss',
  ],
})
export class AirlineLogoComponent implements OnInit {
  @Output() public submitted = new EventEmitter();

  /* Form properties */
  public airlineLogoDialogTitle: string = '';
  public logoBackground!: string;
  public logoLetter!: string;
  public logoLetterColor: string = 'LT-W';
  public logoPreviewImage!: string;

  /* Form fields labels */
  public airlineLogoBackgroundInputLabel: string = '';
  public airlineLogoLetterInputLabel: string = '';
  public airlineLogoLetterColorInputLabel: string = '';
  public airlineLogoPreviewInputLabel: string = '';

  // Logo letter field available values
  public letters: string[] = getAlphabet();

  // Button label
  public selectButtonLabel!: string;

  public airlineMapper: AirlineMapper = new AirlineMapper();

  constructor() {}

  ngOnInit(): void {
    /* Form title, fields and button initialization */
    this.airlineLogoDialogTitle = getAirlineLogoDialogTitle();
    this.airlineLogoBackgroundInputLabel = getAirlineLogoBackgroundInputLabel();
    this.airlineLogoLetterInputLabel = getAirlineLogoLetterInputLabel();
    this.airlineLogoLetterColorInputLabel =
      getAirlineLogoLetterColorInputLabel();
    this.airlineLogoPreviewInputLabel = getAirlineLogoPreviewLabel();
    this.selectButtonLabel = getSelectButtonLabel();
  }

  /* Logo preview image refresh */
  refreshLogoPreviewImage(): void {
    if (this.logoLetter && this.logoBackground && this.logoLetterColor) {
      this.logoPreviewImage = `src/images/logos/128x128/${this.logoLetter}_${this.logoBackground}_${this.logoLetterColor}.png`;
    }
  }

  /* Airline logo editing */
  editAirlineLogo(): void {
    this.submitted.emit(
      `${this.logoLetter}_${this.logoBackground}_${this.logoLetterColor}`
    );
  }
}
