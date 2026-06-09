import { FOILINGS, type FoilingT } from '@codex/core';

import { setFoilings } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useFoilingFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { foilings } = useAppSelector(selectFilters);

  return {
    options: Object.values(FOILINGS),
    foilings,
    setFoilings: (v: string[]) => dispatch(setFoilings(v as FoilingT[])),
  };
};
