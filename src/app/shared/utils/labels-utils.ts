import { PARTICULES } from '../constants/language-constants';

export function capitalize(word: string): string {
  word = word.replaceAll('ß', 'ẞ');
  return word.toUpperCase();
}

export function capitalizeSpaceSeparatedWordsFirstLetter(
  wordsBlock: string,
): string {
  wordsBlock = wordsBlock.trim();
  const words = wordsBlock.split(' ');

  for (let index: number = 0; index < words.length; index++) {
    words[index] = capitalizeFirstLetter(words[index]);
  }

  return words.join(' ');
}

export function capitalizeDashedWordsFirstLetter(wordsBlock: string): string {
  const words = wordsBlock.split('-');

  for (let index: number = 0; index < words.length; index++) {
    words[index] = capitalizeFirstLetter(words[index]);
  }

  return words.join('-');
}

export function capitalizeWords(wordsBlock: string): string {
  const words: string[] = wordsBlock.split(/([\s'-])/);

  let isNewWord: boolean = true;

  const result: string[] = words.map((word) => {
    if (/^[\s'-]$/.test(word)) {
      return word;
    }

    if (isNewWord) {
      isNewWord = false;
      return capitalizeFirstLetter(word);
    }

    if (PARTICULES.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }

    return capitalizeFirstLetter(word);
  });

  return result.join('');
}

export function capitalizeFirstLetter(word: string): string {
  return `${capitalize(word.charAt(0))}${word.slice(1)}`;
}
