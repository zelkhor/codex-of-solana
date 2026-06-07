import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { useRarityFilterViewModel } from './rarity-filter.view-model.ts';

export const RarityFilter = () => {
  const vm = useRarityFilterViewModel();

  return (
    <MultiSelect
      options={vm.options}
      selected={vm.rarities}
      onChange={vm.setRarities}
      placeholder="e.g. Promo, Marvel, Rare, ..."
    />
  );
};
