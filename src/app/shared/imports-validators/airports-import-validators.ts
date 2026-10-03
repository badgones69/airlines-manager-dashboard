import { ICAO_IATA_CODE_PATTERN, LATITUDE_LONGITUDE_PATTERN } from '../constants/forms-constants';
import { getCountries } from '../utils/geographical-utils';
import { capitalize } from '../utils/labels-utils';
import { isNotBlank } from './commons-validators';

function isValidIATA(iata: string): boolean {
  return isNotBlank(iata) && new RegExp(ICAO_IATA_CODE_PATTERN).exec(iata) != null;
}

function isValidLatitudeLongitude(latitudeLongitude: string): boolean {
  return !Number.isNaN(Number.parseFloat(latitudeLongitude)) && new RegExp(LATITUDE_LONGITUDE_PATTERN).exec(latitudeLongitude) != null;
}

function isValidCountry(country: any): boolean {
  const countryName: string = typeof country === 'string' ? country : country?.name;
  return isNotBlank(countryName) && getCountries().some(c => capitalize(c.name) === capitalize(countryName));
}

function isValidRegion(region: any, country: any): boolean {
  if (country?.regions) {
    const regionName: string = typeof region === 'string' ? region : region?.name;
    return country?.regions.some((r: any) => capitalize(r.name) === capitalize(regionName));
  }
  return true;
}

export function isValidAirportsList(airportsList: any[]): boolean {
  airportsList.forEach(airport => {
    airport.country = getCountries().find((country: any) => capitalize(country.name) === capitalize(airport.country));

    if (airport.country?.regions) {
      airport.region = airport.country.regions.find((region: any) => capitalize(region.name) === capitalize(airport.region));
    }
  });

  return airportsList.length > 0 &&
    airportsList.every(airport => 
      isValidIATA(airport.iata) &&
      isNotBlank(airport.name) &&
      isValidLatitudeLongitude(airport.latitude) &&
      isValidLatitudeLongitude(airport.longitude) &&
      isValidCountry(airport.country) &&
      isValidRegion(airport.region, airport.country)
    );
}