import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { ToastrService } from 'ngx-toastr';
import { ResetUserPasswordComponent } from '../../app/user/pages/reset-user-password/reset-user-password.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import {
  ADD_FORM_MODE,
  NOT_IDENTICAL_PASS_WORD_ERROR,
  PASS_WORD_PATTERN,
  PATTERN_ERROR,
  REQUIRED_ERROR,
} from '../../app/shared/constants/forms-constants';
import {
  getPasswordInputLabel,
  getResetButtonLabel,
  getResetButtonIcon,
  getResetButtonType,
} from '../../app/shared/labels/commons/form-common';
import {
  getGivenNameLabel,
  getSurnameLabel,
} from '../../app/shared/labels/commons/user-common';
import {
  getResetUserPasswordFormSuccessNotificationMessage,
  getResetUserPasswordFormTitle,
  getSubmitButtonLabel,
} from '../../app/shared/labels/forms/reset-user-password-form';
import { getRepeatedPasswordInputLabel } from '../../app/shared/labels/forms/user-form';
import { TestBed } from '@angular/core/testing';
import { MockListUsersComponent } from '../mocks/mock-list-users-component';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';

describe('ResetUserPasswordComponent', () => {
  @Component({})
  class MockResetUserPasswordComponent {
    public authenticatedUser!: User;
    public userUUID!: string;

    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
      readonly route: any = {
        snapshot: { paramMap: new Map().set('uuid', 'user-created-uuid') },
      },
    ) {}
  }

  it('#ngOnInit should initialize "Reset user password" component', async () => {
    TestBed.runInInjectionContext(() => {
      let mockResetUserPasswordComponent: MockResetUserPasswordComponent =
        new MockResetUserPasswordComponent();
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      vi.spyOn(resetUserPasswordComponent, 'ngOnInit').mockImplementation(
        () => {
          resetUserPasswordComponent.userUUID =
            mockResetUserPasswordComponent.route.snapshot.paramMap.get(
              'uuid',
            ) ?? '';

          mockResetUserPasswordComponent.userService
            .findUser(resetUserPasswordComponent.userUUID)
            .then(async (userToEdit) => {
              resetUserPasswordComponent.initUserToResetPassword =
                resetUserPasswordComponent.userMapper.userFromDB(
                  userToEdit.data,
                );

              expect(
                resetUserPasswordComponent.initUserToResetPassword,
              ).toStrictEqual({
                id: 21,
                uuid: 'user-created-uuid',
                givenName: 'User',
                surname: 'CREATED',
                login: 'u.c',
                profile: 2,
              });
            });

          mockResetUserPasswordComponent.userService.user.subscribe((user) => {
            if (user) {
              resetUserPasswordComponent.authenticatedUser = JSON.parse(
                user.toString(),
              );
            }
          });

          resetUserPasswordComponent.resetUserPasswordFormTitle =
            getResetUserPasswordFormTitle(false);
          resetUserPasswordComponent.givenNameInputLabel = getGivenNameLabel();
          resetUserPasswordComponent.surnameInputLabel = getSurnameLabel();
          resetUserPasswordComponent.passwordInputLabel =
            getPasswordInputLabel();
          resetUserPasswordComponent.repeatedPasswordInputLabel =
            getRepeatedPasswordInputLabel();
          resetUserPasswordComponent.submitButtonLabel = getSubmitButtonLabel();
          resetUserPasswordComponent.resetButtonLabel =
            getResetButtonLabel(ADD_FORM_MODE);
          resetUserPasswordComponent.resetButtonIcon =
            getResetButtonIcon(ADD_FORM_MODE);
          resetUserPasswordComponent.resetButtonType =
            getResetButtonType(ADD_FORM_MODE);
        },
      );
      resetUserPasswordComponent.ngOnInit();

      expect(resetUserPasswordComponent.userUUID).toStrictEqual(
        'user-created-uuid',
      );

      expect(resetUserPasswordComponent.authenticatedUser).toStrictEqual({
        id: 7,
        uuid: 'uuid-authenticated-user',
        givenName: 'Authneticated',
        surname: 'USER',
        login: 'a.u',
        profile: 1,
      });

      expect(
        resetUserPasswordComponent.resetUserPasswordFormTitle,
      ).toStrictEqual(
        "Réinitialisation du mot de passe<br /> d'un utilisateur",
      );
      expect(resetUserPasswordComponent.givenNameInputLabel).toStrictEqual(
        'PRÉNOM',
      );
      expect(resetUserPasswordComponent.surnameInputLabel).toStrictEqual('NOM');
      expect(resetUserPasswordComponent.passwordInputLabel).toStrictEqual(
        'MOT DE PASSE',
      );
      expect(
        resetUserPasswordComponent.repeatedPasswordInputLabel,
      ).toStrictEqual('RÉPÉTER MOT DE PASSE');
      expect(resetUserPasswordComponent.submitButtonLabel).toStrictEqual(
        'Réinitialiser',
      );
      expect(resetUserPasswordComponent.resetButtonLabel).toStrictEqual(
        'Effacer',
      );
      expect(resetUserPasswordComponent.resetButtonIcon).toStrictEqual(
        'ink_eraser',
      );
      expect(resetUserPasswordComponent.resetButtonType).toStrictEqual('reset');
    });
  });

  it('#showPasswordToggle should manage "Show password" toggle', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.showPasswordToggle();
      expect(resetUserPasswordComponent.showPassword).toBeTruthy();
      resetUserPasswordComponent.showPasswordToggle();
      expect(resetUserPasswordComponent.showPassword).toBeFalsy();
    });
  });

  it('#showRepeatedPasswordToggle should manage "Show repeated password" toggle', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.showRepeatedPasswordToggle();
      expect(resetUserPasswordComponent.showRepeatedPassword).toBeTruthy();
      resetUserPasswordComponent.showRepeatedPasswordToggle();
      expect(resetUserPasswordComponent.showRepeatedPassword).toBeFalsy();
    });
  });

  it('#isPasswordFieldInvalid should check password field validity', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setValue('');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.markAsDirty();

      expect(resetUserPasswordComponent.isPasswordFieldInvalid()).toBeTruthy();

      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setValue('4bC');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [PASS_WORD_PATTERN]: true });
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.markAsTouched();

      expect(resetUserPasswordComponent.isPasswordFieldInvalid()).toBeTruthy();

      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.markAsUntouched();

      expect(resetUserPasswordComponent.isPasswordFieldInvalid()).toBeFalsy();
    });
  });

  it('#isRepeatedPasswordFieldInvalid should check repeated password field validity', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsDirty();

      expect(
        resetUserPasswordComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeTruthy();

      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('4bC');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [NOT_IDENTICAL_PASS_WORD_ERROR]: true });
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsTouched();

      expect(
        resetUserPasswordComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeTruthy();

      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.markAsUntouched();

      expect(
        resetUserPasswordComponent.isRepeatedPasswordFieldInvalid(),
      ).toBeFalsy();
    });
  });

  it('#displayPasswordErrorMessage should display password field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        resetUserPasswordComponent.displayPasswordErrorMessage(),
      ).toStrictEqual('champ obligatoire');

      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [PATTERN_ERROR]: true });

      expect(
        resetUserPasswordComponent.displayPasswordErrorMessage(),
      ).toStrictEqual('mot de passe trop court et/ou pas assez sécurisé');
    });
  });

  it('#displayRepeatedPasswordErrorMessage should display repeated password field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      resetUserPasswordComponent.resetUserPasswordForm
        .get(resetUserPasswordComponent.repeatedPass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        resetUserPasswordComponent.displayRepeatedPasswordErrorMessage(
          'required',
        ),
      ).toStrictEqual('champ obligatoire');

      resetUserPasswordComponent.resetUserPasswordForm.setErrors({
        [NOT_IDENTICAL_PASS_WORD_ERROR]: true,
      });

      expect(
        resetUserPasswordComponent.displayRepeatedPasswordErrorMessage(
          'notIdenticalPassword',
        ),
      ).toStrictEqual('mots de passe différents');
    });
  });

  it('#submitResetUserPasswordForm should reset user password in DB', async () => {
    TestBed.configureTestingModule({
      imports: [ResetUserPasswordComponent],
      providers: [
        provideRouter([
          { path: 'users/list', component: MockListUsersComponent },
        ]),
      ],
    });

    const userToResetPassword: any = {
      userUUID: 'user-created-uuid',
      userGivenName: 'User',
      userSurname: 'CREATED',
      userLogin: 'u.c',
      userProfile: 2,
    };

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      let mockResetUserPasswordComponent: MockResetUserPasswordComponent =
        new MockResetUserPasswordComponent();
      const resetUserPasswordComponent: ResetUserPasswordComponent =
        new ResetUserPasswordComponent(
          Inject(NotificationService),
          Inject(ActivatedRoute),
        );
      vi.spyOn(
        resetUserPasswordComponent,
        'submitResetUserPasswordForm',
      ).mockImplementation(() => {
        mockResetUserPasswordComponent.userService
          .resetUserPassword(userToResetPassword)
          .then(async (result) => {
            if (result.data) {
              expect(result.data).toStrictEqual({
                userID: 21,
                userUUID: 'user-created-uuid',
                userGivenName: 'User',
                userSurname: 'PASSWORD-RESETTED',
                userLogin: 'u.p-r',
                userProfile: 2,
              });

              const toastrSuccess: any =
                mockResetUserPasswordComponent.notificationService.showSuccessNotification(
                  `${getResetUserPasswordFormTitle(true)}`.toUpperCase(),
                  `${getResetUserPasswordFormSuccessNotificationMessage()}`,
                );
              expect(toastrSuccess.toastId).toStrictEqual(2);
              expect(toastrSuccess.title).toStrictEqual(
                "RÉINITIALISATION DU MOT DE PASSE D'UN UTILISATEUR",
              );
              expect(toastrSuccess.message).toStrictEqual(
                'Le mot de passe de votre utilisateur a bien été réinitialisé !',
              );

              await harness.navigateByUrl('/users/list');
              expect(harness.routeNativeElement?.textContent).toBe(
                'List users',
              );
            } else {
              const toastrError: any =
                mockResetUserPasswordComponent.notificationService.showErrorNotification(
                  `${getTechnicalErrorTitle()}`,
                  `${getTechnicalErrorMessage()}`,
                );
              expect(toastrError.toastId).toStrictEqual(1);
              expect(toastrError.title).toStrictEqual('ERREUR TECHNIQUE');
              expect(toastrError.message).toStrictEqual(
                'Une erreur est survenue : veuillez réessayer...',
              );
            }
          });
      });
      resetUserPasswordComponent.submitResetUserPasswordForm();
    });
  });
});
