import { Flight } from '../dto/Flight';
import { convertStringTimeInDate } from '../utils/date-utils';
import { RouteMapper } from './RouteMapper';

export class FlightMapper {
  public routeMapper: RouteMapper = new RouteMapper();

  /* DB => DTO mapping (flights list) */
  public flightsListFromDB(flightsListFromDB: any[]): Flight[] {
    let flightsList: Flight[] = [];

    for (const flightFromDB of flightsListFromDB) {
      flightsList.push(this.flightFromDB(flightFromDB));
    }
    return flightsList;
  }

  /* DB => DTO mapping */
  public flightFromDB(flightFromDB: any): Flight {
    return {
      id: flightFromDB.flightID,
      uuid: flightFromDB.flightUUID,
      number: flightFromDB.flightNumber,
      route: this.routeMapper.routeFromDB(flightFromDB.flightRoute),
      takeOff: convertStringTimeInDate(flightFromDB.flightTakeOff, false),
      landing: convertStringTimeInDate(flightFromDB.flightLanding, true),
      return: flightFromDB.flightReturn,
    };
  }

  /* DTO => DB mapping (flights list) */
  public flightsListToDB(flightsListToDB: Flight[]): any[] {
    let flightsList: any[] = [];

    for (const flightToDB of flightsListToDB) {
      flightsList.push(this.flightToDB(flightToDB));
    }
    return flightsList;
  }

  /* DTO => DB mapping */
  public flightToDB(flightToDB: any): any {
    return {
      flightID: flightToDB.id,
      flightUUID: flightToDB.uuid,
      flightNumber: flightToDB.number,
      flightRoute: flightToDB.route.id,
      flightTakeOff: flightToDB.takeOff.toTimeString().split(' ')[0],
      flightLanding: flightToDB.landing.toTimeString().split(' ')[0],
      flightReturn: flightToDB.return,
    };
  }
}
