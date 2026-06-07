import { useDispatch, useSelector } from 'react-redux';

import { TYPES, type TypeT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setTypeFilterMode, setTypes } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useTypeFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { types, typeFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(TYPES),
    types,
    typeFilterMode,
    setTypes: (v: string[]) => dispatch(setTypes(v as TypeT[])),
    setTypeFilterMode: (v: FilterModeT) => dispatch(setTypeFilterMode(v)),
  };
};
