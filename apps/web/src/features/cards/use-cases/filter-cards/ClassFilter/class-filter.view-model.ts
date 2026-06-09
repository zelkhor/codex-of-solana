import { CLASSES, type ClassT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setClassFilterMode, setClasses } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useClassFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { classes, classFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(CLASSES),
    classes,
    classFilterMode,
    setClasses: (v: string[]) => dispatch(setClasses(v as ClassT[])),
    setClassFilterMode: (v: FilterModeT) => dispatch(setClassFilterMode(v)),
  };
};
