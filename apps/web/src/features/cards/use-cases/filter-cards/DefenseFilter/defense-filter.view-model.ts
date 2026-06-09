import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setDefenseFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useDefenseFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { defense } = useAppSelector(selectFilters);

  return {
    defense,
    setDefenseFilter: (v: NumericComparisonT) => dispatch(setDefenseFilter(v)),
  };
};
