import { FlightMapper } from './FlightMapper';

export class AircraftMapper {
  public flightMapper: FlightMapper = new FlightMapper();

  /* DTO => DB mapping */
  public aircraftToDB(aircraftToDB: any): any {
    return {
      aircraftID: aircraftToDB.id,
      aircraftUUID: aircraftToDB.uuid,
      aircraftRegistration: aircraftToDB.registration,
      aircraftManufacturer: aircraftToDB.manufacturer,
      aircraftModel: aircraftToDB.model,
      aircraftHomeHub: aircraftToDB.homeHub,
      aircraftFlights: this.flightMapper.flightsListToDB(aircraftToDB.flights),
    };
  }
}
