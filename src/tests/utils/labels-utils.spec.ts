import { capitalize, capitalizeFirstLetter, capitalizeSpaceSeparatedWordsFirstLetter, capitalizeDashedWordsFirstLetter } from '../../app/shared/utils/labels-utils';
import { describe, it, expect } from 'vitest';

describe('LabelsUtils', () => {
  
  it('#capitalize should return full capitalized word', () => {
    const capitalizedWord: string = capitalize('strauß');
    expect(capitalizedWord).toStrictEqual('STRAUẞ');
  });

  it('#capitalizeFirstLetter should return word with first letter capitalized', () => {
    const firstLetterCapitalizedWord: string = capitalizeFirstLetter('dashboard');
    expect(firstLetterCapitalizedWord).toStrictEqual('Dashboard');
  });

  it('#capitalizeSpaceSeparatedWordsFirstLetter should return space-separated words with first letter capitalized', () => {
    const firstLetterCapitalizedSpaceSeparatedWords: string = capitalizeSpaceSeparatedWordsFirstLetter('wolfgang amadeus');
    expect(firstLetterCapitalizedSpaceSeparatedWords).toStrictEqual('Wolfgang Amadeus');
  })

  it('#capitalizeDashedWordsFirstLetter should return dashed words with first letter capitalized', () => {
    const firstLetterCapitalizedDashedWords: string = capitalizeDashedWordsFirstLetter('franz-josef');
    expect(firstLetterCapitalizedDashedWords).toStrictEqual('Franz-Josef');
  })
});
