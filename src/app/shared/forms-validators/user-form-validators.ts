import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NOT_IDENTICAL_PASS_WORD_ERROR } from '../constants/forms-constants';

export function notIdenticalPasswordsValidator(
  passwordFieldIdentifier: string,
  repeatedPasswordFieldIdentifier: string,
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    if (
      form.get(passwordFieldIdentifier)?.value !==
      form.get(repeatedPasswordFieldIdentifier)?.value
    ) {
      return { [NOT_IDENTICAL_PASS_WORD_ERROR]: true };
    }
    return null;
  };
}
