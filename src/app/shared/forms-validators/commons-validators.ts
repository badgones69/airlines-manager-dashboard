import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ONLY_WHITESPACE_ERROR } from '../constants/forms-constants';

export function onlyWhitespaceValueValidator(): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    return !!formControl.value && formControl.value.trim() === ''
      ? { [ONLY_WHITESPACE_ERROR]: true }
      : null;
  };
}
