import { AUSTRALIA_REGIONS_FR, BRAZIL_REGIONS_FR, CANADA_REGIONS_FR, USA_REGIONS_FR, COUNTRIES_FR } from '../../app/shared/constants/geographical-constants';
import { describe, it, expect } from 'vitest';

describe('GeographicalConstants', () => {
  
  it('AUSTRALIA_REGIONS_FR should return all Australia regions in French', () => {
    expect(AUSTRALIA_REGIONS_FR.length).toStrictEqual(8);
    expect(AUSTRALIA_REGIONS_FR[0].name).toStrictEqual('Australie-Méridionale');
    expect(AUSTRALIA_REGIONS_FR[3].name).toStrictEqual('Queensland');
    expect(AUSTRALIA_REGIONS_FR[5].name).toStrictEqual('Victoria');
    expect(AUSTRALIA_REGIONS_FR[7].name).toStrictEqual('Territoire du Nord');
  });

  it('BRAZIL_REGIONS_FR should return all Brazil regions in French', () => {
    expect(BRAZIL_REGIONS_FR.length).toStrictEqual(27);
    expect(BRAZIL_REGIONS_FR[0].name).toStrictEqual('Acre');
    expect(BRAZIL_REGIONS_FR[3].name).toStrictEqual('Amazonas');
    expect(BRAZIL_REGIONS_FR[4].name).toStrictEqual('Bahia');
    expect(BRAZIL_REGIONS_FR[6].name).toStrictEqual('District Fédéral');
    expect(BRAZIL_REGIONS_FR[18].name).toStrictEqual('Rio de Janeiro');
    expect(BRAZIL_REGIONS_FR[24].name).toStrictEqual('São Paulo');
    expect(BRAZIL_REGIONS_FR[26].name).toStrictEqual('Tocantins');
  });

  it('CANADA_REGIONS_FR should return all Canada regions in French', () => {
    expect(CANADA_REGIONS_FR.length).toStrictEqual(13);
    expect(CANADA_REGIONS_FR[0].name).toStrictEqual('Alberta');
    expect(CANADA_REGIONS_FR[3].name).toStrictEqual('Manitoba');
    expect(CANADA_REGIONS_FR[7].name).toStrictEqual('Québec');
    expect(CANADA_REGIONS_FR[12].name).toStrictEqual('Yukon');
  });

  it('USA_REGIONS_FR should return all United States regions in French', () => {
    expect(USA_REGIONS_FR.length).toStrictEqual(50);
    expect(USA_REGIONS_FR[0].name).toStrictEqual('New York');
    expect(USA_REGIONS_FR[3].name).toStrictEqual('Texas');
    expect(USA_REGIONS_FR[10].name).toStrictEqual('Washington');
    expect(USA_REGIONS_FR[12].name).toStrictEqual('District de Colombia');
    expect(USA_REGIONS_FR[13].name).toStrictEqual('Massachusetts');
    expect(USA_REGIONS_FR[21].name).toStrictEqual('Wisconsin');
    expect(USA_REGIONS_FR[49].name).toStrictEqual('Hawaii');
  });

  it('COUNTRIES_FR should return all countries in French', () => {
    expect(COUNTRIES_FR.length).toStrictEqual(216);
    expect(COUNTRIES_FR[0].name).toStrictEqual('Afghanistan');
    expect(COUNTRIES_FR[66].name).toStrictEqual('France');
    expect(COUNTRIES_FR[162].name).toStrictEqual('Tchéquie');
    expect(COUNTRIES_FR[164].name).toStrictEqual('Angleterre (Royaume-Uni)');
    expect(COUNTRIES_FR[211].name).toStrictEqual('Île Christmas (Australie)');
    expect(COUNTRIES_FR[212].name).toStrictEqual('Irlande du Nord (Royaume-Uni)');
    expect(COUNTRIES_FR[213].name).toStrictEqual('Écosse (Royaume-Uni)');
    expect(COUNTRIES_FR[214].name).toStrictEqual('Pays de Galles (Royaume-Uni)');
    expect(COUNTRIES_FR[215].name).toStrictEqual('Europe');
  });
});