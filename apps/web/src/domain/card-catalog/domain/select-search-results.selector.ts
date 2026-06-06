import { type RootState } from '@/shared/store';

export const selectSearchResults = (state: RootState) => state.cardCatalog.searchResults;
