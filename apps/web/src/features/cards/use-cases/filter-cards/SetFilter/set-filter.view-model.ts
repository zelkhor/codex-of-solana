import { SET_GROUPS, type SetT } from '@codex/core';

import { setSets } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useSetFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { sets } = useAppSelector(selectFilters);

  return {
    groups: SET_GROUPS.map((g) => ({ label: g.group, options: g.sets })),
    sets,
    setSets: (v: string[]) => dispatch(setSets(v as SetT[])),
  };
};
