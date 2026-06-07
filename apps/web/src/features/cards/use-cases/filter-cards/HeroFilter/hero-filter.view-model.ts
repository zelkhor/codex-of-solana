import { useDispatch, useSelector } from 'react-redux';

import { HEROES, type HeroT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';

import { setHero } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useHeroFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hero } = useSelector(selectFilters);

  return {
    options: Object.values(HEROES).sort((a, b) => a.localeCompare(b)),
    hero,
    setHero: (v: HeroT | null) => dispatch(setHero(v)),
  };
};
