import { AirportMapper } from '../../app/shared/mappers/AirportMapper';
import { describe, it, expect } from 'vitest';
import { Airport } from '../../app/shared/models/Airport';
import { USA_REGIONS_FR } from '../../app/shared/constants/geographical-constants';

describe('AirportMapper', () => {
  const airportMapper: AirportMapper = new AirportMapper();

  it('#airportFromDB should return mapped airport from DB', () => {
    const airportInDB: any = {
      airportID: 2,
      airportUUID: 'airport-uuid',
      airportIATA: 'CDG',
      airportName: 'Roissy-Charles de Gaulle',
      airportCity: 'Paris',
      airportLatitude: 6.6,
      airportLongitude: 7.7,
      airportCountry: 67,
      airportHub: false,
    };
    const airportMappedFromDB: Airport =
      airportMapper.airportFromDB(airportInDB);
    expect(airportMappedFromDB.id).toStrictEqual(2);
    expect(airportMappedFromDB.uuid).toStrictEqual('airport-uuid');
    expect(airportMappedFromDB.iata).toStrictEqual('CDG');
    expect(airportMappedFromDB.name).toStrictEqual('Roissy-Charles de Gaulle');
    expect(airportMappedFromDB.city).toStrictEqual('Paris');
    expect(airportMappedFromDB.latitude).toStrictEqual(6.6);
    expect(airportMappedFromDB.longitude).toStrictEqual(7.7);
    expect(airportMappedFromDB.country).toStrictEqual({
      id: 67,
      name: 'France',
      icao: 'F',
      flagCode: 'fr',
    });
    expect(airportMappedFromDB.region).toBeUndefined();
    expect(airportMappedFromDB.hub).toBeFalsy();
  });

  it('#airportsListFromDB should return mapped airports list from DB', () => {
    const airportsInDB: any[] = [
      {
        airportID: 1,
        airportUUID: 'uuid-airport',
        airportIATA: 'JFK',
        airportName: 'John F. Kennedy',
        airportCity: 'New York',
        airportLatitude: 63.63,
        airportLongitude: 1.1,
        airportCountry: 63,
        airportRegion: 1,
        airportHub: true,
      },
      {
        airportID: 2,
        airportUUID: 'airport-uuid',
        airportIATA: 'CDG',
        airportName: 'Roissy-Charles de Gaulle',
        airportCity: 'Paris',
        airportLatitude: 6.6,
        airportLongitude: 7.7,
        airportCountry: 67,
        airportHub: false,
      },
    ];
    const airportsMappedFromDB: Airport[] =
      airportMapper.airportsListFromDB(airportsInDB);
    expect(airportsMappedFromDB.length).toStrictEqual(2);
    expect(airportsMappedFromDB[0].id).toStrictEqual(1);
    expect(airportsMappedFromDB[0].uuid).toStrictEqual('uuid-airport');
    expect(airportsMappedFromDB[0].iata).toStrictEqual('JFK');
    expect(airportsMappedFromDB[0].name).toStrictEqual('John F. Kennedy');
    expect(airportsMappedFromDB[0].city).toStrictEqual('New York');
    expect(airportsMappedFromDB[0].latitude).toStrictEqual(63.63);
    expect(airportsMappedFromDB[0].longitude).toStrictEqual(1.1);
    expect(airportsMappedFromDB[0].country).toStrictEqual({
      id: 63,
      name: 'États-Unis',
      icao: 'N',
      flagCode: 'us',
      regions: USA_REGIONS_FR,
    });
    expect(airportsMappedFromDB[0].region).toStrictEqual({
      id: 1,
      code: 'NY',
      name: 'New York',
    });
    expect(airportsMappedFromDB[1].id).toStrictEqual(2);
    expect(airportsMappedFromDB[1].uuid).toStrictEqual('airport-uuid');
    expect(airportsMappedFromDB[1].iata).toStrictEqual('CDG');
    expect(airportsMappedFromDB[1].name).toStrictEqual(
      'Roissy-Charles de Gaulle',
    );
    expect(airportsMappedFromDB[1].city).toStrictEqual('Paris');
    expect(airportsMappedFromDB[1].latitude).toStrictEqual(6.6);
    expect(airportsMappedFromDB[1].longitude).toStrictEqual(7.7);
    expect(airportsMappedFromDB[1].country).toStrictEqual({
      id: 67,
      name: 'France',
      icao: 'F',
      flagCode: 'fr',
    });
    expect(airportsMappedFromDB[1].region).toBeUndefined();
  });

  it('#airportToDB should return mapped airport to DB', () => {
    const airport: Airport = {
      id: 1,
      uuid: 'uuid-airport',
      iata: 'JFK',
      name: 'John F. Kennedy',
      city: 'New York',
      latitude: 63.63,
      longitude: 1.1,
      country: {
        id: 63,
        name: 'États-Unis',
        icao: 'N',
        flagCode: 'us',
        regions: USA_REGIONS_FR,
      },
      region: {
        id: 1,
        code: 'NY',
        name: 'New York',
      },
      hub: true,
    };
    const airportMappedToDB: any = airportMapper.airportToDB(airport);
    expect(airportMappedToDB.airportID).toStrictEqual(1);
    expect(airportMappedToDB.airportUUID).toStrictEqual('uuid-airport');
    expect(airportMappedToDB.airportIATA).toStrictEqual('JFK');
    expect(airportMappedToDB.airportName).toStrictEqual('John F. Kennedy');
    expect(airportMappedToDB.airportCity).toStrictEqual('New York');
    expect(airportMappedToDB.airportLatitude).toStrictEqual(63.63);
    expect(airportMappedToDB.airportLongitude).toStrictEqual(1.1);
    expect(airportMappedToDB.airportCountry).toStrictEqual(63);
    expect(airportMappedToDB.airportRegion).toStrictEqual(1);
    expect(airportMappedToDB.airportHub).toBeTruthy();
  });
});
