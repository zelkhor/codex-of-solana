import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from '@/shared/store/root-reducer.ts';
import type { ThunkDependencies } from '@/shared/store/types.ts';

export { createAppAsyncThunk } from '@/shared/store/app-thunk.ts';
export type { AppThunk } from '@/shared/store/app-thunk.ts';
export type { RootState } from '@/shared/store/root-reducer.ts';
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
      }),
  });

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
