import type { RootState } from '@/shared/store';

export const selectFilters = (state: RootState) => state.filters;
