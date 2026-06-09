import { configureStore } from '@reduxjs/toolkit';

import { filtersPersistenceListener } from '@/domain/filter/infrastructure/filters-persistence.listener.ts';
import { rootReducer } from '@/domain/store/root-reducer.ts';
import type { ThunkDependencies } from '@/domain/store/types.ts';

export { createAppAsyncThunk } from '@/domain/store/app-thunk.ts';
export type { AppThunk } from '@/domain/store/app-thunk.ts';
export { useAppDispatch, useAppSelector } from '@/domain/store/hooks.ts';
export type { RootState } from '@/domain/store/root-reducer.ts';
export { rootReducer };
export type { ThunkDependencies };

export const createStore = (
  dependencies: ThunkDependencies,
  preloadedState?: Partial<ReturnType<typeof rootReducer>>,
) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        serializableCheck: false,
      }).prepend(filtersPersistenceListener.middleware),
  });

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
