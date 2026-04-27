import { describe, it, expect, vi } from 'vitest';
import {
  ADD_FORM_MODE,
  EDIT_FORM_MODE,
  NOT_IDENTICAL_PASS_WORD_ERROR,
  PASS_WORD_PATTERN,
  PATTERN_ERROR,
  REQUIRED_ERROR,
} from '../../app/shared/constants/forms-constants';
import {
  getResetButtonLabel,
  getResetButtonIcon,
  getResetButtonType,
  getFormModeLabel,
  getSubmitButtonIcon,
  getPasswordInputLabel,
} from '../../app/shared/labels/commons/form-common';
import {
  getSubmitButtonLabel,
} from '../../app/shared/labels/commons/form-common';
import { TestBed } from '@angular/core/testing';
import { UserFormComponent } from '../../app/user/form-component/user-form.component';
import { getRepeatedPasswordInputLabel, getUserFormTitle } from '../../app/shared/labels/forms/user-form';
import { getGivenNameLabel, getLoginLabel, getProfileLabel, getSurnameLabel } from '../../app/shared/labels/commons/user-common';

describe('UserFormComponent', () => {
  it('#ngOnInit should initialize "User form" component', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      vi.spyOn(userFormComponent, 'ngOnInit').mockImplementation(() => {
        userFormComponent.userFormTitle = `${getFormModeLabel(
          userFormComponent.formMode,
        )} ${getUserFormTitle()}`;
        userFormComponent.givenNameInputLabel = getGivenNameLabel();
        userFormComponent.surnameInputLabel = getSurnameLabel();
        userFormComponent.loginInputLabel = getLoginLabel();
        userFormComponent.passwordInputLabel = getPasswordInputLabel();
        userFormComponent.repeatedPasswordInputLabel = getRepeatedPasswordInputLabel();
        userFormComponent.profileInputLabel = getProfileLabel();
        userFormComponent.submitButtonLabel = getSubmitButtonLabel(userFormComponent.formMode);
        userFormComponent.submitButtonIcon = getSubmitButtonIcon(userFormComponent.formMode);
        userFormComponent.resetButtonLabel = getResetButtonLabel(userFormComponent.formMode);
        userFormComponent.resetButtonIcon = getResetButtonIcon(userFormComponent.formMode);
        userFormComponent.resetButtonType = getResetButtonType(userFormComponent.formMode);
      });
      userFormComponent.formMode = ADD_FORM_MODE;
      userFormComponent.ngOnInit();

      expect(userFormComponent.userFormTitle).toStrictEqual(
        'Ajout d\'un utilisateur',
      );
      expect(userFormComponent.givenNameInputLabel).toStrictEqual(
        'PRÉNOM',
      );
      expect(userFormComponent.surnameInputLabel).toStrictEqual(
        'NOM',
      );
      expect(userFormComponent.loginInputLabel).toStrictEqual(
        'IDENTIFIANT',
      );
      expect(userFormComponent.passwordInputLabel).toStrictEqual(
        'MOT DE PASSE',
      );
      expect(userFormComponent.repeatedPasswordInputLabel).toStrictEqual(
        'RÉPÉTER MOT DE PASSE',
      );
      expect(userFormComponent.profileInputLabel).toStrictEqual(
        'PROFIL',
      );
      expect(userFormComponent.submitButtonLabel).toStrictEqual(
        'Créer',
      );
      expect(userFormComponent.submitButtonIcon).toStrictEqual('add');
      expect(userFormComponent.resetButtonLabel).toStrictEqual('Effacer');
      expect(userFormComponent.resetButtonIcon).toStrictEqual(
        'ink_eraser',
      );
      expect(userFormComponent.resetButtonType).toStrictEqual('reset');

      userFormComponent.formMode = EDIT_FORM_MODE;
      userFormComponent.ngOnInit();

      expect(userFormComponent.userFormTitle).toStrictEqual(
        'Modification d\'un utilisateur',
      );
      expect(userFormComponent.submitButtonLabel).toStrictEqual(
        'Modifier',
      );
      expect(userFormComponent.submitButtonIcon).toStrictEqual('edit');
      expect(userFormComponent.resetButtonLabel).toStrictEqual('Annuler');
      expect(userFormComponent.resetButtonIcon).toStrictEqual(
        'undo',
      );
      expect(userFormComponent.resetButtonType).toStrictEqual('button');
    });
  });

  it('#showPasswordToggle should manage "Show password" toggle', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.showPasswordToggle();
      expect(userFormComponent.showPassword).toBeTruthy();
      userFormComponent.showPasswordToggle();
      expect(userFormComponent.showPassword).toBeFalsy();
    });
  });

  it('#showRepeatedPasswordToggle should manage "Show repeated password" toggle', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.showRepeatedPasswordToggle();
      expect(userFormComponent.showRepeatedPassword).toBeTruthy();
      userFormComponent.showRepeatedPasswordToggle();
      expect(userFormComponent.showRepeatedPassword).toBeFalsy();
    });
  });

  it('#isPasswordFieldInvalid should check password field validity', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setValue('');
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.markAsDirty();

      expect(userFormComponent.isPasswordFieldInvalid()).toBeTruthy();

      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setValue('4bC');
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [PASS_WORD_PATTERN]: true });
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.markAsTouched();

      expect(userFormComponent.isPasswordFieldInvalid()).toBeTruthy();

      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.markAsUntouched();

      expect(userFormComponent.isPasswordFieldInvalid()).toBeFalsy();
    });
  });

  it('#isRepeatedPasswordFieldInvalid should check repeated password field validity', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('');
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsDirty();

      expect(
        userFormComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeTruthy();

      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('4bC');
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [NOT_IDENTICAL_PASS_WORD_ERROR]: true });
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsTouched();

      expect(
        userFormComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeTruthy();

      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsUntouched();

      expect(
        userFormComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeFalsy();
    });
  });

  it('#displayGivenNameErrorMessage should display given name field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.givenNameFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displayGivenNameErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      userFormComponent.userForm
        .get(userFormComponent.givenNameFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        userFormComponent.displayGivenNameErrorMessage(),
      ).toStrictEqual('identité invalide');
    });
  });

  it('#displaySurnameErrorMessage should display surname field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.surnameFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displaySurnameErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      userFormComponent.userForm
        .get(userFormComponent.surnameFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        userFormComponent.displaySurnameErrorMessage(),
      ).toStrictEqual('identité invalide');
    });
  });

  it('#displayLoginErrorMessage should display login field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.loginFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displayLoginErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      userFormComponent.userForm
        .get(userFormComponent.loginFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        userFormComponent.displayLoginErrorMessage(),
      ).toStrictEqual('format invalide (a[-b].c[-d])');
    });
  });

  it('#displayPasswordErrorMessage should display password field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displayPasswordErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      userFormComponent.userForm
        .get(userFormComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        userFormComponent.displayPasswordErrorMessage(),
      ).toStrictEqual('mot de passe trop court et/ou pas assez sécurisé');
    });
  });

  it('#displayRepeatedPasswordErrorMessage should display repeated password field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displayRepeatedPasswordErrorMessage(
          'required',
        ),
      ).toStrictEqual('champ obligatoire');

      userFormComponent.userForm.setErrors({
        [NOT_IDENTICAL_PASS_WORD_ERROR]: true,
      });

      expect(
        userFormComponent.displayRepeatedPasswordErrorMessage(
          'notIdenticalPassword',
        ),
      ).toStrictEqual('mots de passe différents');
    });
  });

  it('#displayProfileErrorMessage should display profile field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();
      userFormComponent.userForm
        .get(userFormComponent.profileFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        userFormComponent.displayProfileErrorMessage(),
      ).toStrictEqual('champ obligatoire');
    });
  });

  it('#submitUserForm should submit user', async () => {
    TestBed.runInInjectionContext(() => {
      const userFormComponent: UserFormComponent =
        new UserFormComponent();

      userFormComponent.userForm.setValue({
        givenName: 'john',
        surname: 'smith',
        login: 'j.s',
        password: '$m1T',
        repeatedPassword: '$m1T',
        profile: 1,
      });
      
      vi.spyOn(userFormComponent.submitted, 'emit');
      userFormComponent.submitUserForm();
      expect(userFormComponent.submitted.emit).toHaveBeenCalledWith(
        {
          userGivenName: 'John',
          userSurname: 'SMITH',
          userLogin: 'j.s',
          userPassword: '$m1T',
          userProfile: 1,
        },
      );
    });
  });
});
