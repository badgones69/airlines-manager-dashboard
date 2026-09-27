import { Airport } from '../dto/Airport';
import { getCountryById, getRegionById } from '../utils/geographical-utils';
import {
  capitalize,
  capitalizeWords,
} from '../utils/labels-utils';

export class AirportMapper {
  /* DB => DTO mapping (airports list) */
  public airportsListFromDB(airportsListFromDB: any[]): Airport[] {
    let airportsList: Airport[] = [];

    for (const airportFromDB of airportsListFromDB) {
      airportsList.push(this.airportFromDB(airportFromDB));
    }
    return airportsList;
  }

  /* DB => DTO mapping */
  public airportFromDB(airportFromDB: any): Airport {
    return {
      id: airportFromDB.airportID,
      uuid: airportFromDB.airportUUID,
      iata: airportFromDB.airportIATA,
      name: airportFromDB.airportName,
      city: airportFromDB.airportCity,
      latitude: airportFromDB.airportLatitude,
      longitude: airportFromDB.airportLongitude,
      country: getCountryById(airportFromDB.airportCountry),
      region: getRegionById(
        airportFromDB.airportRegion,
        airportFromDB.airportCountry,
      ),
      hub: airportFromDB.airportHub,
    } as Airport;
  }

  /* DTO => DB mapping */
  public airportToDB(airportToDB: any): any {
    airportToDB.name = capitalizeWords(airportToDB.name);

    if (airportToDB.city) {
      airportToDB.city = capitalizeWords(airportToDB.city);
    }

    return {
      airportID: airportToDB.id,
      airportUUID: airportToDB.uuid,
      airportIATA: capitalize(airportToDB.iata),
      airportName: airportToDB.name,
      airportCity: airportToDB.city,
      airportLatitude: airportToDB.latitude,
      airportLongitude: airportToDB.longitude,
      airportCountry: airportToDB.country.id,
      airportRegion: airportToDB.region?.id,
      airportHub: airportToDB.hub,
    };
  }
}
