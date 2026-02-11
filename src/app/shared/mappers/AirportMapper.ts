import { Airport } from '../models/Airport';
import { getCountryById, getRegionById } from '../utils/geographical-utils';
import {
  capitalize,
  capitalizeDashedWordsFirstLetter,
  capitalizeFirstLetter,
  capitalizeSpaceSeparatedWordsFirstLetter,
} from '../utils/labels-utils';

export class AirportMapper {
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
      region: getRegionById(airportFromDB.airportRegion, airportFromDB.airportCountry),
      hub: airportFromDB.airportHub,
    } as Airport;
  }

  /* DTO => DB mapping */
  public airportToDB(airportToDB: any): any {
    if (airportToDB.name.includes('-') || airportToDB.name.includes(' ')) {
      airportToDB.name = capitalizeDashedWordsFirstLetter(
        capitalizeSpaceSeparatedWordsFirstLetter(airportToDB.name),
      );
    } else {
      airportToDB.name = capitalizeFirstLetter(airportToDB.name);
    }

    if (airportToDB.city) {
      if (airportToDB.city.includes('-') || airportToDB.city.includes(' ')) {

        airportToDB.city = capitalizeDashedWordsFirstLetter(
          capitalizeSpaceSeparatedWordsFirstLetter(airportToDB.city),
        );
      } else {
        airportToDB.city = capitalizeFirstLetter(airportToDB.city);
      }
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
      airportHub: airportToDB.hub
    };
  }
}
