import { selectAllArtists } from '@/domain/card-catalog/domain/select-all-artists.selector.ts';
import { setArtists } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useArtistFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { artists } = useAppSelector(selectFilters);
  const allArtists = useAppSelector(selectAllArtists);

  return {
    artists,
    allArtists,
    setArtists: (v: string[]) => dispatch(setArtists(v)),
  };
};
