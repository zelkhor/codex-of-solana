import { useDispatch, useSelector } from 'react-redux';

import { FORMATS, type FormatT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';

import { setFormat } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useFormatFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { format } = useSelector(selectFilters);

  return {
    options: Object.values(FORMATS) as FormatT[],
    format,
    setFormat: (v: FormatT | null) => dispatch(setFormat(v)),
  };
};
