import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setAttackFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useAttackFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { attack } = useAppSelector(selectFilters);

  return {
    attack,
    setAttackFilter: (v: NumericComparisonT) => dispatch(setAttackFilter(v)),
  };
};
