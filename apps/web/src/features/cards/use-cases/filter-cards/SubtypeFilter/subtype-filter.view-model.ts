import { SUBTYPES, type SubtypeT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setSubtypeFilterMode, setSubtypes } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useSubtypeFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { subtypes, subtypeFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(SUBTYPES),
    subtypes,
    subtypeFilterMode,
    setSubtypes: (v: string[]) => dispatch(setSubtypes(v as SubtypeT[])),
    setSubtypeFilterMode: (v: FilterModeT) => dispatch(setSubtypeFilterMode(v)),
  };
};
