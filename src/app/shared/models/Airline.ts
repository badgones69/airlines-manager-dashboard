import { Country } from './Country';

export class Airline {
  id!: number;
  uuid!: string;
  icao!: string;
  name!: string;
  logo!: string;
  nationality!: Country;
}
