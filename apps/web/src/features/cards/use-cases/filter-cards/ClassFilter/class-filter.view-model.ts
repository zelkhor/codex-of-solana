import { useDispatch, useSelector } from 'react-redux';

import { CLASSES, type ClassT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setClassFilterMode, setClasses } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useClassFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classes, classFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(CLASSES),
    classes,
    classFilterMode,
    setClasses: (v: string[]) => dispatch(setClasses(v as ClassT[])),
    setClassFilterMode: (v: FilterModeT) => dispatch(setClassFilterMode(v)),
  };
};
