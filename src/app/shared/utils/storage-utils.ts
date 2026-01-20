/* Stored item retrieving */
export function getStoredItem(storedItemName: string): any {
  return sessionStorage.getItem(storedItemName);
}

/* Stored item deleting */
export function removeStoredItem(storedItemName: string): void {
  sessionStorage.removeItem(storedItemName);
}
