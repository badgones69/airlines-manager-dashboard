import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AboutComponent } from './about/about.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/User';

@Component({
  selector: 'app',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../styles.scss'],
})
export class AppComponent implements OnInit {
  public authenticatedUser!: User | null;

  public menuOpened: boolean = false;
  public airlineSubMenuExpanded: boolean = false;
  public userSubMenuExpanded: boolean = false;

  constructor(
    readonly userService: UserService,
    readonly router: Router,
    readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      } else {
        this.authenticatedUser = null;
      }
    });
  }

  /* Menu opening/closing */
  menuToggle(): void {
    this.menuOpened = !this.menuOpened;

    /* All submenu closing */
    if (!this.menuOpened) {
      this.airlineSubMenuExpanded = false;
      this.userSubMenuExpanded = false;
    }
  }

  /* Airline submenu opening/closing */
  airlineSubMenuToggle(): void {
    this.airlineSubMenuExpanded = !this.airlineSubMenuExpanded;
  }

  /* User submenu opening/closing */
  userSubMenuToggle(): void {
    this.userSubMenuExpanded = !this.userSubMenuExpanded;
  }

  /* About dialog opening */
  openAboutDialog(): void {
    this.dialog.open(AboutComponent, {
      disableClose: false,
      autoFocus: true,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  /* Authenticated user disconnecting */
  logout(): void {
    // Session closing
    this.userService.disconnectUser();
    // Redirection to authentication form
    this.router.navigate(['authentication']);
  }
}
