import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setAttackFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useAttackFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { attack } = useSelector(selectFilters);

  return {
    attack,
    setAttackFilter: (v: NumericComparisonT) => dispatch(setAttackFilter(v)),
  };
};
