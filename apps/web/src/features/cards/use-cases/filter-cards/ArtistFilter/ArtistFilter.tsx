import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { useArtistFilterViewModel } from './artist-filter.view-model.ts';

export const ArtistFilter = () => {
  const vm = useArtistFilterViewModel();

  return (
    <MultiSelect
      options={vm.allArtists}
      selected={vm.artists}
      onChange={vm.setArtists}
      placeholder="Search artists…"
    />
  );
};
