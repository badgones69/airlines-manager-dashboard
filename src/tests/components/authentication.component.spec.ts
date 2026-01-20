import { Component, Inject } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { User } from '../../app/shared/models/User';
import { mockSessionStorage } from '../mocks/mock-session-storage';
import { MockUserService } from '../mocks/mock-user-service';
import { MockNotificationService } from '../mocks/mock-notification-service';
import { ToastrService } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { NotificationService } from '../../app/shared/services/notification.service';
import {
  ADD_FORM_MODE,
  REQUIRED_ERROR,
} from '../../app/shared/constants/forms-constants';
import {
  getPasswordInputLabel,
  getResetButtonLabel,
  getResetButtonIcon,
  getResetButtonType,
} from '../../app/shared/labels/commons/form-common';
import {
  getAuthenticationFormTitle,
  getErrorNotificationMessage,
  getSubmitButtonLabel,
} from '../../app/shared/labels/forms/authentication-form';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  getTechnicalErrorMessage,
  getTechnicalErrorTitle,
} from '../../app/shared/labels/errors';
import { AuthenticationComponent } from '../../app/authentication/authentication.component';
import {
  APP_LANGUAGE_STORAGE_NAME,
  AUTHENTICATED_USER_STORAGE_NAME,
} from '../../app/shared/constants/storage-constants';
import { FRENCH } from '../../app/shared/constants/language-constants';
import { getLoginLabel } from '../../app/shared/labels/commons/user-common';
import { getStoredItem } from '../../app/shared/utils/storage-utils';
import { MockHomeComponent } from '../mocks/mock-home-component';
import { compare } from 'bcrypt-ts';

Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('AuthenticationComponent', () => {
  @Component({})
  class MockAuthenticationComponent {
    constructor(
      readonly userService: MockUserService = new MockUserService(),
      readonly notificationService: MockNotificationService = new MockNotificationService(
        Inject(ToastrService),
      ),
    ) {}
  }

  it('#ngOnInit should initialize "Authentication" component', async () => {
    TestBed.runInInjectionContext(() => {
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      vi.spyOn(authenticationComponent, 'ngOnInit').mockImplementation(() => {
        globalThis.sessionStorage.setItem(APP_LANGUAGE_STORAGE_NAME, FRENCH);

        authenticationComponent.authenticationFormTitle =
          getAuthenticationFormTitle();
        authenticationComponent.loginInputLabel = getLoginLabel();
        authenticationComponent.passwordInputLabel = getPasswordInputLabel();
        authenticationComponent.submitButtonLabel = getSubmitButtonLabel();
        authenticationComponent.resetButtonLabel =
          getResetButtonLabel(ADD_FORM_MODE);
        authenticationComponent.resetButtonIcon =
          getResetButtonIcon(ADD_FORM_MODE);
        authenticationComponent.resetButtonType =
          getResetButtonType(ADD_FORM_MODE);
      });
      authenticationComponent.ngOnInit();

      expect(getStoredItem(APP_LANGUAGE_STORAGE_NAME)).toStrictEqual('fr');
      expect(authenticationComponent.authenticationFormTitle).toStrictEqual(
        'Authentification',
      );
      expect(authenticationComponent.loginInputLabel).toStrictEqual(
        'IDENTIFIANT',
      );
      expect(authenticationComponent.passwordInputLabel).toStrictEqual(
        'MOT DE PASSE',
      );
      expect(authenticationComponent.submitButtonLabel).toStrictEqual(
        'Connexion',
      );
      expect(authenticationComponent.resetButtonLabel).toStrictEqual('Effacer');
      expect(authenticationComponent.resetButtonIcon).toStrictEqual(
        'ink_eraser',
      );
      expect(authenticationComponent.resetButtonType).toStrictEqual('reset');
    });
  });

  it('#showPasswordToggle should manage "Show password" toggle', async () => {
    TestBed.runInInjectionContext(() => {
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      authenticationComponent.showPasswordToggle();
      expect(authenticationComponent.showPassword).toBeTruthy();
      authenticationComponent.showPasswordToggle();
      expect(authenticationComponent.showPassword).toBeFalsy();
    });
  });

  it('#isPasswordFieldInvalid should check password field validity', async () => {
    TestBed.runInInjectionContext(() => {
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setValue('');
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.markAsDirty();

      expect(authenticationComponent.isPasswordFieldInvalid()).toBeTruthy();

      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setValue('');
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.markAsTouched();

      expect(authenticationComponent.isPasswordFieldInvalid()).toBeTruthy();

      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setValue('4444ZZZZ€€€€rrrr');
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.markAsUntouched();

      expect(authenticationComponent.isPasswordFieldInvalid()).toBeFalsy();
    });
  });

  it('#displayLoginErrorMessage should display login field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      authenticationComponent.authenticationForm
        .get(authenticationComponent.loginFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(authenticationComponent.displayLoginErrorMessage()).toStrictEqual(
        'champ obligatoire',
      );
    });
  });

  it('#displayPasswordErrorMessage should display password field error message', async () => {
    TestBed.runInInjectionContext(() => {
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      authenticationComponent.authenticationForm
        .get(authenticationComponent.pass_wordFieldIdentifier)
        ?.setErrors({ [REQUIRED_ERROR]: true });

      expect(
        authenticationComponent.displayPasswordErrorMessage(),
      ).toStrictEqual('champ obligatoire');
    });
  });

  it('#submitAuthenticationForm should open session', async () => {
    TestBed.configureTestingModule({
      imports: [AuthenticationComponent],
      providers: [
        provideRouter([{ path: 'home', component: MockHomeComponent }]),
      ],
    });

    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    TestBed.runInInjectionContext(() => {
      let mockAuthenticationComponent: MockAuthenticationComponent =
        new MockAuthenticationComponent();
      const authenticationComponent: AuthenticationComponent =
        new AuthenticationComponent(Inject(NotificationService));
      vi.spyOn(
        authenticationComponent,
        'submitAuthenticationForm',
      ).mockImplementation(() => {
        mockAuthenticationComponent.userService
          .authenticateUser('u.a')
          .then(async (userFound) => {
            if (userFound) {
              compare('admin', '$2b$13$eyVvAiQlk42LrypO6cuNIuMIfFN').then(
                async (isValid) => {
                  if (isValid) {
                    const user: User =
                      authenticationComponent.userMapper.userFromDB(userFound);
                    mockAuthenticationComponent.userService.connectUser(user);

                    expect(
                      JSON.parse(
                        getStoredItem(AUTHENTICATED_USER_STORAGE_NAME),
                      ),
                    ).toStrictEqual({
                      id: 1,
                      uuid: 'user-admin-uuid',
                      givenName: 'User',
                      surname: 'ADMIN',
                      login: 'u.a',
                      profile: 1,
                    });

                    await harness.navigateByUrl('home');
                    expect(harness.routeNativeElement?.textContent).toBe(
                      'Home',
                    );
                  } else {
                    const toastrSuccess: any =
                      mockAuthenticationComponent.notificationService.showErrorNotification(
                        `${getAuthenticationFormTitle().toUpperCase()}`,
                        `${getErrorNotificationMessage()}`,
                      );
                    expect(toastrSuccess.toastId).toStrictEqual(1);
                    expect(toastrSuccess.title).toStrictEqual(
                      'AUTHENTIFICATION',
                    );
                    expect(toastrSuccess.message).toStrictEqual(
                      'Login et/ou mot de passe incorrects !',
                    );
                  }
                },
              );
            } else {
              const toastrError: any =
                mockAuthenticationComponent.notificationService.showErrorNotification(
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
      authenticationComponent.submitAuthenticationForm();
    });
  });
});
