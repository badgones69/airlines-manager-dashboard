import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../shared/models/User';
import { UserService } from '../../../shared/services/user.service';
import { getHubsListTitle } from '../../../shared/labels/lists';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteHubComponent } from '../delete-hub/delete-hub.component';
import { Airport } from '../../../shared/models/Airport';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ListAirportsComponent } from '../../../shared/components/list-airports/list-airports.component';

@Component({
  selector: 'list-hubs',
  standalone: true,
  imports: [ListAirportsComponent, UnauthorizedComponent],
  templateUrl: './list-hubs.component.html',
  styleUrls: [],
})
export class ListHubsComponent implements OnInit {
  public authenticatedUser!: User;

  /* List properties */
  public hubsListTitle!: string;

  /* Injections */
  public userService: UserService = inject(UserService);
  public router: Router = inject(Router);

  constructor(readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.hubsListTitle = getHubsListTitle();

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });
  }

  /* Hub form (edit mode) opening */
  openHubForm(hub: Airport) {
    this.router.navigate(['hubs', 'edit'], {
      state: { hub: JSON.stringify(hub) },
    });
  }

  /* Hub deletion confirmation dialog opening */
  deleteHub(hub: Airport) {
    let dialogRef: MatDialogRef<DeleteHubComponent> = this.dialog.open(
      DeleteHubComponent,
      {
        disableClose: false,
        autoFocus: true,
        scrollStrategy: new NoopScrollStrategy(),
      },
    );
    dialogRef.componentInstance.hubUUID = hub.uuid!;
    dialogRef.afterClosed().subscribe(() => this.ngOnInit());
  }
}
