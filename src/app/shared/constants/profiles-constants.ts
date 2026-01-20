import { Profile } from '../models/Profile';

export function getProfiles(
  administratorLabel: string,
  managerLabel: string,
  consultantLabel: string,
): Profile[] {
  return [
    { id: 1, name: administratorLabel },
    { id: 2, name: managerLabel },
    { id: 3, name: consultantLabel },
  ];
}
