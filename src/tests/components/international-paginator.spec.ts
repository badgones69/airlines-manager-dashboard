import { describe, it, expect } from 'vitest';
import { InternationalPaginator } from '../../app/shared/components/international-paginator';

describe('InternationalPaginator', () => {
  it('this should initialize international paginator labels', () => {
    const internationalPaginator: InternationalPaginator =
      new InternationalPaginator();

    expect(internationalPaginator.itemsPerPageLabel).toStrictEqual(
      'Éléments par page :',
    );
    expect(internationalPaginator.firstPageLabel).toStrictEqual(
      'Première page',
    );
    expect(internationalPaginator.previousPageLabel).toStrictEqual(
      'Page précédente',
    );
    expect(internationalPaginator.nextPageLabel).toStrictEqual('Page suivante');
    expect(internationalPaginator.lastPageLabel).toStrictEqual('Dernière page');
    expect(internationalPaginator.getRangeLabel(0, 5, 0)).toStrictEqual(
      'Page 1 sur 1',
    );
    expect(internationalPaginator.getRangeLabel(1, 5, 15)).toStrictEqual(
      'Page 2 sur 3',
    );
  });
});
