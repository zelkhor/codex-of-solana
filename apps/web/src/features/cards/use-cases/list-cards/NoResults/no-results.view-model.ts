import { resetFilters } from '@/domain/filter/application/filters.slice.ts';
import { useAppDispatch } from '@/domain/store';

export interface NoResultsViewModel {
  reset: () => void;
}

export const useNoResultsViewModel = (): NoResultsViewModel => {
  const dispatch = useAppDispatch();
  return { reset: () => dispatch(resetFilters()) };
};
