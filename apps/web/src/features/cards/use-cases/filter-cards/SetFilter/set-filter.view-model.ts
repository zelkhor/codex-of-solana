import { useDispatch, useSelector } from 'react-redux';

import { SET_GROUPS, type SetT } from '@codex/core';

import type { AppDispatch } from '@/shared/store';

import { setSets } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useSetFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sets } = useSelector(selectFilters);

  return {
    groups: SET_GROUPS.map((g) => ({ label: g.group, options: g.sets })),
    sets,
    setSets: (v: string[]) => dispatch(setSets(v as SetT[])),
  };
};
