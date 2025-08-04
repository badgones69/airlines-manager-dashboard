import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AboutComponent } from './about/about.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../styles.scss'],
})
export class AppComponent {
  public menuOpened: boolean = false;

  constructor(readonly dialog: MatDialog) {}

  /* Menu opening */
  menuToggle(): void {
    this.menuOpened = !this.menuOpened;
  }

  /* About dialog opening */
  openAboutDialog(): void {
    this.dialog.open(AboutComponent, {
      disableClose: false,
      autoFocus: true,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }
}
