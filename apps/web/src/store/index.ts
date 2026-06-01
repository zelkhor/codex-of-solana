import { configureStore } from '@reduxjs/toolkit';
import type { ThunkDependencies } from '@/store/types';
import { rootReducer } from '@/store/root-reducer';

export { rootReducer };
export type { RootState } from '@/store/root-reducer';
export type { ThunkDependencies };
export type { AppThunk } from '@/store/app-thunk';
export { createAppAsyncThunk } from '@/store/app-thunk';

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
