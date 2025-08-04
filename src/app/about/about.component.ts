import { Component } from '@angular/core';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import packageJson from '../../../package.json';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { INFO_DIALOG_MODE } from '../shared/constants/dialogs-constants';
import { getAppReleaseDate } from '../shared/labels/commons/commons';

@Component({
  selector: 'about',
  imports: [DialogComponent, MatTableModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  public aboutDialogTitle!: string;
  public aboutDialogMode!: string;
  public releaseDate!: string;

  public packageJson = packageJson;

  public columnsIdentifiers: string[] = [
    'toolLeftName',
    'toolLeftVersion',
    'toolRightName',
    'toolRightVersion',
  ];
  public externalToolsList: MatTableDataSource<any> = new MatTableDataSource();

  constructor() {}

  ngOnInit(): void {
    this.aboutDialogTitle = `${packageJson.productName} - À propos`;
    this.aboutDialogMode = INFO_DIALOG_MODE;
    this.releaseDate = getAppReleaseDate();

    /* Server & Database libraries */
    this.externalToolsList.data.push({
      toolLeft: { name: 'Vercel', version: packageJson.vercel },
      toolRight: {
        name: 'Supabase-JS',
        version: packageJson.dependencies['@supabase/supabase-js'].replace(
          '^',
          ''
        ),
      },
    });

    /* Angular libraries */
    this.externalToolsList.data.push({
      toolLeft: {
        name: 'Angular',
        version: packageJson.dependencies['@angular/core'].replace('^', ''),
      },
      toolRight: {
        name: 'NGx Toastr',
        version: packageJson.dependencies['ngx-toastr'].replace('^', ''),
      },
    });

    /* Tests libraries */
    this.externalToolsList.data.push({
      toolLeft: {
        name: 'Jasmine',
        version: packageJson.devDependencies['jasmine-core'].replace('^', ''),
      },
      toolRight: {
        name: 'Karma',
        version: packageJson.devDependencies['karma'].replace('^', ''),
      },
    });

    /* Security libraries */
    this.externalToolsList.data.push({
      toolLeft: {
        name: 'UUID',
        version: packageJson.dependencies['uuid'].replace('^', ''),
      },
      toolRight: {
        name: 'Bcrypt-TS',
        version: packageJson.dependencies['bcrypt-ts'].replace('^', ''),
      },
    });

    /* Charts & Flags libraries */
    this.externalToolsList.data.push({
      toolLeft: {
        name: 'Chart.js',
        version: packageJson.dependencies['chart.js'].replace('^', ''),
      },
      toolRight: {
        name: 'Flag Icons',
        version: packageJson.dependencies['flag-icons'].replace('^', ''),
      },
    });
  }
}
