import { Country } from "./Country";
import { Region } from "./Region";

export class Airport {
  id?: number;
  uuid!: string;
  iata!: string;
  name!: string;
  city!: string;
  latitude!: number;
  longitude!: number;
  country!: Country;
  region?: Region;
  hub!: boolean;
}