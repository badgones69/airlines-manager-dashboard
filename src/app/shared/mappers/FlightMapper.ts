import { Flight } from '../dto/Flight';
import {
  getDepartureTimeFieldIdentifier,
  getLengthFieldIdentifier,
  getRouteFieldIdentifier,
} from '../labels/forms/aircraft-form';
import {
  addMinutesToDateTime,
  convertDateTimeInMinutes,
  convertStringTimeInDate,
} from '../utils/date-utils';
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

  /* DTO => fields mapping (flights list) */
  public flightsListToFields(flightsList: Flight[]): any[] {
    let flightsFieldsList: any[] = [];
    const outboundFlightsListToFields: Flight[] = flightsList.filter(
      (flight) => !flight.return,
    );
    const returnFlightsList: Flight[] = flightsList.filter(
      (flight) => flight.return,
    );

    for (let i: number = 0; i < outboundFlightsListToFields.length; i++) {
      flightsFieldsList.push(
        this.flightToFields(
          i,
          outboundFlightsListToFields[i],
          i === outboundFlightsListToFields.length - 1
            ? returnFlightsList[i].landing
            : outboundFlightsListToFields[i + 1].takeOff,
        ),
      );
    }
    return flightsFieldsList;
  }

  /* DTO => fields mapping */
  public flightToFields(
    index: number,
    flightToFields: any,
    nextFlight: any,
  ): any {
    let lengthFieldValue: Date = new Date();
    lengthFieldValue.setHours(0, 0, 0);
    lengthFieldValue.setMinutes(
      addMinutesToDateTime(
        lengthFieldValue,
        convertDateTimeInMinutes(nextFlight) -
          convertDateTimeInMinutes(flightToFields.takeOff),
      ),
    );

    return {
      [`${getRouteFieldIdentifier(index)}`]:
        flightToFields.route.arrivalAirport,
      [`${getDepartureTimeFieldIdentifier(index)}`]: `${new Date(flightToFields.takeOff).toTimeString().split(' ')[0]}`,
      [`${getLengthFieldIdentifier(index)}`]: `${lengthFieldValue.toTimeString().split(' ')[0]}`,
    };
  }
}
