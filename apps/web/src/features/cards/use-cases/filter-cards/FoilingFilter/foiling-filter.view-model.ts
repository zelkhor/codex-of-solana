import { useDispatch, useSelector } from 'react-redux';

import { FOILINGS, type FoilingT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';

import { setFoilings } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useFoilingFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { foilings } = useSelector(selectFilters);

  return {
    options: Object.values(FOILINGS),
    foilings,
    setFoilings: (v: string[]) => dispatch(setFoilings(v as FoilingT[])),
  };
};
