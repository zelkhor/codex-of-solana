import { useEffect, useState } from 'react';

import { useDebounced } from '@/shared/hooks/useDebounced.ts';

import { searchCards } from '@/domain/card-catalog/application/search-cards.thunk.ts';
import { setSearchQuery } from '@/domain/filter/application/filters.slice.ts';
import { selectSearchQuery } from '@/domain/filter/domain/select-search-query.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export interface SearchInputViewModel {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const useSearchInputViewModel = (): SearchInputViewModel => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  useDebounced(
    () => {
      dispatch(setSearchQuery(value));
      dispatch(searchCards(value));
    },
    300,
    [value],
  );

  return {
    value,
    onChange: setValue,
    onClear: () => setValue(''),
  };
};
