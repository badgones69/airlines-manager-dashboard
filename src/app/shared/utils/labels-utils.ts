export function capitalize(word: string): string {
  word = word.replaceAll('ß', 'ẞ');
  return word.toUpperCase();
}

export function capitalizeSpaceSeparatedWordsFirstLetter(
  wordsBlock: string
): string {
  wordsBlock = wordsBlock.trim();
  const words = wordsBlock.split(' ');

  for (let index = 0; index < words.length; index++) {
    words[index] = capitalizeFirstLetter(words[index]);
  }

  return words.join(' ');
}

export function capitalizeDashedWordsFirstLetter(wordsBlock: string): string {
  const words = wordsBlock.split('-');

  for (let index = 0; index < words.length; index++) {
    words[index] = capitalizeFirstLetter(words[index]);
  }

  return words.join('-');
}

export function capitalizeFirstLetter(word: string): string {
  return `${capitalize(word.charAt(0))}${word.slice(1)}`;
}
