import { describe, it, expect } from 'vitest';
import { FRENCH, GERMAN, SPANISH, ENGLISH, ITALIAN, DUTCH, PORTUGHESE } from '../../app/shared/constants/language-constants';

describe('LanguageConstants', () => {
    
  it('FRENCH should return French language code', () => {
    expect(FRENCH).toStrictEqual('fr');
  });

  it('GERMAN should return German language code', () => {
    expect(GERMAN).toStrictEqual('de');
  });

  it('SPANISH should return Spanish language code', () => {
    expect(SPANISH).toStrictEqual('es');
  });

  it('ENGLISH should return English language code', () => {
    expect(ENGLISH).toStrictEqual('en');
  });

  it('ITALIAN should return Italian language code', () => {
    expect(ITALIAN).toStrictEqual('it');
  });

  it('DUTCH should return Dutch language code', () => {
    expect(DUTCH).toStrictEqual('nl');
  });

  it('PORTUGHESE should return Portughese language code', () => {
    expect(PORTUGHESE).toStrictEqual('pt');
  });
});