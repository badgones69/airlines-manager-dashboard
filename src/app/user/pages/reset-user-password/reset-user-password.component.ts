import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../shared/models/User';
import { UserMapper } from '../../../shared/mappers/UserMapper';
import {
  ADD_FORM_MODE,
  REQUIRED_ERROR,
  NOT_IDENTICAL_PASS_WORD_ERROR,
  PASS_WORD_PATTERN,
  PATTERN_ERROR,
} from '../../../shared/constants/forms-constants';
import { notIdenticalPasswordsValidator } from '../../../shared/forms-validators/user-form-validators';
import {
  getPasswordInputLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
} from '../../../shared/labels/commons/form-common';
import {
  getPasswordFieldFormatErrorMessage,
  getRepeatedPasswordFieldFormatErrorMessage,
  getRepeatedPasswordInputLabel,
} from '../../../shared/labels/forms/user-form';
import {
  getGivenNameLabel,
  getLoginLabel,
  getProfileLabel,
  getSurnameLabel,
} from '../../../shared/labels/commons/user-common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  getResetUserPasswordFormSuccessNotificationMessage,
  getResetUserPasswordFormTitle,
  getSubmitButtonLabel,
} from '../../../shared/labels/forms/reset-user-password-form';
import { UserService } from '../../../shared/services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ForbiddenComponent } from '../../../shared/components/forbidden/forbidden.component';
import { UnauthorizedComponent } from '../../../shared/components/unauthorized/unauthorized.component';
import { AuthenticatedUserUneditableComponent } from '../authenticated-user-uneditable/authenticated-user-uneditable.component';
import { getTechnicalErrorTitle, getTechnicalErrorMessage } from '../../../shared/labels/errors';

@Component({
  selector: 'reset-user-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ToastrModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ForbiddenComponent,
    UnauthorizedComponent,
    AuthenticatedUserUneditableComponent,
  ],
  templateUrl: './reset-user-password.component.html',
  styleUrl: '../../../shared/styles/forms.scss',
})
export class ResetUserPasswordComponent implements OnInit {
  public authenticatedUser!: User;

  public userUUID!: string;
  public initUserToResetPassword!: User;

  public userMapper: UserMapper = new UserMapper();

  /* Form properties */
  public resetUserPasswordForm!: FormGroup;
  public resetUserPasswordFormTitle: string = '';
  public showPassword: boolean = false;
  public showRepeatedPassword: boolean = false;

  /* Form fields identifiers */
  public givenNameFieldIdentifier: string = 'givenName';
  public surnameFieldIdentifier: string = 'surname';
  public passwordFieldIdentifier: string = 'passWord';
  public repeatedPasswordFieldIdentifier: string = 'repeatedPassWord';

  /* Form fields labels */
  public givenNameInputLabel: string = '';
  public surnameInputLabel: string = '';
  public loginInputLabel: string = '';
  public passwordInputLabel: string = '';
  public repeatedPasswordInputLabel: string = '';
  public profileInputLabel: string = '';

