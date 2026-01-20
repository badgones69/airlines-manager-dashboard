import { describe, it, expect } from 'vitest';
import { appConfig } from '../app/app.config';

describe('App config', () => {
  it('appConfig should return app configuration', () => {
    expect(appConfig.providers.length).toStrictEqual(3);
  });
});
