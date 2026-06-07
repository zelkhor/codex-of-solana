import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';

import { useFoilingFilterViewModel } from './foiling-filter.view-model.ts';

export const FoilingFilter = () => {
  const vm = useFoilingFilterViewModel();

  return (
    <MultiSelect
      options={vm.options}
      selected={vm.foilings}
      onChange={vm.setFoilings}
      placeholder="e.g. Regular, Cold Foil, Rainbow Foil, ..."
    />
  );
};
