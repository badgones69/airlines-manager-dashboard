import { COUNTRIES_FR } from '../constants/geographical-constants';
import { Country } from '../models/Country';
import { Region } from '../models/Region';
import { sortElementsAlphabetically } from './commons-utils';
import { capitalize } from './labels-utils';

export function getCountriesList(): Country[] {
  return COUNTRIES_FR.filter((country) => country.flagCode !== 'eu');
}

export function getCountries(): Country[] {
  let countriesList = getCountriesList();
  return sortElementsAlphabetically(countriesList, 'fr');
}

export function getCountryById(countryId: number): Country | undefined {
  return getCountriesList().find((country) => country.id === countryId);
}

export function getCountryByName(countryName: string): Country | undefined {
  return getCountriesList().find(
    (country) => capitalize(country.name) === capitalize(countryName),
  );
}

export function getRegion(
  regionId: number,
  countryId: number,
): Region | undefined {
  return getCountryById(countryId)?.regions?.find(
    (region) => region.id === regionId,
  );
}
