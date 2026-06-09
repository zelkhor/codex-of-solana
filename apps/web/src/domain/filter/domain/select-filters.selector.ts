import type { RootState } from '@/domain/store';

export const selectFilters = (state: RootState) => state.filters;
