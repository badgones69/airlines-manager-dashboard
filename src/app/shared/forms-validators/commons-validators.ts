import { AbstractControl, ValidatorFn } from '@angular/forms';
import { BLANK_VALUE_ERROR } from '../constants/forms-constants';

export function onlyWhitespaceValueValidator(): ValidatorFn {
  return (formControl: AbstractControl): { [key: string]: boolean } | null => {
    return !!formControl.value && formControl.value.trim() === ''
      ? { [BLANK_VALUE_ERROR]: true }
      : null;
  };
}
