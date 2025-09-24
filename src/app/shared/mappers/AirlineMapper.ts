import { Airline } from '../models/Airline';
import { getCountryById } from '../utils/geographical-utils';
import { capitalize, capitalizeDashedWordsFirstLetter, capitalizeFirstLetter, capitalizeSpaceSeparatedWordsFirstLetter } from '../utils/labels-utils';

export class AirlineMapper {
  
  /* DB => DTO mapping */
  public airlineFromDB(airlineFromDB: any): Airline {
    return {
      id: airlineFromDB.airlineID,
      uuid: airlineFromDB.airlineUUID,
      icao: airlineFromDB.airlineICAO,
      name: airlineFromDB.airlineName,
      logo: airlineFromDB.airlineLogo,
      nationality: getCountryById(airlineFromDB.airlineNationality),
    } as Airline;
  }

  /* DTO => DB mapping */
  public airlineToDB(airlineToDB: any): any {
    if (
      airlineToDB.name.indexOf('-') < 0 &&
      airlineToDB.name.indexOf(' ') < 0
    ) {
      airlineToDB.name = capitalizeFirstLetter(airlineToDB.name);
    } else {
      airlineToDB.name = capitalizeDashedWordsFirstLetter(
        capitalizeSpaceSeparatedWordsFirstLetter(airlineToDB.name)
      );
    }

    return {
      airlineID: airlineToDB.id,
      airlineUUID: airlineToDB.uuid,
      airlineICAO: capitalize(airlineToDB.icao),
      airlineName: airlineToDB.name,
      airlineLogo: airlineToDB.logo,
      airlineNationality: airlineToDB.nationality.id,
    };
  }
}
