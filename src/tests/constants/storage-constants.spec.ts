import { describe, it, expect } from 'vitest';
import { AUTHENTICATED_USER_STORAGE_NAME, APP_LANGUAGE_STORAGE_NAME } from '../../app/shared/constants/storage-constants';

describe('StorageConstants', () => {
    
  it('AUTHENTICATED_USER_STORAGE_NAME should return storage name for authenticated user', () => {
    expect(AUTHENTICATED_USER_STORAGE_NAME).toStrictEqual('authenticatedUser');
  });

  it('APP_LANGUAGE_STORAGE_NAME should return storage name for app language', () => {
    expect(APP_LANGUAGE_STORAGE_NAME).toStrictEqual('appLanguage');
  });
});