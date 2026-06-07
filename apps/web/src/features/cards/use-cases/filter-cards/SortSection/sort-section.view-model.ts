import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';
import { SORT_ORDER, type SortOrderT } from '@/shared/types/sort-order.ts';

import { setGroupPrintings, setSortOrder } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useSortSectionViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);
  const hasSearchQuery = !!filters.searchQuery.trim();

  const sortOrderOptions = [
    ...(hasSearchQuery ? [{ value: 'relevance', label: 'By relevance' }] : []),
    { value: SORT_ORDER.SET_ASC, label: 'Set release ↑' },
    { value: SORT_ORDER.SET_DESC, label: 'Set release ↓' },
    { value: SORT_ORDER.NAME_ASC, label: 'Name A → Z' },
    { value: SORT_ORDER.NAME_DESC, label: 'Name Z → A' },
  ];

  return {
    sortOrderValue: hasSearchQuery ? 'relevance' : filters.sortOrder,
    isSortDisabled: hasSearchQuery,
    sortOrderOptions,
    groupPrintings: filters.groupPrintings,
    setSortOrder: (v: SortOrderT) => dispatch(setSortOrder(v)),
    setGroupPrintings: (v: boolean) => dispatch(setGroupPrintings(v)),
  };
};
