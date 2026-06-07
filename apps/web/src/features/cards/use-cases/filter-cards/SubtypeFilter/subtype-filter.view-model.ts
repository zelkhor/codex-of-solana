import { useDispatch, useSelector } from 'react-redux';

import { SUBTYPES, type SubtypeT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setSubtypeFilterMode, setSubtypes } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useSubtypeFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subtypes, subtypeFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(SUBTYPES),
    subtypes,
    subtypeFilterMode,
    setSubtypes: (v: string[]) => dispatch(setSubtypes(v as SubtypeT[])),
    setSubtypeFilterMode: (v: FilterModeT) => dispatch(setSubtypeFilterMode(v)),
  };
};
