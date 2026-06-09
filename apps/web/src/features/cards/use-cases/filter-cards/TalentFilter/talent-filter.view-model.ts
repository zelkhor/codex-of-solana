import { TALENTS, type TalentT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setTalentFilterMode, setTalents } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useTalentFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { talents, talentFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(TALENTS),
    talents,
    talentFilterMode,
    setTalents: (v: string[]) => dispatch(setTalents(v as TalentT[])),
    setTalentFilterMode: (v: FilterModeT) => dispatch(setTalentFilterMode(v)),
  };
};
