import { RARITIES, type RarityT } from '@codex/core';

import { setRarities } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useRarityFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { rarities } = useAppSelector(selectFilters);

  return {
    options: Object.values(RARITIES),
    rarities,
    setRarities: (v: string[]) => dispatch(setRarities(v as RarityT[])),
  };
};
