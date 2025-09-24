import { Region } from './Region';

export class Country {
  id!: number;
  icao!: string | null;
  name!: string;
  flagCode!: string;
  regions?: Region[];
}
