import { getUsersListTitle } from '../../app/shared/labels/lists';
import { describe, it, expect } from 'vitest';

describe('ListsLabels', () => {
  it('#getUsersListTitle should return users list title', () => {
    const usersListTitle: string = getUsersListTitle();
    expect(usersListTitle).toStrictEqual('Liste des utilisateurs');
  });
});
