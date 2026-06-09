import type { Dispatch, ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/domain/store/root-reducer.ts';
import type { ThunkDependencies } from '@/domain/store/types.ts';

export type AppThunk<R = void> = ThunkAction<R, RootState, ThunkDependencies, UnknownAction>;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: Dispatch;
  extra: ThunkDependencies;
  rejectValue: string;
}>();
