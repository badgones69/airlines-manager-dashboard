import { Component, OnInit } from '@angular/core';
import { getUnauthorizedMessage } from '../../labels/errors';
import { MatButtonModule } from '@angular/material/button';
import { getAuthenticationFormTitle } from '../../labels/forms/authentication-form';
import { Router } from '@angular/router';

@Component({
  selector: 'unauthorized',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['../../styles/errors.scss', '../../../app.component.scss'],
})
export class UnauthorizedComponent implements OnInit {
  public message: string = '';
  public redirectionButtonLabel: string = '';

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.message = getUnauthorizedMessage();
    this.redirectionButtonLabel = getAuthenticationFormTitle();
  }

  /* Authentication form redirecting */
  goToAuthenticationForm(): void {
    this.router.navigate(['authentication']);
  }
}
