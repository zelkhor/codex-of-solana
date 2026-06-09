import { TREATMENTS, type TreatmentT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import {
  setTreatmentFilterMode,
  setTreatments,
} from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useTreatmentFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { treatments, treatmentFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(TREATMENTS),
    treatments,
    treatmentFilterMode,
    setTreatments: (v: string[]) => dispatch(setTreatments(v as TreatmentT[])),
    setTreatmentFilterMode: (v: FilterModeT) => dispatch(setTreatmentFilterMode(v)),
  };
};
