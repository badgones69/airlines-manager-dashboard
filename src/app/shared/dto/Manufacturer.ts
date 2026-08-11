import { Model } from './Model';

export class Manufacturer {
  id?: number;
  name!: string;
  headquarterCountryFlagCode!: string;
  models!: Model[];
}