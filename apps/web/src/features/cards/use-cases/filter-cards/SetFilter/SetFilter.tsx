import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { useSetFilterViewModel } from './set-filter.view-model.ts';

export const SetFilter = () => {
  const vm = useSetFilterViewModel();

  return (
    <MultiSelect
      groups={vm.groups}
      selected={vm.sets}
      onChange={vm.setSets}
      placeholder="e.g. Dynasty, Armory Deck: Kayo, ..."
    />
  );
};
