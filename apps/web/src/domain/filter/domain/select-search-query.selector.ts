import type { RootState } from '@/shared/store';

export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
