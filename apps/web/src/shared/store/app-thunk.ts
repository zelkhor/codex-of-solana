import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ThunkAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { ThunkDependencies } from '@/shared/store/types.ts';
import type { RootState } from '@/shared/store/root-reducer.ts';

export type AppThunk<R = void> = ThunkAction<R, RootState, ThunkDependencies, UnknownAction>;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: Dispatch;
  extra: ThunkDependencies;
  rejectValue: string;
}>();
