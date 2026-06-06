import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { configureStore, isAsyncThunkAction } from '@reduxjs/toolkit';

import type { RootState, ThunkDependencies } from '@/shared/store';
import { rootReducer } from '@/shared/store';

import { InMemoryCardCatalogGateway } from '@/domain/card-catalog/infrastructure/card-catalog.inmemory.gateway.ts';
import { InMemorySearchGateway } from '@/domain/card-catalog/infrastructure/search.inmemory.gateway.ts';

export const EMPTY_ARGS = 'EMPTY_ARGS' as const;

export const createTestStore = (
  {
    cardCatalogGateway = new InMemoryCardCatalogGateway(),
    searchGateway = new InMemorySearchGateway(),
    collectionGateway = {},
    authGateway = {},
  }: Partial<ThunkDependencies> = {},
  preloadedState?: Partial<RootState>,
) => {
  const actions: UnknownAction[] = [];

  const actionLogger: Middleware = () => (next) => (action) => {
    actions.push(action as UnknownAction);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            cardCatalogGateway,
            searchGateway,
            collectionGateway,
            authGateway,
          },
        },
        serializableCheck: false,
      }).concat(actionLogger),
    preloadedState,
  });

  return {
    ...store,
    getActions: () => actions,
    getDispatchedUseCaseArgs(useCase: { pending: { toString(): string } }) {
      const action = actions.find(
        (a) => (a as { type?: string }).type === useCase.pending.toString(),
      );
      if (!action || !isAsyncThunkAction(action)) return undefined;
      return (action.meta as { arg?: unknown }).arg ?? EMPTY_ARGS;
    },
  };
};

export type AppTestStore = ReturnType<typeof createTestStore>;
