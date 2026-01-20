import packageJson from '../../../package.json';
import {
  getAppReleaseDate,
  getHomeLabel,
  getAlphabet,
} from '../../app/shared/labels/commons/commons';
import { describe, it, expect } from 'vitest';

describe('CommonsLabels', () => {
  it('#getAppReleaseDate should return app release date', () => {
    packageJson.releaseDate = '2025-01-01';
    const appReleaseDate: string = getAppReleaseDate();
    expect(appReleaseDate).toStrictEqual('1er Janvier 2025');
  });

  it('#getHomeLabel should return "home" label', () => {
    const homeLabel: string = getHomeLabel();
    expect(homeLabel).toStrictEqual('Accueil');
  });

  it('#getAlphabet should return alphabet', () => {
    const alphabet: string[] = getAlphabet();
    expect(alphabet.length).toStrictEqual(26);
    expect(alphabet[0]).toStrictEqual('A');
    expect(alphabet[5]).toStrictEqual('F');
    expect(alphabet[13]).toStrictEqual('N');
    expect(alphabet[21]).toStrictEqual('V');
    expect(alphabet[25]).toStrictEqual('Z');
  });
});
