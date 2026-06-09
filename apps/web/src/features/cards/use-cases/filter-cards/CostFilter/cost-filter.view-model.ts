import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setCostFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useCostFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { cost } = useAppSelector(selectFilters);

  return {
    cost,
    setCostFilter: (v: NumericComparisonT) => dispatch(setCostFilter(v)),
  };
};
