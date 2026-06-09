import { HEROES, type HeroT } from '@codex/core';

import { setHero } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useHeroFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { hero } = useAppSelector(selectFilters);

  return {
    options: Object.values(HEROES).sort((a, b) => a.localeCompare(b)),
    hero,
    setHero: (v: HeroT | null) => dispatch(setHero(v)),
  };
};
