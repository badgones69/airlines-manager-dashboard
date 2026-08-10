export function sortElementsAlphabetically(
  elements: any[],
  language: string,
): any[] {
  elements.sort((e1, e2) => {
    if (e1.name === e2.name) {
      return 0;
    }

    if (e1.name > e2.name) {
      return 1;
    }
    return -1;
  });
  return elements.sort((e1, e2) => e1.name.localeCompare(e2.name, language));
}

export function generateRandomString(characters: string[], stringLength: number): string {
  const randomValues: any = new Uint32Array(stringLength);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value: any) => 
    characters[value % characters.length]
  ).join('');
}

export function generateRandomNumber(numbers: string[]): number {
  return Number.parseInt(generateRandomString(numbers, 1));
}
