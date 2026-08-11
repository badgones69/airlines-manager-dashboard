import { Route } from './Route';

export class Flight {
  id!: number;
  uuid!: string;
  number!: string;
  route!: Route;
  takeOff!: Date;
  landing!: Date;
  return!: boolean;
}