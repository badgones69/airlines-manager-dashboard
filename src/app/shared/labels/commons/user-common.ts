import { Profile } from '../../models/Profile';
import { getProfiles } from '../../constants/profiles-constants';

export function getGivenNameLabel(): string {
  return 'PRÉNOM';
}

export function getSurnameLabel(): string {
  return 'NOM';
}

export function getLoginLabel(): string {
  return 'IDENTIFIANT';
}

export function getProfileLabel(): string {
  return 'PROFIL';
}

export function getProfilesValues(): Profile[] {
  return getProfiles('Administrateur', 'Gestionnaire', 'Consultant');
}
