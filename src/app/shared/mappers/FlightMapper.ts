import { Flight } from "../dto/Flight";

export class FlightMapper {
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
