/* Form modes */
export const ADD_FORM_MODE = 'ADD';
export const EDIT_FORM_MODE = 'EDIT';
export const DELETE_FORM_MODE = 'DELETE';

/* Forms fields patterns */
export const IDENTITY_PATTERN =
  '^[a-zA-Zßñçãáàâäéèêëíìîïõо́òôöúùûüẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ\\.]+(?:[ -][a-zA-Zßñçãáàâäéèêëíìîïõо́òôöúùûüẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ\\.]+)*$';
export const LOGIN_PATTERN =
  '^([a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]|[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]-[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü])+\\.([a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]|[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]-[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü])+$';
export const PASS_WORD_PATTERN =
  '^(?=(?:.*[0-9]){2,})(?=(?:.*[A-ZẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ]){2,})(?=(?:.*[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]){2,})(?=(?:.*[\\[\\]§:*_`|"+(=)&¤<.>?€;!$£%@^#~/{}\\-]){2,}).{16,}$';

/* Forms fields error types */
export const REQUIRED_ERROR = 'required';
export const ONLY_WHITESPACE_ERROR = 'onlyWhitespaceValue';
export const PATTERN_ERROR = 'pattern';
export const NOT_IDENTICAL_PASS_WORD_ERROR = 'notIdenticalPassword';
