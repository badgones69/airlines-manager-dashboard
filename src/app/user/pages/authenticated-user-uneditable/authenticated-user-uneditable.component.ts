import { Component, OnInit } from '@angular/core';
import { getAuthenticatedUserUneditableMessage } from '../../../shared/labels/errors';
import { getUsersListTitle } from '../../../shared/labels/lists';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'authenticated-user-uneditable',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './authenticated-user-uneditable.component.html',
  styleUrls: [
    '../../../shared/styles/errors.scss',
    '../../../app.component.scss',
  ],
})
export class AuthenticatedUserUneditableComponent implements OnInit {
  public message: string = '';
  public redirectionButtonLabel: string = '';

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.message = getAuthenticatedUserUneditableMessage();
    this.redirectionButtonLabel = getUsersListTitle();
  }

  /* Users list redirecting */
  goToUsersList(): void {
    this.router.navigate(['users', 'list']);
  }
}
