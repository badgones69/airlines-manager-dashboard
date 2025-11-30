import { getProfiles } from '../../app/shared/constants/profiles-constants';
import { Profile } from '../../app/shared/models/Profile';
import { describe, it, expect } from 'vitest';

describe('ProfilesConstants', () => {
    
  it('#getProfiles should return all profiles types', () => {
    const profiles: Profile[] = getProfiles('Administrateur', 'Gestionnaire', 'Consultant');
    expect(profiles).toStrictEqual([
      { id: 1, name: 'Administrateur' },
      { id: 2, name: 'Gestionnaire' },
      { id: 3, name: 'Consultant' },
    ]);
  });
});