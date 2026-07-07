import { Airline } from './Airline';

export class User {
  id?: number;
  uuid!: string;
  givenName!: string;
  surname!: string;
  login!: string;
  password?: string;
  profile!: number;
  airline!: Airline;
}
