import { Airport } from './Airport';

export class Route {
  id?: number;
  uuid!: string;
  departureHub!: Airport;
  arrivalAirport!: Airport;
}
