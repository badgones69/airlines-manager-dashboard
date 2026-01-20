import { Component, OnInit } from '@angular/core';
import { getForbiddenMessage } from '../../labels/errors';
import { Router } from '@angular/router';
import { getHomeLabel } from '../../labels/commons/commons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'forbidden',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './forbidden.component.html',
  styleUrls: ['../../styles/errors.scss', '../../../app.component.scss'],
})
export class ForbiddenComponent implements OnInit {
  public message: string = '';
  public redirectionButtonLabel: string = '';

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.message = getForbiddenMessage();
    this.redirectionButtonLabel = getHomeLabel();
  }

  /* Home page redirecting */
  goToHome(): void {
    this.router.navigate(['home']);
  }
}
