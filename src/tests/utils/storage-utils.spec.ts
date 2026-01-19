import { AUTHENTICATED_USER_STORAGE_NAME } from '../../app/shared/constants/storage-constants';
import { getStoredItem, removeStoredItem } from '../../app/shared/utils/storage-utils';
import { describe, beforeEach, it, expect } from 'vitest';
import { mockSessionStorage } from "../mocks/mock-session-storage";
  
Object.defineProperty(globalThis, 'sessionStorage', {
  value: mockSessionStorage
});

describe('StorageUtils', () => {

  beforeEach(() => {
    globalThis.sessionStorage.clear();
    globalThis.sessionStorage.setItem(
      AUTHENTICATED_USER_STORAGE_NAME,
      JSON.stringify({
        id: 6,  
        uuid: 'uuid-user',
        givenName: 'User',
        surname: 'Stored',
        login: 'u.s',
        profile: 1,
      }));
  });

  it('#getStoredItem should return item stored in sessionStorage', () => {
    const storedItem = JSON.parse(getStoredItem(AUTHENTICATED_USER_STORAGE_NAME));
    expect(storedItem).toStrictEqual({
      id: 6,  
      uuid: 'uuid-user',
      givenName: 'User',
      surname: 'Stored',
      login: 'u.s',
      profile: 1,
    });
  });

  it('#removeStoredItem should remove item stored in sessionStorage', () => {
    removeStoredItem(AUTHENTICATED_USER_STORAGE_NAME);
    expect(globalThis.sessionStorage.getItem(AUTHENTICATED_USER_STORAGE_NAME)).toBeNull();
  });
});