import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';

import { setPitchFilter } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const usePitchFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pitch } = useSelector(selectFilters);

  return {
    pitch,
    setPitchFilter: (v: NumericComparisonT) => dispatch(setPitchFilter(v)),
  };
};
