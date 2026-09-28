import { PARTICULES } from '../constants/language-constants';

export function capitalize(word: string): string {
  word = word.replaceAll('ß', 'ẞ');
  return word.toUpperCase();
}

export function capitalizeWords(wordsBlock: string): string {
  const words: string[] = wordsBlock.split(/([\s'-])/);

  const result: string[] = words.map((word) => {
    if (/^[\s'-]$/.test(word)) {
      return word;
    }

    if (PARTICULES.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }

    return capitalizeFirstLetter(word);
  });

  return result.join('');
}

function capitalizeFirstLetter(word: string): string {
  return `${capitalize(word.charAt(0))}${word.slice(1)}`;
}
