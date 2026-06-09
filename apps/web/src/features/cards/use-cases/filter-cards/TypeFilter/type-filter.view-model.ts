import { TYPES, type TypeT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setTypeFilterMode, setTypes } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useTypeFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { types, typeFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(TYPES),
    types,
    typeFilterMode,
    setTypes: (v: string[]) => dispatch(setTypes(v as TypeT[])),
    setTypeFilterMode: (v: FilterModeT) => dispatch(setTypeFilterMode(v)),
  };
};
