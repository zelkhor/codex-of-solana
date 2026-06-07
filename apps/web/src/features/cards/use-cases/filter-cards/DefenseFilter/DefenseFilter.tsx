import { NumericFilterInput } from '@/shared/ui/NumericFilterInput.tsx';

import { useDefenseFilterViewModel } from './defense-filter.view-model.ts';

export const DefenseFilter = () => {
  const vm = useDefenseFilterViewModel();

  return <NumericFilterInput value={vm.defense} onChange={vm.setDefenseFilter} />;
};
