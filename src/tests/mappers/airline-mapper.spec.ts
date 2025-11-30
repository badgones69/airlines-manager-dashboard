import { AirlineMapper } from '../../app/shared/mappers/AirlineMapper';
import { describe, it, expect } from 'vitest';
import { Airline } from '../../app/shared/models/Airline';
import { Country } from '../../app/shared/models/Country';

describe('AirlineMapper', () => {
  const airlineMapper: AirlineMapper = new AirlineMapper();

  it('#airlineFromDB should return mapped airline from DB', () => {
    const airlineInDB: any = {
      airlineID: 4,
      airlineUUID: 'airline-uuid',
      airlineICAO: 'XAL',
      airlineName: 'X Airlines',
      airlineLogo: null,
      airlineNationality: 103,
    };
    const airlineMappedFromDB: Airline = airlineMapper.airlineFromDB(airlineInDB);
    expect(airlineMappedFromDB.id).toStrictEqual(4);
    expect(airlineMappedFromDB.uuid).toStrictEqual('airline-uuid');
    expect(airlineMappedFromDB.icao).toStrictEqual('XAL');
    expect(airlineMappedFromDB.name).toStrictEqual('X Airlines');
    expect(airlineMappedFromDB.logo).toBeNull();
    expect(airlineMappedFromDB.nationality.name).toStrictEqual('Japon');
  });

  it('#airlineToDB should return mapped airline to DB', () => {
    const airline: Airline = {
      id: 5,  
      uuid: 'uuid-airline',
      icao: 'XAW',
      name: 'X Airways',
      logo: 'X_BG-R_LT-W',
      nationality: {
        id: 188,
        name: 'Suisse',
        icao: 'HB',
        flagCode: 'ch'
      } as Country
    };
    const airlineMappedToDB: any = airlineMapper.airlineToDB(airline);
    expect(airlineMappedToDB.airlineID).toStrictEqual(5);
    expect(airlineMappedToDB.airlineUUID).toStrictEqual('uuid-airline');
    expect(airlineMappedToDB.airlineICAO).toStrictEqual('XAW');
    expect(airlineMappedToDB.airlineName).toStrictEqual('X Airways');
    expect(airlineMappedToDB.airlineLogo).toStrictEqual('X_BG-R_LT-W');
    expect(airlineMappedToDB.airlineNationality).toStrictEqual(188);
  })
});
