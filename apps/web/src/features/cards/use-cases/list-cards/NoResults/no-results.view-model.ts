import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/shared/store';

import { resetFilters } from '@/domain/filter/application/filters.slice.ts';

export interface NoResultsViewModel {
  reset: () => void;
}

export const useNoResultsViewModel = (): NoResultsViewModel => {
  const dispatch = useDispatch<AppDispatch>();
  return { reset: () => dispatch(resetFilters()) };
};
