import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from '../shared/services/notification.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import {
  getAuthenticationFormTitle,
  getSubmitButtonLabel,
  getErrorNotificationMessage,
} from '../shared/labels/forms/authentication-form';
import {
  getPasswordInputLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
} from '../shared/labels/commons/form-common';
import { getLoginLabel } from '../shared/labels/commons/user-common';
import { User } from '../shared/models/User';
import { UserMapper } from '../shared/mappers/UserMapper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { APP_LANGUAGE_STORAGE_NAME } from '../shared/constants/storage-constants';
import { FRENCH } from '../shared/constants/language-constants';
import {
  ADD_FORM_MODE,
  REQUIRED_ERROR,
} from '../shared/constants/forms-constants';
import { compare } from 'bcrypt-ts';

@Component({
  selector: 'authentication',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ToastrModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: '../shared/styles/forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationComponent implements OnInit {
  /* Form properties */
  public authenticationForm!: FormGroup;
  public authenticationFormTitle: string = '';
  public showPassword: boolean = false;

  /* Form fields identifiers */
  public loginFieldIdentifier: string = 'login';
  public passwordFieldIdentifier: string = 'password';

  /* Form fields labels */
  public loginInputLabel: string = '';
  public passwordInputLabel: string = '';

  /* Buttons properties */
  public submitButtonLabel: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  public userMapper: UserMapper = new UserMapper();

  constructor(
    readonly formBuilder: FormBuilder,
    readonly router: Router,
    readonly userService: UserService,
    readonly notificationService: NotificationService
  ) {
    /* Form fields creation & constraints definition */
    this.authenticationForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // App default language definition
    sessionStorage.setItem(APP_LANGUAGE_STORAGE_NAME, FRENCH);

    /* Form title, fields and buttons initialization */
    this.authenticationFormTitle = getAuthenticationFormTitle();
    this.loginInputLabel = getLoginLabel();
    this.passwordInputLabel = getPasswordInputLabel();
    this.submitButtonLabel = getSubmitButtonLabel();
    this.resetButtonLabel = getResetButtonLabel(ADD_FORM_MODE);
    this.resetButtonIcon = getResetButtonIcon(ADD_FORM_MODE);
    this.resetButtonType = getResetButtonType(ADD_FORM_MODE);
  }

  /* Password showing toggle listener */
  showPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  /* Password field validation */
  isPasswordFieldValid(): boolean {
    return (
      (this.authenticationForm.get(this.passwordFieldIdentifier)?.invalid &&
        (this.authenticationForm.get(this.passwordFieldIdentifier)?.dirty ||
          this.authenticationForm.get(this.passwordFieldIdentifier)
            ?.touched)) ??
      true
    );
  }

  /* Login field error message(s) display */
  displayLoginErrorMessage(): string {
    if (
      this.authenticationForm
        .get(this.loginFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    }
    return '';
  }

  /* Password field error message(s) display */
  displayPasswordErrorMessage(): string {
    if (
      this.authenticationForm
        .get(this.passwordFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitAuthenticationForm(): void {
    // User verification
    this.userService
      .authenticateUser(this.authenticationForm.value.login)
      .then((userFound: any) => {
        // If user exists
        if (userFound) {
          // Password comparison
          compare(
            this.authenticationForm.value.password,
            userFound.userPassword
          ).then((isValid: any) => {
            // If password is valid
            if (isValid) {
              // User mapping
              const user: User = this.userMapper.userFromDB(userFound);
              // Session opening
              this.userService.connectUser(user);
              // Redirection to home page
            } else {
              // Error notification showing
              this.getErrorNotification();
            }
          });
        } else {
          // Error notification showing
          this.getErrorNotification();
        }
      });
  }

  /* Error notification throwing */
  private getErrorNotification() {
    this.notificationService.showErrorNotification(
      `${this.authenticationFormTitle.toUpperCase()}`,
      `${getErrorNotificationMessage()} !`
    );
  }
}
