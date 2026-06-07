import { useDispatch, useSelector } from 'react-redux';

import { RARITIES, type RarityT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';

import { setRarities } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useRarityFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rarities } = useSelector(selectFilters);

  return {
    options: Object.values(RARITIES),
    rarities,
    setRarities: (v: string[]) => dispatch(setRarities(v as RarityT[])),
  };
};
