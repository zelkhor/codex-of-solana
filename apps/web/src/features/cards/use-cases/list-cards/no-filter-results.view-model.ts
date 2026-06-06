import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/shared/store';
import { resetFilters } from '@/domain/filter/domain/filters.slice.ts';

export interface NoFilterResultsViewModel {
  reset: () => void;
}

export const useNoFilterResultsViewModel = (): NoFilterResultsViewModel => {
  const dispatch = useDispatch<AppDispatch>();
  return { reset: () => dispatch(resetFilters()) };
};
