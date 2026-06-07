import { useDispatch, useSelector } from 'react-redux';

import { TALENTS, type TalentT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';
import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setTalentFilterMode, setTalents } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useTalentFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { talents, talentFilterMode } = useSelector(selectFilters);

  return {
    options: Object.values(TALENTS),
    talents,
    talentFilterMode,
    setTalents: (v: string[]) => dispatch(setTalents(v as TalentT[])),
    setTalentFilterMode: (v: FilterModeT) => dispatch(setTalentFilterMode(v)),
  };
};
