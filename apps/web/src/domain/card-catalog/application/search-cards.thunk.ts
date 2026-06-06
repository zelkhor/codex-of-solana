import type { Card } from '@codex/core';

import type { AppThunk } from '@/shared/store/app-thunk.ts';

import { setSearchResults } from '@/domain/card-catalog/application/card-catalog.slice.ts';

export const searchCards =
  (query: string): AppThunk =>
  (dispatch, getState, extra) => {
    const allCards = getState().cardCatalog.allCards;
    if (!query.trim()) {
      dispatch(setSearchResults(allCards));
      return;
    }
    dispatch(setSearchResults(extra.searchGateway.search(query) as Card[]));
  };
