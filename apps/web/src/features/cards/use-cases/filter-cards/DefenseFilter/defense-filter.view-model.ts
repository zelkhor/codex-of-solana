import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setDefenseFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useDefenseFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { defense } = useSelector(selectFilters);

  return {
    defense,
    setDefenseFilter: (v: NumericComparisonT) => dispatch(setDefenseFilter(v)),
  };
};
