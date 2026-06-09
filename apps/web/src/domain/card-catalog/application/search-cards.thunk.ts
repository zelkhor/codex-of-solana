import { setSearchResultIdentifiers } from '@/domain/card-catalog/application/card-catalog.slice.ts';
import type { AppThunk } from '@/domain/store/app-thunk.ts';

export const searchCards =
  (query: string): AppThunk =>
  (dispatch, _getState, extra) => {
    if (!query.trim()) {
      dispatch(setSearchResultIdentifiers(null));
      return;
    }
    const identifiers = extra.searchGateway.search(query).map((card) => card.cardIdentifier);
    dispatch(setSearchResultIdentifiers(identifiers));
  };
