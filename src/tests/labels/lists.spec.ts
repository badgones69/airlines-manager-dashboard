import {
  getDestinationsListTitle,
  getHubsListTitle,
  getUsersListTitle,
} from '../../app/shared/labels/lists';
import { describe, it, expect } from 'vitest';

describe('ListsLabels', () => {
  it('#getUsersListTitle should return users list title', () => {
    const usersListTitle: string = getUsersListTitle();
    expect(usersListTitle).toStrictEqual('Liste des utilisateurs');
  });

  it('#getHubsListTitle should return hubs list title', () => {
    const hubsListTitle: string = getHubsListTitle();
    expect(hubsListTitle).toStrictEqual('Liste des hubs');
  });

  it('#getDestinationsListTitle should return destinations list title', () => {
    const destinationsListTitle: string = getDestinationsListTitle();
    expect(destinationsListTitle).toStrictEqual('Liste des destinations');
  });
});
