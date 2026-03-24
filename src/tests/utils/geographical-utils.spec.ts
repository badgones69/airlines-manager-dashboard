import { Country } from '../../app/shared/models/Country';
import { Region } from '../../app/shared/models/Region';
import {
  getCountriesList,
  getCountries,
  getCountryById,
  getCountryByName,
  getRegions,
  getRegionById,
  getRegionByName,
} from '../../app/shared/utils/geographical-utils';
import { describe, it, expect } from 'vitest';

describe('GeographicalUtils', () => {
  it('#getCountriesList should return all countries without Europe', () => {
    const countriesList: Country[] = getCountriesList();
    const europeFound: boolean = countriesList.some(
      (country) => country.flagCode === 'eu',
    );
    expect(countriesList.length).toStrictEqual(215);
    expect(europeFound).toBeFalsy();
  });

  it('#getCountries should return all countries sorted alphabetically', () => {
    const countries: Country[] = getCountries();
    expect(countries.length).toStrictEqual(215);
    expect(countries[0].name).toStrictEqual('Afghanistan');
    expect(countries[5].name).toStrictEqual('Angleterre (Royaume-Uni)');
    expect(countries[55].name).toStrictEqual('Écosse (Royaume-Uni)');
    expect(countries[86].name).toStrictEqual('Île Christmas (Australie)');
    expect(countries[101].name).toStrictEqual('Irlande du Nord (Royaume-Uni)');
    expect(countries[155].name).toStrictEqual('Pays de Galles (Royaume-Uni)');
    expect(countries[197].name).toStrictEqual('Tchéquie');
    expect(countries[214].name).toStrictEqual('Zimbabwe');
  });

  it('#getCountryById should return country found by its id', () => {
    const countryFound: Country | undefined = getCountryById(5);
    expect(countryFound?.id).toStrictEqual(5);
    expect(countryFound?.name).toStrictEqual('Allemagne');
    expect(countryFound?.icao).toStrictEqual('D');
    expect(countryFound?.flagCode).toStrictEqual('de');
    expect(countryFound?.regions).toBeUndefined();
  });

  it('#getCountryByName should return country found by its name', () => {
    const countryFound: Country | undefined = getCountryByName('france');
    expect(countryFound?.id).toStrictEqual(67);
    expect(countryFound?.name).toStrictEqual('France');
    expect(countryFound?.icao).toStrictEqual('F');
    expect(countryFound?.flagCode).toStrictEqual('fr');
    expect(countryFound?.regions).toBeUndefined();
  });

  it(`#getRegions should return all regions of a country
      (only if it's Australia, Brazil, Canada or United States)`, () => {
    const regionsAustralia: Region[] = getRegions(13);
    expect(regionsAustralia.length).toStrictEqual(8);
    expect(regionsAustralia[0].name).toStrictEqual('Australie-Méridionale');
    expect(regionsAustralia[3].name).toStrictEqual('Queensland');
    expect(regionsAustralia[5].name).toStrictEqual(
      'Territoire de la capitale Australienne',
    );
    expect(regionsAustralia[7].name).toStrictEqual('Victoria');
  });

  it('#getRegionById should return region found by its id and id of its country', () => {
    const regionFound: Region | undefined = getRegionById(8, 37);
    expect(regionFound?.id).toStrictEqual(8);
    expect(regionFound?.code).toStrictEqual('QC');
    expect(regionFound?.name).toStrictEqual('Québec');
  });

  it('#getRegionByName should return region found by its name and flag code of its country', () => {
    const regionFound: Region | undefined = getRegionByName('washington', 'us');
    expect(regionFound?.id).toStrictEqual(11);
    expect(regionFound?.code).toStrictEqual('WA');
    expect(regionFound?.name).toStrictEqual('Washington');
  });
});