  /* Buttons labels and icons */
  public submitButtonLabel: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly userService: UserService,
    readonly notificationService: NotificationService,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {
    this.userUUID = this.route.snapshot.paramMap.get('uuid') ?? '';

    /* Form fields creation & constraints definition */
    this.resetUserPasswordForm = this.formBuilder.group(
      {
        givenName: { value: '', disabled: true },
        surname: { value: '', disabled: true },
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(new RegExp(PASS_WORD_PATTERN)),
          ],
        ],
        repeatedPassword: ['', Validators.required],
      },
      {
        validators: [
          notIdenticalPasswordsValidator(
            this.passwordFieldIdentifier,
            this.repeatedPasswordFieldIdentifier
          ),
        ],
        updateOn: 'change',
      }
    );
  }

  ngOnInit(): void {
    this.userService.findUser(this.userUUID).then((userFromDB) => {
      this.initUserToResetPassword = this.userMapper.userFromDB(userFromDB);
      this.resetUserPasswordForm.patchValue({
        givenName: this.initUserToResetPassword?.givenName,
        surname: this.initUserToResetPassword?.surname,
      });
    });

    this.userService.user.subscribe((user) => {
      if (user) {
        this.authenticatedUser = JSON.parse(user.toString());
      }
    });

    /* Form title, fields and buttons initialization */
    this.resetUserPasswordFormTitle = getResetUserPasswordFormTitle(false);
    this.givenNameInputLabel = getGivenNameLabel();
    this.surnameInputLabel = getSurnameLabel();
    this.loginInputLabel = getLoginLabel();
    this.passwordInputLabel = getPasswordInputLabel();
    this.repeatedPasswordInputLabel = getRepeatedPasswordInputLabel();
    this.profileInputLabel = getProfileLabel();
    this.submitButtonLabel = getSubmitButtonLabel();
    this.resetButtonLabel = getResetButtonLabel(ADD_FORM_MODE);
    this.resetButtonIcon = getResetButtonIcon(ADD_FORM_MODE);
    this.resetButtonType = getResetButtonType(ADD_FORM_MODE);
  }

  /* Password showing toggle listener */
  showPasswordToggle() {
    this.showPassword = !this.showPassword;
  }

  /* Repeated password showing toggle listener */
  showRepeatedPasswordToggle() {
    this.showRepeatedPassword = !this.showRepeatedPassword;
  }

  /* Password field validation */
  isPasswordFieldInvalid(): boolean {
    let passwordFormField: any = this.resetUserPasswordForm.get(
      this.passwordFieldIdentifier
    );
    return (
      (passwordFormField?.invalid &&
        (passwordFormField?.dirty || passwordFormField?.touched)) ??
      true
    );
  }

  /* Repeated password field validation */
  isRepeatedPasswordFieldInvalid(): boolean {
    let repeatedPasswordFormField: any = this.resetUserPasswordForm.get(
      this.repeatedPasswordFieldIdentifier
    );

    return (
      ((repeatedPasswordFormField?.invalid ||
        this.resetUserPasswordForm.hasError(NOT_IDENTICAL_PASS_WORD_ERROR)) &&
        (repeatedPasswordFormField?.dirty ||
          repeatedPasswordFormField?.touched)) ??
      true
    );
  }

  /* Password field error message(s) display */
  displayPasswordErrorMessage(): string {
    if (
      this.resetUserPasswordForm
        .get(this.passwordFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.resetUserPasswordForm
        .get(this.passwordFieldIdentifier)
        ?.hasError(PATTERN_ERROR)
    ) {
      return getPasswordFieldFormatErrorMessage();
    }
    return '';
  }

  /* Repeated password field error message(s) display */
  displayRepeatedPasswordErrorMessage(error: string): string {
    if (
      error === REQUIRED_ERROR &&
      this.resetUserPasswordForm
        .get(this.repeatedPasswordFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      error === NOT_IDENTICAL_PASS_WORD_ERROR &&
      this.resetUserPasswordForm.hasError(NOT_IDENTICAL_PASS_WORD_ERROR)
    ) {
      return getRepeatedPasswordFieldFormatErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitResetUserPasswordFormForm() {
    /* User data mapping */
    const userToDB = {
      ...this.resetUserPasswordForm.value,
      uuid: this.userUUID,
      givenName: this.initUserToResetPassword.givenName,
      surname: this.initUserToResetPassword.surname,
      login: this.initUserToResetPassword.login,
      profile: this.initUserToResetPassword.profile,
    };

    let userToResetPassword = this.userMapper.userToDB(userToDB);

    // User password resetting
    this.userService
      .resetUserPassword(userToResetPassword)
      .then((result: any) => {
        // If user password is reseted
        if (result.data) {
          /* Success notification showing */
          this.notificationService.showSuccessNotification(
            `${getResetUserPasswordFormTitle(true)}`,
            `${getResetUserPasswordFormSuccessNotificationMessage()}`
          );
          // Redirection to users list
          this.router.navigate(['users', 'list']);
        } else {
          /* Technical error notification showing */
          this.notificationService.showErrorNotification(
            `${getTechnicalErrorTitle()}`,
            `${getTechnicalErrorMessage()}`
          );
        }
      });
  }
}
