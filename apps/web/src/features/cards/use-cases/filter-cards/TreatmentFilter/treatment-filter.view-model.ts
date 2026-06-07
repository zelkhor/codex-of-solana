import { useDispatch, useSelector } from 'react-redux';

import { TREATMENTS, type TreatmentT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import {
  setTreatmentFilterMode,
  setTreatments,
} from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useTreatmentFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { treatments, treatmentFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(TREATMENTS),
    treatments,
    treatmentFilterMode,
    setTreatments: (v: string[]) => dispatch(setTreatments(v as TreatmentT[])),
    setTreatmentFilterMode: (v: FilterModeT) => dispatch(setTreatmentFilterMode(v)),
  };
};
