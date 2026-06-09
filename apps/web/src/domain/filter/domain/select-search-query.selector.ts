import type { RootState } from '@/domain/store';

export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
