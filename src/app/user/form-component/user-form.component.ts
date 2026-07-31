import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import {
  getUserFormTitle,
  getRepeatedPasswordInputLabel,
  getLoginFieldFormatErrorMessage,
  getPasswordFieldFormatErrorMessage,
  getRepeatedPasswordFieldFormatErrorMessage,
  getIdentityFieldsErrorMessage,
} from '../../shared/labels/forms/user-form';
import {
  getBackButtonIcon,
  getBackButtonLabel,
  getFormModeLabel,
  getPasswordInputLabel,
  getRequiredFieldErrorMessage,
  getResetButtonIcon,
  getResetButtonLabel,
  getResetButtonType,
  getSubmitButtonIcon,
  getSubmitButtonLabel,
} from '../../shared/labels/commons/form-common';
import {
  getGivenNameLabel,
  getSurnameLabel,
  getLoginLabel,
  getProfileLabel,
  getProfilesValues,
} from '../../shared/labels/commons/user-common';
import { User } from '../../shared/dto/User';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { notIdenticalPasswordsValidator } from '../../shared/forms-validators/user-form-validators';
import {
  EDIT_FORM_MODE,
  IDENTITY_PATTERN,
  LOGIN_PATTERN,
  NOT_IDENTICAL_PASS_WORD_ERROR,
  PASS_WORD_PATTERN,
  PATTERN_ERROR,
  REQUIRED_ERROR,
} from '../../shared/constants/forms-constants';
import { UserMapper } from '../../shared/mappers/UserMapper';
import { Profile } from '../../shared/dto/Profile';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ToastrModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: '../../shared/styles/forms.scss',
})
export class UserFormComponent implements OnInit {
  @Input() public formMode!: string;
  @Input() public user!: User;
  @Output() public submitted = new EventEmitter();
  public isEditMode!: boolean;

  public userMapper: UserMapper = new UserMapper();

  /* Form properties */
  public userForm!: FormGroup;
  public userFormTitle: string = '';
  public showPassword: boolean = false;
  public showRepeatedPassword: boolean = false;

  /* Form fields identifiers */
  public givenNameFieldIdentifier: string = 'givenName';
  public surnameFieldIdentifier: string = 'surname';
  public loginFieldIdentifier: string = 'login';
  public pass_wordFieldIdentifier: string = 'password';
  public repeatedPass_wordFieldIdentifier: string = 'repeatedPassword';
  public profileFieldIdentifier: string = 'profile';

  /* Form fields labels */
  public givenNameInputLabel: string = '';
  public surnameInputLabel: string = '';
  public loginInputLabel: string = '';
  public passwordInputLabel: string = '';
  public repeatedPasswordInputLabel: string = '';
  public profileInputLabel: string = '';

  // Profile field available values
  public profiles: Profile[] = getProfilesValues();

  /* Buttons labels and icons */
  public backButtonLabel: string = '';
  public backButtonIcon: string = '';
  public submitButtonLabel: string = '';
  public submitButtonIcon: string = '';
  public resetButtonLabel: string = '';
  public resetButtonIcon: string = '';
  public resetButtonType: string = '';

  /* Injections */
  public userService = inject(UserService);

  constructor() {
    /* Form fields creation & constraints definition */
    this.userForm = new FormGroup(
      {
        givenName: new FormControl('', [
          Validators.required,
          Validators.pattern(new RegExp(IDENTITY_PATTERN)),
        ]),
        surname: new FormControl('', [
          Validators.required,
          Validators.pattern(new RegExp(IDENTITY_PATTERN)),
        ]),
        login: new FormControl('', [
          Validators.required,
          Validators.pattern(new RegExp(LOGIN_PATTERN)),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(new RegExp(PASS_WORD_PATTERN)),
        ]),
        repeatedPassword: new FormControl('', Validators.required),
        profile: new FormControl('', Validators.required),
      },
      {
        validators: [
          notIdenticalPasswordsValidator(
            this.pass_wordFieldIdentifier,
            this.repeatedPass_wordFieldIdentifier,
          ),
        ],
        updateOn: 'change',
      },
    );
  }

