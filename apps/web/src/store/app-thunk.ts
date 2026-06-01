import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ThunkAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { ThunkDependencies } from '@/store/types';
import type { RootState } from '@/store/root-reducer';

export type AppThunk<R = void> = ThunkAction<R, RootState, ThunkDependencies, UnknownAction>;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: Dispatch;
  extra: ThunkDependencies;
  rejectValue: string;
}>();
