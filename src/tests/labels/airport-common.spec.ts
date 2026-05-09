import {
  getIATALabel,
  getCityLabel,
  getLatitudeInputLabel,
  getLongitudeInputLabel,
  getCountryLabel,
  getRegionLabel,
  getUnknownRegionErrorMessage,
  getIATAUniquenessErrorMessage,
} from '../../app/shared/labels/commons/airport-common';
import { describe, it, expect } from 'vitest';

describe('AirportCommonLabels', () => {
  it('#getIATALabel should return "IATA" label', () => {
    const iataLabel: string = getIATALabel();
    expect(iataLabel).toStrictEqual('IATA');
  });

  it('#getCityLabel should return "city" label', () => {
    const cityLabel: string = getCityLabel();
    expect(cityLabel).toStrictEqual('VILLE');
  });

  it('#getLatitudeInputLabel should return "latitude" label', () => {
    const latitudeLabel: string = getLatitudeInputLabel();
    expect(latitudeLabel).toStrictEqual('LATITUDE');
  });

  it('#getLongitudeInputLabel should return "longitude" label', () => {
    const longitudeLabel: string = getLongitudeInputLabel();
    expect(longitudeLabel).toStrictEqual('LONGITUDE');
  });

  it('#getCountryLabel should return "country" label', () => {
    const countryLabel: string = getCountryLabel();
    expect(countryLabel).toStrictEqual('PAYS');
  });

  it('#getRegionLabel should return "region" label', () => {
    const regionlabel: string = getRegionLabel();
    expect(regionlabel).toStrictEqual('RÉGION');
  });

  it('#getIATAUniquenessErrorMessage should return IATA uniqueness error message', () => {
    const iataUniquenessErrorMessage: string = getIATAUniquenessErrorMessage();
    expect(iataUniquenessErrorMessage).toStrictEqual('Code IATA déjà lié à un autre aéroport existant !');
  });

  it('#getUnknownRegionErrorMessage should return region field error message', () => {
    const unknownRegionErrorMessage: string = getUnknownRegionErrorMessage();
    expect(unknownRegionErrorMessage).toStrictEqual('région inconnue');
  });
});
