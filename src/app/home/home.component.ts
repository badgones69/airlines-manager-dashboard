import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UnauthorizedComponent } from '../shared/components/unauthorized/unauthorized.component';
import { User } from '../shared/models/User';
import { AirlineService } from '../shared/services/airline.service';
import {
  getAirlineWelcomeMessage,
  getDefaultWelcomeMessage,
} from '../shared/labels/pages/home';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    UnauthorizedComponent,
    NgOptimizedImage,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../app.component.scss'],
})
export class HomeComponent implements OnInit {
  public authenticatedUser!: User;
  public welcomeMessage!: string;
  public welcomeLogo!: string;

  /* Injections */
  public userService: UserService = inject(UserService);
  public airlineService: AirlineService = inject(AirlineService);  

  constructor() {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
        this.airlineService.findAirline().then((airline) => {
          this.welcomeMessage = airline.airlineName
            ? getAirlineWelcomeMessage(airline.airlineName)
            : getDefaultWelcomeMessage();

          this.welcomeLogo = 'src/images/'.concat(
            airline.airlineLogo
              ? `logos/256x256/${airline.airlineLogo}.png`
              : 'favicon.ico',
          );
        });
      }
    });
  }
}
