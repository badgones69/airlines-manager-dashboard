export function getItemsPerPageLabel(): string {
  return 'Éléments par page';
}

export function getCurrentPageLabel(
  currentPage: number,
  totalPages: number
): string {
  return `Page ${currentPage} sur ${totalPages}`;
}

export function getFirstPageLabel(): string {
  return 'Première page';
}

export function getPreviousPageLabel(): string {
  return 'Page précédente';
}

export function getNextPageLabel(): string {
  return 'Page suivante';
}

export function getLastPageLabel(): string {
  return 'Dernière page';
}
