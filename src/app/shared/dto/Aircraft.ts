import { Airport } from './Airport';
import { Flight } from './Flight';
import { Manufacturer } from './Manufacturer';
import { Model } from './Model';

export class Aircraft {
  id!: number;
  uuid!: string;
  registration!: string;
  manufacturer!: Manufacturer;
  model!: Model;
  homeHub!: Airport;
  flights!: Flight[];
}
