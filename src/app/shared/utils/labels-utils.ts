export function capitalize(word: string): string {
  return word.toUpperCase();
}

export function capitaliseFirstLetter(word: string): string {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}