  ngOnInit(): void {
    this.isEditMode = this.formMode === EDIT_FORM_MODE;

    if (this.isEditMode) {
      this.userForm.setValidators([]);
      this.userForm.get(this.pass_wordFieldIdentifier)?.setValidators([]);
      this.userForm
        .get(this.repeatedPass_wordFieldIdentifier)
        ?.setValidators([]);
    }

    /* Form title, fields and buttons initialization */
    this.userFormTitle = `${getFormModeLabel(
      this.formMode,
    )} ${getUserFormTitle()}`;
    this.givenNameInputLabel = getGivenNameLabel();
    this.surnameInputLabel = getSurnameLabel();
    this.loginInputLabel = getLoginLabel();
    this.passwordInputLabel = getPasswordInputLabel();
    this.repeatedPasswordInputLabel = getRepeatedPasswordInputLabel();
    this.profileInputLabel = getProfileLabel();
    this.backButtonLabel = getBackButtonLabel();
    this.backButtonIcon = getBackButtonIcon();
    this.submitButtonLabel = getSubmitButtonLabel(this.formMode);
    this.submitButtonIcon = getSubmitButtonIcon(this.formMode);
    this.resetButtonLabel = getResetButtonLabel(this.formMode);
    this.resetButtonIcon = getResetButtonIcon(this.formMode);
    this.resetButtonType = getResetButtonType(this.formMode);

    this.userForm.patchValue({
      givenName: this.user?.givenName,
      surname: this.user?.surname,
      login: this.user?.login,
      profile: this.user?.profile,
    });
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
    let passwordFormField: any = this.userForm.get(
      this.pass_wordFieldIdentifier,
    );
    return (
      (passwordFormField?.invalid &&
        (passwordFormField?.dirty || passwordFormField?.touched)) ??
      true
    );
  }

  /* Repeated password field validation */
  isRepeatedPasswordFieldInvalid(): boolean {
    let repeatedPasswordFormField: any = this.userForm.get(
      this.repeatedPass_wordFieldIdentifier,
    );

    return (
      ((repeatedPasswordFormField?.invalid ||
        this.userForm.hasError(NOT_IDENTICAL_PASS_WORD_ERROR)) &&
        (repeatedPasswordFormField?.dirty ||
          repeatedPasswordFormField?.touched)) ??
      true
    );
  }

  /* Given name field error message(s) display */
  displayGivenNameErrorMessage(): string {
    if (
      this.userForm.get(this.givenNameFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.userForm.get(this.givenNameFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getIdentityFieldsErrorMessage();
    }
    return '';
  }

  /* Surname field error message(s) display */
  displaySurnameErrorMessage(): string {
    if (
      this.userForm.get(this.surnameFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.userForm.get(this.surnameFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getIdentityFieldsErrorMessage();
    }
    return '';
  }

  /* Login field error message(s) display */
  displayLoginErrorMessage(): string {
    if (
      this.userForm.get(this.loginFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.userForm.get(this.loginFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getLoginFieldFormatErrorMessage();
    }
    return '';
  }

  /* Password field error message(s) display */
  displayPasswordErrorMessage(): string {
    if (
      this.userForm.get(this.pass_wordFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      this.userForm.get(this.pass_wordFieldIdentifier)?.hasError(PATTERN_ERROR)
    ) {
      return getPasswordFieldFormatErrorMessage();
    }
    return '';
  }

  /* Repeated password field error message(s) display */
  displayRepeatedPasswordErrorMessage(error: string): string {
    if (
      error === REQUIRED_ERROR &&
      this.userForm
        .get(this.repeatedPass_wordFieldIdentifier)
        ?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    } else if (
      error === NOT_IDENTICAL_PASS_WORD_ERROR &&
      this.userForm.hasError(NOT_IDENTICAL_PASS_WORD_ERROR)
    ) {
      return getRepeatedPasswordFieldFormatErrorMessage();
    }
    return '';
  }

  /* Profile field error message(s) display */
  displayProfileErrorMessage(): string {
    if (
      this.userForm.get(this.profileFieldIdentifier)?.hasError(REQUIRED_ERROR)
    ) {
      return getRequiredFieldErrorMessage();
    }
    return '';
  }

  /* Form submit */
  submitUserForm() {
    this.userService.user.subscribe((user) => {
      if (user) {
        let authenticatedUser = JSON.parse(user.toString());
        this.userForm.value.airline = authenticatedUser.airline.id;
        this.submitted.emit(this.userMapper.userToDB(this.userForm.value));
      }
    });
  }
}
