import { createListenerMiddleware } from '@reduxjs/toolkit';

import { saveFilters } from '@/domain/filter/infrastructure/filters.storage.ts';
import type { RootState } from '@/domain/store/root-reducer.ts';

export const filtersPersistenceListener = createListenerMiddleware<RootState>();

filtersPersistenceListener.startListening({
  predicate: (_action, currentState, previousState) =>
    currentState.filters !== previousState.filters,
  effect: (_action, listenerApi) => {
    saveFilters(listenerApi.getState().filters);
  },
});
