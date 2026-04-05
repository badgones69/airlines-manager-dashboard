import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';
import { getDestinationsListTitle } from '../../../shared/labels/lists';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { ListAirportsComponent } from '../../../shared/components/list-airports/list-airports.component';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';

@Component({
  selector: 'list-destinations',
  standalone: true,
  imports: [ListAirportsComponent, ForbiddenComponent, UnauthorizedComponent],
  templateUrl: './list-destinations.component.html',
  styleUrls: [],
})
export class ListDestinationsComponent implements OnInit {
  public authenticatedUser!: User;

  /* List properties */
  public destinationsListTitle!: string;

  /* Injections */
  public userService: UserService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    this.destinationsListTitle = getDestinationsListTitle();

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }
}
