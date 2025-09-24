export function orderElementsByAlphabetical(
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
