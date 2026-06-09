import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setPitchFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const usePitchFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { pitch } = useAppSelector(selectFilters);

  return {
    pitch,
    setPitchFilter: (v: NumericComparisonT) => dispatch(setPitchFilter(v)),
  };
};
