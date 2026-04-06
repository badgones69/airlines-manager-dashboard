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
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';
import { Airport } from '../../../shared/models/Airport';
import { Router } from '@angular/router';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  public router: Router = inject(Router);

  constructor(readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.destinationsListTitle = getDestinationsListTitle();

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Destination form (edit mode) opening */
  openDestinationForm(destination: Airport) {
    this.router.navigate(['destinations', 'edit', destination.uuid]);
  }

  /* Destination deletion confirmation dialog opening */
  deleteDestination(destination: Airport) {
    let dialogRef: MatDialogRef<DeleteDestinationComponent> = this.dialog.open(
      DeleteDestinationComponent,
      {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );
    dialogRef.componentInstance.destinationUUID = destination.uuid!;
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }
}
