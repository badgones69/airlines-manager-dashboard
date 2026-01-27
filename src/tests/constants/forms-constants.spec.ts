import { describe, it, expect } from 'vitest';
import {
  ADD_FORM_MODE,
  EDIT_FORM_MODE,
  DELETE_FORM_MODE,
  IDENTITY_PATTERN,
  LOGIN_PATTERN,
  PASS_WORD_PATTERN,
  ICAO_IATA_CODE_PATTERN,
  REQUIRED_ERROR,
  BLANK_VALUE_ERROR,
  MIN_LENGTH_ERROR,
  MAX_LENGTH_ERROR,
  PATTERN_ERROR,
  NOT_IDENTICAL_PASS_WORD_ERROR,
  UNKNOWN_COUNTRY_ERROR,
} from '../../app/shared/constants/forms-constants';

describe('FormsConstants', () => {
  it('ADD_FORM_MODE should return "add" form mode', () => {
    expect(ADD_FORM_MODE).toStrictEqual('ADD');
  });

  it('EDIT_FORM_MODE should return "edit" form mode', () => {
    expect(EDIT_FORM_MODE).toStrictEqual('EDIT');
  });

  it('DELETE_FORM_MODE should return "delete" form mode', () => {
    expect(DELETE_FORM_MODE).toStrictEqual('DELETE');
  });

  it('IDENTITY_PATTERN should return identity fields pattern', () => {
    expect(IDENTITY_PATTERN).toStrictEqual(
      String.raw`^[a-zA-Zßñçãáàâäéèêëíìîïõо́òôöúùûüẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ\.]+(?:[ -][a-zA-Zßñçãáàâäéèêëíìîïõо́òôöúùûüẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ\.]+)*$`,
    );
  });

  it('LOGIN_PATTERN should return login field pattern', () => {
    expect(LOGIN_PATTERN).toStrictEqual(
      String.raw`^([a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]|[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]-[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü])+\.([a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]|[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]-[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü])+$`,
    );
  });

  it('PASS_WORD_PATTERN should return password field pattern', () => {
    expect(PASS_WORD_PATTERN).toStrictEqual(
      '^(?=(?:.*[0-9]){2,})(?=(?:.*[A-ZẞÑÇÃÁÀÂÄÉÈÊËÍÌÎÏÕÒÓÔÖÚÙÛÜ]){2,})(?=(?:.*[a-zßñçãáàâäéèêëíìîïõо́òôöúùûü]){2,})(?=(?:.*[\\[\\]§:*_`|"+(=)&¤<.>?€;!$£%@^#~/{}\\-]){2,}).{16,}$',
    );
  });

  it('ICAO_IATA_CODE_PATTERN should return ICAO/IATA fields pattern', () => {
    expect(ICAO_IATA_CODE_PATTERN).toStrictEqual('[A-Za-z]{3}');
  });

  it('REQUIRED_ERROR should return "required" error code', () => {
    expect(REQUIRED_ERROR).toStrictEqual('required');
  });

  it('BLANK_VALUE_ERROR should return "blank value" error code', () => {
    expect(BLANK_VALUE_ERROR).toStrictEqual('blankValue');
  });

  it('MIN_LENGTH_ERROR should return "min length" error code', () => {
    expect(MIN_LENGTH_ERROR).toStrictEqual('minlength');
  });

  it('MAX_LENGTH_ERROR should return "max length" error code', () => {
    expect(MAX_LENGTH_ERROR).toStrictEqual('maxlength');
  });

  it('PATTERN_ERROR should return "pattern" error code', () => {
    expect(PATTERN_ERROR).toStrictEqual('pattern');
  });

  it('NOT_IDENTICAL_PASS_WORD_ERROR should return "not identical password" error code', () => {
    expect(NOT_IDENTICAL_PASS_WORD_ERROR).toStrictEqual('notIdenticalPassword');
  });

  it('UNKNOWN_COUNTRY_ERROR should return "unknown country" error code', () => {
    expect(UNKNOWN_COUNTRY_ERROR).toStrictEqual('unknownCountry');
  });
});
