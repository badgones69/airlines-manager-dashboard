import { COUNTRIES_FR } from '../data/countries-regions';
import { Country } from '../dto/Country';
import { Region } from '../dto/Region';
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

export function getRegions(countryId: number): Region[] {
  let regionsList = getCountryById(countryId)!.regions!;
  return sortElementsAlphabetically(regionsList, 'fr');
}

export function getRegionById(
  regionId: number,
  countryId: number,
): Region | undefined {
  return getCountryById(countryId)?.regions?.find(
    (region) => region.id === regionId,
  );
}

export function getRegionByName(
  regionName: string,
  countryFlagCode: string,
): Region | undefined {
  return getCountries()
    .find((country) => country.flagCode === countryFlagCode)
    ?.regions?.find(
      (region) => capitalize(region.name) === capitalize(regionName),
    );
}
