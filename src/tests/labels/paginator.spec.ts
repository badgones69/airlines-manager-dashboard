import {
  getItemsPerPageLabel,
  getCurrentPageLabel,
  getFirstPageLabel,
  getPreviousPageLabel,
  getNextPageLabel,
  getLastPageLabel,
} from '../../app/shared/labels/paginator';
import { describe, it, expect } from 'vitest';

describe('PaginatorLabels', () => {
  it('#getItemsPerPageLabel should return "items per page" label', () => {
    const itemsPerPageLabel: string = getItemsPerPageLabel();
    expect(itemsPerPageLabel).toStrictEqual('Éléments par page');
  });

  it('#getCurrentPageLabel should return current page label', () => {
    const currentPageLabel: string = getCurrentPageLabel(7, 20);
    expect(currentPageLabel).toStrictEqual('Page 7 sur 20');
  });

  it('#getFirstPageLabel should return "first page" label', () => {
    const firstPageLabel: string = getFirstPageLabel();
    expect(firstPageLabel).toStrictEqual('Première page');
  });

  it('#getPreviousPageLabel should return "previous page" label', () => {
    const previousPageLabel: string = getPreviousPageLabel();
    expect(previousPageLabel).toStrictEqual('Page précédente');
  });

  it('#getNextPageLabel should return "next page" label', () => {
    const nextPageLabel: string = getNextPageLabel();
    expect(nextPageLabel).toStrictEqual('Page suivante');
  });

  it('#getLastPageLabel should return "last page" label', () => {
    const lastPageLabel: string = getLastPageLabel();
    expect(lastPageLabel).toStrictEqual('Dernière page');
  });
});
