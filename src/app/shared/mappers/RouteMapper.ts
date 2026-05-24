import { Route } from '../models/Route';
import { AirportMapper } from './AirportMapper';

export class RouteMapper {
  public airportMapper: AirportMapper = new AirportMapper();

  /* DB => DTO mapping (routes list) */
  public routesListFromDB(routesListFromDB: any[]): Route[] {
    let routesList: Route[] = [];

    for (const routeFromDB of routesListFromDB) {
      routesList.push(this.routeFromDB(routeFromDB));
    }
    return routesList;
  }

  /* DB => DTO mapping */
  public routeFromDB(routeFromDB: any): Route {
    return {
      id: routeFromDB.routeID,
      uuid: routeFromDB.routeUUID,
      departureHub: this.airportMapper.airportFromDB(routeFromDB.routeDepartureHub),
      arrivalAirport: this.airportMapper.airportFromDB(routeFromDB.routeArrivalAirport),
    } as Route;
  }

  /* DTO => DB mapping */
  public routeToDB(routeToDB: any): any {
    return {
      routeID: routeToDB.id,
      routeUUID: routeToDB.uuid,
      routeDepartureHub: routeToDB.departureHub,
      routeArrivalAirport: routeToDB.arrivalAirport,
    };
  }
}
