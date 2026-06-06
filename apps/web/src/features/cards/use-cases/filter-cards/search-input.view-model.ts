import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/shared/store';
import { setSearchQuery } from '@/domain/filter/domain/filters.slice.ts';
import { selectSearchQuery } from '@/domain/filter/domain/select-search-query.selector.ts';
import { useDebounced } from '@/shared/hooks/useDebounced.ts';
import { searchCards } from '@/domain/card-catalog/application/search-cards.thunk.ts';

export interface SearchInputViewModel {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const useSearchInputViewModel = (): SearchInputViewModel => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector(selectSearchQuery);
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
