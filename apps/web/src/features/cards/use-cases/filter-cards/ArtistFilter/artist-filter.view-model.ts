import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '@/shared/store';

import { selectAllArtists } from '@/domain/card-catalog/domain/select-all-artists.selector.ts';
import { setArtists } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';

export const useArtistFilterViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { artists } = useSelector(selectFilters);
  const allArtists = useSelector(selectAllArtists);

  return {
    artists,
    allArtists,
    setArtists: (v: string[]) => dispatch(setArtists(v)),
  };
};
