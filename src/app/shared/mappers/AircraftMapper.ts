import { Aircraft } from '../dto/Aircraft';
import { getManufacturerById, getModelById } from '../utils/aviation-utils';
import { AirportMapper } from './AirportMapper';
import { FlightMapper } from './FlightMapper';

export class AircraftMapper {
  public airportMapper: AirportMapper = new AirportMapper();
  public flightMapper: FlightMapper = new FlightMapper();

  /* DB => DTO mapping (aircrafts list) */
  public aircraftsListFromDB(aircraftsListFromDB: any[]): Aircraft[] {
    let aircraftsList: Aircraft[] = [];

    for (const aircraftFromDB of aircraftsListFromDB) {
      aircraftsList.push(this.aircraftFromDB(aircraftFromDB));
    }
    return aircraftsList;
  }

  /* DB => DTO mapping */
  public aircraftFromDB(aircraftFromDB: any): Aircraft {
    return {
      id: aircraftFromDB.aircraftID,
      uuid: aircraftFromDB.aircraftUUID,
      registration: aircraftFromDB.aircraftRegistration,
      manufacturer: getManufacturerById(aircraftFromDB.aircraftManufacturer),
      model: getModelById(aircraftFromDB.aircraftModel, aircraftFromDB.aircraftManufacturer),
      homeHub: this.airportMapper.airportFromDB(aircraftFromDB.aircraftHomeHub),
      flights: this.flightMapper.flightsListFromDB(aircraftFromDB.aircraftFlights),
    } as Aircraft;
  }

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
