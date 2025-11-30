import { sortElementsAlphabetically } from '../../app/shared/utils/commons-utils';
import { describe, it, expect } from 'vitest';

describe('CommonsUtils', () => {
  
  it('#sortElementsAlphabetically should return list sorted alphabetically', () => {
    const airlines: any[] = [{name: 'Canadair'}, {name: 'Airbus'}, {name: 'Boeing'}]; 
    const orderedAirlines: any[] = sortElementsAlphabetically(airlines, 'fr');
    expect(orderedAirlines).toStrictEqual([{name: 'Airbus'}, {name: 'Boeing'}, {name: 'Canadair'}]);
  });
});