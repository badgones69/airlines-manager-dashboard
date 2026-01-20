import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import packageJson from '../../../package.json';
import { INFO_DIALOG_MODE } from '../shared/constants/dialogs-constants';
import { getAppReleaseDate } from '../shared/labels/commons/commons';
import {
  getAboutDialogTitle,
  getServerAndDatabaseLabel,
  getFrameworkAndLanguageLabel,
  getChartsAndMapsLabel,
  getFlagsAndNotificationsLabel,
  getSecurityLabel,
  getTestsLabel,
} from '../shared/labels/dialogs/about-dialog';

@Component({
  selector: 'about',
  imports: [DialogComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  public aboutDialogTitle!: string;
  public aboutDialogMode!: string;
  public releaseDate!: string;
  public serverAndDatabaseLabel!: string;
  public frameworkAndLanguageLabel!: string;
  public chartsAndMapsLabel!: string;
  public flagsAndNotificationsLabel!: string;
  public securityLabel!: string;
  public testsLabel!: string;

  public packageJson = packageJson;

  constructor() {}

  ngOnInit(): void {
    this.aboutDialogTitle = `${packageJson.productName} - ${getAboutDialogTitle()}`;
    this.aboutDialogMode = INFO_DIALOG_MODE;
    this.releaseDate = getAppReleaseDate();
    this.serverAndDatabaseLabel = getServerAndDatabaseLabel();
    this.frameworkAndLanguageLabel = getFrameworkAndLanguageLabel();
    this.chartsAndMapsLabel = getChartsAndMapsLabel();
    this.flagsAndNotificationsLabel = getFlagsAndNotificationsLabel();
    this.securityLabel = getSecurityLabel();
    this.testsLabel = getTestsLabel();
  }
}
