import { FORMATS, type FormatT } from '@codex/core';

import { setFormat } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useFormatFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { format } = useAppSelector(selectFilters);

  return {
    options: Object.values(FORMATS) as FormatT[],
    format,
    setFormat: (v: FormatT | null) => dispatch(setFormat(v)),
  };
};
