import { getGivenNameLabel, getSurnameLabel, getLoginLabel, getProfileLabel, getProfilesValues } from '../../app/shared/labels/commons/user-common';
import { describe, it, expect } from 'vitest';
import { Profile } from '../../app/shared/models/Profile';

describe('UserCommonLabels', () => {
  
  it('#getGivenNameLabel should return "given name" label', () => {
    const givenNameLabel: string = getGivenNameLabel();
    expect(givenNameLabel).toStrictEqual('PRÉNOM');
  });

  it('#getSurnameLabel should return "surname" label', () => {
    const surnameLabel: string = getSurnameLabel();
    expect(surnameLabel).toStrictEqual('NOM');
  });

  it('#getLoginLabel should return "login" label', () => {
    const loginLabel: string = getLoginLabel();
    expect(loginLabel).toStrictEqual('IDENTIFIANT');
  });

  it('#getProfileLabel should return "profile" label', () => {
    const profileLabel: string = getProfileLabel();
    expect(profileLabel).toStrictEqual('PROFIL');
  });

  it('#getProfilesValues should return profiles values', () => {
    const profilesValues: Profile[] = getProfilesValues();
    expect(profilesValues).toStrictEqual([
      { id: 1, name: 'Administrateur' },
      { id: 2, name: 'Gestionnaire' },
      { id: 3, name: 'Consultant' },
    ]);
  });
});