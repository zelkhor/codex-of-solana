import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setCostFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useCostFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cost } = useSelector(selectFilters);

  return {
    cost,
    setCostFilter: (v: NumericComparisonT) => dispatch(setCostFilter(v)),
  };
};
