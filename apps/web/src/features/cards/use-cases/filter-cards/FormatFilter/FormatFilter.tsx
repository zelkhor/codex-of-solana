import { SingleSelect } from '@/shared/ui/SingleSelect.tsx';

import { useFormatFilterViewModel } from './format-filter.view-model.ts';

export const FormatFilter = () => {
  const vm = useFormatFilterViewModel();

  return (
    <SingleSelect
      options={vm.options}
      value={vm.format}
      onChange={vm.setFormat}
      placeholder="Any format"
      clearLabel="Any format"
    />
  );
};
